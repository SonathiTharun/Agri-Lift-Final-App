
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube } from "lucide-react";

interface SoilAnalysis {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
}

interface SoilAnalysisPanelProps {
  soilAnalysis: SoilAnalysis;
  onRefresh: () => void;
}

const SoilAnalysisPanel = ({ soilAnalysis, onRefresh }: SoilAnalysisPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <TestTube className="h-5 w-5 mr-2 text-blue-600" />
            Soil Analysis
          </span>
          <Button onClick={onRefresh} size="sm" variant="outline">
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600">pH Level</div>
            <div className="text-xl font-bold text-blue-900">{soilAnalysis.ph.toFixed(1)}</div>
            <Badge variant={soilAnalysis.ph >= 6 && soilAnalysis.ph <= 7.5 ? "default" : "destructive"} className="text-xs">
              {soilAnalysis.ph >= 6 && soilAnalysis.ph <= 7.5 ? "Optimal" : "Needs attention"}
            </Badge>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600">Nitrogen</div>
            <div className="text-xl font-bold text-green-900">{soilAnalysis.nitrogen.toFixed(0)}ppm</div>
            <Badge variant={soilAnalysis.nitrogen >= 40 ? "default" : "destructive"} className="text-xs">
              {soilAnalysis.nitrogen >= 40 ? "Good" : "Low"}
            </Badge>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600">Phosphorus</div>
            <div className="text-xl font-bold text-purple-900">{soilAnalysis.phosphorus.toFixed(0)}ppm</div>
            <Badge variant={soilAnalysis.phosphorus >= 25 ? "default" : "destructive"} className="text-xs">
              {soilAnalysis.phosphorus >= 25 ? "Good" : "Low"}
            </Badge>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-sm text-orange-600">Potassium</div>
            <div className="text-xl font-bold text-orange-900">{soilAnalysis.potassium.toFixed(0)}ppm</div>
            <Badge variant={soilAnalysis.potassium >= 20 ? "default" : "destructive"} className="text-xs">
              {soilAnalysis.potassium >= 20 ? "Good" : "Low"}
            </Badge>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Organic Matter</div>
          <div className="text-lg font-bold text-gray-900">{soilAnalysis.organicMatter.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Soil health indicator</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilAnalysisPanel;
