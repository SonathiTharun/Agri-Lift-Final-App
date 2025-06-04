
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Satellite, TestTube, Thermometer, Droplets, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LandDetails {
  location: string;
  pincode: string;
  plotNumber: string;
  totalArea: number;
  soilType: string;
  climateType: string;
}

interface LandDetailsFormProps {
  initialData: LandDetails;
  onSubmit: (data: LandDetails) => void;
}

const LandDetailsForm = ({ initialData, onSubmit }: LandDetailsFormProps) => {
  const [formData, setFormData] = useState<LandDetails>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof LandDetails, string>>>({});
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [soilAnalysis, setSoilAnalysis] = useState({
    ph: 6.5,
    nitrogen: 45,
    phosphorus: 30,
    potassium: 25,
    organicMatter: 3.2
  });
  const { toast } = useToast();

  const soilTypes = [
    { value: "Loam", label: "Loam", description: "Balanced mixture, ideal for most crops" },
    { value: "Clay", label: "Clay", description: "High water retention, nutrient-rich" },
    { value: "Sandy", label: "Sandy", description: "Well-draining, warms quickly" },
    { value: "Silt", label: "Silt", description: "Fertile, retains moisture well" },
    { value: "Chalk", label: "Chalk", description: "Alkaline, free-draining" },
    { value: "Peat", label: "Peat", description: "High organic content, acidic" }
  ];

  const climateTypes = [
    { value: "Temperate", label: "Temperate", description: "Moderate climate, distinct seasons" },
    { value: "Tropical", label: "Tropical", description: "Hot and humid, year-round growing" },
    { value: "Continental", label: "Continental", description: "Hot summers, cold winters" },
    { value: "Arid", label: "Arid", description: "Dry climate, irrigation required" },
    { value: "Mediterranean", label: "Mediterranean", description: "Mild winters, dry summers" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalArea' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name as keyof LandDetails]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const detectLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              location: `Agricultural Zone: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              pincode: "560001"
            }));
            setIsDetectingLocation(false);
            
            toast({
              title: "Location detected",
              description: "GPS coordinates captured successfully"
            });
          }, 1500);
        },
        () => {
          setIsDetectingLocation(false);
          toast({
            title: "Location detection failed",
            description: "Please enter location manually",
            variant: "destructive"
          });
        }
      );
    }
  };

  const simulateSoilTest = () => {
    setSoilAnalysis({
      ph: 6.2 + Math.random() * 1.5,
      nitrogen: 35 + Math.random() * 25,
      phosphorus: 20 + Math.random() * 20,
      potassium: 15 + Math.random() * 25,
      organicMatter: 2.5 + Math.random() * 2
    });
    
    toast({
      title: "Soil analysis updated",
      description: "Latest soil test results have been loaded"
    });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof LandDetails, string>> = {};
    
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    if (!formData.plotNumber.trim()) newErrors.plotNumber = "Plot number is required";
    if (!formData.totalArea) newErrors.totalArea = "Total area is required";
    else if (formData.totalArea <= 0) newErrors.totalArea = "Area must be greater than 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Smart Land Analysis</h2>
        <p className="text-gray-600">Enter your land details for AI-powered crop recommendations</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Basic Land Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Land Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                    <div className="flex">
                      <Input
                        id="location"
                        name="location"
                        placeholder="Enter location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`flex-1 ${errors.location ? "border-red-500" : ""}`}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={detectLocation} 
                        disabled={isDetectingLocation} 
                        className="ml-2"
                      >
                        <MapPin size={16} className="mr-1" />
                        {isDetectingLocation ? "Detecting..." : "GPS"}
                      </Button>
                    </div>
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="Enter 6-digit pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={errors.pincode ? "border-red-500" : ""}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plotNumber">Plot Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="plotNumber"
                      name="plotNumber"
                      placeholder="Enter plot number"
                      value={formData.plotNumber}
                      onChange={handleChange}
                      className={errors.plotNumber ? "border-red-500" : ""}
                    />
                    {errors.plotNumber && <p className="text-red-500 text-sm">{errors.plotNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalArea">Total Area (acres) <span className="text-red-500">*</span></Label>
                    <Input
                      id="totalArea"
                      name="totalArea"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter total area"
                      value={formData.totalArea || ""}
                      onChange={handleChange}
                      className={errors.totalArea ? "border-red-500" : ""}
                    />
                    {errors.totalArea && <p className="text-red-500 text-sm">{errors.totalArea}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <select
                      id="soilType"
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {soilTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="climateType">Climate Type</Label>
                    <select
                      id="climateType"
                      name="climateType"
                      value={formData.climateType}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {climateTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Continue to Smart Selection →
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Soil Analysis Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <TestTube className="h-5 w-5 mr-2 text-blue-600" />
                  Soil Analysis
                </span>
                <Button onClick={simulateSoilTest} size="sm" variant="outline">
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600">pH Level</div>
                  <div className="text-xl font-bold text-blue-900">{soilAnalysis.ph.toFixed(1)}</div>
                  <Badge variant={soilAnalysis.ph >= 6 && soilAnalysis.ph <= 7.5 ? "default" : "destructive"} className="text-xs">
                    {soilAnalysis.ph >= 6 && soilAnalysis.ph <= 7.5 ? "Optimal" : "Needs attention"}
                  </Badge>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600">Nitrogen</div>
                  <div className="text-xl font-bold text-green-900">{soilAnalysis.nitrogen.toFixed(0)}ppm</div>
                  <Badge variant={soilAnalysis.nitrogen >= 40 ? "default" : "destructive"} className="text-xs">
                    {soilAnalysis.nitrogen >= 40 ? "Good" : "Low"}
                  </Badge>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600">Phosphorus</div>
                  <div className="text-xl font-bold text-purple-900">{soilAnalysis.phosphorus.toFixed(0)}ppm</div>
                  <Badge variant={soilAnalysis.phosphorus >= 25 ? "default" : "destructive"} className="text-xs">
                    {soilAnalysis.phosphorus >= 25 ? "Good" : "Low"}
                  </Badge>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm text-orange-600">Potassium</div>
                  <div className="text-xl font-bold text-orange-900">{soilAnalysis.potassium.toFixed(0)}ppm</div>
                  <Badge variant={soilAnalysis.potassium >= 20 ? "default" : "destructive"} className="text-xs">
                    {soilAnalysis.potassium >= 20 ? "Good" : "Low"}
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Organic Matter</div>
                <div className="text-lg font-bold text-gray-900">{soilAnalysis.organicMatter.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Soil health indicator</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Satellite className="h-5 w-5 mr-2 text-indigo-600" />
                Satellite View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-3">
                <div className="text-center text-gray-500">
                  <Satellite className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm">Satellite imagery</div>
                  <div className="text-xs">Plot visualization</div>
                </div>
              </div>
              {coordinates && (
                <div className="text-xs text-gray-600">
                  <div>Lat: {coordinates.lat.toFixed(6)}</div>
                  <div>Lng: {coordinates.lng.toFixed(6)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandDetailsForm;
