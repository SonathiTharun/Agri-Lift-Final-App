
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LandDetails {
  location: string;
  pincode: string;
  plotNumber: string;
  totalArea: number;
  soilType: string;
  climateType: string;
}

interface BasicLandFormProps {
  formData: LandDetails;
  errors: Partial<Record<keyof LandDetails, string>>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetectLocation: () => void;
  isDetectingLocation: boolean;
}

const BasicLandForm = ({ 
  formData, 
  errors, 
  onSubmit, 
  onChange, 
  onDetectLocation, 
  isDetectingLocation 
}: BasicLandFormProps) => {
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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
          <div className="flex">
            <Input
              id="location"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={onChange}
              className={`flex-1 ${errors.location ? "border-red-500" : ""}`}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={onDetectLocation} 
              disabled={isDetectingLocation} 
              className="ml-2"
            >
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
  );
};

export default BasicLandForm;
