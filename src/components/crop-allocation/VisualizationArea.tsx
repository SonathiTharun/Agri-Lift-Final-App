
import PieChartArea from "./charts/PieChartArea";
import BarChartYield from "./charts/BarChartYield";
import Field3D from "./Field3D";

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface VisualizationAreaProps {
  selectedCrops: SelectedCrop[];
  rotationEnabled: boolean;
}

const VisualizationArea = ({ selectedCrops, rotationEnabled }: VisualizationAreaProps) => {
  return (
    <div className="md:col-span-2 space-y-4">
      <Field3D crops={selectedCrops} rotationEnabled={rotationEnabled} />
      
      <div className="grid grid-cols-2 gap-4">
        <PieChartArea selectedCrops={selectedCrops} />
        <BarChartYield selectedCrops={selectedCrops} />
      </div>
    </div>
  );
};

export default VisualizationArea;
