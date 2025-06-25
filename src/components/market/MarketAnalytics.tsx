import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign, Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageContext";
import { GlassCard } from "./GlassCard";

interface MarketMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface PriceData {
  crop: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  volume: number;
  prediction: 'bullish' | 'bearish' | 'stable';
}

const mockMetrics: MarketMetric[] = [
  {
    label: "Total Market Value",
    value: "₹2.4M",
    change: 12.5,
    trend: 'up',
    icon: <DollarSign className="w-5 h-5" />
  },
  {
    label: "Active Products",
    value: "15,420",
    change: 8.2,
    trend: 'up',
    icon: <Package className="w-5 h-5" />
  },
  {
    label: "Daily Transactions",
    value: "1,256",
    change: -3.1,
    trend: 'down',
    icon: <Activity className="w-5 h-5" />
  },
  {
    label: "Active Users",
    value: "8,947",
    change: 15.7,
    trend: 'up',
    icon: <Users className="w-5 h-5" />
  }
];

const mockPriceData: PriceData[] = [
  { crop: "Wheat", currentPrice: 2500, previousPrice: 2400, change: 4.17, volume: 1250, prediction: 'bullish' },
  { crop: "Rice", currentPrice: 3200, previousPrice: 3250, change: -1.54, volume: 980, prediction: 'bearish' },
  { crop: "Corn", currentPrice: 1800, previousPrice: 1780, change: 1.12, volume: 750, prediction: 'stable' },
  { crop: "Soybean", currentPrice: 4500, previousPrice: 4300, change: 4.65, volume: 650, prediction: 'bullish' },
  { crop: "Cotton", currentPrice: 6800, previousPrice: 7000, change: -2.86, volume: 420, prediction: 'bearish' }
];

export const MarketAnalytics = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState(mockMetrics);
  const [priceData, setPriceData] = useState(mockPriceData);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(prev => prev.map(item => {
        const changeAmount = (Math.random() - 0.5) * 100;
        const newPrice = Math.max(item.currentPrice + changeAmount, item.currentPrice * 0.9);
        const change = ((newPrice - item.previousPrice) / item.previousPrice) * 100;
        
        return {
          ...item,
          currentPrice: Math.round(newPrice),
          change: Number(change.toFixed(2)),
          volume: Math.max(100, item.volume + Math.floor((Math.random() - 0.5) * 200)),
          prediction: change > 2 ? 'bullish' : change < -2 ? 'bearish' : 'stable'
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate metric values
  useEffect(() => {
    metrics.forEach((metric, index) => {
      const targetValue = parseFloat(metric.value.replace(/[₹,M]/g, ''));
      let currentValue = animatedValues[metric.label] || 0;
      
      const animate = () => {
        const diff = targetValue - currentValue;
        if (Math.abs(diff) > 0.1) {
          currentValue += diff * 0.1;
          setAnimatedValues(prev => ({ ...prev, [metric.label]: currentValue }));
          requestAnimationFrame(animate);
        }
      };
      
      setTimeout(() => animate(), index * 200);
    });
  }, [metrics]);

  const MetricCard = ({ metric, index }: { metric: MarketMetric; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-white/10">
            {metric.icon}
          </div>
          <Badge 
            className={`${
              metric.trend === 'up' 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : metric.trend === 'down'
                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
            }`}
          >
            {metric.trend === 'up' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : metric.trend === 'down' ? (
              <TrendingDown className="w-3 h-3 mr-1" />
            ) : (
              <Activity className="w-3 h-3 mr-1" />
            )}
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </Badge>
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {metric.value}
        </div>
        <div className="text-sm text-gray-300">{metric.label}</div>
      </GlassCard>
    </motion.div>
  );

  const PriceRow = ({ data, index }: { data: PriceData; index: number }) => (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-white/10 hover:bg-white/5 transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
            {data.crop.charAt(0)}
          </div>
          <span className="text-white font-medium">{data.crop}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-white font-semibold">
        ₹{data.currentPrice.toLocaleString()}
      </td>
      <td className="py-3 px-4">
        <div className={`flex items-center gap-1 ${
          data.change > 0 ? 'text-green-400' : data.change < 0 ? 'text-red-400' : 'text-gray-400'
        }`}>
          {data.change > 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : data.change < 0 ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <Activity className="w-4 h-4" />
          )}
          {data.change > 0 ? '+' : ''}{data.change}%
        </div>
      </td>
      <td className="py-3 px-4 text-gray-300">
        {data.volume.toLocaleString()} tons
      </td>
      <td className="py-3 px-4">
        <Badge 
          className={`${
            data.prediction === 'bullish' 
              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
              : data.prediction === 'bearish'
              ? 'bg-red-500/20 text-red-300 border-red-500/30'
              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
          }`}
        >
          {data.prediction}
        </Badge>
      </td>
    </motion.tr>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{t('marketplace.marketAnalytics')}</h2>
          <p className="text-gray-300">{t('marketplace.analyticsDescription')}</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '1y'].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
              className="border-white/20"
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} index={index} />
        ))}
      </div>

      {/* Price Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {t('marketplace.priceAnalysis')}
            </h3>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Crop</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Current Price</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">24h Change</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Volume</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {priceData.map((data, index) => (
                  <PriceRow key={data.crop} data={data} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {t('marketplace.marketTrends')}
          </h3>
          <div className="h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-gray-300">Interactive charts coming soon</p>
              <p className="text-gray-400 text-sm">Real-time market visualization</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
