import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Cloud, Thermometer, Wind, Droplets, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type WeatherAlert = {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  type: 'weather' | 'agriculture' | 'health';
  startTime: string;
  endTime: string;
};

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  onDismiss: (alertId: string) => void;
  compact?: boolean;
}

const severityColors = {
  low: 'from-blue-500 to-blue-600',
  medium: 'from-yellow-500 to-orange-500',
  high: 'from-orange-500 to-red-500',
  extreme: 'from-red-600 to-red-800'
};

const severityIcons = {
  low: Cloud,
  medium: Sun,
  high: Wind,
  extreme: AlertTriangle
};

const typeIcons = {
  weather: Cloud,
  agriculture: Sun,
  health: Thermometer
};

export function WeatherAlerts({ alerts, onDismiss, compact = false }: WeatherAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No active weather alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {alerts.map((alert, index) => {
          const SeverityIcon = severityIcons[alert.severity];
          const TypeIcon = typeIcons[alert.type];
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-0 ${compact ? 'p-2' : 'p-3'}`}>
                {/* Animated background gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${severityColors[alert.severity]} opacity-10`}
                  animate={{
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Severity indicator bar */}
                <motion.div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${severityColors[alert.severity]}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                />
                
                <div className="relative z-10 flex items-start gap-3">
                  {/* Icon with animation */}
                  <motion.div
                    className={`flex-shrink-0 p-2 rounded-full bg-gradient-to-r ${severityColors[alert.severity]}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{
                      scale: alert.severity === 'extreme' ? [1, 1.05, 1] : 1
                    }}
                    transition={{
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <SeverityIcon className="h-4 w-4 text-white" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`font-semibold ${compact ? 'text-xs' : 'text-sm'} text-gray-900 mb-1`}>
                          {alert.title}
                        </h4>
                        <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 leading-relaxed`}>
                          {alert.description}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                        onClick={() => onDismiss(alert.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Time and type info */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <TypeIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500 capitalize">{alert.type}</span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {alert.startTime} - {alert.endTime}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Pulse effect for extreme alerts */}
                {alert.severity === 'extreme' && (
                  <motion.div
                    className="absolute inset-0 border-2 border-red-500 rounded-lg"
                    animate={{
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Alert notification badge component
export function AlertBadge({ alertCount, severity }: { alertCount: number; severity: 'low' | 'medium' | 'high' | 'extreme' }) {
  if (alertCount === 0) return null;
  
  return (
    <motion.div
      className={`absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r ${severityColors[severity]} flex items-center justify-center`}
      animate={{
        scale: severity === 'extreme' ? [1, 1.2, 1] : 1
      }}
      transition={{
        duration: 1,
        repeat: Infinity
      }}
    >
      <span className="text-xs font-bold text-white">{alertCount}</span>
    </motion.div>
  );
}
