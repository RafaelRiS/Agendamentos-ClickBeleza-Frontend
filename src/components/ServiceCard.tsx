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
        <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:shadow-md transition-all">

            {/* Imagem */}
            <img
                src={service.image}
                alt={service.name}
                className="w-20 h-20 object-cover rounded-xl"
            />

            {/* Info */}
            <div className="flex-1">
                <p className="text-base font-semibold text-foreground">
                    {service.name}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                    ⏱ {service.duration} min
                </p>
            </div>

            {/* Preço */}
            <span className="font-mono-data text-sm font-semibold text-white-400">
    R$ {service.price}
  </span>
      </div>
    </motion.button>
  );
};

export default ServiceCard;
