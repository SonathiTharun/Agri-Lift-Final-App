
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ChevronLeft, BarChart, FileText, PieChart, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { Bar, Pie, Line } from 'react-chartjs-2';

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Sample data for charts
  const pieChartData = {
    labels: selectedCrops.map(crop => crop.name),
    datasets: [
      {
        data: selectedCrops.map(crop => crop.percentage),
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(33, 150, 243, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(156, 39, 176, 0.7)',
          'rgba(233, 30, 99, 0.7)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const yieldChartData = {
    labels: selectedCrops.map(crop => crop.name),
    datasets: [
      {
        label: 'Estimated Yield (tons)',
        data: selectedCrops.map(crop => crop.estimatedYield),
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
      },
    ],
  };

  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Projected Revenue (₹ thousands)',
        data: Array(12).fill(0).map(() => Math.random() * 50 + 50),
        borderColor: 'rgba(76, 175, 80, 1)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  useEffect(() => {
    // Mock 3D visualization setup
    if (canvasRef.current) {
      const mockRotation = () => {
        if (!rotationEnabled || !canvasRef.current) return;
        
        // Simulate slow rotation animation
        const mockCanvas = canvasRef.current;
        const currentRotation = parseFloat(mockCanvas.dataset.rotation || "0");
        const newRotation = (currentRotation + 0.5) % 360;
        mockCanvas.dataset.rotation = newRotation.toString();
        
        // Use CSS 3D transforms to rotate the mock canvas
        mockCanvas.style.transform = `rotateY(${newRotation}deg) rotateX(20deg)`;
        
        requestAnimationFrame(mockRotation);
      };
      
      const animationId = requestAnimationFrame(mockRotation);
      
      // Clean up on unmount
      return () => cancelAnimationFrame(animationId);
    }
  }, [rotationEnabled]);

  // Simulated crop color assignments
  const cropColors = {
    wheat: "#F5DEB3",
    rice: "#CDBA96",
    corn: "#F8DE7E",
    potato: "#CD853F",
    tomato: "#FF6347",
    cotton: "#F0FFFF",
    soybean: "#90EE90",
    sugarcane: "#87CEFA"
  };

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
    <div>
      <h2 className="text-xl font-semibold mb-6">Step 3: Visualization & Allocation</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* 3D Plot Visualization */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-gray-50 border rounded-lg h-80 relative overflow-hidden">
            <div 
              ref={canvasRef}
              className="absolute inset-0 transition-transform duration-200 ease-linear"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Mock 3D visualization for demo purposes */}
              <div className="absolute inset-0 bg-green-200/30 border-2 border-foliage/30 rounded-lg">
                {/* Crop Areas */}
                {selectedCrops.map((crop, index) => {
                  const cropColor = cropColors[crop.id as keyof typeof cropColors] || "#AED581";
                  const width = Math.sqrt(crop.percentage) * 3;
                  const height = Math.sqrt(crop.percentage) * 3;
                  const left = 15 + (index * 20) % 60;
                  const top = 15 + Math.floor((index * 20) / 60) * 20;
                  
                  return (
                    <div
                      key={crop.id}
                      className="absolute border-2 border-white/50 rounded-md flex items-center justify-center text-xs font-bold shadow-lg"
                      style={{
                        backgroundColor: cropColor,
                        width: `${width}%`,
                        height: `${height}%`,
                        left: `${left}%`,
                        top: `${top}%`,
                        color: "#333",
                        transform: `translateZ(${index + 2}px)`
                      }}
                    >
                      {crop.name}
                    </div>
                  );
                })}
                
                {/* Water channels */}
                <div className="absolute h-1 bg-blue-400/70 rounded-full" style={{ width: '70%', top: '30%', left: '15%', transform: 'translateZ(10px)' }}></div>
                <div className="absolute h-1 bg-blue-400/70 rounded-full" style={{ width: '1%', height: '40%', top: '30%', left: '60%', transform: 'translateZ(10px)' }}></div>
                
                {/* Fertilizer zones */}
                <div className="absolute w-16 h-16 rounded-full bg-yellow-200/30 border border-yellow-400/50" style={{ top: '20%', left: '20%', transform: 'translateZ(1px)' }}></div>
                <div className="absolute w-24 h-24 rounded-full bg-yellow-200/30 border border-yellow-400/50" style={{ top: '50%', left: '60%', transform: 'translateZ(1px)' }}></div>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 space-x-2">
              <Button size="sm" variant="outline" className="bg-white" onClick={() => setRotationEnabled(!rotationEnabled)}>
                {rotationEnabled ? 'Pause' : 'Rotate'}
              </Button>
            </div>
            
            <div className="absolute top-4 left-4">
              <div className="text-sm font-medium text-gray-700">Plot: {landDetails.plotNumber}</div>
              <div className="text-xs text-gray-500">{landDetails.location}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 border rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2 flex items-center text-gray-700">
                <PieChart size={16} className="mr-1 text-foliage-dark" />
                Area Distribution
              </h3>
              <div className="h-40">
                <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            
            <div className="bg-white p-4 border rounded-lg shadow-sm">
              <h3 className="text-sm font-medium mb-2 flex items-center text-gray-700">
                <BarChart size={16} className="mr-1 text-foliage-dark" />
                Yield Projection
              </h3>
              <div className="h-40">
                <Bar 
                  data={yieldChartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Info and Controls */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
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
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4">
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
                  <LineChart size={16} className="mr-1 text-foliage-dark" />
                  Revenue Projection
                </h3>
                <div className="h-40">
                  <Line 
                    data={monthlyRevenueData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true } }
                    }} 
                  />
                </div>
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
