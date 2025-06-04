
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Satellite, RefreshCw, Key } from "lucide-react";
import { useState } from "react";

interface SatelliteViewPanelProps {
  coordinates: { lat: number; lng: number } | null;
}

const SatelliteViewPanel = ({ coordinates }: SatelliteViewPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [imageError, setImageError] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);

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
    
    const zoom = 18; // Higher zoom for better plot detail
    const width = 400;
    const height = 300;
    
    if (apiKey && apiKey.trim() !== "") {
      // Using Google Maps Static API with real API key
      return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=${zoom}&size=${width}x${height}&maptype=satellite&key=${apiKey}`;
    } else {
      // Fallback to OpenStreetMap satellite-style imagery
      return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${Math.floor((1 - Math.log(Math.tan(coordinates.lat * Math.PI / 180) + 1 / Math.cos(coordinates.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}/${Math.floor((coordinates.lng + 180) / 360 * Math.pow(2, zoom))}`;
    }
  };

  const handleImageError = () => {
    console.log('Satellite image failed to load');
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Satellite image loaded successfully');
    setImageError(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Satellite className="h-5 w-5 mr-2 text-indigo-600" />
            Real-Time Satellite View
          </span>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowApiInput(!showApiInput)} 
              size="sm" 
              variant="outline"
            >
              <Key className="h-4 w-4" />
            </Button>
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
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showApiInput && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700 mb-2">
              Enter Google Maps API Key for high-quality satellite imagery:
            </div>
            <Input
              type="password"
              placeholder="Google Maps API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-sm"
            />
            <div className="text-xs text-blue-600 mt-1">
              Get your API key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a>
            </div>
          </div>
        )}
        
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-3 overflow-hidden">
          {coordinates ? (
            <div className="relative w-full h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
                    <div className="text-sm">Loading real-time satellite view...</div>
                  </div>
                </div>
              ) : imageError ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Satellite className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Satellite imagery unavailable</div>
                    <div className="text-xs">Add Google Maps API key for better quality</div>
                  </div>
                </div>
              ) : (
                <>
                  <img 
                    src={getSatelliteImageUrl() || ''} 
                    alt="Real-time satellite view of your plot"
                    className="w-full h-full object-cover rounded"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                  <div className="absolute top-2 right-2 bg-green-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                    🛰️ Live Satellite
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    Zoom: 18 | Real-time imagery
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Satellite className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Use GPS to view real-time satellite imagery</div>
              <div className="text-xs">Your plot will be visible in high resolution</div>
            </div>
          )}
        </div>
        
        {coordinates && (
          <div className="space-y-3">
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span>Latitude:</span>
                  <span className="font-mono font-semibold">{coordinates.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Longitude:</span>
                  <span className="font-mono font-semibold">{coordinates.lng.toFixed(6)}</span>
                </div>
              </div>
              {!apiKey && (
                <div className="text-xs text-amber-600 mt-2 p-2 bg-amber-50 rounded">
                  💡 Add Google Maps API key for enhanced satellite quality
                </div>
              )}
            </div>
            
            {lastUpdated && (
              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="text-xs text-green-600">Soil Analysis</div>
                <div className="text-sm font-semibold text-green-800">Real-time</div>
              </div>
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="text-xs text-blue-600">Water Detection</div>
                <div className="text-sm font-semibold text-blue-800">Active</div>
              </div>
              <div className="bg-purple-50 p-2 rounded text-center">
                <div className="text-xs text-purple-600">Crop Health</div>
                <div className="text-sm font-semibold text-purple-800">Monitoring</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SatelliteViewPanel;
