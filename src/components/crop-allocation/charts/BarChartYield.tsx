
import { Bar } from 'react-chartjs-2';
import { ChartBar } from 'lucide-react';

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface BarChartYieldProps {
  selectedCrops: SelectedCrop[];
}

const BarChartYield = ({ selectedCrops }: BarChartYieldProps) => {
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

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      <h3 className="text-sm font-medium mb-2 flex items-center text-gray-700">
        <ChartBar size={16} className="mr-1 text-foliage-dark" />
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
  );
};

export default BarChartYield;
