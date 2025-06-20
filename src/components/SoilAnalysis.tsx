import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { SoilCharts } from "@/components/SoilCharts";
import { apiService, SoilParameter, CropRecommendation } from "@/services/apiService";
import { useLanguage } from "@/components/LanguageContext";

// Types for soil data (using types from apiService)
type SoilReport = {
  id?: string;
  parameters: SoilParameter[];
  timestamp: string;
};

export function SoilAnalysis() {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [soilReport, setSoilReport] = useState<SoilReport | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("kharif");
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'manual' | null>(null);
  const [manualData, setManualData] = useState<SoilParameter[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Function to handle file upload using backend API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setAnalyzing(true);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file to backend
      const response = await apiService.uploadSoilHealthCard(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);

      // Store report ID for future use
      setCurrentReportId(response.reportId);

      // Create soil report from API response
      const soilReport: SoilReport = {
        id: response.reportId,
        parameters: response.soilData.parameters,
        timestamp: new Date().toISOString(),
      };

      setSoilReport(soilReport);
      setAnalyzing(false);
      setInputMode('upload');
      setShowVisualization(true);

      // Generate crop recommendations
      await generateCropRecommendations(response.reportId, selectedSeason);

      toast({
        title: t("analysis-complete"),
        description: response.message,
      });

    } catch (error) {
      console.error("Error during file upload:", error);
      setIsUploading(false);
      setAnalyzing(false);
      
      toast({
        title: t("analysis-failed"),
        description: error instanceof Error ? error.message : "There was an error analyzing your soil health card. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to generate crop recommendations using backend API
  const generateCropRecommendations = async (reportId: string, season: string) => {
    try {
      const response = await apiService.generateCropRecommendations(reportId, season);
      setCropRecommendations(response.recommendations);
    } catch (error) {
      console.error("Error generating crop recommendations:", error);
      toast({
        title: "Recommendation Failed",
        description: "Could not generate crop recommendations. Using default values.",
        variant: "destructive",
      });

      // Fallback to empty recommendations
      setCropRecommendations([]);
    }
  };

  // Function to generate crop recommendations for manual data entry
  const generateManualCropRecommendations = (parameters: SoilParameter[], season: string) => {
    console.log('🌱 Generating manual crop recommendations for season:', season);
    console.log('📊 Parameters:', parameters);

    // Create a parameter lookup for easy access
    const paramLookup = parameters.reduce((acc, param) => {
      acc[param.name.toLowerCase().replace(' ', '_')] = param;
      return acc;
    }, {} as Record<string, SoilParameter>);

    // Define types for crop requirements
    interface CropRequirement {
      min: number;
      max: number;
      weight: number;
    }

    interface CropData {
      name: string;
      description: string;
      growingPeriod: string;
      waterNeed: "Low" | "Medium" | "High";
      requirements: Record<string, CropRequirement>;
    }

    // Define crop database with requirements
    const cropDatabase: Record<string, CropData[]> = {
      kharif: [
        {
          name: "Rice",
          description: "Staple cereal crop, requires high water availability and slightly acidic to neutral soil.",
          growingPeriod: "120-150 days",
          waterNeed: "High" as const,
          requirements: {
            pH: { min: 5.5, max: 7.0, weight: 0.2 },
            nitrogen: { min: 100, max: 200, weight: 0.25 },
            phosphorus: { min: 20, max: 40, weight: 0.2 },
            potassium: { min: 150, max: 300, weight: 0.2 },
            moisture: { min: 35, max: 60, weight: 0.15 }
          }
        },
        {
          name: "Maize",
          description: "Versatile cereal crop, adapts well to various soil conditions with good drainage.",
          growingPeriod: "90-120 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.2 },
            nitrogen: { min: 120, max: 180, weight: 0.3 },
            phosphorus: { min: 25, max: 40, weight: 0.25 },
            potassium: { min: 120, max: 250, weight: 0.2 },
            organic_matter: { min: 2.5, max: 5.0, weight: 0.05 }
          }
        },
        {
          name: "Cotton",
          description: "Cash crop requiring well-drained soil with moderate fertility and warm climate.",
          growingPeriod: "180-200 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.5, max: 8.0, weight: 0.15 },
            nitrogen: { min: 80, max: 150, weight: 0.25 },
            phosphorus: { min: 15, max: 30, weight: 0.25 },
            potassium: { min: 150, max: 280, weight: 0.3 },
            organic_matter: { min: 1.5, max: 4.0, weight: 0.05 }
          }
        },
        {
          name: "Sugarcane",
          description: "Long-duration crop requiring rich, well-drained soil with high organic matter.",
          growingPeriod: "300-365 days",
          waterNeed: "High" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.15 },
            nitrogen: { min: 150, max: 250, weight: 0.3 },
            phosphorus: { min: 30, max: 50, weight: 0.2 },
            potassium: { min: 200, max: 350, weight: 0.25 },
            organic_matter: { min: 3.0, max: 8.0, weight: 0.1 }
          }
        }
      ],
      rabi: [
        {
          name: "Wheat",
          description: "Major cereal crop, prefers cool climate and well-drained fertile soil.",
          growingPeriod: "120-150 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.2 },
            nitrogen: { min: 100, max: 160, weight: 0.3 },
            phosphorus: { min: 20, max: 35, weight: 0.25 },
            potassium: { min: 100, max: 200, weight: 0.2 },
            organic_matter: { min: 2.0, max: 5.0, weight: 0.05 }
          }
        },
        {
          name: "Barley",
          description: "Hardy cereal crop, tolerates alkaline soil and requires less water than wheat.",
          growingPeriod: "90-120 days",
          waterNeed: "Low" as const,
          requirements: {
            pH: { min: 6.5, max: 8.5, weight: 0.15 },
            nitrogen: { min: 80, max: 140, weight: 0.25 },
            phosphorus: { min: 15, max: 30, weight: 0.25 },
            potassium: { min: 80, max: 180, weight: 0.25 },
            organic_matter: { min: 1.5, max: 4.0, weight: 0.1 }
          }
        },
        {
          name: "Mustard",
          description: "Oilseed crop, adapts to various soil types and requires moderate fertility.",
          growingPeriod: "90-110 days",
          waterNeed: "Low" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.2 },
            nitrogen: { min: 60, max: 120, weight: 0.25 },
            phosphorus: { min: 15, max: 25, weight: 0.25 },
            potassium: { min: 80, max: 150, weight: 0.25 },
            organic_matter: { min: 2.0, max: 4.0, weight: 0.05 }
          }
        },
        {
          name: "Chickpea",
          description: "Legume crop that fixes nitrogen, prefers well-drained soil with neutral pH.",
          growingPeriod: "100-120 days",
          waterNeed: "Low" as const,
          requirements: {
            pH: { min: 6.5, max: 7.5, weight: 0.25 },
            nitrogen: { min: 20, max: 60, weight: 0.1 }, // Lower N requirement due to N fixation
            phosphorus: { min: 20, max: 35, weight: 0.3 },
            potassium: { min: 100, max: 200, weight: 0.25 },
            organic_matter: { min: 2.0, max: 5.0, weight: 0.1 }
          }
        }
      ],
      zaid: [
        {
          name: "Watermelon",
          description: "Summer fruit crop requiring well-drained sandy loam soil with good organic matter.",
          growingPeriod: "90-100 days",
          waterNeed: "High" as const,
          requirements: {
            pH: { min: 6.0, max: 7.0, weight: 0.2 },
            nitrogen: { min: 80, max: 120, weight: 0.25 },
            phosphorus: { min: 20, max: 35, weight: 0.25 },
            potassium: { min: 150, max: 250, weight: 0.25 },
            organic_matter: { min: 3.0, max: 6.0, weight: 0.05 }
          }
        },
        {
          name: "Cucumber",
          description: "Vine crop requiring warm climate and fertile, well-drained soil.",
          growingPeriod: "60-70 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.0, weight: 0.2 },
            nitrogen: { min: 100, max: 150, weight: 0.3 },
            phosphorus: { min: 25, max: 40, weight: 0.25 },
            potassium: { min: 120, max: 200, weight: 0.2 },
            organic_matter: { min: 2.5, max: 5.0, weight: 0.05 }
          }
        },
        {
          name: "Fodder Maize",
          description: "Quick-growing fodder crop, suitable for summer cultivation with irrigation.",
          growingPeriod: "60-75 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.15 },
            nitrogen: { min: 100, max: 160, weight: 0.35 },
            phosphorus: { min: 20, max: 35, weight: 0.25 },
            potassium: { min: 100, max: 200, weight: 0.2 },
            organic_matter: { min: 2.0, max: 4.0, weight: 0.05 }
          }
        },
        {
          name: "Sunflower",
          description: "Oilseed crop with good drought tolerance, adapts to various soil conditions.",
          growingPeriod: "90-110 days",
          waterNeed: "Medium" as const,
          requirements: {
            pH: { min: 6.0, max: 7.5, weight: 0.2 },
            nitrogen: { min: 60, max: 100, weight: 0.25 },
            phosphorus: { min: 20, max: 35, weight: 0.25 },
            potassium: { min: 120, max: 220, weight: 0.25 },
            organic_matter: { min: 2.0, max: 4.0, weight: 0.05 }
          }
        }
      ]
    };

    // Calculate suitability scores for crops in the selected season
    const seasonCrops = cropDatabase[season as keyof typeof cropDatabase] || [];

    const recommendations: CropRecommendation[] = seasonCrops.map((crop: CropData) => {
      let totalScore = 0;
      let totalWeight = 0;

      // Calculate score for each parameter
      Object.entries(crop.requirements).forEach(([paramName, requirement]: [string, CropRequirement]) => {
        const param = paramLookup[paramName];
        if (param) {
          const value = param.value;
          let paramScore = 0;

          // Calculate parameter score based on how well it fits the requirement
          if (value >= requirement.min && value <= requirement.max) {
            // Perfect match
            paramScore = 100;
          } else if (value < requirement.min) {
            // Below minimum - calculate how far below
            const deficit = requirement.min - value;
            const range = requirement.max - requirement.min;
            paramScore = Math.max(0, 100 - (deficit / range) * 100);
          } else {
            // Above maximum - calculate how far above
            const excess = value - requirement.max;
            const range = requirement.max - requirement.min;
            paramScore = Math.max(0, 100 - (excess / range) * 50); // Less penalty for excess
          }

          totalScore += paramScore * requirement.weight;
          totalWeight += requirement.weight;
        }
      });

      // Normalize score
      const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;

      // Determine suitability based on score
      let suitability: "Excellent" | "Good" | "Fair" | "Poor";
      if (finalScore >= 85) suitability = "Excellent";
      else if (finalScore >= 70) suitability = "Good";
      else if (finalScore >= 50) suitability = "Fair";
      else suitability = "Poor";

      return {
        name: crop.name,
        description: crop.description,
        growingPeriod: crop.growingPeriod,
        waterNeed: crop.waterNeed,
        suitability,
        score: finalScore,
        season
      };
    });

    // Sort by score (highest first)
    recommendations.sort((a, b) => b.score - a.score);

    console.log('🎯 Generated recommendations:', recommendations);
    setCropRecommendations(recommendations);
  };

  // Function to initialize manual data entry
  const initializeManualEntry = () => {
    const parameters: SoilParameter[] = [
      {
        name: "pH",
        value: 6.5,
        unit: "",
        status: "optimal",
        optimal: { min: 6.0, max: 7.5 },
      },
      {
        name: "Nitrogen",
        value: 120,
        unit: "kg/ha",
        status: "optimal",
        optimal: { min: 80, max: 180 },
      },
      {
        name: "Phosphorus",
        value: 25,
        unit: "kg/ha",
        status: "optimal",
        optimal: { min: 15, max: 35 },
      },
      {
        name: "Potassium",
        value: 180,
        unit: "kg/ha",
        status: "optimal",
        optimal: { min: 120, max: 280 },
      },
      {
        name: "Organic Matter",
        value: 3.5,
        unit: "%",
        status: "optimal",
        optimal: { min: 3, max: 6 },
      },
      {
        name: "Moisture",
        value: 30,
        unit: "%",
        status: "optimal",
        optimal: { min: 25, max: 45 },
      },
    ];

    setManualData(parameters);
    setInputMode('manual');
    setShowVisualization(false);
    setCropRecommendations([]);

    toast({
      title: "Manual Entry Mode",
      description: "Enter your soil parameter values and click 'Visualize Data' to see analysis.",
    });
  };

  // Function to visualize manual data
  const visualizeManualData = () => {
    if (manualData.length === 0) {
      toast({
        title: t("no-data"),
        description: t("no-data-description"),
        variant: "destructive",
      });
      return;
    }

    const report: SoilReport = {
      parameters: manualData,
      timestamp: new Date().toISOString(),
    };

    setSoilReport(report);
    setShowVisualization(true);

    // Generate crop recommendations for manual data
    generateManualCropRecommendations(manualData, selectedSeason);

    toast({
      title: t("data-visualized"),
      description: t("data-visualized-description"),
    });
  };

  // Effect to update crop recommendations when season changes
  useEffect(() => {
    if (soilReport) {
      if (currentReportId) {
        // For uploaded data, use backend API
        generateCropRecommendations(currentReportId, selectedSeason);
      } else {
        // For manual data, use client-side recommendations
        generateManualCropRecommendations(soilReport.parameters, selectedSeason);
      }
    }
  }, [selectedSeason, currentReportId, soilReport]);

  // Function to trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "text-status-optimal";
      case "low": return "text-status-warning";
      case "deficient": return "text-status-danger";
      default: return "text-gray-500";
    }
  };

  // Function to determine status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal": return "✓";
      case "low": return "⚠️";
      case "deficient": return "❌";
      default: return "•";
    }
  };

  // Function to determine recommendation badge color
  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "Excellent": return "bg-status-optimal text-white";
      case "Good": return "bg-green-100 text-green-800";
      case "Fair": return "bg-status-warning/20 text-status-warning";
      case "Poor": return "bg-status-danger/20 text-status-danger";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get suitability emoji
  const getSuitabilityEmoji = (suitability: string) => {
    switch (suitability) {
      case "Excellent": return "🌟";
      case "Good": return "👍";
      case "Fair": return "👌";
      case "Poor": return "⚠️";
      default: return "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-soil-light/5">
        <CardHeader className="bg-gradient-to-r from-soil to-soil-dark text-white rounded-t-lg">
          <CardTitle className="text-center">{t("soil-analysis")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Initial Mode Selection */}
          {inputMode === null && !analyzing && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-6">{t("choose-analysis-method")}</h3>
              <p className="text-sm text-gray-600 mb-8">{t("select-soil-analysis")}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Upload Option */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-soil" onClick={() => setInputMode('upload')}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-soil" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium mb-2">{t("upload-soil-card")}</h4>
                    <p className="text-sm text-gray-600 mb-4">{t("upload-description")}</p>
                    <div className="text-xs text-gray-500">
                      <p>✓ Automatic OCR processing</p>
                      <p>✓ Supports PDF, JPG, PNG</p>
                      <p>✓ Instant analysis</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Manual Entry Option */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-soil" onClick={initializeManualEntry}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-soil" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium mb-2">{t("manual-data-entry")}</h4>
                    <p className="text-sm text-gray-600 mb-4">{t("manual-description")}</p>
                    <div className="text-xs text-gray-500">
                      <p>✓ Custom parameter input</p>
                      <p>✓ Real-time validation</p>
                      <p>✓ Flexible analysis</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Upload Mode */}
          {inputMode === 'upload' && !soilReport && !analyzing && (
            <div className="text-center py-8">
              <Button
                onClick={() => setInputMode(null)}
                variant="ghost"
                className="mb-4 text-gray-600 hover:text-gray-800"
              >
                {t("back-to-selection")}
              </Button>
              <h3 className="text-lg font-medium mb-6">{t("upload-your-card")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("upload-card-description")}</p>
              <div
                className="max-w-sm mx-auto border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-soil hover:bg-soil-light/10 transition-colors"
                onClick={triggerFileUpload}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-soil" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="mt-1 text-xs text-gray-500">PDF, JPG, JPEG or PNG</p>
                  <p className="mt-3 text-xs text-soil-dark font-medium">Our system will extract soil parameters from your health card</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Better Results:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Ensure good lighting when taking photos of your soil health card</li>
                  <li>• Keep the document flat and avoid shadows</li>
                  <li>• Make sure all text is clearly visible and not blurred</li>
                  <li>• For best results, scan the document instead of taking a photo</li>
                </ul>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-4">Uploading File...</h3>
              <div className="max-w-sm mx-auto">
                <Progress value={uploadProgress} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">{uploadProgress}%</p>
              </div>
            </div>
          )}

          {/* Manual Entry Mode */}
          {inputMode === 'manual' && !showVisualization && (
            <div className="py-8">
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={() => setInputMode(null)}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Back to selection
                </Button>
                <h3 className="text-lg font-medium">Manual Data Entry</h3>
                <div></div>
              </div>

              <p className="text-sm text-gray-600 mb-6 text-center">Enter your soil parameter values below</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {manualData.map((param, index) => (
                  <Card key={param.name} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">{param.name}</label>
                      <span className="text-xs text-gray-500">{param.unit}</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={param.value}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value) || 0;
                        const updatedData = [...manualData];

                        // Update status based on optimal range
                        let status: "optimal" | "low" | "deficient" = "optimal";
                        if (newValue < param.optimal.min) {
                          status = newValue < param.optimal.min * 0.7 ? "deficient" : "low";
                        } else if (newValue > param.optimal.max) {
                          status = newValue > param.optimal.max * 1.3 ? "deficient" : "low";
                        }

                        updatedData[index] = { ...param, value: newValue, status };
                        setManualData(updatedData);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soil focus:border-transparent"
                      placeholder={`Enter ${param.name.toLowerCase()} value`}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        param.status === 'optimal' ? 'bg-green-100 text-green-800' :
                        param.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {param.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        Optimal: {param.optimal.min} - {param.optimal.max}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button
                  onClick={visualizeManualData}
                  className="bg-soil hover:bg-soil-dark text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  🔍 {t("visualize-data")} & Get Recommendations
                </Button>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg max-w-2xl mx-auto">
                <h4 className="text-sm font-medium text-green-900 mb-2">{t("parameter-guidelines")}</h4>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• <strong>pH:</strong> 6.0-7.5 is optimal for most crops</li>
                  <li>• <strong>Nitrogen:</strong> 80-180 kg/ha for good crop growth</li>
                  <li>• <strong>Phosphorus:</strong> 15-35 kg/ha for root development</li>
                  <li>• <strong>Potassium:</strong> 120-280 kg/ha for plant health</li>
                  <li>• <strong>Organic Matter:</strong> 3-6% for soil fertility</li>
                  <li>• <strong>Moisture:</strong> 25-45% for optimal water availability</li>
                </ul>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-4">{t("analyzing-card")}</h3>
              <div className="max-w-sm mx-auto">
                <div className="animate-pulse flex space-x-4 items-center justify-center">
                  <div className="rounded-full bg-soil-light h-10 w-10"></div>
                  <div className="h-4 bg-soil-light rounded w-16"></div>
                  <div className="rounded-full bg-soil-light h-10 w-10"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">{t("processing-image")}</p>
                  <p className="text-xs text-gray-500">{t("identifying-parameters")}</p>
                  <p className="text-xs text-gray-500">{t("generating-recommendations")}</p>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-800">This may take 10-30 seconds depending on image quality</p>
                </div>
              </div>
            </div>
          )}

          {soilReport && showVisualization && (
            <div className="py-4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {inputMode === 'manual' && (
                      <Button
                        onClick={() => setShowVisualization(false)}
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ← Back to Entry
                      </Button>
                    )}
                    <h3 className="text-lg font-medium">Soil Parameters</h3>
                  </div>
                  {inputMode === 'upload' && (
                    <Button
                      onClick={() => {
                        setInputMode(null);
                        setSoilReport(null);
                        setShowVisualization(false);
                        setCropRecommendations([]);
                        setCurrentReportId(null);
                      }}
                      variant="outline"
                      className="text-sm"
                    >
                      New Analysis
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {inputMode === 'upload'
                    ? 'Values extracted from your soil health card. You can adjust any value by clicking on it.'
                    : 'Your manually entered values. You can still adjust them by clicking on any value.'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {soilReport.parameters.map((param, index) => (
                    <Card key={index} className="border-l-4 hover:shadow-md transition-shadow" style={{
                      borderLeftColor: param.status === 'optimal' ? '#4ade80' : param.status === 'low' ? '#fbbf24' : '#f87171'
                    }}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{param.name}</h4>
                            <div className="flex items-center">
                              <input 
                                type="number" 
                                value={param.value}
                                onChange={(e) => {
                                  const newValue = parseFloat(e.target.value);
                                  if (!isNaN(newValue)) {
                                    // Create a copy of the soil report
                                    const updatedReport = {...soilReport!};
                                    // Find and update the parameter
                                    const paramIndex = updatedReport.parameters.findIndex(p => p.name === param.name);
                                    if (paramIndex !== -1) {
                                      // Update the value
                                      updatedReport.parameters[paramIndex].value = newValue;
                                      // Update the status
                                      const p = updatedReport.parameters[paramIndex];
                                      if (newValue < p.optimal.min) {
                                        p.status = newValue < p.optimal.min * 0.7 ? "deficient" : "low";
                                      } else if (newValue > p.optimal.max) {
                                        p.status = newValue > p.optimal.max * 1.3 ? "deficient" : "low";
                                      } else {
                                        p.status = "optimal";
                                      }
                                      // Update the state
                                      setSoilReport(updatedReport);

                                      // Also update manual data if in manual mode
                                      if (inputMode === 'manual') {
                                        setManualData(updatedReport.parameters);
                                      }

                                      // Update crop recommendations
                                      if (currentReportId) {
                                        // For uploaded data, use backend API
                                        generateCropRecommendations(currentReportId, selectedSeason);
                                      } else {
                                        // For manual data, use client-side recommendations
                                        generateManualCropRecommendations(updatedReport.parameters, selectedSeason);
                                      }
                                    }
                                  }
                                }}
                                className="text-2xl font-bold w-24 border-b border-gray-300 focus:border-soil focus:outline-none"
                              />
                              <span className="text-sm font-normal text-gray-500 ml-1">{param.unit}</span>
                            </div>
                          </div>
                          <div>
                            <span className={`text-lg ${getStatusColor(param.status)}`}>
                              {getStatusIcon(param.status)}
                            </span>
                            <p className={`text-xs capitalize ${getStatusColor(param.status)}`}>{param.status}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Optimal Range: {param.optimal.min} - {param.optimal.max} {param.unit}</div>
                          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-soil-light to-soil-dark rounded-full"
                                style={{
                                  width: `${Math.min(100, Math.max(0, (param.value - param.optimal.min) / (param.optimal.max - param.optimal.min) * 100))}%`,
                                }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Soil Data Visualizations */}
                <SoilCharts parameters={soilReport.parameters} />
              </div>

              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Crop Recommendations</h3>
                <Tabs defaultValue="kharif" value={selectedSeason} onValueChange={setSelectedSeason}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="kharif">Kharif Season</TabsTrigger>
                    <TabsTrigger value="rabi">Rabi Season</TabsTrigger>
                    <TabsTrigger value="zaid">Zaid Season</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={selectedSeason} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cropRecommendations.map((crop, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-lg">{crop.name}</h4>
                              <span className={`text-xs py-0.5 px-2 rounded-full ${getSuitabilityColor(crop.suitability)}`}>
                                {getSuitabilityEmoji(crop.suitability)} {crop.suitability}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{crop.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="bg-gray-100 text-gray-800 py-0.5 px-2 rounded-full">
                                🕒 {crop.growingPeriod}
                              </span>
                              <span className="bg-sky-100 text-sky-800 py-0.5 px-2 rounded-full">
                                💧 {crop.waterNeed} water need
                              </span>
                              <span className="bg-foliage-light/30 text-foliage-dark py-0.5 px-2 rounded-full">
                                🎯 {crop.score}% match
                              </span>
                            </div>
                            <div className="mt-3">
                              <Button variant="outline" className="text-xs h-7 border-soil text-soil hover:bg-soil-light/20">
                                Buy Seeds
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                {inputMode === 'manual' && (
                  <Button
                    onClick={() => setShowVisualization(false)}
                    variant="outline"
                    className="border-soil text-soil hover:bg-soil-light/20"
                  >
                    ← Back to Edit Values
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setInputMode(null);
                    setSoilReport(null);
                    setShowVisualization(false);
                    setCropRecommendations([]);
                    setCurrentReportId(null);
                    setManualData([]);
                  }}
                  className="bg-soil hover:bg-soil-dark text-white"
                >
                  🔄 New Analysis
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
