import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Star } from 'lucide-react';

interface AnimatedLogoProps {
  to: string;
  variant?: 'farmer' | 'executive';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-10 w-auto',
  md: 'h-12 w-auto sm:h-14',
  lg: 'h-14 w-auto sm:h-16 md:h-18',
  xl: 'h-16 w-auto sm:h-18 md:h-20'
};

export function AnimatedLogo({ 
  to, 
  variant = 'farmer', 
  showText = false, 
  size = 'lg' 
}: AnimatedLogoProps) {
  const isExecutive = variant === 'executive';
  
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Link to={to} className="flex items-center group">
        <motion.div
          className="relative p-1"
          whileHover={{ 
            rotate: [0, -3, 3, 0],
            y: [-3, 0, -3, 0]
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Animated background glow */}
          <motion.div
            className={`absolute inset-0 rounded-3xl blur-xl transition-opacity duration-500 ${
              isExecutive
                ? 'bg-gradient-to-r from-emerald-600/30 via-green-700/30 to-emerald-800/30'
                : 'bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-green-500/30'
            }`}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Hover enhanced glow */}
          <motion.div
            className={`absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
              isExecutive
                ? 'bg-gradient-to-r from-emerald-500/60 via-green-600/60 to-emerald-700/60'
                : 'bg-gradient-to-r from-green-300/60 via-emerald-300/60 to-green-400/60'
            }`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary glow layer */}
          <motion.div
            className={`absolute inset-2 rounded-2xl blur-md opacity-30 group-hover:opacity-60 ${
              isExecutive 
                ? 'bg-gradient-to-br from-blue-400/40 to-emerald-600/40' 
                : 'bg-gradient-to-br from-yellow-400/40 to-green-600/40'
            }`}
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Main logo */}
          <motion.img
            alt={isExecutive ? "AgriLift Executive Portal" : "AgriLift Logo"}
            className={`${sizeClasses[size]} relative z-10 transition-all duration-500 group-hover:drop-shadow-2xl filter group-hover:brightness-110`}
            src="/lovable-uploads/bad258d5-10ef-4d65-bb8b-35f2420c6caa.png"
            animate={{
              scale: [1, 1.02, 1],
            }}
            whileHover={{
              filter: "brightness(1.15) contrast(1.1) saturate(1.3)",
              scale: 1.05
            }}
            transition={{
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              filter: { duration: 0.3 }
            }}
          />
          
          {/* Animated border ring */}
          <motion.div
            className="absolute inset-1 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100"
            animate={{
              borderColor: [
                "rgba(255,255,255,0.3)", 
                "rgba(255,255,255,0.6)", 
                "rgba(255,255,255,0.3)"
              ],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating sparkles */}
          <motion.div
            className={`absolute -top-2 -right-2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 ${
              isExecutive ? 'bg-blue-300' : 'bg-yellow-300'
            }`}
            animate={{
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.2
            }}
          />
          
          <motion.div
            className={`absolute -bottom-2 -left-2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 ${
              isExecutive ? 'bg-emerald-300' : 'bg-green-300'
            }`}
            animate={{
              scale: [0, 1, 0],
              rotate: [360, 180, 0],
              x: [0, 3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.7
            }}
          />
          
          <motion.div
            className={`absolute top-1/2 -right-3 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 ${
              isExecutive ? 'bg-indigo-300' : 'bg-lime-300'
            }`}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 360],
              x: [0, 5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 1
            }}
          />
          
          {/* Pulsing center highlight */}
          <motion.div
            className="absolute inset-4 rounded-full bg-white/10 opacity-0 group-hover:opacity-100"
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Optional text */}
        {showText && (
          <motion.div
            className="ml-4 hidden lg:block"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              {isExecutive ? (
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Shield size={20} className="text-white/90" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={18} className="text-white/90" />
                </motion.div>
              )}
              <span className="text-white font-bold text-xl tracking-wide">
                {isExecutive ? 'Executive Portal' : 'AgriLift'}
              </span>
            </div>
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
}
