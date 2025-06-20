
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/components/LanguageContext";
import LandDetailsForm from "@/components/crop-allocation/LandDetailsForm";
import CropSelectionEnhanced from "@/components/crop-allocation/CropSelectionEnhanced";
import PlotVisualizationEnhanced from "@/components/crop-allocation/PlotVisualizationEnhanced";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Circle } from "lucide-react";

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
  const { t } = useLanguage();
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
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Complete crop allocation plan saved",
        description: "Your real-time smart farming plan with AI insights has been saved successfully."
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

  const getStepStatus = (step: StepType) => {
    const steps = ["land-details", "crop-selection", "visualization"];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 pb-10">
        <div className="max-w-7xl mx-auto pt-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t('crop-allocation')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered crop planning with real-time insights, market analysis, and predictive recommendations
            </p>
          </div>

          {/* Enhanced Progress indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  getStepStatus("land-details") === "completed" 
                    ? "bg-green-600 text-white shadow-lg" 
                    : getStepStatus("land-details") === "current"
                      ? "bg-blue-600 text-white shadow-lg scale-110" 
                      : "bg-gray-200 text-gray-400"
                }`}>
                  {getStepStatus("land-details") === "completed" ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <Circle className="h-8 w-8" />
                  )}
                </div>
                <div className="text-center mt-3">
                  <div className="font-semibold text-gray-900">{t('land-details')}</div>
                  <div className="text-sm text-gray-500">GPS mapping & soil testing</div>
                </div>
              </div>
              
              {/* Progress Line 1 */}
              <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-500" 
                  style={{ 
                    width: getStepStatus("crop-selection") === "upcoming" ? "0%" : "100%" 
                  }}
                />
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  getStepStatus("crop-selection") === "completed" 
                    ? "bg-green-600 text-white shadow-lg" 
                    : getStepStatus("crop-selection") === "current"
                      ? "bg-blue-600 text-white shadow-lg scale-110" 
                      : "bg-gray-200 text-gray-400"
                }`}>
                  {getStepStatus("crop-selection") === "completed" ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <Circle className="h-8 w-8" />
                  )}
                </div>
                <div className="text-center mt-3">
                  <div className="font-semibold text-gray-900">{t('crop-selection')}</div>
                  <div className="text-sm text-gray-500">Smart recommendations</div>
                </div>
              </div>
              
              {/* Progress Line 2 */}
              <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-500" 
                  style={{ 
                    width: getStepStatus("visualization") === "upcoming" ? "0%" : "100%" 
                  }}
                />
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  getStepStatus("visualization") === "completed" 
                    ? "bg-green-600 text-white shadow-lg" 
                    : getStepStatus("visualization") === "current"
                      ? "bg-blue-600 text-white shadow-lg scale-110" 
                      : "bg-gray-200 text-gray-400"
                }`}>
                  {getStepStatus("visualization") === "completed" ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <Circle className="h-8 w-8" />
                  )}
                </div>
                <div className="text-center mt-3">
                  <div className="font-semibold text-gray-900">{t('visualization')}</div>
                  <div className="text-sm text-gray-500">Live monitoring & insights</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content area */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              {currentStep === "land-details" && (
                <LandDetailsForm 
                  initialData={landDetails}
                  onSubmit={handleLandDetailsSubmit}
                />
              )}
              
              {currentStep === "crop-selection" && (
                <CropSelectionEnhanced
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
          </div>
          
          {/* Quick Access to Market */}
          {currentStep === "visualization" && (
            <div className="text-center mt-8">
              <Button
                onClick={() => navigate("/market")}
                variant="outline"
                className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:from-green-100 hover:to-blue-100"
              >
                Continue to Smart Market →
              </Button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default CropAllocation;
