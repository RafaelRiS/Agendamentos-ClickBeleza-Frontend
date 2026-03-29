import { motion } from "framer-motion";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UNAVAILABLE_SLOTS } from "@/data/booking-data";

interface TimeSelectionProps {
    slots: string[];
    selectedSlot: string | null;
    onSelectSlot: (slot: string) => void;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    appointments: any[];
    selectedDuration: number;
    selectedBarber: any;
}

const TimeSelection = ({
  slots,
  selectedSlot,
  onSelectSlot,
  selectedDate,
  onSelectDate,
    appointments,
    selectedDuration,
    selectedBarber,
}: TimeSelectionProps) => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="py-8">
      {/* Seletor de dia */}
      <div className="px-6 mb-8">
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4">
          Escolha o dia.
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          {days.map((day) => {
            const isSelected =
              format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            return (
              <motion.button
                key={day.toISOString()}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectDate(day)}
                className={`flex-shrink-0 flex flex-col items-center py-3 px-4 border transition-colors ${
                  isSelected
                    ? "border-accent-active bg-secondary"
                    : "border-border surface-hover"
                }`}
              >
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {format(day, "EEE", { locale: ptBR })}
                </span>
                <span className="font-mono-data text-lg font-medium text-foreground mt-0.5">
                  {format(day, "dd")}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Grade de horários */}
      <div className="px-6">
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4">
          Escolha o horário.
        </p>
          <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {

                  const now = new Date();

                  const [hour, minute] = slot.split(":").map(Number);

                  const slotTime = new Date(selectedDate);
                  slotTime.setHours(hour, minute, 0, 0);

                  const isToday =
                      selectedDate.toDateString() === now.toDateString();

                  const isPast =
                      isToday && slotTime.getTime() < now.getTime();

                  const dateFormatted = selectedDate.toLocaleDateString("sv-SE");

                  const toMinutes = (time: string) => {
                      const [h, m] = time.split(":").map(Number);
                      return h * 60 + m;
                  };

                  const isBooked = appointments.some((a) => {
                      if (a.date !== dateFormatted) return false;
                      if (a.barber !== selectedBarber?.name) return false;

                      const newStart = toMinutes(slot);
                      const newEnd = newStart + selectedDuration;

                      const existingStart = toMinutes(a.time);
                      const existingEnd = existingStart + (a.duration || 60);

                      return newStart >= existingStart && newStart < existingEnd;
                  });

                  const unavailable =
                      UNAVAILABLE_SLOTS.includes(slot) ||
                      isPast ||
                      isBooked;

                  const isSelected = selectedSlot === slot;
            return (
              <motion.button
                key={slot}
                whileTap={unavailable ? undefined : { scale: 0.98 }}
                onClick={() => !unavailable && onSelectSlot(slot)}
                className={`h-12 flex items-center justify-center border font-mono-data text-sm transition-colors ${
                  unavailable
                    ? "slot-unavailable border-border"
                    : isSelected
                    ? "border-accent-active bg-secondary text-foreground"
                    : "border-border surface-hover text-foreground"
                }`}
              >
                {slot}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
