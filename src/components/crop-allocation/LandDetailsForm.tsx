import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BasicLandForm from "./BasicLandForm";
import SoilAnalysisPanel from "./SoilAnalysisPanel";
import SatelliteViewPanel from "./SatelliteViewPanel";

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
          const newCoordinates = { lat: latitude, lng: longitude };
          setCoordinates(newCoordinates);
          
          console.log('GPS coordinates detected:', newCoordinates);
          
          // Simulate reverse geocoding with more realistic location data
          const locationName = `Agricultural Zone ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          const simulatedPincode = Math.floor(100000 + Math.random() * 900000).toString();
          
          setFormData(prev => ({
            ...prev,
            location: locationName,
            pincode: simulatedPincode
          }));
          
          setIsDetectingLocation(false);
          
          toast({
            title: "Location detected successfully",
            description: `GPS coordinates captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
        },
        (error) => {
          setIsDetectingLocation(false);
          console.error('GPS error:', error);
          
          let errorMessage = "Please enter location manually";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          
          toast({
            title: "Location detection failed",
            description: errorMessage,
            variant: "destructive"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setIsDetectingLocation(false);
      toast({
        title: "GPS not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Land Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicLandForm
                formData={formData}
                errors={errors}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onDetectLocation={detectLocation}
                isDetectingLocation={isDetectingLocation}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <SoilAnalysisPanel 
            soilAnalysis={soilAnalysis}
            onRefresh={simulateSoilTest}
          />
          <SatelliteViewPanel coordinates={coordinates} />
        </div>
      </div>
    </div>
  );
};

export default LandDetailsForm;
