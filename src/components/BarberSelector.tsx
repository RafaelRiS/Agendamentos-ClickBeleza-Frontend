import { motion } from "framer-motion";
import type { Barber } from "@/data/booking-data";

interface BarberSelectorProps {
  barbers: Barber[];
  selectedId: string | null;
  onSelect: (barber: Barber) => void;
}

const BarberSelector = ({ barbers, selectedId, onSelect }: BarberSelectorProps) => {
  return (
    <div className="px-6 py-8">
      <p className="text-xs text-muted-foreground tracking-widest uppercase mb-6">
        Select barber.
      </p>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
        {barbers.map((barber) => (
          <motion.button
            key={barber.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => barber.available && onSelect(barber)}
            className={`flex-shrink-0 flex flex-col items-center gap-3 ${
              !barber.available ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            <div
              className={`relative w-20 h-20 overflow-hidden ${
                selectedId === barber.id ? "ring-1 ring-accent" : "ring-1 ring-border"
              }`}
            >
              <img
                src={barber.image}
                alt={barber.name}
                className="w-full h-full object-cover"
              />
              {/* Availability dot */}
              <div
                className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                  barber.available ? "bg-accent" : "bg-muted-foreground"
                }`}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium tracking-tight text-foreground">
                {barber.name}
              </p>
              <p className="font-mono-data text-[10px] text-muted-foreground">
                {barber.specialty}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BarberSelector;
