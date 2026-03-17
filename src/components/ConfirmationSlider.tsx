import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { format } from "date-fns";
import type { Service, Barber } from "@/data/booking-data";

interface ConfirmationSliderProps {
  service: Service;
  barber: Barber;
  date: Date;
  time: string;
  onConfirm: () => void;
}

const ConfirmationSlider = ({
  service,
  barber,
  date,
  time,
  onConfirm,
}: ConfirmationSliderProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const trackWidth = 280;
  const thumbWidth = 64;
  const maxDrag = trackWidth - thumbWidth;

  const bgOpacity = useTransform(x, [0, maxDrag], [0, 1]);

  const handleDragEnd = () => {
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
      {/* Summary */}
      <div className="border border-border p-6 mb-8 space-y-4">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          Booking summary.
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground">{service.name}</span>
            <span className="font-mono-data text-sm text-primary">${service.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Barber</span>
            <span className="text-sm text-foreground">{barber.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="font-mono-data text-sm text-foreground">
              {format(date, "EEE, MMM dd")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Time</span>
            <span className="font-mono-data text-sm text-foreground">{time}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">Duration</span>
            <span className="font-mono-data text-sm text-foreground">{service.duration}m</span>
          </div>
        </div>
      </div>

      {/* Slide to confirm */}
      <div
        ref={constraintsRef}
        className="relative h-16 border border-border overflow-hidden mx-auto"
        style={{ width: trackWidth }}
      >
        {/* Background fill */}
        <motion.div
          className="absolute inset-0 bg-accent"
          style={{ opacity: bgOpacity }}
        />

        {/* Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`font-mono-data text-xs tracking-widest uppercase ${confirmed ? "text-accent-foreground" : "text-muted-foreground"}`}>
            {confirmed ? "Confirmed." : "Slide to confirm"}
          </span>
        </div>

        {/* Thumb */}
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
