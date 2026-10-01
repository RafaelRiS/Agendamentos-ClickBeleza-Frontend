import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type HeatmapPoint = {
    x: number;
    y: number;
    value: number;
};

const Analytics = () => {
    const [points, setPoints] = useState<HeatmapPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHeatmap = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/heatmap?page=/&event_type=click`
                );

                if (!response.ok) {
                    throw new Error("Erro ao buscar heatmap");
                }

                const data = await response.json();

                setPoints(data);
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar os dados.");
            } finally {
                setLoading(false);
            }
        };

        loadHeatmap();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">
                Carregando...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 text-red-600 flex items-center justify-center">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 p-8">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-2">
                    Analytics
                </h1>

                <p className="text-gray-600 mb-8">
                    Mapa de calor dos cliques.
                </p>

                <div className="bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-xl font-semibold mb-6">
                        Cliques na página inicial
                    </h2>

                    <div
                        className="relative w-full bg-gray-200 rounded-lg overflow-hidden"
                        style={{
                            height: "600px",
                        }}
                    >

                        {points.map((point, index) => {

                            const intensity = Math.min(
                                point.value / 5,
                                1
                            );

                            return (
                                <div
                                    key={index}
                                    style={{
                                        position: "absolute",

                                        left: `${point.x * 100}%`,

                                        top: `${point.y * 100}%`,

                                        width: "50px",

                                        height: "50px",

                                        transform: "translate(-50%, -50%)",

                                        borderRadius: "50%",

                                        background: `rgba(
                      255,
                      0,
                      0,
                      ${0.25 + intensity * 0.75}
                    )`,

                                        boxShadow: `
                      0 0 25px
                      rgba(255, 0, 0, 0.8)
                    `,
                                    }}
                                />
                            );
                        })}

                    </div>

                </div>

                <div className="mt-6 bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Dados
                    </h2>

                    <p>
                        Pontos registrados:{" "}
                        <strong>{points.length}</strong>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Analytics;
