
import { useEffect, useState } from "react";

const API_URL =
    "https://agendamentos-clickbeleza-backend.onrender.com";

type Appointment = {
    id: string;
    client_name: string;
    client_phone: string;
    service: string;
    date: string;
    time: string;
    duration?: number;
};

const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const Admin = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${API_URL}/appointments`);

            if (!res.ok) {
                throw new Error("Não foi possível buscar os agendamentos.");
            }

            const data: Appointment[] = await res.json();
            const today = getLocalDate();

            const upcomingAppointments = data
                .filter((appointment) => {
                    return (
                        typeof appointment.date === "string" &&
                        /^\d{4}-\d{2}-\d{2}$/.test(appointment.date) &&
                        appointment.date >= today
                    );
                })
                .sort((a, b) => {
                    const dateA = `${a.date}T${a.time}`;
                    const dateB = `${b.date}T${b.time}`;

                    return dateA.localeCompare(dateB);
                });

            setAppointments(upcomingAppointments);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar os agendamentos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Deseja cancelar este agendamento?")) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/appointments/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Não foi possível cancelar o agendamento.");
            }

            await fetchAppointments();
        } catch (err) {
            console.error(err);
            alert("Erro ao cancelar o agendamento.");
        }
    };

    const handleUpdate = async (id: string) => {
        const newService = window.prompt("Novo serviço:");

        if (newService === null) return;

        if (!newService.trim()) {
            alert("Informe o nome do serviço.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/appointments/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    service: newService.trim(),
                }),
            });

            if (!res.ok) {
                throw new Error("Não foi possível editar o agendamento.");
            }

            await fetchAppointments();
        } catch (err) {
            console.error(err);
            alert("Erro ao editar o agendamento.");
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Carregando agendamentos...</div>;
    }

    if (error) {
        return (
            <div className="p-6 max-w-lg mx-auto">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchAppointments}
                    className="mt-3 rounded bg-blue-600 px-3 py-2 text-white"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl mb-4">Agendamentos futuros</h1>

            {appointments.length === 0 ? (
                <p className="text-gray-500">
                    Não há agendamentos para hoje ou para datas futuras.
                </p>
            ) : (
                appointments.map((a) => (
                    <div key={a.id} className="border p-3 mb-3 rounded">
                        <p><b>{a.client_name}</b></p>
                        <p>{a.client_phone}</p>
                        <p>{a.service}</p>
                        <p>{a.date} - {a.time}</p>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleDelete(a.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={() => handleUpdate(a.id)}
                                className="bg-yellow-500 text-black px-2 py-1 rounded"
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Admin;
