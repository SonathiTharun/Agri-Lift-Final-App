
import React from 'react';
import { motion } from 'framer-motion';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  variant = 'primary' 
}) => {
  const getGradient = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50';
      case 'secondary':
        return 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50';
      case 'success':
        return 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50';
      default:
        return 'bg-gradient-to-br from-gray-50 to-white';
    }
  };

  return (
    <motion.div
      className={`min-h-screen ${getGradient()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-white/50 backdrop-blur-3xl" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GradientBackground;
