
import { ChartLine } from "lucide-react";
import LineChartRevenue from "../charts/LineChartRevenue";

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

interface InsightsTabProps {
  landDetails: LandDetails;
  selectedCrops: SelectedCrop[];
}

const InsightsTab = ({ landDetails, selectedCrops }: InsightsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h3 className="font-medium mb-3">Key Insights</h3>
        
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-foliage/10 border-l-2 border-foliage rounded-sm">
            <strong>Soil Analysis:</strong> Your {landDetails.soilType} soil is well-suited for {selectedCrops[0]?.name}.
          </div>
          
          <div className="p-2 bg-blue-50 border-l-2 border-blue-400 rounded-sm">
            <strong>Water Efficiency:</strong> Consider installing drip irrigation for optimal water usage.
          </div>
          
          <div className="p-2 bg-yellow-50 border-l-2 border-yellow-400 rounded-sm">
            <strong>Market Trend:</strong> {selectedCrops[0]?.name} prices expected to rise by 15% next season.
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h3 className="font-medium mb-2 flex items-center">
          <ChartLine size={16} className="mr-1 text-foliage-dark" />
          Revenue Projection
        </h3>
        <LineChartRevenue />
      </div>
      
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h3 className="font-medium mb-2">Recommendations</h3>
        
        <ul className="space-y-1 text-sm">
          <li className="flex items-start">
            <span className="text-foliage mr-1">•</span>
            <span>Schedule soil testing in 3 months for nutrient monitoring</span>
          </li>
          <li className="flex items-start">
            <span className="text-foliage mr-1">•</span>
            <span>Consider crop rotation for plots growing {selectedCrops[0]?.name} next season</span>
          </li>
          <li className="flex items-start">
            <span className="text-foliage mr-1">•</span>
            <span>Install moisture sensors for optimal irrigation scheduling</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InsightsTab;
