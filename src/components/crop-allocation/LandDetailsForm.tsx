
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
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
  const { toast } = useToast();

  const soilTypes = [
    { value: "Loam", label: "Loam" },
    { value: "Clay", label: "Clay" },
    { value: "Sandy", label: "Sandy" },
    { value: "Silt", label: "Silt" },
    { value: "Chalk", label: "Chalk" },
    { value: "Peat", label: "Peat" }
  ];

  const climateTypes = [
    { value: "Temperate", label: "Temperate" },
    { value: "Tropical", label: "Tropical" },
    { value: "Continental", label: "Continental" },
    { value: "Arid", label: "Arid" },
    { value: "Mediterranean", label: "Mediterranean" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalArea' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user corrects the field
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
          // In a real app, we would do reverse geocoding here
          // For this example, we'll simulate it
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              location: "Detected Location: Agricultural Zone 1",
              pincode: "560001"
            }));
            setIsDetectingLocation(false);
            
            toast({
              title: "Location detected",
              description: "Your location has been automatically filled"
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
    } else {
      setIsDetectingLocation(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof LandDetails, string>> = {};
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    
    if (!formData.plotNumber.trim()) {
      newErrors.plotNumber = "Plot number is required";
    }
    
    if (!formData.totalArea) {
      newErrors.totalArea = "Total area is required";
    } else if (formData.totalArea <= 0) {
      newErrors.totalArea = "Area must be greater than 0";
    }
    
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
    <div>
      <h2 className="text-xl font-semibold mb-6">Step 1: Land Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Location with Auto-detect */}
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
                {isDetectingLocation ? "Detecting..." : "Detect"}
              </Button>
            </div>
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          {/* Pincode */}
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

          {/* Plot Number */}
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

          {/* Total Area */}
          <div className="space-y-2">
            <Label htmlFor="totalArea">Total Area (acres) <span className="text-red-500">*</span></Label>
            <Input
              id="totalArea"
              name="totalArea"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter total area in acres"
              value={formData.totalArea || ""}
              onChange={handleChange}
              className={errors.totalArea ? "border-red-500" : ""}
            />
            {errors.totalArea && <p className="text-red-500 text-sm">{errors.totalArea}</p>}
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <select
              id="soilType"
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              {soilTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Climate Type */}
          <div className="space-y-2">
            <Label htmlFor="climateType">Climate Type</Label>
            <select
              id="climateType"
              name="climateType"
              value={formData.climateType}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              {climateTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map Section - Placeholder */}
        <div className="border border-dashed border-gray-300 rounded-md p-4 mt-6 bg-gray-50">
          <p className="text-center text-gray-500">Map-based plot marking would appear here</p>
          <div className="h-40 w-full bg-gray-200 rounded-md mt-2 flex items-center justify-center">
            <MapPin size={24} className="text-gray-400" />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="bg-foliage hover:bg-foliage-dark">
            Continue to Crop Selection
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LandDetailsForm;
