
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Leaf, BarChart, PieChart, ChevronRight, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LandDetails {
  location: string;
  pincode: string;
  plotNumber: string;
  totalArea: number;
  soilType: string;
  climateType: string;
}

interface Crop {
  id: string;
  name: string;
  category: string;
  soilCompatibility: string[];
  climateCompatibility: string[];
  waterUsage: "low" | "medium" | "high";
  growthCycle: "short" | "medium" | "long";
  roi: "low" | "medium" | "high";
  description: string;
  yieldPerAcre: number;
  recommendation?: number;
}

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface CropSelectionProps {
  landDetails: LandDetails;
  onSubmit: (crops: SelectedCrop[]) => void;
  onBack: () => void;
}

const SAMPLE_CROPS: Crop[] = [
  {
    id: "wheat",
    name: "Wheat",
    category: "Grain",
    soilCompatibility: ["Loam", "Clay", "Silt"],
    climateCompatibility: ["Temperate", "Continental"],
    waterUsage: "medium",
    growthCycle: "medium",
    roi: "medium",
    description: "A staple grain crop grown worldwide",
    yieldPerAcre: 3.5
  },
  {
    id: "rice",
    name: "Rice",
    category: "Grain",
    soilCompatibility: ["Clay", "Loam"],
    climateCompatibility: ["Tropical", "Temperate"],
    waterUsage: "high",
    growthCycle: "medium",
    roi: "medium",
    description: "Grown in flooded fields called rice paddies",
    yieldPerAcre: 4.2
  },
  {
    id: "corn",
    name: "Corn",
    category: "Grain",
    soilCompatibility: ["Loam", "Silt"],
    climateCompatibility: ["Temperate", "Tropical", "Continental"],
    waterUsage: "medium",
    growthCycle: "medium",
    roi: "high",
    description: "Versatile grain used for food, feed, and fuel",
    yieldPerAcre: 5.8
  },
  {
    id: "potato",
    name: "Potato",
    category: "Root Vegetable",
    soilCompatibility: ["Loam", "Sandy"],
    climateCompatibility: ["Temperate", "Continental"],
    waterUsage: "medium",
    growthCycle: "medium",
    roi: "high",
    description: "Tuberous root vegetable and world's fourth-largest food crop",
    yieldPerAcre: 12
  },
  {
    id: "tomato",
    name: "Tomato",
    category: "Vegetable",
    soilCompatibility: ["Loam", "Sandy"],
    climateCompatibility: ["Temperate", "Mediterranean"],
    waterUsage: "medium",
    growthCycle: "short",
    roi: "high",
    description: "Versatile fruit commonly used as a vegetable",
    yieldPerAcre: 15
  },
  {
    id: "cotton",
    name: "Cotton",
    category: "Fiber",
    soilCompatibility: ["Loam", "Clay"],
    climateCompatibility: ["Tropical", "Arid"],
    waterUsage: "high",
    growthCycle: "long",
    roi: "medium",
    description: "Major fiber crop used for textile production",
    yieldPerAcre: 0.8
  },
  {
    id: "soybean",
    name: "Soybean",
    category: "Legume",
    soilCompatibility: ["Loam", "Clay", "Silt"],
    climateCompatibility: ["Temperate", "Continental"],
    waterUsage: "low",
    growthCycle: "medium",
    roi: "medium",
    description: "Protein-rich legume used for oil, food, and animal feed",
    yieldPerAcre: 2.5
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    category: "Cash Crop",
    soilCompatibility: ["Loam", "Clay"],
    climateCompatibility: ["Tropical"],
    waterUsage: "high",
    growthCycle: "long",
    roi: "high",
    description: "Major source of sugar, grown in tropical regions",
    yieldPerAcre: 35
  }
];

