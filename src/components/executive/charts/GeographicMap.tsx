import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp, DollarSign } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface RegionData {
  id: string;
  name: string;
  coordinates: [number, number];
  farmers: number;
  revenue: number;
  growth: number;
  activeUsers: number;
  marketActivity: number;
}

interface GeographicMapProps {
  title?: string;
  data: RegionData[];
  className?: string;
  height?: string;
}

// Custom hook to fit map bounds
const FitBounds: React.FC<{ data: RegionData[] }> = ({ data }) => {
  const map = useMap();
  
  useEffect(() => {
    if (data.length > 0) {
      const bounds = data.map(region => region.coordinates);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [data, map]);
  
  return null;
};

// Get marker size based on revenue
const getMarkerSize = (revenue: number, maxRevenue: number): number => {
  const minSize = 8;
  const maxSize = 25;
  const ratio = revenue / maxRevenue;
  return minSize + (maxSize - minSize) * ratio;
};

// Get marker color based on growth
const getMarkerColor = (growth: number): string => {
  if (growth >= 15) return '#22c55e'; // Green for high growth
  if (growth >= 10) return '#eab308'; // Yellow for medium growth
  if (growth >= 5) return '#f97316';  // Orange for low growth
  return '#ef4444'; // Red for negative/very low growth
};

export const GeographicMap: React.FC<GeographicMapProps> = ({
  title = "Geographic Distribution",
  data,
  className = "",
  height = "h-96"
}) => {
  const maxRevenue = Math.max(...data.map(region => region.revenue));

  return (
    <Card className={`agrilift-card hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="agrilift-card-header pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold agrilift-text-primary flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="agrilift-text-muted">High Growth</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="agrilift-text-muted">Medium Growth</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="agrilift-text-muted">Low Growth</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`${height} rounded-lg overflow-hidden agrilift-border`}>
          <MapContainer
            center={[20.5937, 78.9629]} // Center of India
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds data={data} />
            {data.map((region) => (
              <CircleMarker
                key={region.id}
                center={region.coordinates}
                radius={getMarkerSize(region.revenue, maxRevenue)}
                fillColor={getMarkerColor(region.growth)}
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.8}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{region.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="h-3 w-3" />
                          Farmers
                        </span>
                        <Badge variant="secondary">{region.farmers.toLocaleString()}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign className="h-3 w-3" />
                          Revenue
                        </span>
                        <Badge variant="secondary">₹{(region.revenue / 100000).toFixed(1)}L</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <TrendingUp className="h-3 w-3" />
                          Growth
                        </span>
                        <Badge 
                          variant={region.growth >= 10 ? "default" : "secondary"}
                          className={region.growth >= 10 ? "bg-green-600" : ""}
                        >
                          +{region.growth}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="font-medium">{region.activeUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Market Activity</span>
                        <span className="font-medium">{region.marketActivity}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        
        {/* Summary Statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.reduce((sum, region) => sum + region.farmers, 0).toLocaleString()}
            </div>
            <div className="text-sm agrilift-text-muted">Total Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₹{(data.reduce((sum, region) => sum + region.revenue, 0) / 100000).toFixed(1)}L
            </div>
            <div className="text-sm agrilift-text-muted">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data.reduce((sum, region) => sum + region.activeUsers, 0).toLocaleString()}
            </div>
            <div className="text-sm agrilift-text-muted">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(data.reduce((sum, region) => sum + region.growth, 0) / data.length).toFixed(1)}%
            </div>
            <div className="text-sm agrilift-text-muted">Avg Growth</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample data for testing
export const sampleRegionData: RegionData[] = [
  {
    id: '1',
    name: 'Punjab',
    coordinates: [30.7333, 76.7794],
    farmers: 450,
    revenue: 1800000,
    growth: 15.2,
    activeUsers: 380,
    marketActivity: 156
  },
  {
    id: '2',
    name: 'Haryana',
    coordinates: [29.0588, 76.0856],
    farmers: 320,
    revenue: 1450000,
    growth: 12.8,
    activeUsers: 290,
    marketActivity: 134
  },
  {
    id: '3',
    name: 'Gujarat',
    coordinates: [23.0225, 72.5714],
    farmers: 280,
    revenue: 1250000,
    growth: 18.5,
    activeUsers: 245,
    marketActivity: 98
  },
  {
    id: '4',
    name: 'Maharashtra',
    coordinates: [19.7515, 75.7139],
    farmers: 190,
    revenue: 950000,
    growth: 10.3,
    activeUsers: 165,
    marketActivity: 87
  },
  {
    id: '5',
    name: 'Uttar Pradesh',
    coordinates: [26.8467, 80.9462],
    farmers: 520,
    revenue: 2100000,
    growth: 14.7,
    activeUsers: 445,
    marketActivity: 203
  },
  {
    id: '6',
    name: 'Rajasthan',
    coordinates: [27.0238, 74.2179],
    farmers: 210,
    revenue: 890000,
    growth: 8.9,
    activeUsers: 178,
    marketActivity: 76
  }
];

export default GeographicMap;
