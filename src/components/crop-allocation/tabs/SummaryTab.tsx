
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface SummaryTabProps {
  landDetails: LandDetails;
  selectedCrops: SelectedCrop[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SummaryTab = ({ 
  landDetails, 
  selectedCrops, 
  onSubmit,
  isSubmitting 
}: SummaryTabProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your allocation plan is being prepared for export"
    });
    
    // In a real app, this would download a PDF or spreadsheet
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Crop allocation plan has been saved to your downloads"
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h3 className="font-medium mb-3 flex items-center">
          <FileText size={16} className="mr-1 text-foliage-dark" />
          Allocation Summary
        </h3>
        
        <div className="space-y-2">
          {selectedCrops.map(crop => (
            <div key={crop.id} className="flex justify-between items-center text-sm border-b pb-1">
              <span>{crop.name}</span>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{crop.area.toFixed(1)} acres</span>
                <span className="text-gray-600 w-12 text-right">{crop.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))}
          
          <div className="font-medium flex justify-between pt-1">
            <span>Total</span>
            <span>{landDetails.totalArea.toFixed(1)} acres</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <Button onClick={handleExport} size="sm" variant="outline" className="w-full">
            Export to PDF/Excel
          </Button>
          
          <Button size="sm" className="w-full bg-foliage hover:bg-foliage-dark" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Plan'}
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h3 className="font-medium mb-2">Land Details</h3>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span>{landDetails.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Plot Number:</span>
            <span>{landDetails.plotNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Area:</span>
            <span>{landDetails.totalArea.toFixed(1)} acres</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Soil Type:</span>
            <span>{landDetails.soilType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Climate:</span>
            <span>{landDetails.climateType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
