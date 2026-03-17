import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressHeader from "@/components/ProgressHeader";
import ServiceCard from "@/components/ServiceCard";
import BarberSelector from "@/components/BarberSelector";
import TimeSelection from "@/components/TimeSelection";
import ConfirmationSlider from "@/components/ConfirmationSlider";
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

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

  const handleConfirm = () => {
    toast.success("Agendamento confirmado!", {
      description: `${selectedService?.name} com ${selectedBarber?.name} às ${selectedSlot}`,
    });
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <ProgressHeader step={step} totalSteps={STEPS.length} labels={STEPS} />

      {/* Barra de status */}
      <div className="border-b border-border px-6 py-3 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <p className="font-mono-data text-[11px] text-muted-foreground">
          Atendendo agora: Cliente #47. Próximo horário livre em <span className="text-foreground">14 min</span>.
        </p>
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
              service={selectedService}
              barber={selectedBarber}
              date={selectedDate}
              time={selectedSlot}
              onConfirm={handleConfirm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
