import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Leaf, BarChart, PieChart, ChevronRight, ChevronLeft, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CROPS_DATABASE, getCropRecommendationScore, type CropDetails } from "@/data/cropsDatabase";

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

interface CropSelectionProps {
  landDetails: LandDetails;
  onSubmit: (crops: SelectedCrop[]) => void;
  onBack: () => void;
}

const CropSelection = ({ landDetails, onSubmit, onBack }: CropSelectionProps) => {
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");
  const [selectedCrops, setSelectedCrops] = useState<SelectedCrop[]>([]);
  const [cropAllocations, setCropAllocations] = useState<Record<string, number>>({});
  const [availableArea, setAvailableArea] = useState<number>(landDetails.totalArea);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cropsWithRecommendations, setCropsWithRecommendations] = useState<(CropDetails & { recommendation?: number })[]>([...CROPS_DATABASE]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const { toast } = useToast();

  // Filter tags
  const filterTags = [
    { id: "lowWater", label: "Low Water Usage", filter: (crop: CropDetails) => crop.waterUsage === "low" },
    { id: "shortCycle", label: "Short Cycle", filter: (crop: CropDetails) => crop.growthCycle === "short" },
    { id: "highROI", label: "High ROI", filter: (crop: CropDetails) => crop.roi === "high" },
    { id: "soilMatch", label: "Soil Compatible", filter: (crop: CropDetails) => crop.soilCompatibility.includes(landDetails.soilType) },
    { id: "climateMatch", label: "Climate Compatible", filter: (crop: CropDetails) => crop.climateCompatibility.includes(landDetails.climateType) }
  ];

  // Categories
  const categories = ["all", ...Array.from(new Set(CROPS_DATABASE.map(crop => crop.category)))];

  // Check if a crop is compatible with the land's soil and climate
  const isCropCompatible = (crop: CropDetails) => {
    return (
      crop.soilCompatibility.includes(landDetails.soilType) &&
      crop.climateCompatibility.includes(landDetails.climateType)
    );
  };

  // Filter crops based on active filters, search term, and category
  const filteredCrops = cropsWithRecommendations.filter(crop => {
    // Category filter
    if (selectedCategory !== "all" && crop.category !== selectedCategory) return false;
    
    // Search filter
    if (searchTerm && !crop.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Active filters
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
      const recommendedCrops = CROPS_DATABASE.map(crop => {
        const recommendationScore = getCropRecommendationScore(crop, landDetails.soilType, landDetails.climateType);
        return {
          ...crop,
          recommendation: recommendationScore
        };
      }).sort((a, b) => (b.recommendation || 0) - (a.recommendation || 0));
      
      setCropsWithRecommendations(recommendedCrops);
      
      // Automatically select the top 3-4 crops for the AI tab
      if (activeTab === "ai") {
        const topCrops = recommendedCrops.slice(0, 4).filter(crop => (crop.recommendation || 0) > 60);
        
        const newAllocations: Record<string, number> = {};
        const newSelectedCrops: SelectedCrop[] = [];
        
        let remainingArea = landDetails.totalArea;
        const totalRecommendation = topCrops.reduce((sum, crop) => sum + (crop.recommendation || 0), 0);
        
        topCrops.forEach((crop, index) => {
          if (index === topCrops.length - 1) {
            // Last crop gets all remaining area
            newAllocations[crop.id] = remainingArea;
          } else {
            // Distribute by recommendation score
            const proportion = (crop.recommendation || 0) / totalRecommendation;
            const area = Math.round((landDetails.totalArea * proportion) * 10) / 10;
            newAllocations[crop.id] = Math.min(area, remainingArea);
            remainingArea -= newAllocations[crop.id];
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
        setAvailableArea(Math.max(0, landDetails.totalArea - Object.values(newAllocations).reduce((a, b) => a + b, 0)));
      }
      
      setIsLoadingRecommendations(false);
      
      toast({
        title: "AI Recommendations Ready",
        description: `Generated recommendations for ${landDetails.soilType} soil and ${landDetails.climateType} climate`
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
        description: `You only have ${availableArea.toFixed(1)} acres available`,
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
  const addCrop = (crop: CropDetails) => {
    if (availableArea <= 0) {
      toast({
        title: "No area available",
        description: "Please reduce other crop allocations first",
        variant: "destructive"
      });
      return;
    }
    
    // Start with a reasonable allocation based on available area
    const initialAllocation = Math.min(Math.max(0.5, availableArea * 0.2), availableArea);
    const newAllocations = { 
      ...cropAllocations, 
      [crop.id]: (cropAllocations[crop.id] || 0) + initialAllocation 
    };
    
    setCropAllocations(newAllocations);
    setAvailableArea(prev => prev - initialAllocation);
    
    // Update selected crops
    updateSelectedCrops(newAllocations);
    
    toast({
      title: "Crop added",
      description: `${crop.name} allocated ${initialAllocation.toFixed(1)} acres`
    });
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
      <h2 className="text-xl font-semibold mb-6">Step 2: Crop Selection & Allocation</h2>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "manual" | "ai")} className="mb-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="manual">Manual Selection</TabsTrigger>
          <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-gray-50 rounded-md p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter Crops
              </h3>
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
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Available Crops ({filteredCrops.length})
              </h3>
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
                          } hover:bg-gray-50 cursor-pointer`}
                          onClick={() => addCrop(crop)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Leaf size={16} className="mr-2 text-foliage" />
                              <span className="font-medium">{crop.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {crop.category}
                              </Badge>
                              {isCropCompatible(crop) && (
                                <Badge variant="default" className="text-xs bg-green-500">
                                  Compatible
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Yield: {crop.yieldPerAcre} tons/acre • ROI: {crop.roi} • Water: {crop.waterUsage}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="w-80 p-3">
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Description:</span> {crop.description}</p>
                          <p><span className="font-medium">Market Price:</span> ₹{crop.marketPrice.toLocaleString()}/ton</p>
                          <p><span className="font-medium">Planting Seasons:</span> {crop.plantingSeasons.join(", ")}</p>
                          <p><span className="font-medium">Harvest:</span> {crop.harvestMonths.join(", ")}</p>
                          <p><span className="font-medium">Maturity:</span> {crop.maturityDays} days</p>
                          <p><span className="font-medium">pH Range:</span> {crop.phRange[0]} - {crop.phRange[1]}</p>
                          <p>
                            <span className="font-medium">Compatibility:</span> {" "}
                            {isCropCompatible(crop) 
                              ? "Good match for your land" 
                              : "Not ideal for your soil/climate"
                            }
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {filteredCrops.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No crops match your current filters
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
                        
                        <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                          <span>Est. yield: {crop.estimatedYield.toFixed(1)} tons</span>
                          <span>Revenue: ₹{Math.round(crop.estimatedYield * (cropInfo?.marketPrice || 0)).toLocaleString()}</span>
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
                <p className="text-sm text-gray-500">Generating personalized recommendations for {landDetails.soilType} soil</p>
              </div>
            </div>
          ) : (
            // ... keep existing code (AI recommendations display)
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
                        
                        <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                          <span>Yield: {crop.estimatedYield.toFixed(1)} tons</span>
                          <span>Revenue: ₹{Math.round(crop.estimatedYield * (cropInfo?.marketPrice || 0)).toLocaleString()}</span>
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
                                const cropInfo = cropsWithRecommendations.find(c => c.id === crop.id);
                                return sum + (crop.estimatedYield * (cropInfo?.marketPrice || 0));
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
          Continue to Analysis
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default CropSelection;
