import { motion } from "framer-motion";

interface ProgressHeaderProps {
  step: number;
  totalSteps: number;
  labels: string[];
}

const ProgressHeader = ({ step, totalSteps, labels }: ProgressHeaderProps) => {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-medium tracking-tighter">PRECISION</h1>
        <span className="font-mono-data text-xs text-muted-foreground">
          {labels[step]}
        </span>
      </div>
      <div className="h-[1px] w-full bg-border relative">
        <motion.div
          className="h-[1px] bg-accent absolute left-0 top-0"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        />
      </div>
    </div>
  );
};

export default ProgressHeader;
