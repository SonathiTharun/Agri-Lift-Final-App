
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import LandDetailsForm from "@/components/crop-allocation/LandDetailsForm";
import CropSelection from "@/components/crop-allocation/CropSelection";
import PlotVisualization from "@/components/crop-allocation/PlotVisualization";
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
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Crop allocation plan saved",
        description: "Your allocation plan has been saved successfully."
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
        <div className="max-w-5xl mx-auto pt-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foliage-dark">Crop Allocation Plan</h1>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "land-details" ? "bg-foliage text-white" : "bg-foliage/20 text-foliage-dark"}`}>
                  1
                </div>
                <span className="text-sm mt-1">Land Details</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div 
                  className="h-full bg-foliage" 
                  style={{ width: currentStep === "land-details" ? "0%" : currentStep === "crop-selection" ? "50%" : "100%" }}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "crop-selection" ? "bg-foliage text-white" : currentStep === "visualization" ? "bg-foliage/20 text-foliage-dark" : "bg-gray-200 text-gray-400"}`}>
                  2
                </div>
                <span className="text-sm mt-1">Crop Selection</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div 
                  className="h-full bg-foliage" 
                  style={{ width: currentStep === "visualization" ? "100%" : "0%" }}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "visualization" ? "bg-foliage text-white" : "bg-gray-200 text-gray-400"}`}>
                  3
                </div>
                <span className="text-sm mt-1">Visualization</span>
              </div>
            </div>
          </div>
          
          {/* Content area */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              <PlotVisualization
                landDetails={landDetails}
                selectedCrops={selectedCrops}
                onSubmit={handleFinish}
                onBack={handlePrevious}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep === "visualization" && (
              <Button
                onClick={handleNext}
                className="bg-foliage hover:bg-foliage-dark"
              >
                Next: Market
              </Button>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CropAllocation;
