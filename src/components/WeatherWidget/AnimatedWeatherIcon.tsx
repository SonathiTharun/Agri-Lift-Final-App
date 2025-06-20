
import React from "react";
import { motion } from "framer-motion";

type WeatherIconProps = {
  condition: string;
  timeOfDay: "day" | "afternoon" | "night";
  compact?: boolean;
};

export function AnimatedWeatherIcon({ condition, timeOfDay, compact = false }: WeatherIconProps) {
  const size = compact ? 32 : 64;

  // Enhanced time of day gradients with more realistic colors
  const getBackgroundGradient = () => {
    switch (timeOfDay) {
      case "night":
        if (condition === "Rain") return "from-slate-800 via-slate-900 to-blue-900";
        if (condition === "Snow") return "from-indigo-900 via-slate-800 to-purple-900";
        if (condition === "Thunderstorm") return "from-gray-900 via-slate-900 to-black";
        return "from-indigo-900 via-purple-900 to-slate-800";
      case "afternoon":
        if (condition === "Rain") return "from-gray-500 via-slate-600 to-blue-700";
        if (condition === "Sunny") return "from-orange-400 via-red-400 to-pink-500";
        return "from-orange-300 via-pink-400 to-purple-500";
      default:
        if (condition === "Rain") return "from-gray-400 via-slate-500 to-blue-600";
        if (condition === "Snow") return "from-gray-200 via-slate-300 to-blue-300";
        if (condition === "Sunny") return "from-yellow-300 via-orange-400 to-blue-500";
        return "from-blue-400 via-cyan-500 to-blue-600";
    }
  };

  // Realistic animated weather icons
  let iconSvg = null;

  if (condition === "Rain" || condition === "Showers" || condition === "Light Rain") {
    iconSvg = (
      <motion.div className="relative w-full h-full flex items-center justify-center">
        {/* Animated cloud */}
        <motion.div
          className="absolute"
          animate={{
            y: [0, -2, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width={size} height={size} viewBox="0 0 64 64">
            {/* Main cloud body */}
            <ellipse cx="32" cy="28" rx="18" ry="10" fill="#94a3b8" />
            <ellipse cx="42" cy="24" rx="10" ry="7" fill="#cbd5e1" />
            <ellipse cx="22" cy="26" rx="8" ry="6" fill="#e2e8f0" />

            {/* Cloud shadow */}
            <ellipse cx="32" cy="30" rx="16" ry="3" fill="#64748b" opacity="0.3" />
          </svg>
        </motion.div>

        {/* Animated raindrops */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${25 + i * 6}%`,
              top: '60%'
            }}
            animate={{
              y: [0, 15, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeIn"
            }}
          >
            <div
              className="w-0.5 h-3 bg-blue-400 rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 197, 253, 0.9) 100%)',
                filter: 'blur(0.2px)'
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  } else if (condition === "Heavy Rain" || condition === "Thunderstorm") {
    iconSvg = (
      <motion.div className="relative w-full h-full flex items-center justify-center">
        {/* Dark storm cloud */}
        <motion.div
          className="absolute"
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width={size} height={size} viewBox="0 0 64 64">
            <ellipse cx="32" cy="28" rx="20" ry="12" fill="#475569" />
            <ellipse cx="42" cy="24" rx="12" ry="8" fill="#64748b" />
            <ellipse cx="22" cy="26" rx="10" ry="7" fill="#94a3b8" />
          </svg>
        </motion.div>

        {/* Heavy rain */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 5}%`,
              top: '55%'
            }}
            animate={{
              y: [0, 20, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeIn"
            }}
          >
            <div
              className="w-1 h-4 bg-blue-500 rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%)'
              }}
            />
          </motion.div>
        ))}

        {/* Lightning flash */}
        {condition === "Thunderstorm" && (
          <motion.div
            className="absolute"
            style={{ left: '45%', top: '35%' }}
            animate={{
              opacity: [0, 0, 0, 1, 0, 1, 0, 0, 0, 0]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <svg width="12" height="20" viewBox="0 0 12 20">
              <path
                d="M2 0 L10 8 L6 8 L10 20 L2 12 L6 12 Z"
                fill="#fbbf24"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))'
                }}
              />
            </svg>
          </motion.div>
        )}
      </motion.div>
    );
  } else if (condition === "Cloudy" || condition === "Partly Cloudy" || condition === "Overcast") {
    iconSvg = (
      <motion.div className="relative w-full h-full flex items-center justify-center">
        {/* Background cloud */}
        <motion.div
          className="absolute"
          animate={{
            x: [-2, 2, -2],
            y: [0, -1, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width={size} height={size} viewBox="0 0 64 64">
            <ellipse cx="32" cy="32" rx="22" ry="12" fill="#cbd5e1" opacity="0.8" />
          </svg>
        </motion.div>

        {/* Front cloud layers */}
        <motion.div
          className="absolute"
          animate={{
            x: [2, -2, 2],
            y: [0, 1, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <svg width={size} height={size} viewBox="0 0 64 64">
            <ellipse cx="38" cy="28" rx="12" ry="8" fill="#e2e8f0" />
            <ellipse cx="26" cy="30" rx="10" ry="6" fill="#f1f5f9" />
          </svg>
        </motion.div>

        {/* Partly cloudy sun (if applicable) */}
        {condition === "Partly Cloudy" && (
          <motion.div
            className="absolute"
            style={{ left: '15%', top: '15%' }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="6" fill="#fbbf24" />
              {[...Array(8)].map((_, i) => (
                <rect
                  key={i}
                  x="11"
                  y="2"
                  width="2"
                  height="4"
                  fill="#fbbf24"
                  style={{
                    transformOrigin: '12px 12px',
                    transform: `rotate(${i * 45}deg)`
                  }}
                />
              ))}
            </svg>
          </motion.div>
        )}
      </motion.div>
    );
  } else if (condition === "Thunderstorm" || condition === "Lightning") {
    iconSvg = (
      <svg className="animate-float" viewBox="0 0 64 64">
        <ellipse cx="32" cy="37" rx="20" ry="12" fill="#b3b3b3" />
        <polygon points="28,44 36,44 30,56 39,50 30,50" fill="#ffd700" className="animate-bounce" />
        <polygon points="35,38 43,38 37,48 46,42 37,42" fill="#ffd700" className="animate-bounce" style={{animationDelay: "0.3s"}} />
      </svg>
    );
  } else if (condition === "Foggy" || condition === "Mist" || condition === "Haze") {
    iconSvg = (
      <svg className="animate-float" viewBox="0 0 64 64">
        <rect x="10" y="30" width="44" height="3" rx="1.5" fill="#e2e8f0" className="animate-[fade-in_1.5s_infinite_alternate]" />
        <rect x="14" y="36" width="36" height="3" rx="1.5" fill="#e2e8f0" className="animate-[fade-in_2s_infinite_alternate]" style={{animationDelay: "0.3s"}} />
        <rect x="18" y="42" width="28" height="3" rx="1.5" fill="#e2e8f0" className="animate-[fade-in_1.8s_infinite_alternate]" style={{animationDelay: "0.6s"}} />
      </svg>
    );
  } else if (condition === "Night" || condition === "Clear Night") {
    iconSvg = (
      <svg viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="13" fill="#fde68a" opacity="0.7" />
        <circle cx="40" cy="28" r="11" fill="#22223b" />
        <circle cx="24" cy="20" r="1" fill="#f8fafc" className="animate-pulse" />
        <circle cx="45" cy="35" r="1" fill="#f8fafc" className="animate-pulse" style={{animationDelay: "0.5s"}} />
        <circle cx="36" cy="15" r="1" fill="#f8fafc" className="animate-pulse" style={{animationDelay: "1s"}} />
      </svg>
    );
  } else if (condition === "Snow" || condition === "Light Snow") {
    iconSvg = (
      <motion.div className="relative w-full h-full flex items-center justify-center">
        {/* Snow cloud */}
        <motion.div
          className="absolute"
          animate={{
            y: [0, -2, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width={size} height={size} viewBox="0 0 64 64">
            <ellipse cx="32" cy="28" rx="18" ry="10" fill="#cbd5e1" />
            <ellipse cx="42" cy="24" rx="10" ry="7" fill="#e2e8f0" />
            <ellipse cx="22" cy="26" rx="8" ry="6" fill="#f1f5f9" />
          </svg>
        </motion.div>

        {/* Animated snowflakes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${25 + i * 5}%`,
              top: '55%'
            }}
            animate={{
              y: [0, 20, 0],
              x: [0, Math.random() * 4 - 2],
              rotate: [0, 360],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear"
            }}
          >
            <svg width="6" height="6" viewBox="0 0 12 12">
              <g fill="#f8fafc" opacity="0.9">
                <circle cx="6" cy="6" r="1.5" />
                <rect x="5.5" y="2" width="1" height="8" />
                <rect x="2" y="5.5" width="8" height="1" />
                <rect x="3.5" y="3.5" width="5" height="1" transform="rotate(45 6 6)" />
                <rect x="3.5" y="7.5" width="5" height="1" transform="rotate(-45 6 6)" />
              </g>
            </svg>
          </motion.div>
        ))}
      </motion.div>
    );
  } else {
    // Default: Sunny or Clear
    iconSvg = (
      <motion.div className="relative w-full h-full flex items-center justify-center">
        {/* Sun core with glow */}
        <motion.div
          className="absolute"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360]
          }}
          transition={{
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        >
          <svg width={size} height={size} viewBox="0 0 64 64">
            {/* Outer glow */}
            <circle
              cx="32"
              cy="32"
              r="18"
              fill="rgba(251, 191, 36, 0.3)"
              opacity="0.6"
            />
            {/* Main sun body */}
            <circle
              cx="32"
              cy="32"
              r="12"
              fill="#fbbf24"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))'
              }}
            />
          </svg>
        </motion.div>

        {/* Animated sun rays */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              transformOrigin: '50% 50%',
              transform: `rotate(${i * 30}deg)`
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          >
            <div
              className="absolute bg-yellow-400 rounded-full"
              style={{
                width: '2px',
                height: compact ? '8px' : '12px',
                left: '50%',
                top: compact ? '15%' : '10%',
                marginLeft: '-1px',
                background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.9) 0%, rgba(251, 191, 36, 0.3) 100%)',
                filter: 'blur(0.3px)'
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`rounded-xl flex items-center justify-center ${compact ? 'w-8 h-8' : 'w-16 h-16'} bg-gradient-to-br ${getBackgroundGradient()} transition-all shadow-lg border border-white/20 backdrop-blur-sm`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          '0 4px 6px rgba(0, 0, 0, 0.1)',
          '0 8px 15px rgba(0, 0, 0, 0.2)',
          '0 4px 6px rgba(0, 0, 0, 0.1)'
        ]
      }}
      transition={{
        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div className={`${compact ? 'scale-75' : 'scale-100'} transition-transform duration-300`}>
        {iconSvg}
      </div>
    </motion.div>
  );
}
