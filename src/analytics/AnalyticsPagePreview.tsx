import { SERVICES } from "@/data/booking-data";

type AnalyticsPagePreviewProps = {
    page: string;
};

const AnalyticsPagePreview = ({
                                  page,
                              }: AnalyticsPagePreviewProps) => {

    if (page === "/meus-agendamentos") {
        return (
            <div className="min-h-screen bg-background max-w-lg mx-auto p-6">
                <h1 className="text-3xl font-semibold">
                    Meus Agendamentos
                </h1>

                <p className="text-sm text-muted-foreground mt-2">
                    Visualização dos seus agendamentos.
                </p>
            </div>
        );
    }

    if (page === "/admin") {
        return (
            <div className="min-h-screen bg-background max-w-lg mx-auto p-6">
                <h1 className="text-3xl font-semibold">
                    Administração
                </h1>

                <p className="text-sm text-muted-foreground mt-2">
                    Painel administrativo.
                </p>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-background max-w-lg mx-auto relative"
        >
            {/* Cabeçalho */}
            <div className="px-6 py-5 border-b">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        Agendamento
                    </span>

                    <button
                        className="text-xs border border-black px-4 py-2 rounded-full bg-black text-white"
                    >
                        Meus Agendamentos
                    </button>
                </div>
            </div>

            {/* Título */}
            <div className="px-6 pt-8 pb-4">
                <h2 className="font-display text-5xl font-medium italic text-foreground leading-[1.1]">
                    Seu horário
                    <br />
                    está esperando.
                </h2>

                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-6">
                    Escolha seu serviço.
                </p>
            </div>

            {/* Serviços */}
            <div>
                {SERVICES.map((service) => (
                    <div
                        key={service.id}
                        className="px-6 py-5 border-b border-border"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">
                                    {service.name}
                                </h3>

                                <p className="text-sm text-muted-foreground mt-1">
                                    {service.duration} min
                                </p>
                            </div>

                            <div className="text-sm font-medium">
                                R$ {service.price}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsPagePreview;
