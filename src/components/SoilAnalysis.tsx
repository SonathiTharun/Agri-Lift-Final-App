
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { SoilCharts } from "@/components/SoilCharts";

// Types for soil data
type SoilParameter = {
  name: string;
  value: number;
  unit: string;
  status: "optimal" | "low" | "deficient";
  optimal: { min: number; max: number };
};

type SoilReport = {
  parameters: SoilParameter[];
  timestamp: string;
};

type CropRecommendation = {
  name: string;
  description: string;
  growingPeriod: string;
  waterNeed: "Low" | "Medium" | "High";
  suitability: "Excellent" | "Good" | "Fair" | "Poor";
  score: number;
};

export function SoilAnalysis() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [soilReport, setSoilReport] = useState<SoilReport | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("kharif");
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setAnalyzing(true);
          simulateAnalysis();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Function to simulate soil analysis
  const simulateAnalysis = () => {
    setTimeout(() => {
      // Generate random soil data
      const parameters: SoilParameter[] = [
        {
          name: "pH",
          value: parseFloat((Math.random() * 3 + 5).toFixed(1)),
          unit: "",
          status: "optimal",
          optimal: { min: 6.0, max: 7.5 },
        },
        {
          name: "Nitrogen",
          value: parseFloat((Math.random() * 150 + 50).toFixed(0)),
          unit: "kg/ha",
          status: "optimal",
          optimal: { min: 80, max: 180 },
        },
        {
          name: "Phosphorus",
          value: parseFloat((Math.random() * 30 + 10).toFixed(0)),
          unit: "kg/ha",
          status: "optimal",
          optimal: { min: 15, max: 35 },
        },
        {
          name: "Potassium",
          value: parseFloat((Math.random() * 200 + 100).toFixed(0)),
          unit: "kg/ha",
          status: "optimal",
          optimal: { min: 120, max: 280 },
        },
        {
          name: "Organic Matter",
          value: parseFloat((Math.random() * 5 + 1).toFixed(1)),
          unit: "%",
          status: "optimal",
          optimal: { min: 3, max: 6 },
        },
        {
          name: "Moisture",
          value: parseFloat((Math.random() * 30 + 20).toFixed(1)),
          unit: "%",
          status: "optimal",
          optimal: { min: 25, max: 45 },
        },
      ];

      // Adjust statuses based on values
      parameters.forEach(param => {
        if (param.value < param.optimal.min) {
          param.status = param.value < param.optimal.min * 0.7 ? "deficient" : "low";
        } else if (param.value > param.optimal.max) {
          param.status = param.value > param.optimal.max * 1.3 ? "deficient" : "low";
        }
      });

      const report: SoilReport = {
        parameters,
        timestamp: new Date().toISOString(),
      };
      
      setSoilReport(report);
      setAnalyzing(false);
      generateCropRecommendations(report, selectedSeason);
      
      toast({
        title: "Analysis Complete",
        description: "Soil analysis has been completed successfully.",
      });
    }, 3000);
  };

  // Function to generate crop recommendations based on soil data and selected season
  const generateCropRecommendations = (report: SoilReport, season: string) => {
    // Definition of crops by season with their ideal soil conditions
    const cropsBySeason: Record<string, Array<{
      name: string;
      description: string;
      growingPeriod: string;
      waterNeed: "Low" | "Medium" | "High";
      idealConditions: {
        pH: { min: number; max: number };
        nitrogen: { min: number; max: number };
        phosphorus: { min: number; max: number };
        potassium: { min: number; max: number };
        organicMatter: { min: number; max: number };
      };
    }>> = {
      kharif: [
        {
          name: "Rice",
          description: "Staple food crop grown in flooded fields",
          growingPeriod: "120-150 days",
          waterNeed: "High",
          idealConditions: {
            pH: { min: 5.5, max: 7.0 },
            nitrogen: { min: 120, max: 200 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 150, max: 250 },
            organicMatter: { min: 3, max: 5 },
          },
        },
        {
          name: "Cotton",
          description: "Important fiber crop with moderate water needs",
          growingPeriod: "150-180 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 5.8, max: 8.0 },
            nitrogen: { min: 80, max: 150 },
            phosphorus: { min: 15, max: 35 },
            potassium: { min: 120, max: 200 },
            organicMatter: { min: 2, max: 4 },
          },
        },
        {
          name: "Maize",
          description: "Versatile grain used for food, feed and industry",
          growingPeriod: "90-120 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 5.5, max: 7.5 },
            nitrogen: { min: 100, max: 180 },
            phosphorus: { min: 18, max: 30 },
            potassium: { min: 130, max: 230 },
            organicMatter: { min: 2.5, max: 5 },
          },
        },
        {
          name: "Soybean",
          description: "Protein-rich legume that fixes nitrogen in soil",
          growingPeriod: "100-120 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 6.0, max: 7.0 },
            nitrogen: { min: 60, max: 120 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 150, max: 220 },
            organicMatter: { min: 3, max: 6 },
          },
        },
      ],
      rabi: [
        {
          name: "Wheat",
          description: "Essential winter season grain crop",
          growingPeriod: "120-150 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 6.0, max: 8.0 },
            nitrogen: { min: 100, max: 180 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 130, max: 210 },
            organicMatter: { min: 2, max: 5 },
          },
        },
        {
          name: "Mustard",
          description: "Oil seed crop suitable for cooler temperatures",
          growingPeriod: "110-130 days",
          waterNeed: "Low",
          idealConditions: {
            pH: { min: 6.0, max: 7.5 },
            nitrogen: { min: 70, max: 130 },
            phosphorus: { min: 15, max: 35 },
            potassium: { min: 120, max: 200 },
            organicMatter: { min: 2, max: 4 },
          },
        },
        {
          name: "Chickpea",
          description: "Drought-resistant legume with high protein content",
          growingPeriod: "90-120 days",
          waterNeed: "Low",
          idealConditions: {
            pH: { min: 6.0, max: 8.0 },
            nitrogen: { min: 50, max: 100 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 110, max: 180 },
            organicMatter: { min: 2, max: 5 },
          },
        },
        {
          name: "Barley",
          description: "Hardy cereal crop with multiple uses",
          growingPeriod: "90-110 days",
          waterNeed: "Low",
          idealConditions: {
            pH: { min: 6.0, max: 8.5 },
            nitrogen: { min: 80, max: 140 },
            phosphorus: { min: 15, max: 30 },
            potassium: { min: 100, max: 180 },
            organicMatter: { min: 2, max: 4 },
          },
        },
      ],
      zaid: [
        {
          name: "Moong Bean",
          description: "Short-duration pulse crop rich in protein",
          growingPeriod: "60-90 days",
          waterNeed: "Low",
          idealConditions: {
            pH: { min: 6.0, max: 7.5 },
            nitrogen: { min: 40, max: 80 },
            phosphorus: { min: 15, max: 30 },
            potassium: { min: 100, max: 170 },
            organicMatter: { min: 2, max: 4 },
          },
        },
        {
          name: "Watermelon",
          description: "Heat-loving summer fruit crop",
          growingPeriod: "80-110 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 6.0, max: 7.0 },
            nitrogen: { min: 60, max: 120 },
            phosphorus: { min: 25, max: 45 },
            potassium: { min: 150, max: 250 },
            organicMatter: { min: 3, max: 6 },
          },
        },
        {
          name: "Cucumber",
          description: "Fast-growing summer vegetable",
          growingPeriod: "45-65 days",
          waterNeed: "Medium",
          idealConditions: {
            pH: { min: 5.5, max: 7.0 },
            nitrogen: { min: 70, max: 130 },
            phosphorus: { min: 20, max: 40 },
            potassium: { min: 140, max: 220 },
            organicMatter: { min: 3, max: 6 },
          },
        },
      ],
    };

    const selectedCrops = cropsBySeason[season] || [];
    
    // Calculate suitability scores based on current soil parameters
    const recommendations: CropRecommendation[] = selectedCrops.map(crop => {
      // Get soil parameter values
      const pH = report.parameters.find(p => p.name === "pH")?.value || 0;
      const nitrogen = report.parameters.find(p => p.name === "Nitrogen")?.value || 0;
      const phosphorus = report.parameters.find(p => p.name === "Phosphorus")?.value || 0;
      const potassium = report.parameters.find(p => p.name === "Potassium")?.value || 0;
      const organicMatter = report.parameters.find(p => p.name === "Organic Matter")?.value || 0;
      
      // Calculate score for each parameter (0-1 scale)
      const pHScore = getParameterScore(pH, crop.idealConditions.pH.min, crop.idealConditions.pH.max);
      const nitrogenScore = getParameterScore(nitrogen, crop.idealConditions.nitrogen.min, crop.idealConditions.nitrogen.max);
      const phosphorusScore = getParameterScore(phosphorus, crop.idealConditions.phosphorus.min, crop.idealConditions.phosphorus.max);
      const potassiumScore = getParameterScore(potassium, crop.idealConditions.potassium.min, crop.idealConditions.potassium.max);
      const organicMatterScore = getParameterScore(organicMatter, crop.idealConditions.organicMatter.min, crop.idealConditions.organicMatter.max);
      
      // Calculate overall score (weighted average)
      const overallScore = (
        pHScore * 0.25 +
        nitrogenScore * 0.2 +
        phosphorusScore * 0.2 +
        potassiumScore * 0.2 +
        organicMatterScore * 0.15
      ) * 100;
      
      // Determine suitability level
      let suitability: "Excellent" | "Good" | "Fair" | "Poor";
      if (overallScore >= 85) suitability = "Excellent";
      else if (overallScore >= 70) suitability = "Good";
      else if (overallScore >= 50) suitability = "Fair";
      else suitability = "Poor";
      
      return {
        name: crop.name,
        description: crop.description,
        growingPeriod: crop.growingPeriod,
        waterNeed: crop.waterNeed,
        suitability,
        score: parseFloat(overallScore.toFixed(1)),
      };
    });
    
    // Sort by score (highest first)
    recommendations.sort((a, b) => b.score - a.score);
    
    setCropRecommendations(recommendations);
  };

  // Helper function to calculate parameter score
  const getParameterScore = (value: number, min: number, max: number): number => {
    if (value < min) {
      // Below minimum - linear decrease in score
      return Math.max(0, 0.7 * (value / min));
    } else if (value > max) {
      // Above maximum - linear decrease in score
      return Math.max(0, 1 - 0.3 * ((value - max) / max));
    } else {
      // Within ideal range - perfect score
      // With a slight curve that peaks in the middle of the range
      const mid = (min + max) / 2;
      const distanceFromMid = Math.abs(value - mid);
      const rangeHalf = (max - min) / 2;
      return 1 - 0.1 * (distanceFromMid / rangeHalf);
    }
  };

  // Effect to update crop recommendations when season changes
  useEffect(() => {
    if (soilReport) {
      generateCropRecommendations(soilReport, selectedSeason);
    }
  }, [selectedSeason]);

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

  // Function to trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="shadow-lg border-soil-light">
        <CardHeader className="bg-gradient-to-r from-soil-dark to-soil-light text-white">
          <CardTitle className="text-center">Soil Analysis</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!soilReport && !analyzing && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-6">Upload Your Soil Report</h3>
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
                </div>
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

          {analyzing && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-4">Analyzing Soil Sample...</h3>
              <div className="max-w-sm mx-auto">
                <div className="animate-pulse flex space-x-4 items-center justify-center">
                  <div className="rounded-full bg-soil-light h-10 w-10"></div>
                  <div className="h-4 bg-soil-light rounded w-16"></div>
                  <div className="rounded-full bg-soil-light h-10 w-10"></div>
                </div>
                <p className="mt-4 text-sm text-gray-600">Please wait while we analyze your soil sample</p>
              </div>
            </div>
          )}

          {soilReport && (
            <div className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Soil Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {soilReport.parameters.map((param, index) => (
                    <Card key={index} className="border-l-4 hover:shadow-md transition-shadow" style={{
                      borderLeftColor: param.status === 'optimal' ? '#4ade80' : param.status === 'low' ? '#fbbf24' : '#f87171'
                    }}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{param.name}</h4>
                            <p className="text-2xl font-bold">
                              {param.value} <span className="text-sm font-normal text-gray-500">{param.unit}</span>
                            </p>
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

              <div className="mt-6 flex justify-center">
                <Button onClick={triggerFileUpload} className="bg-soil hover:bg-soil-dark text-white">
                  Upload New Sample
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
