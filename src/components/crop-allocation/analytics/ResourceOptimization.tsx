
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Zap, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { getCropById } from '@/data/cropsDatabase';

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface LandDetails {
  totalArea: number;
  soilType: string;
  climateType: string;
}

interface ResourceOptimizationProps {
  selectedCrops: SelectedCrop[];
  landDetails: LandDetails;
}

const ResourceOptimization: React.FC<ResourceOptimizationProps> = ({ selectedCrops, landDetails }) => {
  const calculateResourceUtilization = () => {
    let totalWaterRequirement = 0;
    let totalLaborDays = 0;
    let totalFertilizerNeed = 0;
    let resourceWarnings: string[] = [];
    let optimizations: string[] = [];

    selectedCrops.forEach(crop => {
      const cropData = getCropById(crop.id);
      if (!cropData) return;

      // Water calculation (liters per day for the crop area)
      const cropWaterNeed = crop.area * cropData.waterRequirement * 1000; // Convert to liters
      totalWaterRequirement += cropWaterNeed;

      // Labor calculation (estimated person-days per acre)
      const laborPerAcre = cropData.growthCycle === "short" ? 30 : 
                          cropData.growthCycle === "medium" ? 50 : 80;
      totalLaborDays += crop.area * laborPerAcre;

      // Fertilizer calculation (kg per acre)
      const fertilizerPerAcre = 200; // Average kg per acre
      totalFertilizerNeed += crop.area * fertilizerPerAcre;

      // Check for warnings
      if (cropData.waterUsage === "high" && crop.area > landDetails.totalArea * 0.3) {
        resourceWarnings.push(`${crop.name} requires high water usage and covers ${crop.percentage.toFixed(0)}% of your land`);
      }

      if (!cropData.soilCompatibility.includes(landDetails.soilType)) {
        resourceWarnings.push(`${crop.name} may not perform well in ${landDetails.soilType} soil`);
      }

      // Generate optimizations
      if (cropData.companionCrops.length > 0) {
        optimizations.push(`Consider companion planting with ${crop.name}: ${cropData.companionCrops.slice(0, 2).join(", ")}`);
      }
    });

    // Calculate efficiency scores
    const waterEfficiencyScore = Math.max(0, 100 - (totalWaterRequirement / (landDetails.totalArea * 5000))); // Arbitrary baseline
    const laborEfficiencyScore = Math.max(0, 100 - (totalLaborDays / (landDetails.totalArea * 60))); // Arbitrary baseline
    const diversificationScore = Math.min(100, (selectedCrops.length / 5) * 100); // Optimal is 5 crops

    return {
      totalWaterRequirement,
      totalLaborDays,
      totalFertilizerNeed,
      waterEfficiencyScore,
      laborEfficiencyScore,
      diversificationScore,
      resourceWarnings,
      optimizations
    };
  };

  const resources = calculateResourceUtilization();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Resource Utilization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Droplets className="h-4 w-4 mr-2 text-blue-500" />
              Water Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(resources.totalWaterRequirement)} L/day
              </div>
              <div className="text-sm text-gray-600">
                Per acre: {formatNumber(resources.totalWaterRequirement / landDetails.totalArea)} L/day
              </div>
              <Progress 
                value={resources.waterEfficiencyScore} 
                className="h-2"
              />
              <div className={`text-sm font-medium ${getScoreColor(resources.waterEfficiencyScore)}`}>
                Efficiency: {resources.waterEfficiencyScore.toFixed(0)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-green-500" />
              Labor Requirement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(resources.totalLaborDays)} days
              </div>
              <div className="text-sm text-gray-600">
                Per acre: {formatNumber(resources.totalLaborDays / landDetails.totalArea)} days
              </div>
              <Progress 
                value={resources.laborEfficiencyScore} 
                className="h-2"
              />
              <div className={`text-sm font-medium ${getScoreColor(resources.laborEfficiencyScore)}`}>
                Efficiency: {resources.laborEfficiencyScore.toFixed(0)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2 text-purple-500" />
              Fertilizer Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(resources.totalFertilizerNeed)} kg
              </div>
              <div className="text-sm text-gray-600">
                Per acre: {formatNumber(resources.totalFertilizerNeed / landDetails.totalArea)} kg
              </div>
              <Progress 
                value={resources.diversificationScore} 
                className="h-2"
              />
              <div className={`text-sm font-medium ${getScoreColor(resources.diversificationScore)}`}>
                Diversification: {resources.diversificationScore.toFixed(0)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Warnings */}
      {resources.resourceWarnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-orange-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Resource Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resources.resourceWarnings.map((warning, index) => (
                <Alert key={index} className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-orange-800">
                    {warning}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resources.optimizations.slice(0, 3).map((optimization, index) => (
              <Alert key={index} className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  {optimization}
                </AlertDescription>
              </Alert>
            ))}
            
            {/* General recommendations */}
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Consider installing drip irrigation to reduce water usage by 30-50%
              </AlertDescription>
            </Alert>
            
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Implement crop rotation to improve soil health and reduce pest pressure
              </AlertDescription>
            </Alert>
            
            {selectedCrops.length < 3 && (
              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-blue-800">
                  Add more crop varieties to improve risk diversification and soil health
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resource Efficiency Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Resource Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-blue-600">
                {resources.waterEfficiencyScore.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 mb-2">Water Efficiency</div>
              <Progress value={resources.waterEfficiencyScore} className="h-3" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-green-600">
                {resources.laborEfficiencyScore.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 mb-2">Labor Efficiency</div>
              <Progress value={resources.laborEfficiencyScore} className="h-3" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-purple-600">
                {resources.diversificationScore.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 mb-2">Crop Diversification</div>
              <Progress value={resources.diversificationScore} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceOptimization;
