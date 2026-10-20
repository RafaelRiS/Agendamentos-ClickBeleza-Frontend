
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Summary = {
    total_clients: number;
    high_risk_clients: number;
    lower_risk_clients: number;
    average_rating: number | null;
    average_ease_rating: number | null;
    model_status: string;
};

type Client = {
    client_phone: string;
    risk_percentage: number;
    risk_probability: number;
    classification: string;
    previous_appointments: number;
    days_since_last_appointment: number;
    last_service: string | null;
    feedback_count: number;
};

export default function RetentionDashboard() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");

                const [summaryResponse, clientsResponse] = await Promise.all([
                    fetch(`${API_URL}/analytics/retention/summary`),
                    fetch(`${API_URL}/analytics/retention/clients`),
                ]);

                if (!summaryResponse.ok || !clientsResponse.ok) {
                    throw new Error("Não foi possível carregar os dados da API.");
                }

                const summaryData = await summaryResponse.json();
                const clientsData = await clientsResponse.json();

                if (active) {
                    setSummary(summaryData);
                    setClients(clientsData);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error ? err.message : "Erro inesperado."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const filteredClients = clients.filter((client) =>
        client.client_phone.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <main style={styles.page}>Carregando dashboard de retenção...</main>;
    }

    if (error) {
        return (
            <main style={styles.page}>
                <h1>Dashboard de retenção</h1>
                <p style={{ color: "#ff8d8d" }}>{error}</p>
                <p>Confira o backend e a variável VITE_API_URL.</p>
            </main>
        );
    }

    return (
        <main style={styles.page}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Retenção de clientes</h1>
                    <p style={styles.muted}>
                        Análise de comportamento e probabilidade estimada de não retorno.
                    </p>
                </div>
                <a href="/admin" style={styles.link}>Voltar ao Admin</a>
            </header>

            <div style={styles.notice}>
                Modelo experimental treinado com dados fictícios. Os riscos são
                estimativas e ainda não foram validados com clientes reais.
            </div>

            {summary && (
                <section style={styles.cards}>
                    <Metric title="Clientes analisados" value={summary.total_clients} />
                    <Metric title="Risco estimado de não retorno" value={summary.high_risk_clients} />
                    <Metric title="Retorno mais provável" value={summary.lower_risk_clients} />
                    <Metric
                        title="Avaliação média"
                        value={summary.average_rating ?? "Sem avaliações"}
                    />
                    <Metric
                        title="Facilidade média"
                        value={summary.average_ease_rating ?? "Sem avaliações"}
                    />
                </section>
            )}

            <section style={styles.panel}>
                <h2>Clientes</h2>

                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Pesquisar pelo telefone..."
                    style={styles.input}
                />

                <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.cell}>Telefone</th>
                            <th style={styles.cell}>Risco estimado</th>
                            <th style={styles.cell}>Último serviço</th>
                            <th style={styles.cell}>Dias desde a visita</th>
                            <th style={styles.cell}>Agendamentos anteriores</th>
                            <th style={styles.cell}>Feedbacks</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredClients.map((client) => (
                            <tr key={client.client_phone}>
                                <td style={styles.cell}>{client.client_phone}</td>
                                <td style={styles.cell}>
                    <span
                        style={{
                            color:
                                client.risk_percentage >= 50 ? "#ff8585" : "#81dfad",
                            fontWeight: 700,
                        }}
                    >
                      {client.risk_percentage.toFixed(2)}%
                    </span>
                                    <div style={styles.muted}>{client.classification}</div>
                                </td>
                                <td style={styles.cell}>{client.last_service ?? "—"}</td>
                                <td style={styles.cell}>
                                    {client.days_since_last_appointment}
                                </td>
                                <td style={styles.cell}>{client.previous_appointments}</td>
                                <td style={styles.cell}>{client.feedback_count}</td>
                            </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td style={styles.cell} colSpan={6}>
                                    Nenhum cliente encontrado.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

function Metric({
                    title,
                    value,
                }: {
    title: string;
    value: string | number;
}) {
    return (
        <article style={styles.metric}>
            <p style={styles.muted}>{title}</p>
            <strong style={styles.metricValue}>{value}</strong>
        </article>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px",
    },
    title: { fontSize: "30px", marginBottom: "8px" },
    muted: { color: "#aaa", fontSize: "14px" },
    link: { color: "#ff5c93" },
    notice: {
        background: "#30251c",
        color: "#f3d0a5",
        padding: "14px",
        borderRadius: "8px",
        marginBottom: "24px",
    },
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
    },
    metric: {
        background: "#202020",
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "20px",
    },
    metricValue: { fontSize: "26px" },
    panel: {
        background: "#202020",
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "20px",
    },
    input: {
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "400px",
        padding: "12px",
        margin: "8px 0 20px",
        borderRadius: "8px",
        border: "1px solid #444",
        background: "#151515",
        color: "#fff",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
    },
    cell: {
        padding: "12px",
        borderBottom: "1px solid #383838",
        whiteSpace: "nowrap",
    },
};
