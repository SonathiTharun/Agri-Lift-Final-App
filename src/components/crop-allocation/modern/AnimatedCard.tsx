
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  title?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  delay = 0, 
  title, 
  icon,
  variant = 'default'
}) => {
  const variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        delay,
        ease: "easeOut"
      }
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl';
      case 'gradient':
        return 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200/50 shadow-lg';
      default:
        return 'bg-white shadow-lg border border-gray-200/50';
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={`${getVariantStyles()} rounded-xl transition-all duration-300 ${className}`}
    >
      <Card className="border-0 shadow-none bg-transparent">
        {title && (
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-semibold">
              {icon && <span className="mr-2">{icon}</span>}
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
