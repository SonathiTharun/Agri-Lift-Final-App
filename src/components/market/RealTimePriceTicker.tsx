
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PriceData {
  id: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

const mockPriceData: PriceData[] = [
  { id: "1", name: "Wheat", price: 2500, change: 50, changePercent: 2.04, trend: 'up' },
  { id: "2", name: "Rice", price: 3200, change: -25, changePercent: -0.77, trend: 'down' },
  { id: "3", name: "Corn", price: 1800, change: 0, changePercent: 0, trend: 'neutral' },
  { id: "4", name: "Soybean", price: 4500, change: 100, changePercent: 2.27, trend: 'up' },
  { id: "5", name: "Cotton", price: 6800, change: -150, changePercent: -2.16, trend: 'down' },
];

export const RealTimePriceTicker = () => {
  const [prices, setPrices] = useState(mockPriceData);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPrices(prev => prev.map(item => {
        const changeAmount = (Math.random() - 0.5) * 100;
        const newPrice = Math.max(item.price + changeAmount, item.price * 0.8);
        const change = newPrice - item.price;
        const changePercent = (change / item.price) * 100;
        
        return {
          ...item,
          price: Math.round(newPrice),
          change: Math.round(change),
          changePercent: Number(changePercent.toFixed(2)),
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/20 rounded-xl border border-white/30 p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className={`h-5 w-5 ${isLive ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
          <h3 className="font-semibold text-gray-800">Live Market Prices</h3>
          <Badge variant={isLive ? "default" : "secondary"} className="text-xs">
            {isLive ? 'LIVE' : 'PAUSED'}
          </Badge>
        </div>
        
        <button
          onClick={() => setIsLive(!isLive)}
          className="text-sm text-foliage hover:text-foliage-dark transition-colors"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: isLive ? [-1000, 0] : 0 }}
          transition={{ 
            x: { 
              duration: 20, 
              ease: "linear", 
              repeat: Infinity 
            } 
          }}
        >
          {[...prices, ...prices].map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 min-w-fit"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm">
                <span className="font-medium text-gray-800 whitespace-nowrap">
                  {item.name}
                </span>
                <span className="font-bold text-gray-900">
                  ₹{item.price.toLocaleString()}
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getTrendColor(item.trend)}`}>
                  {getTrendIcon(item.trend)}
                  <span>
                    {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
