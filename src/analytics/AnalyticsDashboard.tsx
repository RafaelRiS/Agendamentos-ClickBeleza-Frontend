import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type AnalyticsEvent = {
    type: "click" | "mousemove" | "scroll";
    page: string;
    screen?: string;
    x?: number;
    y?: number;
    viewportWidth?: number;
    viewportHeight?: number;
};

const AnalyticsDashboard = () => {

    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [selectedPage, setSelectedPage] = useState("/");

    const loadEvents = async (page: string) => {

        try {

            const response = await fetch(
                `${API_URL}/analytics/events?page=${encodeURIComponent(page)}&event_type=click&limit=5000`
            );

            const data = await response.json();

            setEvents(data);

        } catch (error) {

            console.error(
                "Erro ao buscar analytics:",
                error
            );

        }

    };

    useEffect(() => {

        loadEvents(selectedPage);

    }, [selectedPage]);


    const pages = [
        "/",
        "/meus-agendamentos",
        "/admin",
    ];


    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#111",
                color: "#fff",
                padding: "30px",
            }}
        >

            <h1
                style={{
                    fontSize: "28px",
                    marginBottom: "20px",
                }}
            >
                Analytics
            </h1>


            {/* SELEÇÃO DA PÁGINA */}

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "30px",
                }}
            >

                {pages.map((page) => (

                    <button
                        key={page}
                        onClick={() => setSelectedPage(page)}
                        style={{
                            padding: "10px 18px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",

                            background:
                                selectedPage === page
                                    ? "#ff2d75"
                                    : "#333",

                            color: "#fff",
                        }}
                    >
                        {page === "/" ? "Início" : page}
                    </button>

                ))}

            </div>


            <div
                style={{
                    marginBottom: "20px",
                    color: "#aaa",
                }}
            >
                Página selecionada:

                <strong
                    style={{
                        color: "#fff",
                        marginLeft: "8px",
                    }}
                >
                    {selectedPage}
                </strong>
            </div>


            {/* ÁREA DOS CLIQUES */}

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "1000px",
                    minHeight: "700px",
                    background: "#222",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #444",
                }}
            >

                {events.map((event, index) => {

                    if (
                        event.x === undefined ||
                        event.y === undefined
                    ) {
                        return null;
                    }

                    const viewportWidth =
                        event.viewportWidth || 1920;

                    const viewportHeight =
                        event.viewportHeight || 991;


                    const left =
                        (event.x / viewportWidth) * 100;

                    const top =
                        (event.y / viewportHeight) * 100;


                    return (
                        <div
                            key={index}
                            title={`Clique: ${event.x}, ${event.y}`}
                            style={{
                                position: "absolute",

                                left: `${left}%`,
                                top: `${top}%`,

                                width: "14px",
                                height: "14px",

                                background: "#ff2d75",

                                borderRadius: "50%",

                                transform:
                                    "translate(-50%, -50%)",

                                boxShadow:
                                    "0 0 12px #ff2d75",

                                zIndex: 10,
                            }}
                        />
                    );

                })}


                {events.length === 0 && (

                    <div
                        style={{
                            position: "absolute",
                            inset: 0,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            color: "#777",
                        }}
                    >
                        Nenhum clique registrado nesta página.
                    </div>

                )}

            </div>


            <div
                style={{
                    marginTop: "20px",
                    color: "#aaa",
                }}
            >
                {events.length} cliques encontrados.
            </div>

        </div>
    );
};

export default AnalyticsDashboard;
