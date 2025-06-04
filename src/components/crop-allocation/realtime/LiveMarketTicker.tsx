
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { useRealTimeData } from '@/hooks/useRealTimeData';

interface LiveMarketTickerProps {
  location: string;
}

const LiveMarketTicker: React.FC<LiveMarketTickerProps> = ({ location }) => {
  const { marketData, isLoading, isConnected } = useRealTimeData(location);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
            Live Market Prices
          </span>
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {marketData.map((item) => (
            <div key={item.crop} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium capitalize text-gray-900">{item.crop}</div>
                    <div className="text-xs text-gray-500">
                      Vol: {item.volume.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center text-sm ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(item.change).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMarketTicker;
