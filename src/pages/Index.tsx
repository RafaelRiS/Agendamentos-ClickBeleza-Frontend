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
        fetch("http://127.0.0.1:8000/appointments")
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(() => console.error("Erro ao buscar agendamentos"));
    }, []);

    const handleConfirm = async () => {
        try {
            const cleanPhone = customerPhone.replace(/\D/g, "");

            const response = await fetch("http://127.0.0.1:8000/appointments", {
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

            const data = await response.json();

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
            fetch("http://127.0.0.1:8000/appointments")
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

  return (
      <div className="min-h-screen bg-background max-w-lg mx-auto relative">
          <ProgressHeader step={step} totalSteps={STEPS.length} labels={STEPS} />

          {/* 🔥 BOTÃO "MEUS AGENDAMENTOS" (sempre visível) */}
          <div className="flex justify-end p-4">
              <button
                  onClick={() => navigate("/meus-agendamentos")}
                  className="text-xs border border-black-400 px-4 py-2 rounded-full bg-black text-white hover:border-pink-500 transition"
              >
                  Meus Agendamentos
              </button>
          </div>

          {/* Botão voltar */}
          {step > 0 && (
              <button
                  onClick={handleBack}
                  className="px-6 pt-4 text-xs text-muted-foreground tracking-widest uppercase surface-hover inline-block"
              >
                  ← Voltar
              </button>
          )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="services"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          >
            <div className="px-6 pt-8 pb-4">
              <h2 className="font-display text-5xl font-medium italic text-foreground leading-[1.1]">
                Seu horário<br />está esperando.
              </h2>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mt-6">
                Escolha seu serviço.
              </p>
            </div>
            <div>
              {SERVICES.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedService?.id === service.id}
                  onSelect={handleServiceSelect}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="barbers"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          >
            <BarberSelector
              barbers={BARBERS}
              selectedId={selectedBarber?.id ?? null}
              onSelect={handleBarberSelect}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="time"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          >
              <TimeSelection
                  slots={TIME_SLOTS}
                  selectedSlot={selectedSlot}
                  selectedDate={selectedDate}
                  onSelectSlot={handleSlotSelect}
                  onSelectDate={setSelectedDate}
                  appointments={appointments}
                  selectedDuration={selectedService?.duration || 0}
                  selectedBarber={selectedBarber}
              />
          </motion.div>
        )}

        {step === 3 && selectedService && selectedBarber && selectedSlot && (
          <motion.div
            key="confirm"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          >
              <ConfirmationSlider
                  service={selectedService!}
                  barber={selectedBarber!}
                  date={selectedDate}
                  time={selectedSlot!}
                  name={customerName}
                  setName={setCustomerName}
                  phone={customerPhone}
                  setPhone={setCustomerPhone}
                  onConfirm={handleConfirm}
              />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
