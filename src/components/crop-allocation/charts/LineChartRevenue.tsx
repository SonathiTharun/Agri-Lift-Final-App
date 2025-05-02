
import { Line } from 'react-chartjs-2';
import { ChartLine } from 'lucide-react';

const LineChartRevenue = () => {
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

  return (
    <div className="h-40">
      <Line 
        data={monthlyRevenueData} 
        options={{ 
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }} 
      />
    </div>
  );
};

export default LineChartRevenue;
