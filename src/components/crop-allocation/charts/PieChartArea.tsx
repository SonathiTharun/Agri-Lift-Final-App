
import { Pie } from 'react-chartjs-2';
import { ChartPie } from 'lucide-react';

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface PieChartAreaProps {
  selectedCrops: SelectedCrop[];
}

const PieChartArea = ({ selectedCrops }: PieChartAreaProps) => {
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

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      <h3 className="text-sm font-medium mb-2 flex items-center text-gray-700">
        <ChartPie size={16} className="mr-1 text-foliage-dark" />
        Area Distribution
      </h3>
      <div className="h-40">
        <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default PieChartArea;
