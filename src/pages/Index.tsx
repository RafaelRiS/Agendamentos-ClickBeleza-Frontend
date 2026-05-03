import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressHeader from "@/components/ProgressHeader";
import ServiceCard from "@/components/ServiceCard";
import BarberSelector from "@/components/BarberSelector";
import TimeSelection from "@/components/TimeSelection";
import ConfirmationSlider from "@/components/ConfirmationSlider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  SERVICES,
  BARBERS,
  TIME_SLOTS,
  type Service,
  type Barber,
} from "@/data/booking-data";
import { toast } from "sonner";

const STEPS = ["Serviço", "Profissional", "Horário", "Confirmar"];

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const Index = () => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointments, setAppointments] = useState([]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setTimeout(() => setStep(1), 150);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setTimeout(() => setStep(2), 150);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setTimeout(() => setStep(3), 150);
  };

    useEffect(() => {
        fetch("https://agendamentos-clickbeleza-backend.onrender.com/appointments")
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(() => console.error("Erro ao buscar agendamentos"));
    }, []);

    const handleConfirm = async () => {
        try {
            const cleanPhone = customerPhone.replace(/\D/g, "");

            const response = await fetch("https://agendamentos-clickbeleza-backend.onrender.com/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_name: customerName,
                    client_phone: cleanPhone,
                    service: selectedService?.name,
                    barber: selectedBarber?.name,
                    date: selectedDate.toLocaleDateString("sv-SE"), // formato: YYYY-MM-DD
                    time: selectedSlot,
                    duration: selectedService?.duration,
                }),
            });

            console.log("ENVIANDO:", customerName, customerPhone);

            let data;

            try {
                data = await response.json();
            } catch {
                toast.error("Erro na resposta do servidor");
                return;
            }

            if (data.error) {
                toast.error(data.error);
                return;
            }

            toast.success("Agendamento confirmado!", {
                description: `${customerName} às ${selectedSlot}`,
            });
            setTimeout(() => {
                setStep(0);
                setSelectedService(null);
                setSelectedBarber(null);
                setSelectedSlot(null);
                setCustomerName("");
                setCustomerPhone("");
                setSelectedDate(new Date());
            }, 1000);

// 🔥 atualiza lista
            fetch("https://agendamentos-clickbeleza-backend.onrender.com/appointments")
                .then(res => res.json())
                .then(data => setAppointments(data));

        } catch (error) {
            toast.error("Erro ao agendar");
        }
    };

    const navigate = useNavigate();

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

    interface ConfirmationSliderProps {
        service: Service;
        barber: Barber;
        date: Date;
        time: string;
        client_name: string;
        setName: (value: string) => void;
        client_phone: string;
        setPhone: (value: string) => void;
        onConfirm: () => void;
    }
    return <h1>FUNCIONANDO</h1>;
};

export default Index;
