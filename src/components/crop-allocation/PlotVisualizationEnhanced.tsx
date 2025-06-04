
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, BarChart, PieChart, Calendar, TrendingUp, Settings, FileText, Activity, Brain, Satellite } from "lucide-react";
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
import RealTimeWeatherWidget from "./realtime/RealTimeWeatherWidget";
import LiveMarketTicker from "./realtime/LiveMarketTicker";
import IoTSensorDashboard from "./realtime/IoTSensorDashboard";
import AIRecommendationEngine from "./analytics/AIRecommendationEngine";

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

interface PlotVisualizationEnhancedProps {
  landDetails: LandDetails;
  selectedCrops: SelectedCrop[];
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const PlotVisualizationEnhanced = ({
  landDetails,
  selectedCrops,
  onSubmit,
  onBack,
  isSubmitting
}: PlotVisualizationEnhancedProps) => {
  const [activeTab, setActiveTab] = useState<string>("realtime");
  const [rotationEnabled, setRotationEnabled] = useState(true);
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Step 3: Real-Time Visualization & Analysis</h2>
      
      {/* Real-Time Dashboard Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 space-y-4">
          <VisualizationArea 
            selectedCrops={selectedCrops}
            rotationEnabled={rotationEnabled}
          />
        </div>
        
        <div className="space-y-4">
          <RealTimeWeatherWidget location={landDetails.location} />
          <LiveMarketTicker location={landDetails.location} />
        </div>
        
        <div className="space-y-4">
          <IoTSensorDashboard location={landDetails.location} />
          <AIRecommendationEngine 
            landDetails={landDetails}
            selectedCrops={selectedCrops}
            location={landDetails.location}
          />
        </div>
      </div>

      {/* Enhanced Analytics Section */}
      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="realtime" className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Real-Time
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              AI Insights
            </TabsTrigger>
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

          <TabsContent value="realtime" className="mt-6 animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SummaryTab 
                  landDetails={landDetails}
                  selectedCrops={selectedCrops}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
              <div>
                <InsightsTab 
                  landDetails={landDetails}
                  selectedCrops={selectedCrops}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="mt-6 animate-scale-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIRecommendationEngine 
                landDetails={landDetails}
                selectedCrops={selectedCrops}
                location={landDetails.location}
              />
              
              <div className="space-y-6">
                {/* Predictive Analytics */}
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Satellite className="h-5 w-5 mr-2 text-blue-600" />
                    Predictive Analytics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Yield Prediction</h4>
                      <p className="text-sm text-blue-800 mb-2">
                        Based on current conditions and historical data, expected yield:
                      </p>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedCrops.reduce((sum, crop) => sum + crop.estimatedYield, 0).toFixed(1)} tons
                      </div>
                      <p className="text-xs text-blue-700 mt-1">±5% confidence interval</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Disease Risk Assessment</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Current Risk Level</span>
                        <span className="text-lg font-bold text-green-900">Low</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900 mb-2">Market Forecast</h4>
                      <p className="text-sm text-yellow-800">
                        Prices expected to increase by 12% over next 3 months
                      </p>
                      <div className="text-lg font-bold text-yellow-900 mt-1">
                        Optimal selling window: Week 8-10
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Risk Matrix */}
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Risk Assessment Matrix</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="font-medium text-red-900 text-sm">Weather Risk</h4>
                      <div className="text-lg font-bold text-red-900">Medium</div>
                      <p className="text-xs text-red-700">Heavy rain predicted</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="font-medium text-green-900 text-sm">Market Risk</h4>
                      <div className="text-lg font-bold text-green-900">Low</div>
                      <p className="text-xs text-green-700">Stable demand</p>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h4 className="font-medium text-yellow-900 text-sm">Resource Risk</h4>
                      <div className="text-lg font-bold text-yellow-900">Medium</div>
                      <p className="text-xs text-yellow-700">Water availability</p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="font-medium text-blue-900 text-sm">Pest Risk</h4>
                      <div className="text-lg font-bold text-blue-900">Low</div>
                      <p className="text-xs text-blue-700">Favorable conditions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-6 animate-scale-in">
            <FinancialProjections 
              selectedCrops={selectedCrops}
              landDetails={landDetails}
            />
          </TabsContent>

          <TabsContent value="resources" className="mt-6 animate-scale-in">
            <ResourceOptimization
              selectedCrops={selectedCrops}
              landDetails={landDetails}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6 animate-scale-in">
            <CropCalendar selectedCrops={selectedCrops} />
          </TabsContent>

          <TabsContent value="reports" className="mt-6 animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Export Options</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start hover-scale">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Comprehensive Report (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover-scale">
                    <BarChart className="h-4 w-4 mr-2" />
                    Export Analytics to Excel
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover-scale">
                    <PieChart className="h-4 w-4 mr-2" />
                    Generate Real-Time Dashboard
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover-scale">
                    <Activity className="h-4 w-4 mr-2" />
                    Export IoT Data History
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Sharing & Collaboration</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start hover-scale">
                    Share Real-Time Dashboard
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover-scale">
                    Send to Agricultural Advisor
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover-scale">
                    Submit to Bank for Loan
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover-scale">
                    Create Investor Presentation
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
          className="flex items-center hover-scale"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        
        <Button 
          onClick={onSubmit}
          className="bg-foliage hover:bg-foliage-dark flex items-center hover-scale"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Real-Time Plan...' : 'Save Enhanced Plan'}
        </Button>
      </div>
    </div>
  );
};

export default PlotVisualizationEnhanced;
