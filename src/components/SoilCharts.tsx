
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type SoilParameter = {
  name: string;
  value: number;
  unit: string;
  status: "optimal" | "low" | "deficient";
  optimal: { min: number; max: number };
};

type SoilChartProps = {
  parameters: SoilParameter[];
};

export function SoilCharts({ parameters }: SoilChartProps) {
  const [timeSeriesData, setTimeSeriesData] = useState<any>(null);
  const [pieData, setPieData] = useState<any>(null);
  const [barData, setBarData] = useState<any>(null);
  
  useEffect(() => {
    if (parameters && parameters.length > 0) {
      // Generate time-series data (simulated historical readings)
      generateTimeSeriesData();
      
      // Generate pie chart data for nutrient composition
      generatePieChartData();
      
      // Generate bar chart data for parameter comparison
      generateBarChartData();
    }
  }, [parameters]);

  // Generate time-series data for line chart 
  const generateTimeSeriesData = () => {
    // Get the last 7 dates (including today)
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // Create datasets for each parameter
    const datasets = parameters.map((param, index) => {
      // Generate random historical values that trend toward the current value
      const historicalValues = Array.from({ length: 6 }, (_, i) => {
        const randomFactor = Math.random() * 0.2 - 0.1; // -10% to +10% variation
        return parseFloat((param.value * (1 + randomFactor * (6 - i) / 3)).toFixed(1));
      });

      // Add the current value at the end
      historicalValues.push(param.value);

      // Define colors for each parameter
      const colors = [
        { border: 'rgba(53, 162, 235, 1)', bg: 'rgba(53, 162, 235, 0.2)' }, // pH
        { border: 'rgba(75, 192, 192, 1)', bg: 'rgba(75, 192, 192, 0.2)' }, // Nitrogen
        { border: 'rgba(255, 99, 132, 1)', bg: 'rgba(255, 99, 132, 0.2)' }, // Phosphorus
        { border: 'rgba(255, 159, 64, 1)', bg: 'rgba(255, 159, 64, 0.2)' }, // Potassium
        { border: 'rgba(153, 102, 255, 1)', bg: 'rgba(153, 102, 255, 0.2)' }, // Organic Matter
        { border: 'rgba(54, 162, 235, 1)', bg: 'rgba(54, 162, 235, 0.2)' }, // Moisture
      ];

      return {
        label: param.name,
        data: historicalValues,
        borderColor: colors[index % colors.length].border,
        backgroundColor: colors[index % colors.length].bg,
        borderWidth: 2,
        tension: 0.3,
      };
    });

    setTimeSeriesData({
      labels: dates,
      datasets,
    });
  };

  // Generate pie chart data for nutrient composition
  const generatePieChartData = () => {
    // Filter only nutrient parameters
    const nutrients = parameters.filter(p => 
      ['Nitrogen', 'Phosphorus', 'Potassium', 'Organic Matter'].includes(p.name));
    
    setPieData({
      labels: nutrients.map(p => p.name),
      datasets: [
        {
          data: nutrients.map(p => p.value),
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  // Generate bar chart data for parameter comparison
  const generateBarChartData = () => {
    setBarData({
      labels: parameters.map(p => p.name),
      datasets: [
        {
          label: 'Current Values',
          data: parameters.map(p => p.value),
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
        },
        {
          label: 'Optimal Minimum',
          data: parameters.map(p => p.optimal.min),
          backgroundColor: 'rgba(33, 150, 243, 0.5)',
          borderColor: 'rgba(33, 150, 243, 1)',
          borderWidth: 1,
          borderDash: [5, 5],
        },
        {
          label: 'Optimal Maximum',
          data: parameters.map(p => p.optimal.max),
          backgroundColor: 'rgba(255, 152, 0, 0.5)',
          borderColor: 'rgba(255, 152, 0, 1)',
          borderWidth: 1,
          borderDash: [5, 5],
        },
      ],
    });
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Soil Parameters Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Nutrient Composition',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Current vs Optimal Values',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Render soil layer visualization
  const renderSoilLayers = () => {
    // Determine layer colors based on soil health
    const organicMatter = parameters.find(p => p.name === "Organic Matter")?.value || 0;
    const ph = parameters.find(p => p.name === "pH")?.value || 0;
    const moisture = parameters.find(p => p.name === "Moisture")?.value || 0;
    
    // Calculate layer heights (percentages)
    const topsoilHeight = Math.min(100, Math.max(20, organicMatter * 10));
    const subsoilHeight = 100 - topsoilHeight;
    
    // Determine colors based on health
    let topsoilColor = '#8B4513';  // Default brown
    let subsoilColor = '#A0522D';  // Default lighter brown
    
    // Adjust colors based on pH and moisture
    if (ph < 5.5) {
      // Acidic soil - more reddish
      topsoilColor = '#A52A2A';
      subsoilColor = '#CD5C5C';
    } else if (ph > 7.5) {
      // Alkaline soil - more grayish
      topsoilColor = '#696969';
      subsoilColor = '#808080';
    }
    
    // Adjust darkness based on moisture
    const moistureAdjustment = Math.min(100, Math.max(0, moisture)) / 100 * 0.6;
    
    // Function to darken a color
    const darkenColor = (color: string, factor: number) => {
      // Simple darkening by converting to HSL and reducing lightness
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const darkenFactor = 1 - factor;
      const newR = Math.floor(r * darkenFactor);
      const newG = Math.floor(g * darkenFactor);
      const newB = Math.floor(b * darkenFactor);
      
      return `rgb(${newR}, ${newG}, ${newB})`;
    };
    
    topsoilColor = darkenColor(topsoilColor, moistureAdjustment);
    subsoilColor = darkenColor(subsoilColor, moistureAdjustment);

    return (
      <div className="relative h-40 w-full rounded-lg overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full" style={{ 
          height: `${topsoilHeight}%`, 
          backgroundColor: topsoilColor,
          transition: 'height 0.5s ease-in-out, background-color 0.5s ease-in-out'
        }}>
          <div className="absolute top-2 left-2 text-white text-xs font-bold">Topsoil</div>
        </div>
        <div className="absolute bottom-0 left-0 w-full" style={{ 
          height: `${subsoilHeight}%`, 
          backgroundColor: subsoilColor,
          transition: 'height 0.5s ease-in-out, background-color 0.5s ease-in-out'
        }}>
          <div className="absolute top-2 left-2 text-white text-xs font-bold">Subsoil</div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Line Chart - Time Series */}
      <Card className="col-span-2">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">Soil Parameters Over Time</h3>
          {timeSeriesData ? (
            <div className="h-[300px]">
              <Line 
                data={timeSeriesData} 
                options={lineOptions}
              />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Pie Chart - Nutrient Composition */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">Nutrient Composition</h3>
          {pieData ? (
            <div className="h-[250px]">
              <Pie 
                data={pieData} 
                options={pieOptions}
              />
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Bar Chart - Parameter Comparison */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">Parameter Comparison</h3>
          {barData ? (
            <div className="h-[250px]">
              <Bar 
                data={barData} 
                options={barOptions}
              />
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Soil Layer Visualization */}
      <Card className="col-span-2">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">Soil Composition Layers</h3>
          {parameters.length > 0 ? (
            renderSoilLayers()
          ) : (
            <div className="h-[160px] flex items-center justify-center">
              <p className="text-gray-500">Soil layer data not available</p>
            </div>
          )}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Topsoil:</span> Contains most organic matter and nutrients
            </div>
            <div className="text-xs text-gray-600">
              <span className="font-medium">Subsoil:</span> Contains minerals and clay particles
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
