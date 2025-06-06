
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TestTube, Edit3, Save, X } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [manualValues, setManualValues] = useState<SoilAnalysis>(soilAnalysis);

  const handleManualUpdate = (field: keyof SoilAnalysis, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setManualValues(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleSaveManual = () => {
    // Trigger analysis with manual values
    onRefresh();
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setManualValues(soilAnalysis);
    setIsEditing(false);
  };

  const getStatusBadge = (value: number, min: number, max: number) => {
    const isOptimal = value >= min && value <= max;
    return (
      <Badge variant={isOptimal ? "default" : "destructive"} className="text-xs">
        {isOptimal ? "Optimal" : "Needs attention"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <TestTube className="h-5 w-5 mr-2 text-blue-600" />
            Soil Analysis
          </span>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                  <Edit3 className="h-4 w-4 mr-1" />
                  Manual Entry
                </Button>
                <Button onClick={onRefresh} size="sm" variant="outline">
                  Refresh
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSaveManual} size="sm" variant="default">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button onClick={handleCancelEdit} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          // Manual Input Mode
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ph-input">pH Level</Label>
                <Input
                  id="ph-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={manualValues.ph}
                  onChange={(e) => handleManualUpdate('ph', e.target.value)}
                  placeholder="Enter pH value (0-14)"
                />
                <p className="text-xs text-gray-500">Optimal range: 6.0 - 7.5</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nitrogen-input">Nitrogen (ppm)</Label>
                <Input
                  id="nitrogen-input"
                  type="number"
                  min="0"
                  value={manualValues.nitrogen}
                  onChange={(e) => handleManualUpdate('nitrogen', e.target.value)}
                  placeholder="Enter nitrogen value"
                />
                <p className="text-xs text-gray-500">Optimal range: 40+ ppm</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phosphorus-input">Phosphorus (ppm)</Label>
                <Input
                  id="phosphorus-input"
                  type="number"
                  min="0"
                  value={manualValues.phosphorus}
                  onChange={(e) => handleManualUpdate('phosphorus', e.target.value)}
                  placeholder="Enter phosphorus value"
                />
                <p className="text-xs text-gray-500">Optimal range: 25+ ppm</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="potassium-input">Potassium (ppm)</Label>
                <Input
                  id="potassium-input"
                  type="number"
                  min="0"
                  value={manualValues.potassium}
                  onChange={(e) => handleManualUpdate('potassium', e.target.value)}
                  placeholder="Enter potassium value"
                />
                <p className="text-xs text-gray-500">Optimal range: 20+ ppm</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organic-input">Organic Matter (%)</Label>
                <Input
                  id="organic-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={manualValues.organicMatter}
                  onChange={(e) => handleManualUpdate('organicMatter', e.target.value)}
                  placeholder="Enter organic matter percentage"
                />
                <p className="text-xs text-gray-500">Higher values indicate better soil health</p>
              </div>
            </div>
          </div>
        ) : (
          // Display Mode
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600">pH Level</div>
              <div className="text-xl font-bold text-blue-900">{soilAnalysis.ph.toFixed(1)}</div>
              {getStatusBadge(soilAnalysis.ph, 6.0, 7.5)}
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600">Nitrogen</div>
              <div className="text-xl font-bold text-green-900">{soilAnalysis.nitrogen.toFixed(0)}ppm</div>
              {getStatusBadge(soilAnalysis.nitrogen, 40, Infinity)}
            </div>

            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600">Phosphorus</div>
              <div className="text-xl font-bold text-purple-900">{soilAnalysis.phosphorus.toFixed(0)}ppm</div>
              {getStatusBadge(soilAnalysis.phosphorus, 25, Infinity)}
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600">Potassium</div>
              <div className="text-xl font-bold text-orange-900">{soilAnalysis.potassium.toFixed(0)}ppm</div>
              {getStatusBadge(soilAnalysis.potassium, 20, Infinity)}
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Organic Matter</div>
            <div className="text-lg font-bold text-gray-900">{soilAnalysis.organicMatter.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Soil health indicator</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SoilAnalysisPanel;
