import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AnimatedNavItemProps {
  to: string;
  isActive: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showIndicator?: boolean;
}

const variants = {
  default: {
    base: "relative px-3 py-2 rounded-lg font-medium transition-all duration-300 ease-out whitespace-nowrap",
    active: "bg-white text-green-800 shadow-lg",
    inactive: "text-white hover:bg-white/20 hover:shadow-md"
  },
  glass: {
    base: "relative px-3 py-2 rounded-xl font-medium transition-all duration-300 ease-out backdrop-blur-sm border border-white/20 whitespace-nowrap",
    active: "bg-white/20 text-white shadow-xl border-white/40",
    inactive: "text-white/90 hover:bg-white/10 hover:border-white/30 hover:shadow-lg"
  },
  minimal: {
    base: "relative px-3 py-2 rounded-md font-medium transition-all duration-200 ease-out whitespace-nowrap",
    active: "text-white",
    inactive: "text-white/80 hover:text-white hover:bg-white/10"
  }
};

const sizes = {
  sm: "text-xs px-2 py-1.5",
  md: "text-sm px-3 py-2",
  lg: "text-base px-4 py-2.5"
};

export function AnimatedNavItem({ 
  to, 
  isActive, 
  onClick, 
  children, 
  className,
  variant = 'default',
  size = 'md',
  showIndicator = true
}: AnimatedNavItemProps) {
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Link
              to={to}
              onClick={onClick}
              className={cn(
                variantStyles.base,
                sizeStyles,
                isActive ? variantStyles.active : variantStyles.inactive,
                "group overflow-hidden",
                className
              )}
            >
              {/* Background shimmer effect */}
              {isActive && variant === 'glass' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: 'linear'
                  }}
                />
              )}

              {/* Active indicator */}
              {showIndicator && isActive && variant === 'minimal' && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              )}

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />

              <span className="relative z-10 truncate max-w-[120px] lg:max-w-none">{children}</span>
            </Link>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Stagger animation container for multiple nav items
export function AnimatedNavContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}
