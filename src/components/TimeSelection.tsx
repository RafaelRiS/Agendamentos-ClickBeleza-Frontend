import { useState } from "react";
import { motion } from "framer-motion";
import { addDays, format } from "date-fns";
import { UNAVAILABLE_SLOTS } from "@/data/booking-data";

interface TimeSelectionProps {
  slots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const TimeSelection = ({
  slots,
  selectedSlot,
  onSelectSlot,
  selectedDate,
  onSelectDate,
}: TimeSelectionProps) => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="py-8">
      {/* Day Scroller */}
      <div className="px-6 mb-8">
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4">
          Select day.
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
                  {format(day, "EEE")}
                </span>
                <span className="font-mono-data text-lg font-medium text-foreground mt-0.5">
                  {format(day, "dd")}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Grid */}
      <div className="px-6">
        <p className="text-xs text-muted-foreground tracking-widest uppercase mb-4">
          Select time.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => {
            const unavailable = UNAVAILABLE_SLOTS.includes(slot);
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
