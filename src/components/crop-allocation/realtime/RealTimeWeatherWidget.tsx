
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Zap, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { useRealTimeData } from '@/hooks/useRealTimeData';

interface RealTimeWeatherWidgetProps {
  location: string;
}

const RealTimeWeatherWidget: React.FC<RealTimeWeatherWidgetProps> = ({ location }) => {
  const { weatherData, isLoading, isConnected } = useRealTimeData(location);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'stormy':
        return <Zap className="h-6 w-6 text-purple-500" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
            Weather Conditions
          </span>
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Conditions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-600">Temp</span>
            </div>
            <div className="mt-1 text-xl font-semibold text-gray-900">
              {weatherData.temperature.toFixed(1)}°C
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Humidity</span>
            </div>
            <div className="mt-1 text-xl font-semibold text-gray-900">
              {weatherData.humidity.toFixed(0)}%
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <Wind className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Wind</span>
            </div>
            <div className="mt-1 text-xl font-semibold text-gray-900">
              {weatherData.windSpeed.toFixed(1)} m/s
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <CloudRain className="h-4 w-4 text-indigo-500" />
              <span className="text-sm text-gray-600">Rain</span>
            </div>
            <div className="mt-1 text-xl font-semibold text-gray-900">
              {weatherData.precipitation.toFixed(1)} mm
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-3 flex items-center">
            <Eye className="h-4 w-4 mr-1 text-gray-600" />
            7-Day Forecast
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="flex justify-center mb-1">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-xs font-medium">
                  {day.temperature.max.toFixed(0)}°
                </div>
                <div className="text-xs text-gray-500">
                  {day.temperature.min.toFixed(0)}°
                </div>
                {day.precipitation > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    {day.precipitation.toFixed(1)}mm
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {weatherData.windSpeed > 10 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <Wind className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">High wind alert - Consider protecting crops</span>
            </div>
          </div>
        )}
        
        {weatherData.precipitation > 3 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <CloudRain className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">Heavy rain expected - Check drainage systems</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeWeatherWidget;
