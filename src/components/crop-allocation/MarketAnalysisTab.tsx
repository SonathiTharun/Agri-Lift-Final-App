
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface MarketItem {
  crop: string;
  price: number;
  volume: number;
  change: number;
}

interface MarketAnalysisTabProps {
  marketData: MarketItem[];
}

const MarketAnalysisTab = ({ marketData }: MarketAnalysisTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Current Market Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((item) => (
            <div key={item.crop} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium capitalize">{item.crop}</div>
                <div className="text-sm text-gray-500">Volume: {item.volume.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{item.price.toFixed(2)}/ton</div>
                <div className={`text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketAnalysisTab;
