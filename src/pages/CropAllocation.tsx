
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import LandDetailsForm from "@/components/crop-allocation/LandDetailsForm";
import CropSelection from "@/components/crop-allocation/CropSelection";
import PlotVisualizationEnhanced from "@/components/crop-allocation/PlotVisualizationEnhanced";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type StepType = "land-details" | "crop-selection" | "visualization";

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

const CropAllocation = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("land-details");
  const [landDetails, setLandDetails] = useState<LandDetails>({
    location: "",
    pincode: "",
    plotNumber: "",
    totalArea: 0,
    soilType: "Loam",
    climateType: "Temperate"
  });
  const [selectedCrops, setSelectedCrops] = useState<SelectedCrop[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLandDetailsSubmit = (data: LandDetails) => {
    setLandDetails(data);
    setCurrentStep("crop-selection");
  };

  const handleCropSelectionSubmit = (crops: SelectedCrop[]) => {
    setSelectedCrops(crops);
    setCurrentStep("visualization");
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    
    // Simulate API call with enhanced data
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Enhanced crop allocation plan saved",
        description: "Your real-time allocation plan with AI insights has been saved successfully."
      });
      navigate("/market");
    }, 1500);
  };

  const handlePrevious = () => {
    if (currentStep === "crop-selection") {
      setCurrentStep("land-details");
    } else if (currentStep === "visualization") {
      setCurrentStep("crop-selection");
    }
  };

  const handleNext = () => {
    if (currentStep === "visualization") {
      navigate("/market");
    }
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-7xl mx-auto pt-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foliage-dark animate-fade-in">
            Smart Crop Allocation Plan
          </h1>

          {/* Enhanced Progress indicator with animations */}
          <div className="mb-8 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep === "land-details" 
                    ? "bg-foliage text-white shadow-lg scale-110" 
                    : "bg-foliage/20 text-foliage-dark"
                }`}>
                  1
                </div>
                <span className="text-sm mt-2 font-medium">Land Details</span>
              </div>
              <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-foliage to-foliage-dark transition-all duration-500" 
                  style={{ width: currentStep === "land-details" ? "0%" : currentStep === "crop-selection" ? "50%" : "100%" }}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep === "crop-selection" 
                    ? "bg-foliage text-white shadow-lg scale-110" 
                    : currentStep === "visualization" 
                      ? "bg-foliage/20 text-foliage-dark" 
                      : "bg-gray-200 text-gray-400"
                }`}>
                  2
                </div>
                <span className="text-sm mt-2 font-medium">Smart Selection</span>
              </div>
              <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-foliage to-foliage-dark transition-all duration-500" 
                  style={{ width: currentStep === "visualization" ? "100%" : "0%" }}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep === "visualization" 
                    ? "bg-foliage text-white shadow-lg scale-110" 
                    : "bg-gray-200 text-gray-400"
                }`}>
                  3
                </div>
                <span className="text-sm mt-2 font-medium">Real-Time Analysis</span>
              </div>
            </div>
          </div>
          
          {/* Content area with enhanced styling */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-fade-in">
            {currentStep === "land-details" && (
              <LandDetailsForm 
                initialData={landDetails}
                onSubmit={handleLandDetailsSubmit}
              />
            )}
            
            {currentStep === "crop-selection" && (
              <CropSelection
                landDetails={landDetails}
                onSubmit={handleCropSelectionSubmit}
                onBack={handlePrevious}
              />
            )}
            
            {currentStep === "visualization" && (
              <PlotVisualizationEnhanced
                landDetails={landDetails}
                selectedCrops={selectedCrops}
                onSubmit={handleFinish}
                onBack={handlePrevious}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
          
          {/* Enhanced Navigation Buttons */}
          {currentStep === "visualization" && (
            <div className="flex justify-between animate-fade-in">
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-foliage to-foliage-dark hover:from-foliage-dark hover:to-foliage text-white shadow-lg hover-scale"
              >
                Next: Smart Market →
              </Button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default CropAllocation;
