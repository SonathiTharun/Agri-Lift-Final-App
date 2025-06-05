
import React from 'react';
import { motion } from 'framer-motion';

interface LiveStatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error';
  label: string;
  className?: string;
}

const LiveStatusIndicator: React.FC<LiveStatusIndicatorProps> = ({ 
  status, 
  label, 
  className = '' 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        className={`w-2 h-2 rounded-full ${getStatusColor()}`}
        animate={{
          scale: status === 'online' ? [1, 1.2, 1] : 1,
          opacity: status === 'online' ? [1, 0.7, 1] : 1
        }}
        transition={{
          duration: 2,
          repeat: status === 'online' ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default LiveStatusIndicator;
