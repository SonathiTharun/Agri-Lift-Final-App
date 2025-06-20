import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Sprout, AlertTriangle, CheckCircle, Thermometer, Wind, Sun, Bug, Leaf } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type AgricultureData = {
  soilMoisture: number;
  growingConditions: 'poor' | 'fair' | 'good' | 'excellent';
  plantingRecommendation: string;
  harvestingCondition: string;
  irrigationNeeded: boolean;
  pestRisk: 'low' | 'medium' | 'high';
  diseaseRisk: 'low' | 'medium' | 'high';
  optimalCrops: string[];
};

interface AgricultureInsightsProps {
  data: AgricultureData;
  weather: any;
  compact?: boolean;
}

const conditionColors = {
  poor: 'from-red-500 to-red-600',
  fair: 'from-yellow-500 to-orange-500',
  good: 'from-green-500 to-green-600',
  excellent: 'from-emerald-500 to-emerald-600'
};

const riskColors = {
  low: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-red-600 bg-red-100'
};

export function AgricultureInsights({ data, weather, compact = false }: AgricultureInsightsProps) {
  const getSoilMoistureStatus = (moisture: number) => {
    if (moisture < 30) return { status: 'Low', color: 'text-red-600', icon: AlertTriangle };
    if (moisture < 60) return { status: 'Moderate', color: 'text-yellow-600', icon: Droplets };
    return { status: 'Good', color: 'text-green-600', icon: CheckCircle };
  };

  const soilStatus = getSoilMoistureStatus(data.soilMoisture);
  const SoilIcon = soilStatus.icon;

  return (
    <div className="space-y-3">
      {/* Growing Conditions Overview */}
      <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className={`p-2 rounded-full bg-gradient-to-r ${conditionColors[data.growingConditions]}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Sprout className="h-4 w-4 text-white" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Growing Conditions</h3>
            <p className="text-xs text-gray-600 capitalize">{data.growingConditions}</p>
          </div>
        </div>
        
        {/* Condition indicators */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Thermometer className="h-3 w-3 text-orange-500" />
            <span>{weather?.temp || 0}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-3 w-3 text-blue-500" />
            <span>{weather?.humidity || 0}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-3 w-3 text-gray-500" />
            <span>{weather?.wind || 0} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-3 w-3 text-yellow-500" />
            <span>UV {weather?.uvIndex || 0}</span>
          </div>
        </div>
      </Card>

      {/* Soil Moisture */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SoilIcon className={`h-4 w-4 ${soilStatus.color}`} />
            <span className="text-sm font-medium">Soil Moisture</span>
          </div>
          <span className={`text-xs font-medium ${soilStatus.color}`}>
            {soilStatus.status}
          </span>
        </div>
        
        <div className="space-y-2">
          <Progress value={data.soilMoisture} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span className="font-medium">{data.soilMoisture}%</span>
            <span>100%</span>
          </div>
        </div>
        
        {data.irrigationNeeded && (
          <motion.div
            className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <Droplets className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-blue-800 font-medium">Irrigation Recommended</span>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Risk Assessment */}
      <Card className="p-3">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Risk Assessment
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-3 w-3 text-gray-600" />
              <span className="text-xs">Pest Risk</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${riskColors[data.pestRisk]}`}>
              {data.pestRisk}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-3 w-3 text-gray-600" />
              <span className="text-xs">Disease Risk</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${riskColors[data.diseaseRisk]}`}>
              {data.diseaseRisk}
            </span>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-sm font-medium mb-2 text-blue-900">Recommendations</h3>
        
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-medium text-blue-800">Planting:</span>
            <p className="text-blue-700 mt-1">{data.plantingRecommendation}</p>
          </div>
          
          <div>
            <span className="font-medium text-blue-800">Harvesting:</span>
            <p className="text-blue-700 mt-1">{data.harvestingCondition}</p>
          </div>
        </div>
      </Card>

      {/* Optimal Crops */}
      {data.optimalCrops.length > 0 && (
        <Card className="p-3">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Sprout className="h-4 w-4 text-green-500" />
            Optimal Crops
          </h3>
          
          <div className="flex flex-wrap gap-1">
            {data.optimalCrops.map((crop, index) => (
              <motion.span
                key={crop}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {crop}
              </motion.span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
