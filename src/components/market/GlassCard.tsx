
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const GlassCard = ({ children, className, hover = true, gradient = false }: GlassCardProps) => {
  return (
    <motion.div
      className={cn(
        "backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl",
        gradient && "bg-gradient-to-br from-white/20 to-white/5",
        hover && "hover:bg-white/20 hover:border-white/30 transition-all duration-300",
        className
      )}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
