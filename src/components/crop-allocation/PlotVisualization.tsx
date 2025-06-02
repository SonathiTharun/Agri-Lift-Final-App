
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, BarChart, PieChart, Calendar, TrendingUp, Settings, FileText } from "lucide-react";
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
import FinancialProjections from "./analytics/FinancialProjections";
import ResourceOptimization from "./analytics/ResourceOptimization";
import CropCalendar from "./analytics/CropCalendar";

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
      <h2 className="text-xl font-semibold mb-6">Step 3: Visualization & Analysis</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <VisualizationArea 
          selectedCrops={selectedCrops}
          rotationEnabled={rotationEnabled}
        />
        
        {/* Info and Controls */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
              <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
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

      {/* Advanced Analytics Section */}
      <div className="mt-8">
        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="mt-6">
            <FinancialProjections 
              selectedCrops={selectedCrops}
              landDetails={landDetails}
            />
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <ResourceOptimization
              selectedCrops={selectedCrops}
              landDetails={landDetails}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CropCalendar selectedCrops={selectedCrops} />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Export Options</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PieChart className="h-4 w-4 mr-2" />
                    Generate Charts
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Sharing & Collaboration</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Share with Advisor
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Send to Bank
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Create Public Link
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
