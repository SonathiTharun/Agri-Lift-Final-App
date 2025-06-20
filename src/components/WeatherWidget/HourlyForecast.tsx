import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Zap, Wind, Droplets, Thermometer } from 'lucide-react';
import { Card } from '@/components/ui/card';

type HourlyWeather = {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  precipitation: number;
  uvIndex: number;
};

interface HourlyForecastProps {
  hourlyData: HourlyWeather[];
  compact?: boolean;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return Sun;
    case 'rain':
    case 'showers':
      return CloudRain;
    case 'snow':
      return Snowflake;
    case 'thunderstorm':
      return Zap;
    case 'cloudy':
    case 'partly cloudy':
    default:
      return Cloud;
  }
};

const getTemperatureColor = (temp: number) => {
  if (temp < 0) return 'text-blue-600';
  if (temp < 10) return 'text-blue-500';
  if (temp < 20) return 'text-green-500';
  if (temp < 30) return 'text-yellow-500';
  if (temp < 35) return 'text-orange-500';
  return 'text-red-500';
};

const getPrecipitationColor = (precipitation: number) => {
  if (precipitation === 0) return 'text-gray-400';
  if (precipitation < 2) return 'text-blue-400';
  if (precipitation < 5) return 'text-blue-500';
  return 'text-blue-600';
};

export function HourlyForecast({ hourlyData, compact = false }: HourlyForecastProps) {
  if (hourlyData.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No hourly forecast available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Hourly cards */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {hourlyData.map((hour, index) => {
          const WeatherIcon = getWeatherIcon(hour.condition);
          const tempColor = getTemperatureColor(hour.temp);
          const precipColor = getPrecipitationColor(hour.precipitation);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Card className={`${compact ? 'p-2 min-w-[80px]' : 'p-3 min-w-[100px]'} bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-md transition-all duration-200`}>
                {/* Time */}
                <div className="text-center mb-2">
                  <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
                    {hour.time}
                  </span>
                </div>
                
                {/* Weather Icon */}
                <div className="flex justify-center mb-2">
                  <motion.div
                    className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-blue-200"
                    whileHover={{ rotate: 10 }}
                  >
                    <WeatherIcon className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
                  </motion.div>
                </div>
                
                {/* Temperature */}
                <div className="text-center mb-2">
                  <span className={`${compact ? 'text-sm' : 'text-lg'} font-bold ${tempColor}`}>
                    {hour.temp}°
                  </span>
                </div>
                
                {/* Condition */}
                <div className="text-center mb-2">
                  <span className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
                    {hour.condition}
                  </span>
                </div>
                
                {/* Additional details */}
                <div className="space-y-1">
                  {/* Precipitation */}
                  {hour.precipitation > 0 && (
                    <div className="flex items-center justify-center gap-1">
                      <Droplets className={`h-3 w-3 ${precipColor}`} />
                      <span className={`text-xs ${precipColor}`}>
                        {hour.precipitation}mm
                      </span>
                    </div>
                  )}
                  
                  {/* Wind */}
                  <div className="flex items-center justify-center gap-1">
                    <Wind className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">
                      {hour.wind}km/h
                    </span>
                  </div>
                  
                  {/* Humidity */}
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-400" />
                    <span className="text-xs text-gray-600">
                      {hour.humidity}%
                    </span>
                  </div>
                  
                  {/* UV Index (if significant) */}
                  {hour.uvIndex > 3 && (
                    <div className="flex items-center justify-center gap-1">
                      <Sun className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">
                        UV {hour.uvIndex}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Temperature trend chart */}
      <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-sm font-medium mb-3 text-blue-900 flex items-center gap-2">
          <Thermometer className="h-4 w-4" />
          Temperature Trend
        </h3>
        
        <div className="relative h-16 flex items-end justify-between">
          {hourlyData.slice(0, 8).map((hour, index) => {
            const maxTemp = Math.max(...hourlyData.map(h => h.temp));
            const minTemp = Math.min(...hourlyData.map(h => h.temp));
            const height = ((hour.temp - minTemp) / (maxTemp - minTemp)) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <span className="text-xs text-blue-700 font-medium">
                  {hour.temp}°
                </span>
                <motion.div
                  className="w-2 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full"
                  style={{ height: `${Math.max(height, 10)}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 10)}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                />
                <span className="text-xs text-blue-600">
                  {hour.time.split(':')[0]}h
                </span>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Precipitation forecast */}
      {hourlyData.some(h => h.precipitation > 0) && (
        <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <h3 className="text-sm font-medium mb-3 text-blue-900 flex items-center gap-2">
            <CloudRain className="h-4 w-4" />
            Precipitation Forecast
          </h3>
          
          <div className="relative h-12 flex items-end justify-between">
            {hourlyData.slice(0, 8).map((hour, index) => {
              const maxPrecip = Math.max(...hourlyData.map(h => h.precipitation));
              const height = maxPrecip > 0 ? (hour.precipitation / maxPrecip) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  {hour.precipitation > 0 && (
                    <span className="text-xs text-blue-700 font-medium">
                      {hour.precipitation}mm
                    </span>
                  )}
                  <motion.div
                    className="w-2 bg-gradient-to-t from-blue-300 to-blue-500 rounded-full"
                    style={{ height: `${Math.max(height, hour.precipitation > 0 ? 20 : 0)}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, hour.precipitation > 0 ? 20 : 0)}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  />
                  <span className="text-xs text-blue-600">
                    {hour.time.split(':')[0]}h
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
