
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Activity, Brain, TrendingUp, Settings, Calendar, FileText, Satellite, BarChart, PieChart } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Real-Time Analysis & Visualization</h2>
        <p className="text-gray-600">Live monitoring and intelligent insights for your crop allocation plan</p>
      </div>

      {/* Real-Time Overview Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Main Visualization */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Satellite className="h-5 w-5 mr-2 text-blue-600" />
                3D Field Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VisualizationArea 
                selectedCrops={selectedCrops}
                rotationEnabled={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Widgets */}
        <div className="space-y-4">
          <RealTimeWeatherWidget location={landDetails.location} />
          <IoTSensorDashboard location={landDetails.location} />
        </div>

        <div className="space-y-4">
          <LiveMarketTicker location={landDetails.location} />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">{selectedCrops.length}</div>
                  <div className="text-xs text-green-600">Crops Selected</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">{landDetails.totalArea}</div>
                  <div className="text-xs text-blue-600">Total Acres</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {selectedCrops.reduce((sum, crop) => sum + crop.estimatedYield, 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-purple-600">Est. Yield (tons)</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-700">₹{
                    (selectedCrops.reduce((sum, crop) => sum + crop.estimatedYield, 0) * 2000).toLocaleString()
                  }</div>
                  <div className="text-xs text-yellow-600">Est. Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            Comprehensive Analysis Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                Overview
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

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SummaryTab 
                  landDetails={landDetails}
                  selectedCrops={selectedCrops}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
                <InsightsTab 
                  landDetails={landDetails}
                  selectedCrops={selectedCrops}
                />
              </div>
            </TabsContent>

            <TabsContent value="ai-insights" className="mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AIRecommendationEngine 
                  landDetails={landDetails}
                  selectedCrops={selectedCrops}
                  location={landDetails.location}
                />
                
                <div className="space-y-6">
                  {/* Predictive Analytics */}
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Satellite className="h-5 w-5 mr-2 text-blue-600" />
                        Predictive Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-blue-900 mb-2">Yield Prediction</h4>
                        <p className="text-sm text-blue-800 mb-2">
                          Based on current conditions and historical data:
                        </p>
                        <div className="text-2xl font-bold text-blue-900">
                          {selectedCrops.reduce((sum, crop) => sum + crop.estimatedYield, 0).toFixed(1)} tons
                        </div>
                        <p className="text-xs text-blue-700 mt-1">±5% confidence interval</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-green-900 mb-2">Disease Risk Assessment</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-800">Current Risk Level</span>
                          <span className="text-lg font-bold text-green-900">Low</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-yellow-900 mb-2">Market Forecast</h4>
                        <p className="text-sm text-yellow-800">
                          Prices expected to increase by 12% over next 3 months
                        </p>
                        <div className="text-lg font-bold text-yellow-900 mt-1">
                          Optimal selling window: Week 8-10
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Risk Matrix */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Assessment Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

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
                <Card>
                  <CardHeader>
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Comprehensive Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart className="h-4 w-4 mr-2" />
                      Export Analytics to Excel
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <PieChart className="h-4 w-4 mr-2" />
                      Generate Real-Time Dashboard
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="h-4 w-4 mr-2" />
                      Export IoT Data History
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sharing & Collaboration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Share Real-Time Dashboard
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Send to Agricultural Advisor
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Submit to Bank for Loan
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Create Investor Presentation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Selection
        </Button>
        
        <Button 
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Real-Time Plan...' : 'Save Complete Plan'}
        </Button>
      </div>
    </div>
  );
};

export default PlotVisualizationEnhanced;
