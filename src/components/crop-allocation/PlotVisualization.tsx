
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, BarChart, PieChart, LineChart } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import VisualizationArea from "./VisualizationArea";
import SummaryTab from "./tabs/SummaryTab";
import InsightsTab from "./tabs/InsightsTab";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

interface PlotVisualizationProps {
  landDetails: LandDetails;
  selectedCrops: SelectedCrop[];
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const PlotVisualization = ({
  landDetails,
  selectedCrops,
  onSubmit,
  onBack,
  isSubmitting
}: PlotVisualizationProps) => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [rotationEnabled, setRotationEnabled] = useState(true);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Step 3: Visualization & Allocation</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <VisualizationArea 
          selectedCrops={selectedCrops}
          rotationEnabled={rotationEnabled}
        />
        
        {/* Info and Controls */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <SummaryTab 
                landDetails={landDetails}
                selectedCrops={selectedCrops}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
            
            <TabsContent value="insights">
              <InsightsTab 
                landDetails={landDetails}
                selectedCrops={selectedCrops}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        
        <Button 
          onClick={onSubmit}
          className="bg-foliage hover:bg-foliage-dark flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Plan'}
        </Button>
      </div>
    </div>
  );
};

export default PlotVisualization;