const CropSelection = ({ landDetails, onSubmit, onBack }: CropSelectionProps) => {
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");
  const [selectedCrops, setSelectedCrops] = useState<SelectedCrop[]>([]);
  const [cropAllocations, setCropAllocations] = useState<Record<string, number>>({});
  const [availableArea, setAvailableArea] = useState<number>(landDetails.totalArea);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [cropsWithRecommendations, setCropsWithRecommendations] = useState<Crop[]>([...SAMPLE_CROPS]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const { toast } = useToast();

  // Filter tags
  const filterTags = [
    { id: "lowWater", label: "Low Water Usage", filter: (crop: Crop) => crop.waterUsage === "low" },
    { id: "shortCycle", label: "Short Cycle", filter: (crop: Crop) => crop.growthCycle === "short" },
    { id: "highROI", label: "High ROI", filter: (crop: Crop) => crop.roi === "high" },
    { id: "soilMatch", label: "Soil Compatible", filter: (crop: Crop) => crop.soilCompatibility.includes(landDetails.soilType) }
  ];

  // Check if a crop is compatible with the land's soil and climate
  const isCropCompatible = (crop: Crop) => {
    return (
      crop.soilCompatibility.includes(landDetails.soilType) &&
      crop.climateCompatibility.includes(landDetails.climateType)
    );
  };

  // Filter crops based on active filters
  const filteredCrops = cropsWithRecommendations.filter(crop => {
    if (activeFilters.length === 0) return true;
    
    return activeFilters.some(filterId => {
      const filterObj = filterTags.find(tag => tag.id === filterId);
      return filterObj ? filterObj.filter(crop) : false;
    });
  });

  // Get AI recommendations
  const getAIRecommendations = () => {
    setIsLoadingRecommendations(true);
    
    // Simulate API call for recommendations
    setTimeout(() => {
      const recommendedCrops = SAMPLE_CROPS.map(crop => {
        // Calculate a recommendation score based on soil/climate compatibility
        const soilMatch = crop.soilCompatibility.includes(landDetails.soilType);
        const climateMatch = crop.climateCompatibility.includes(landDetails.climateType);
        
        let recommendationScore = 0;
        if (soilMatch && climateMatch) recommendationScore = 0.8 + Math.random() * 0.2;
        else if (soilMatch || climateMatch) recommendationScore = 0.4 + Math.random() * 0.3;
        else recommendationScore = Math.random() * 0.2;
        
        return {
          ...crop,
          recommendation: Math.round(recommendationScore * 100)
        };
      }).sort((a, b) => (b.recommendation || 0) - (a.recommendation || 0));
      
      setCropsWithRecommendations(recommendedCrops);
      
      // Automatically select the top 3 crops for the AI tab
      if (activeTab === "ai") {
        const topCrops = recommendedCrops.slice(0, 3);
        const totalRecommendation = topCrops.reduce((sum, crop) => sum + (crop.recommendation || 0), 0);
        
        const newAllocations: Record<string, number> = {};
        const newSelectedCrops: SelectedCrop[] = [];
        
        let remainingArea = landDetails.totalArea;
        
        topCrops.forEach((crop, index) => {
          if (index === topCrops.length - 1) {
            // Last crop gets all remaining area
            newAllocations[crop.id] = remainingArea;
          } else {
            // Distribute by recommendation score
            const proportion = (crop.recommendation || 0) / totalRecommendation;
            const area = Math.round((landDetails.totalArea * proportion) * 10) / 10;
            newAllocations[crop.id] = area;
            remainingArea -= area;
          }
          
          newSelectedCrops.push({
            id: crop.id,
            name: crop.name,
            area: newAllocations[crop.id],
            percentage: (newAllocations[crop.id] / landDetails.totalArea) * 100,
            estimatedYield: newAllocations[crop.id] * crop.yieldPerAcre
          });
        });
        
        setCropAllocations(newAllocations);
        setSelectedCrops(newSelectedCrops);
        setAvailableArea(0);
      }
      
      setIsLoadingRecommendations(false);
      
      toast({
        title: "AI Recommendations Ready",
        description: "Crop recommendations based on your land details are ready"
      });
    }, 2000);
  };

  // Toggle filters
  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId) 
        : [...prev, filterId]
    );
  };

  // Handle area allocation changes
  const handleAreaChange = (cropId: string, value: number[]) => {
    const newArea = value[0];
    const oldArea = cropAllocations[cropId] || 0;
    const areaDifference = newArea - oldArea;
    
    // Check if we have enough available area
    if (areaDifference > availableArea && areaDifference > 0) {
      toast({
        title: "Allocation exceeds available area",
        description: `You only have ${availableArea} acres available`,
        variant: "destructive"
      });
      return;
    }
    
    const newAllocations = { ...cropAllocations, [cropId]: newArea };
    setCropAllocations(newAllocations);
    setAvailableArea(prev => prev - areaDifference);
    
    // Update selected crops
    updateSelectedCrops(newAllocations);
  };

  // Add a crop to the selection
  const addCrop = (crop: Crop) => {
    if (availableArea <= 0) {
      toast({
        title: "No area available",
        description: "Please reduce other crop allocations first",
        variant: "destructive"
      });
      return;
    }
    
    // Start with a small allocation
    const initialAllocation = Math.min(0.5, availableArea);
    const newAllocations = { 
      ...cropAllocations, 
      [crop.id]: (cropAllocations[crop.id] || 0) + initialAllocation 
    };
    
    setCropAllocations(newAllocations);
    setAvailableArea(prev => prev - initialAllocation);
    
    // Update selected crops
    updateSelectedCrops(newAllocations);
  };

  // Remove a crop from the selection
  const removeCrop = (cropId: string) => {
    const areaFreed = cropAllocations[cropId] || 0;
    
    // Create new allocations without this crop
    const newAllocations = { ...cropAllocations };
    delete newAllocations[cropId];
    
    setCropAllocations(newAllocations);
    setAvailableArea(prev => prev + areaFreed);
    
    // Update selected crops
    updateSelectedCrops(newAllocations);
  };

  // Update the selected crops array based on allocations
  const updateSelectedCrops = (allocations: Record<string, number>) => {
    const crops = Object.entries(allocations)
      .filter(([_, area]) => area > 0)
      .map(([cropId, area]) => {
        const cropInfo = cropsWithRecommendations.find(crop => crop.id === cropId);
        if (!cropInfo) return null;
        
        return {
          id: cropId,
          name: cropInfo.name,
          area,
          percentage: (area / landDetails.totalArea) * 100,
          estimatedYield: area * cropInfo.yieldPerAcre
        };
      })
      .filter(Boolean) as SelectedCrop[];
    
    setSelectedCrops(crops);
  };

  // When the tab changes, we might want to get AI recommendations
  useEffect(() => {
    if (activeTab === "ai" && !cropsWithRecommendations.some(crop => crop.recommendation !== undefined)) {
      getAIRecommendations();
    }
  }, [activeTab]);

  // Check if ready to submit
  const isReadyToSubmit = selectedCrops.length > 0 && availableArea < landDetails.totalArea;

  const handleSubmit = () => {
    if (!isReadyToSubmit) {
      toast({
        title: "Incomplete allocation",
        description: "Please allocate some area to at least one crop",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(selectedCrops);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Step 2: Crop Selection</h2>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "manual" | "ai")} className="mb-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="manual">Manual Selection</TabsTrigger>
          <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-6">
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Filter Crops</h3>
            <div className="flex flex-wrap gap-2">
              {filterTags.map(tag => (
                <Badge 
                  key={tag.id}
                  variant={activeFilters.includes(tag.id) ? "default" : "outline"}
                  className={`cursor-pointer ${activeFilters.includes(tag.id) ? "bg-foliage hover:bg-foliage-dark" : ""}`}
                  onClick={() => toggleFilter(tag.id)}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Available Crops</h3>
              <div className="h-80 overflow-y-auto border rounded-md p-2 space-y-2">
                {filteredCrops.map(crop => (
                  <TooltipProvider key={crop.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`p-3 border rounded-md ${
                            isCropCompatible(crop) 
                              ? "border-foliage/30 bg-foliage/5" 
                              : "border-gray-200"
                          } hover:bg-gray-50 cursor-pointer flex justify-between items-center`}
                          onClick={() => addCrop(crop)}
                        >
                          <div className="flex items-center">
                            <Leaf size={16} className="mr-2 text-foliage" />
                            <span>{crop.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {crop.category}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="w-64 p-2">
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Description:</span> {crop.description}</p>
                          <p>
                            <span className="font-medium">Compatibility:</span> {" "}
                            {isCropCompatible(crop) 
                              ? "Good match for your land" 
                              : "Not ideal for your soil/climate"
                            }
                          </p>
                          <p>
                            <span className="font-medium">Water:</span> {" "}
                            {crop.waterUsage === "low" ? "Low usage" : 
                             crop.waterUsage === "medium" ? "Medium usage" : 
                             "High usage"}
                          </p>
                          <p>
                            <span className="font-medium">ROI:</span> {" "}
                            {crop.roi === "high" ? "High return" : 
                             crop.roi === "medium" ? "Medium return" : 
                             "Low return"}
                          </p>
                          <p><span className="font-medium">Yield:</span> {crop.yieldPerAcre} tons/acre</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {filteredCrops.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No crops match your filters
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Your Allocation</h3>
                <Badge variant={availableArea > 0 ? "outline" : "default"} className={availableArea > 0 ? "" : "bg-foliage"}>
                  {availableArea.toFixed(1)} acres available
                </Badge>
              </div>
              
              <div className="h-80 overflow-y-auto border rounded-md p-2 space-y-3">
                {selectedCrops.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Select crops to allocate area</p>
                  </div>
                ) : (
                  selectedCrops.map(crop => {
                    const cropInfo = cropsWithRecommendations.find(c => c.id === crop.id);
                    return (
                      <div key={crop.id} className="border rounded-md p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{crop.name}</div>
                          <button 
                            className="text-gray-500 hover:text-red-500" 
                            onClick={() => removeCrop(crop.id)}
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-sm w-20">{crop.area.toFixed(1)} acres</span>
                          <Slider
                            value={[crop.area]}
                            min={0.1}
                            max={landDetails.totalArea}
                            step={0.1}
                            onValueChange={(value) => handleAreaChange(crop.id, value)}
                            className="flex-1"
                          />
                          <span className="text-sm w-16">{crop.percentage.toFixed(0)}%</span>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Est. yield: {crop.estimatedYield.toFixed(1)} {cropInfo?.category === "Grain" ? "tons" : "units"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          {isLoadingRecommendations ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="animate-spin h-8 w-8 border-4 border-foliage border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600">Analyzing soil, climate, and market data...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-foliage-light/30 to-foliage-light/10 rounded-md p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <BarChart size={18} className="mr-2 text-foliage-dark" />
                  AI Crop Recommendations
                </h3>
                <p className="text-sm text-gray-600">
                  Based on your {landDetails.soilType} soil, {landDetails.climateType} climate, and current market trends
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recommended Crop Plan</h3>
                  
                  {selectedCrops.map(crop => {
                    const cropInfo = cropsWithRecommendations.find(c => c.id === crop.id);
                    return (
                      <div key={crop.id} className="border rounded-md p-3 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium flex items-center">
                            <Leaf size={16} className="mr-1 text-foliage" />
                            {crop.name}
                          </div>
                          <Badge className="bg-foliage">
                            {cropInfo?.recommendation}% match
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm w-16">{crop.area.toFixed(1)} acres</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-foliage rounded-full" 
                              style={{ width: `${crop.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm w-12">{crop.percentage.toFixed(0)}%</span>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Est. yield: {crop.estimatedYield.toFixed(1)} {cropInfo?.category === "Grain" ? "tons" : "units"}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-medium">Total Allocation:</span>
                    <Badge variant="outline">{(landDetails.totalArea - availableArea).toFixed(1)} / {landDetails.totalArea} acres</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Analysis & Insights</h3>
                  
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 bg-white shadow-sm">
                      <h4 className="font-medium mb-2 flex items-center">
                        <PieChart size={16} className="mr-1 text-foliage-dark" />
                        Resource Utilization
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        This crop mix optimizes water usage and labor requirements for your land.
                      </p>
                      <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-xs">
                        Resource utilization chart would appear here
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-white shadow-sm">
                      <h4 className="font-medium mb-2">Market Outlook</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedCrops.slice(0, 3).map(crop => (
                          <li key={crop.id} className="flex justify-between">
                            <span>{crop.name}:</span>
                            <span className="font-medium text-foliage-dark">
                              Strong demand predicted
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-white shadow-sm">
                      <h4 className="font-medium mb-2">Projected Revenue</h4>
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">Estimated annual revenue based on current market prices:</p>
                        <p className="text-lg font-bold text-foliage-dark">
                          ₹{
                            Math.round(
                              selectedCrops.reduce((sum, crop) => {
                                // Random price between 8000 and 25000 per ton
                                const pricePerTon = 8000 + Math.random() * 17000;
                                return sum + (crop.estimatedYield * pricePerTon);
                              }, 0)
                            ).toLocaleString()
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        
        <Button 
          onClick={handleSubmit}
          className={`bg-foliage hover:bg-foliage-dark flex items-center ${!isReadyToSubmit ? 'opacity-70' : ''}`}
          disabled={!isReadyToSubmit}
        >
          Continue
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default CropSelection;
