
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite } from "lucide-react";

interface SatelliteViewPanelProps {
  coordinates: { lat: number; lng: number } | null;
}

const SatelliteViewPanel = ({ coordinates }: SatelliteViewPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Satellite className="h-5 w-5 mr-2 text-indigo-600" />
          Satellite View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-3">
          <div className="text-center text-gray-500">
            <Satellite className="h-8 w-8 mx-auto mb-2" />
            <div className="text-sm">Satellite imagery</div>
            <div className="text-xs">Plot visualization</div>
          </div>
        </div>
        {coordinates && (
          <div className="text-xs text-gray-600">
            <div>Lat: {coordinates.lat.toFixed(6)}</div>
            <div>Lng: {coordinates.lng.toFixed(6)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SatelliteViewPanel;
