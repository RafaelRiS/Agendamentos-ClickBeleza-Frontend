import { motion } from "framer-motion";
import type { Service } from "@/data/booking-data";

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onSelect: (service: Service) => void;
}

const ServiceCard = ({ service, selected, onSelect }: ServiceCardProps) => {
  return (
    <motion.button
      onClick={() => onSelect(service)}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left border-b border-border p-6 surface-hover transition-colors ${
        selected ? "border-accent-active bg-secondary" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-medium tracking-tighter text-foreground">
            {service.name}
          </p>
          <p className="font-mono-data text-xs text-muted-foreground mt-1">
            {service.duration}m
          </p>
        </div>
        <span className="font-mono-data text-sm text-primary">
          ${service.price}
        </span>
      </div>
    </motion.button>
  );
};

export default ServiceCard;
