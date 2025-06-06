
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Sparkles, TrendingUp, Brain, Target, Droplets, Sun, DollarSign, Clock, AlertTriangle, Wand2 } from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";

interface LandDetails {
  location: string;
  pincode: string;
  plotNumber: string;
  totalArea: number;
  soilType: string;
  climateType: string;
}

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface CropRecommendation {
  id: string;
  name: string;
  suitability: number;
  expectedYield: number;
  marketPrice: number;
  profitability: number;
  riskLevel: 'low' | 'medium' | 'high';
  waterRequirement: 'low' | 'medium' | 'high';
  growingSeason: string;
  marketDemand: 'low' | 'medium' | 'high';
  reasons: string[];
}

interface CropSelectionEnhancedProps {
  landDetails: LandDetails;
  onSubmit: (crops: SelectedCrop[]) => void;
  onBack: () => void;
}

const CropSelectionEnhanced = ({ landDetails, onSubmit, onBack }: CropSelectionEnhancedProps) => {
  const [selectedCrops, setSelectedCrops] = useState<SelectedCrop[]>([]);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [activeTab, setActiveTab] = useState("ai-recommendations");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { weatherData, marketData } = useRealTimeData(landDetails.location);

  useEffect(() => {
    // Simulate AI analysis for crop recommendations
    setTimeout(() => {
      const aiRecommendations: CropRecommendation[] = [
        {
          id: 'wheat',
          name: 'Wheat',
          suitability: 92,
          expectedYield: 3.2,
          marketPrice: 2500,
          profitability: 85,
          riskLevel: 'low',
          waterRequirement: 'medium',
          growingSeason: 'Rabi (Oct-Mar)',
          marketDemand: 'high',
          reasons: ['Excellent soil compatibility', 'Favorable climate conditions', 'High market demand', 'Low disease risk']
        },
        {
          id: 'rice',
          name: 'Rice',
          suitability: 78,
          expectedYield: 4.1,
          marketPrice: 2200,
          profitability: 72,
          riskLevel: 'medium',
          waterRequirement: 'high',
          growingSeason: 'Kharif (Jun-Nov)',
          marketDemand: 'high',
          reasons: ['Good water availability', 'Traditional crop for region', 'Stable market prices']
        },
        {
          id: 'corn',
          name: 'Corn',
          suitability: 88,
          expectedYield: 5.5,
          marketPrice: 1800,
          profitability: 79,
          riskLevel: 'low',
          waterRequirement: 'medium',
          growingSeason: 'Kharif (Apr-Oct)',
          marketDemand: 'medium',
          reasons: ['High yield potential', 'Drought tolerance', 'Growing industrial demand']
        },
        {
          id: 'tomato',
          name: 'Tomato',
          suitability: 95,
          expectedYield: 25.0,
          marketPrice: 1500,
          profitability: 95,
          riskLevel: 'high',
          waterRequirement: 'high',
          growingSeason: 'Year-round',
          marketDemand: 'high',
          reasons: ['Excellent profitability', 'Year-round cultivation', 'High market prices', 'Suitable soil type']
        },
        {
          id: 'potato',
          name: 'Potato',
          suitability: 82,
          expectedYield: 18.5,
          marketPrice: 1200,
          profitability: 68,
          riskLevel: 'medium',
          waterRequirement: 'medium',
          growingSeason: 'Rabi (Oct-Feb)',
          marketDemand: 'medium',
          reasons: ['Good storage potential', 'Consistent demand', 'Suitable climate']
        }
      ];
      
      setRecommendations(aiRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  }, [landDetails]);

  const addCrop = (crop: CropRecommendation, area: number) => {
    const newCrop: SelectedCrop = {
      id: crop.id,
      name: crop.name,
      area: area,
      percentage: (area / landDetails.totalArea) * 100,
      estimatedYield: crop.expectedYield * area
    };

    setSelectedCrops(prev => {
      const existing = prev.find(c => c.id === crop.id);
      if (existing) {
        return prev.map(c => c.id === crop.id ? newCrop : c);
      }
      return [...prev, newCrop];
    });
  };

  const optimizeAllocation = () => {
    setIsOptimizing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const totalArea = landDetails.totalArea;
      const sortedRecommendations = [...recommendations].sort((a, b) => 
        (b.suitability + b.profitability) - (a.suitability + a.profitability)
      );
      
      // Calculate allocation based on suitability, profitability and risk balance
      const newAllocations: SelectedCrop[] = [];
      let remainingArea = totalArea;
      
      // For best crop, allocate up to 40% of land depending on suitability
      if (sortedRecommendations.length > 0) {
        const topCrop = sortedRecommendations[0];
        const allocation = Math.min(
          remainingArea * 0.4, 
          (totalArea * topCrop.suitability / 100) * 0.5
        );
        newAllocations.push({
          id: topCrop.id,
          name: topCrop.name,
          area: parseFloat(allocation.toFixed(1)),
          percentage: (allocation / totalArea) * 100,
          estimatedYield: topCrop.expectedYield * allocation
        });
        remainingArea -= allocation;
      }
      
      // For second best crop, allocate up to 30% of land
      if (sortedRecommendations.length > 1) {
        const secondCrop = sortedRecommendations[1];
        const allocation = Math.min(
          remainingArea * 0.5,
          (totalArea * secondCrop.suitability / 100) * 0.4
        );
        newAllocations.push({
          id: secondCrop.id,
          name: secondCrop.name,
          area: parseFloat(allocation.toFixed(1)),
          percentage: (allocation / totalArea) * 100,
          estimatedYield: secondCrop.expectedYield * allocation
        });
        remainingArea -= allocation;
      }
      
      // Distribute remaining land to other crops based on their suitability
      if (sortedRecommendations.length > 2 && remainingArea > 0) {
        const remainingCrops = sortedRecommendations.slice(2, 5); // Take up to 3 more crops
        const totalSuitability = remainingCrops.reduce((sum, crop) => sum + crop.suitability, 0);
        
        remainingCrops.forEach(crop => {
          if (remainingArea > 0 && totalSuitability > 0) {
            const suitabilityRatio = crop.suitability / totalSuitability;
            const allocation = parseFloat((remainingArea * suitabilityRatio).toFixed(1));
            
            if (allocation >= 0.1) { // Only add if allocation is meaningful
              newAllocations.push({
                id: crop.id,
                name: crop.name,
                area: allocation,
                percentage: (allocation / totalArea) * 100,
                estimatedYield: crop.expectedYield * allocation
              });
              remainingArea -= allocation;
            }
          }
        });
      }
      
      // If there's still land left, add it to the highest suitability crop
      if (remainingArea > 0.1 && newAllocations.length > 0) {
        newAllocations[0].area = parseFloat((newAllocations[0].area + remainingArea).toFixed(1));
        newAllocations[0].percentage = (newAllocations[0].area / totalArea) * 100;
        newAllocations[0].estimatedYield = recommendations.find(r => r.id === newAllocations[0].id)!.expectedYield * newAllocations[0].area;
      }
      
      setSelectedCrops(newAllocations);
      setIsOptimizing(false);
    }, 1500);
  };

  const removeCrop = (cropId: string) => {
    setSelectedCrops(prev => prev.filter(c => c.id !== cropId));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const totalAllocated = selectedCrops.reduce((sum, crop) => sum + crop.area, 0);
  const canSubmit = selectedCrops.length > 0 && totalAllocated <= landDetails.totalArea;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Smart Crop Selection</h2>
        <p className="text-gray-600">AI-powered recommendations based on your land analysis</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Recommendations */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai-recommendations" className="flex items-center">
                <Brain className="h-4 w-4 mr-1" />
                AI Recommendations
              </TabsTrigger>
              <TabsTrigger value="market-analysis" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Market Analysis
              </TabsTrigger>
              <TabsTrigger value="custom-selection" className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Custom Selection
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-recommendations" className="mt-4">
              {isAnalyzing ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-3">
                      <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
                      <div className="text-lg font-medium">Analyzing your land for optimal crops...</div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((crop) => (
                    <Card key={crop.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Sparkles className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className="bg-blue-100 text-blue-800">
                                  {crop.suitability}% Match
                                </Badge>
                                <Badge className={getRiskColor(crop.riskLevel)}>
                                  {crop.riskLevel} risk
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              ₹{(crop.expectedYield * crop.marketPrice).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">per acre potential</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Target className="h-4 w-4 text-blue-500 mr-1" />
                            </div>
                            <div className="text-sm text-gray-600">Yield</div>
                            <div className="font-semibold">{crop.expectedYield} tons/acre</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                            </div>
                            <div className="text-sm text-gray-600">Price</div>
                            <div className="font-semibold">₹{crop.marketPrice}/ton</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Droplets className="h-4 w-4 text-blue-500 mr-1" />
                            </div>
                            <div className="text-sm text-gray-600">Water Need</div>
                            <div className="font-semibold capitalize">{crop.waterRequirement}</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Clock className="h-4 w-4 text-purple-500 mr-1" />
                            </div>
                            <div className="text-sm text-gray-600">Season</div>
                            <div className="font-semibold text-xs">{crop.growingSeason}</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Why this crop is recommended:</div>
                          <div className="flex flex-wrap gap-2">
                            {crop.reasons.map((reason, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <Label htmlFor={`area-${crop.id}`} className="text-sm">Area to allocate (acres)</Label>
                            <Input
                              id={`area-${crop.id}`}
                              type="number"
                              step="0.1"
                              min="0"
                              max={landDetails.totalArea}
                              placeholder="0"
                              className="mt-1"
                              onChange={(e) => {
                                const area = parseFloat(e.target.value) || 0;
                                if (area > 0) addCrop(crop, area);
                              }}
                            />
                          </div>
                          
                          <Button 
                            onClick={() => addCrop(crop, Math.min(1, landDetails.totalArea))}
                            className="bg-green-600 hover:bg-green-700 mt-6"
                          >
                            Add Crop
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="market-analysis" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Current Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketData.map((item) => (
                      <div key={item.crop} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium capitalize">{item.crop}</div>
                          <div className="text-sm text-gray-500">Volume: {item.volume.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{item.price.toFixed(2)}/ton</div>
                          <div className={`text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom-selection" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Crop Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Select crops manually based on your experience and preferences.
                  </p>
                  <div className="space-y-4">
                    {['Wheat', 'Rice', 'Corn', 'Tomato', 'Potato', 'Onion', 'Cotton', 'Sugarcane'].map((cropName) => (
                      <div key={cropName} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex-1 font-medium">{cropName}</div>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max={landDetails.totalArea}
                          placeholder="Area (acres)"
                          className="w-32"
                          onChange={(e) => {
                            const area = parseFloat(e.target.value) || 0;
                            if (area > 0) {
                              addCrop({
                                id: cropName.toLowerCase(),
                                name: cropName,
                                suitability: 75,
                                expectedYield: 3.0,
                                marketPrice: 2000,
                                profitability: 70,
                                riskLevel: 'medium',
                                waterRequirement: 'medium',
                                growingSeason: 'Season varies',
                                marketDemand: 'medium',
                                reasons: ['Manual selection']
                              }, area);
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Selected Crops Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Selected Crops
                </span>
                <Button 
                  onClick={optimizeAllocation} 
                  variant="outline" 
                  className="flex items-center space-x-1" 
                  disabled={isAnalyzing || isOptimizing}
                >
                  <Wand2 size={16} className="mr-1" />
                  {isOptimizing ? "Optimizing..." : "Let AI Decide"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Total Area:</span>
                  <span className="font-semibold">{landDetails.totalArea} acres</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Allocated:</span>
                  <span className={`font-semibold ${totalAllocated > landDetails.totalArea ? 'text-red-600' : 'text-green-600'}`}>
                    {totalAllocated.toFixed(1)} acres
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className="font-semibold">{(landDetails.totalArea - totalAllocated).toFixed(1)} acres</span>
                </div>
              </div>

              {totalAllocated > landDetails.totalArea && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-800">
                      Allocated area exceeds total land area
                    </span>
                  </div>
                </div>
              )}

              {isOptimizing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Wand2 className="h-4 w-4 text-blue-600 animate-pulse" />
                    <span className="text-sm text-blue-800">
                      AI is optimizing crop allocation...
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {selectedCrops.map((crop) => (
                  <div key={crop.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{crop.name}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCrop(crop.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Area: {crop.area} acres ({crop.percentage.toFixed(1)}%)</div>
                      <div>Est. Yield: {crop.estimatedYield.toFixed(1)} tons</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCrops.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm">No crops selected yet</div>
                  <div className="text-xs">Choose from AI recommendations</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ChevronLeft size={16} className="mr-1" />
          Back to Land Details
        </Button>
        
        <Button 
          onClick={() => onSubmit(selectedCrops)}
          className="bg-green-600 hover:bg-green-700"
          disabled={!canSubmit}
        >
          Continue to Real-Time Analysis →
        </Button>
      </div>
    </div>
  );
};

export default CropSelectionEnhanced;
