import { useState } from "react";
import { toast } from "sonner";

interface AppointmentFeedbackProps {
    appointmentId: string;
    customerName: string;
    customerPhone: string;
    service: string;
    barber: string;
    date: string;
    time: string;
    onFinished: () => void;
}

const AppointmentFeedback = ({
                                 appointmentId,
                                 customerName,
                                 customerPhone,
                                 service,
                                 barber,
                                 date,
                                 time,
                                 onFinished,
                             }: AppointmentFeedbackProps) => {
    const [rating, setRating] = useState(0);
    const [easeRating, setEaseRating] = useState(0);
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Selecione uma nota de 1 a 5 estrelas.");
            return;
        }

        if (easeRating === 0) {
            toast.error("Avalie o quanto foi fácil agendar.");
            return;
        }

        setSending(true);

        try {
            const response = await fetch(
                "https://agendamentos-clickbeleza-backend.onrender.com/feedback",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        appointment_id: appointmentId,
                        client_name: customerName,
                        client_phone: customerPhone,
                        service,
                        barber,
                        date,
                        time,
                        rating,
                        ease_rating: easeRating,
                        comment,
                    }),
                }
            );

            const data = await response.json();

            console.log("STATUS:", response.status);
            console.log("RESPOSTA DO BACKEND:", data);
            console.log("ENVIANDO FEEDBACK:", {
                appointment_id: appointmentId,
                rating,
                ease_rating: easeRating,
                comment,
            });


            if (!response.ok) {
                toast.error(
                    data.detail ||
                    data.error ||
                    `Erro ${response.status} ao enviar avaliação`
                );
                return;
            }


            toast.success("Obrigado pela sua avaliação! 💜");

            onFinished();
        } catch (error) {
            console.error(error);
            toast.error("Não foi possível enviar sua avaliação.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-background px-6 py-10 flex items-center justify-center">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">✓</div>

                    <h1 className="font-display text-4xl font-medium italic">
                        Agendamento confirmado!
                    </h1>

                    <p className="text-sm text-muted-foreground mt-3">
                        Obrigado por agendar conosco,{" "}
                        <span className="text-white font-medium">
                            {customerName}
                        </span>.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm">

                    <h2 className="text-xl font-semibold text-center">
                        Como foi sua experiência?
                    </h2>

                    <p className="text-sm text-black text-center mt-2">
                        Sua opinião ajuda a melhorar nosso atendimento.
                    </p>

                    {/* ESTRELAS */}
                    <div className="mt-8">
                        <p className="text-sm text-black font-medium text-center">
                            Como você avalia sua experiência?
                        </p>

                        <div className="flex justify-center gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-4xl transition-transform hover:scale-110 ${
                                        star <= rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FACILIDADE */}
                    <div className="mt-10">
                        <p className="text-sm text-black font-medium text-center">
                            O quanto foi fácil agendar?
                        </p>

                        <div className="flex justify-center gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setEaseRating(value)}
                                    className={`w-11 h-11 rounded-full border transition ${
                                        value === easeRating
                                            ? "bg-[#A855A0] text-white border-[#A855A0]"
                                            : "bg-white text-black hover:bg-gray-100"
                                    }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                                😠 <span>Muito difícil</span>
                            </span>

                                    <span className="flex items-center gap-1">
                                <span>Muito fácil</span> 🤩
                            </span>
                        </div>
                    </div>


                    {/* COMENTÁRIO */}
                    <div className="mt-8">
                        <p className="text-sm font-medium mb-2">
                            Quer deixar um comentário?
                        </p>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Sua opinião é muito importante..."
                            className="w-full min-h-[100px] rounded-xl border p-3 text-sm text-black bg-white resize-none focus:outline-none focus:ring-2 focus:ring-black"
                            maxLength={500}
                        />
                    </div>

                    {/* ENVIAR */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={sending}
                        className="w-full mt-6 rounded-xl bg-black text-white py-3 font-medium hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {sending ? "Enviando..." : "Enviar avaliação"}
                    </button>

                    {/* PULAR */}
                    <button
                        type="button"
                        onClick={onFinished}
                        disabled={sending}
                        className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-black transition"
                    >
                        Agora não
                    </button>

                </div>
            </div>
        </div>
    );
};

export default AppointmentFeedback;
