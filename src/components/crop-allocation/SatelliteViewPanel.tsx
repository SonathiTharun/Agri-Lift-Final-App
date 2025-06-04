
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Satellite, RefreshCw } from "lucide-react";
import { useState } from "react";

interface SatelliteViewPanelProps {
  coordinates: { lat: number; lng: number } | null;
}

const SatelliteViewPanel = ({ coordinates }: SatelliteViewPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [imageError, setImageError] = useState(false);

  const refreshSatelliteView = () => {
    setIsLoading(true);
    setImageError(false);
    // Simulate loading time for satellite data
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 2000);
  };

  const getSatelliteImageUrl = () => {
    if (!coordinates) return null;
    
    // Using a more reliable placeholder service
    const zoom = 15;
    const width = 300;
    const height = 200;
    
    // Using Google Static Maps as a more reliable fallback
    return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=${zoom}&size=${width}x${height}&maptype=satellite&key=demo`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Satellite className="h-5 w-5 mr-2 text-indigo-600" />
            Satellite View
          </span>
          {coordinates && (
            <Button 
              onClick={refreshSatelliteView} 
              size="sm" 
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
          {coordinates ? (
            <div className="relative w-full h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
                    <div className="text-sm">Loading satellite view...</div>
                  </div>
                </div>
              ) : imageError ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Satellite className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Satellite view</div>
                    <div className="text-xs">Plot visualization</div>
                  </div>
                </div>
              ) : (
                <>
                  <img 
                    src={getSatelliteImageUrl() || ''} 
                    alt="Satellite view of your land"
                    className="w-full h-full object-cover rounded"
                    onError={handleImageError}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Live View
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Satellite className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Use GPS to view satellite imagery</div>
              <div className="text-xs">Your plot visualization will appear here</div>
            </div>
          )}
        </div>
        
        {coordinates && (
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Latitude:</span>
                <span className="font-mono">{coordinates.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="font-mono">{coordinates.lng.toFixed(6)}</span>
              </div>
            </div>
            
            {lastUpdated && (
              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="text-xs text-green-600">Soil Quality</div>
                <div className="text-sm font-semibold text-green-800">Good</div>
              </div>
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="text-xs text-blue-600">Water Access</div>
                <div className="text-sm font-semibold text-blue-800">Available</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SatelliteViewPanel;
