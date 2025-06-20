import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calculator, 
  FileText, 
  Phone, 
  MessageCircle,
  X
} from "lucide-react";

interface FloatingActionButtonProps {
  onCalculatorClick: () => void;
  onApplyClick: () => void;
}

export const FloatingActionButton = ({ onCalculatorClick, onApplyClick }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Calculator,
      label: "Calculator",
      onClick: onCalculatorClick,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: FileText,
      label: "Apply Now",
      onClick: onApplyClick,
      color: "bg-foliage hover:bg-foliage-dark"
    },
    {
      icon: Phone,
      label: "Call Support",
      onClick: () => window.open("tel:+911800123456"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: MessageCircle,
      label: "Live Chat",
      onClick: () => console.log("Open chat"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-12 h-12 rounded-full shadow-lg ${action.color} text-white`}
                >
                  <action.icon className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg bg-foliage hover:bg-foliage-dark text-white"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};
