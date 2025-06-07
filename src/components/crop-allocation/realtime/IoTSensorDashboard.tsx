
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Droplets, Thermometer, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRealTimeData } from '@/hooks/useRealTimeData';

interface IoTSensorDashboardProps {
  location: string;
}

const IoTSensorDashboard: React.FC<IoTSensorDashboardProps> = ({ location }) => {
  const { soilData, isLoading, isConnected } = useRealTimeData(location);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!soilData) return null;

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return 'text-green-600';
    if (value < min * 0.8 || value > max * 1.2) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
            IoT Sensor Data
          </span>
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? 'Connected' : 'Offline'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Soil Moisture */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplets className="h-4 w-4 text-blue-500 mr-2" />
              <span className="font-medium">Soil Moisture</span>
            </div>
            {getStatusIcon(soilData.moisture, 40, 70)}
          </div>
          <div className="space-y-2">
            <Progress value={soilData.moisture} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className={getStatusColor(soilData.moisture, 40, 70)}>
                {soilData.moisture.toFixed(1)}%
              </span>
              <span className="text-gray-500">Optimal: 40-70%</span>
            </div>
          </div>
        </div>

        {/* Soil Temperature */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 text-red-500 mr-2" />
              <span className="font-medium">Soil Temperature</span>
            </div>
            {getStatusIcon(soilData.temperature, 18, 25)}
          </div>
          <div className="space-y-2">
            <Progress value={(soilData.temperature / 40) * 100} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className={getStatusColor(soilData.temperature, 18, 25)}>
                {soilData.temperature.toFixed(1)}°C
              </span>
              <span className="text-gray-500">Optimal: 18-25°C</span>
            </div>
          </div>
        </div>

        {/* pH Level */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-purple-500 mr-2" />
              <span className="font-medium">pH Level</span>
            </div>
            {getStatusIcon(soilData.ph, 6, 7.5)}
          </div>
          <div className="space-y-2">
            <Progress value={(soilData.ph / 14) * 100} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className={getStatusColor(soilData.ph, 6, 7.5)}>
                {soilData.ph.toFixed(1)}
              </span>
              <span className="text-gray-500">Optimal: 6.0-7.5</span>
            </div>
          </div>
        </div>

        {/* Nutrients */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-3 flex items-center">
            <Activity className="h-4 w-4 text-green-500 mr-2" />
            Nutrient Levels
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Nitrogen (N)</span>
                <span className="text-sm font-medium">{soilData.nutrients.nitrogen.toFixed(1)} ppm</span>
              </div>
              <Progress value={soilData.nutrients.nitrogen} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Phosphorus (P)</span>
                <span className="text-sm font-medium">{soilData.nutrients.phosphorus.toFixed(1)} ppm</span>
              </div>
              <Progress value={soilData.nutrients.phosphorus} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Potassium (K)</span>
                <span className="text-sm font-medium">{soilData.nutrients.potassium.toFixed(1)} ppm</span>
              </div>
              <Progress value={soilData.nutrients.potassium} className="h-1" />
            </div>
          </div>
        </div>

        {/* Irrigation Recommendation */}
        {soilData.moisture < 40 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <Droplets className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800 font-medium">
                Irrigation Recommended: Soil moisture below optimal level
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IoTSensorDashboard;
