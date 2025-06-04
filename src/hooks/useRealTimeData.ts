
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  precipitation: number;
  forecast: Array<{
    date: string;
    temperature: { min: number; max: number };
    condition: string;
    precipitation: number;
  }>;
}

interface MarketData {
  crop: string;
  price: number;
  change: number;
  volume: number;
  lastUpdated: string;
}

interface SoilData {
  moisture: number;
  temperature: number;
  ph: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

export const useRealTimeData = (location: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket({
    url: `wss://api.agrilift.com/realtime/${location}`,
    onMessage: (data) => {
      switch (data.type) {
        case 'weather':
          setWeatherData(data.payload);
          break;
        case 'market':
          setMarketData(data.payload);
          break;
        case 'soil':
          setSoilData(data.payload);
          break;
      }
    },
    autoReconnect: true
  });

  // Simulate real-time data updates
  useEffect(() => {
    const updateData = () => {
      // Simulate weather data
      setWeatherData({
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        pressure: 1010 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 10,
        precipitation: Math.random() * 5,
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
          temperature: { min: 20 + Math.random() * 5, max: 30 + Math.random() * 10 },
          condition: ['sunny', 'cloudy', 'rainy', 'stormy'][Math.floor(Math.random() * 4)],
          precipitation: Math.random() * 10
        }))
      });

      // Simulate market data
      const crops = ['wheat', 'rice', 'corn', 'tomato', 'potato'];
      setMarketData(crops.map(crop => ({
        crop,
        price: 50 + Math.random() * 100,
        change: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 10000),
        lastUpdated: new Date().toISOString()
      })));

      // Simulate soil data
      setSoilData({
        moisture: 40 + Math.random() * 30,
        temperature: 20 + Math.random() * 15,
        ph: 6 + Math.random() * 2,
        nutrients: {
          nitrogen: 20 + Math.random() * 30,
          phosphorus: 15 + Math.random() * 20,
          potassium: 25 + Math.random() * 25
        }
      });

      setIsLoading(false);
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [location]);

  return {
    weatherData,
    marketData,
    soilData,
    isLoading,
    isConnected
  };
};
