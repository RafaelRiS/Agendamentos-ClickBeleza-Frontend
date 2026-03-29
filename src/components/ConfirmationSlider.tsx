import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Service, Barber } from "@/data/booking-data";
import {toast} from "sonner";

interface ConfirmationSliderProps {
    service: Service;
    barber: Barber;
    date: Date;
    time: string;
    name: string;
    setName: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    onConfirm: () => void;
}

const ConfirmationSlider = ({
                                service,
                                barber,
                                date,
                                time,
                                name,
                                setName,
                                phone,
                                setPhone,
                                onConfirm,
                            }: ConfirmationSliderProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const trackWidth = 280;
  const thumbWidth = 64;
  const maxDrag = trackWidth - thumbWidth;

  const bgOpacity = useTransform(x, [0, maxDrag], [0, 1]);

    const isValidPhone = (phone: string) => {
        const clean = phone.replace(/\D/g, "");

        if (clean.length !== 11) return false;

        if (!clean.startsWith("9", 2)) return false;

        if (/^(\d)\1+$/.test(clean)) return false;

        return true;
    };

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

    const handleDragEnd = () => {
        if (!name || !phone) {
            alert("Preencha nome e telefone");
            animate(x, 0);
            return;
        }

        if (!isValidPhone(phone)) {
            toast.error("Telefone inválido");
            animate(x, 0);
            return;
        }

        if (x.get() > maxDrag * 0.85) {
            animate(x, maxDrag, { duration: 0.15 });
            setConfirmed(true);
            onConfirm();
        } else {
            animate(x, 0, { duration: 0.3, ease: [0.2, 0, 0, 1] });
        }
    };

  return (
    <div className="px-6 py-8">
      {/* Resumo */}
      <div className="border border-border p-6 mb-8 space-y-4">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          Resumo do agendamento.
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">{service.name}</span>
            <span className="font-mono-data text-sm text-primary">R${service.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Profissional</span>
            <span className="text-sm text-foreground">{barber.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Data</span>
            <span className="font-mono-data text-sm text-foreground">
              {format(date, "EEE, dd MMM", { locale: ptBR })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Horário</span>
            <span className="font-mono-data text-sm text-foreground">{time}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">Duração</span>
            <span className="font-mono-data text-sm text-foreground">{service.duration}min</span>
          </div>
        </div>
      </div>

        {/* Formulário */}
        <div className="px-6 py-8 space-y-4">
            <div>
                <label className="text-xs text-muted-foreground uppercase">
                    Nome
                </label>
                <input
                    type="text"
                    placeholder="Rafael Ribeiro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 border px-3 mt-1 text-black"
                />
            </div>

            <div>
                <label className="text-xs text-muted-foreground uppercase">
                    Telefone
                </label>
                <input
                    type="text"
                    placeholder="(11) 9 9999-9999"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="w-full h-12 border px-3 mt-1 text-black"
                />
            </div>
        </div>

      {/* Deslizar para confirmar */}
      <div
        ref={constraintsRef}
        className="relative h-16 border border-border overflow-hidden mx-auto"
        style={{ width: trackWidth }}
      >
        <motion.div
          className="absolute inset-0 bg-accent"
          style={{ opacity: bgOpacity }}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`font-mono-data text-xs tracking-widest uppercase ${confirmed ? "text-accent-foreground" : "text-muted-foreground"}`}>
            {confirmed ? "Confirmado!" : "Deslize para confirmar"}
          </span>
        </div>

        {!confirmed && (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: maxDrag }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="absolute top-0 left-0 w-16 h-full bg-secondary border-r border-border flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          >
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-foreground">
              <path d="M14 1L19 6L14 11" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 6H18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationSlider;
