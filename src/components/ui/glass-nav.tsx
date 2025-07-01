import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassNavProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'farmer' | 'executive';
  blur?: 'sm' | 'md' | 'lg';
}

const variants = {
  farmer: {
    background: 'bg-gradient-to-r from-green-500/90 via-green-600/90 to-emerald-500/90 dark:from-green-700/90 dark:via-green-800/90 dark:to-emerald-700/90',
    border: 'border-green-400/30 dark:border-green-600/30',
    shadow: 'shadow-green-500/20 dark:shadow-green-700/20'
  },
  executive: {
    background: 'bg-gradient-to-r from-green-800/90 via-green-900/90 to-emerald-800/90 dark:from-green-900/90 dark:via-gray-900/90 dark:to-emerald-900/90',
    border: 'border-green-600/30 dark:border-green-700/30',
    shadow: 'shadow-green-800/20 dark:shadow-green-900/20'
  }
};

const blurLevels = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg'
};

export function GlassNav({ 
  children, 
  className, 
  variant = 'farmer',
  blur = 'md'
}: GlassNavProps) {
  const variantStyles = variants[variant];
  const blurStyle = blurLevels[blur];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "border-b border-white/10",
        "min-h-[70px] lg:min-h-[75px] flex items-center py-1",
        variantStyles.background,
        variantStyles.border,
        blurStyle,
        "shadow-xl",
        variantStyles.shadow,
        className
      )}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.nav>
  );
}

// Animated mobile drawer
export function AnimatedDrawer({ 
  children, 
  isOpen, 
  onClose 
}: { 
  children: React.ReactNode; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.05,
            delayChildren: 0.1
          }
        },
        closed: {
          opacity: 0,
          y: -20,
          transition: {
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.02,
            staggerDirection: -1
          }
        }
      }}
      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 dark:border-gray-700/30"
    >
      {children}
    </motion.div>
  );
}

// Animated menu item for mobile drawer
export function AnimatedMenuItem({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
}) {
  return (
    <motion.div
      variants={{
        open: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.2 }
        },
        closed: {
          opacity: 0,
          x: -20,
          transition: { duration: 0.1 }
        }
      }}
      whileHover={{ 
        x: 4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
}
