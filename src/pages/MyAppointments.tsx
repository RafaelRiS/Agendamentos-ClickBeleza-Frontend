import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
    const [phone, setPhone] = useState("");
    const [appointments, setAppointments] = useState([]);

    const handleSearch = async () => {
        const cleanPhone = phone.replace(/\D/g, "");

        const res = await fetch(`http://127.0.0.1:8000/appointments?phone=${cleanPhone}`);
        const data = await res.json();

        setAppointments(data);
    };

    const navigate = useNavigate();

    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, "");

        if (numbers.length === 0) return "";

        if (numbers.length <= 2) {
            return `(${numbers}`;
        }
        if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        }
        if (numbers.length <= 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }

        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl mb-4">Meus Agendamentos</h1>

            <input
                type="text"
                placeholder="Digite seu telefone:"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="border p-3 w-full mb-4 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button onClick={handleSearch} className="bg-black text-white px-4 py-2">
                Buscar
            </button>

            {/* 🔙 BOTÃO VOLTAR */}
            <button
                onClick={() => navigate("/")}
                className="mb-4 text-xs text-muted-foreground tracking-widest uppercase"
            >
                ← Voltar
            </button>

            <div className="mt-6">
                {appointments.map((a: any, i) => (
                    <div key={i} className="border p-3 mb-2">
                        <p><b>Serviço:</b> {a.service}</p>
                        <p><b>Barbeiro:</b> {a.barber}</p>
                        <p><b>Data:</b> {a.date}</p>
                        <p><b>Hora:</b> {a.time}</p>
                        <p><b>Duração Prevista do Atendimento:</b> {a.duration} <>Minutos</></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAppointments;