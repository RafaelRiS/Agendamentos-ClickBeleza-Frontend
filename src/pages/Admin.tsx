import { useEffect, useState } from "react";

const Admin = () => {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        const res = await fetch("https://agendamentos-clickbeleza-backend.onrender.com/appointments");
        const data = await res.json();
        setAppointments(data);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDelete = async (id: string) => {
        await fetch(`https://agendamentos-clickbeleza-backend.onrender.com/appointments/${id}`, {
            method: "DELETE",
        });

        fetchAppointments();
    };

    const handleUpdate = async (id: string) => {
        const newService = prompt("Novo serviço:");

        await fetch(`https://agendamentos-clickbeleza-backend.onrender.com/appointments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ service: newService }),
        });

        fetchAppointments();
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl mb-4">Admin</h1>

            {appointments.map((a: any) => (
                <div key={a.id} className="border p-3 mb-3 rounded">
                    <p><b>{a.client_name}</b></p>
                    <p>{a.client_phone}</p>
                    <p>{a.service}</p>
                    <p>{a.date} - {a.time}</p>

                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => handleDelete(a.id)}
                            className="bg-red-500 text-white px-2 py-1"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={() => handleUpdate(a.id)}
                            className="bg-yellow-500 text-white px-2 py-1"
                        >
                            Editar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Admin;