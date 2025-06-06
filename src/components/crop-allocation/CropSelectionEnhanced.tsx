
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Brain, TrendingUp, Target } from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { LandDetails, SelectedCrop, CropRecommendation } from "./types";
import { optimizeAllocation } from "./cropAllocationUtils";
import AIRecommendationsTab from "./AIRecommendationsTab";
import MarketAnalysisTab from "./MarketAnalysisTab";
import CustomSelectionTab from "./CustomSelectionTab";
import SelectedCropsSummary from "./SelectedCropsSummary";

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

  const handleOptimizeAllocation = () => {
    setIsOptimizing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const newAllocations = optimizeAllocation(recommendations, landDetails.totalArea);
      setSelectedCrops(newAllocations);
      setIsOptimizing(false);
    }, 1500);
  };

  const removeCrop = (cropId: string) => {
    setSelectedCrops(prev => prev.filter(c => c.id !== cropId));
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
              <AIRecommendationsTab 
                isAnalyzing={isAnalyzing}
                recommendations={recommendations}
                onAddCrop={addCrop}
                maxArea={landDetails.totalArea}
              />
            </TabsContent>

            <TabsContent value="market-analysis" className="mt-4">
              <MarketAnalysisTab marketData={marketData} />
            </TabsContent>

            <TabsContent value="custom-selection" className="mt-4">
              <CustomSelectionTab 
                onAddCrop={addCrop}
                maxArea={landDetails.totalArea}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Selected Crops Summary */}
        <div>
          <SelectedCropsSummary 
            landDetails={landDetails}
            selectedCrops={selectedCrops}
            isOptimizing={isOptimizing}
            onOptimize={handleOptimizeAllocation}
            onRemoveCrop={removeCrop}
          />
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
