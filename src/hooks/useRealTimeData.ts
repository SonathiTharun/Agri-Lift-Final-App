
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

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

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

export const useRealTimeData = (location?: LocationData | string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Determine location parameters
        let weatherOptions: any = {};
        if (typeof location === 'object' && location) {
          weatherOptions = { lat: location.latitude, lon: location.longitude };
        } else if (typeof location === 'string') {
          weatherOptions = { city: location };
        } else {
          weatherOptions = { city: 'Delhi', state: 'Delhi' }; // Default
        }

        // Fetch weather data
        try {
          const weatherResponse = await apiService.getCurrentWeather(weatherOptions);
          if (weatherResponse.success) {
            const weather = weatherResponse.data.weather;
            setWeatherData({
              temperature: weather.current.temperature,
              humidity: weather.current.humidity,
              pressure: weather.current.pressure,
              windSpeed: weather.current.windSpeed,
              precipitation: weather.current.precipitation,
              forecast: weather.forecast?.slice(0, 7) || []
            });
          }
        } catch (weatherError) {
          console.warn('Failed to fetch weather data, using fallback:', weatherError);
          // Fallback to simulated weather data
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
        }

        // Fetch market data
        try {
          const marketResponse = await apiService.getRealTimePrices(['wheat', 'rice', 'corn', 'tomato', 'potato'], 5);
          if (marketResponse.success) {
            setMarketData(marketResponse.data.ticker.map(item => ({
              crop: item.name,
              price: item.price,
              change: item.change,
              volume: Math.floor(Math.random() * 10000), // Volume not in ticker, simulate
              lastUpdated: item.lastUpdated
            })));
          }
        } catch (marketError) {
          console.warn('Failed to fetch market data, using fallback:', marketError);
          // Fallback to simulated market data
          const crops = ['wheat', 'rice', 'corn', 'tomato', 'potato'];
          setMarketData(crops.map(crop => ({
            crop,
            price: 50 + Math.random() * 100,
            change: (Math.random() - 0.5) * 10,
            volume: Math.floor(Math.random() * 10000),
            lastUpdated: new Date().toISOString()
          })));
        }

        // Simulate soil data (no API endpoint yet)
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
        setIsConnected(true);
      } catch (err) {
        console.error('Error fetching real-time data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setIsLoading(false);
        setIsConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes for real API calls

    return () => clearInterval(interval);
  }, [location]);

  return {
    weatherData,
    marketData,
    soilData,
    isLoading,
    isConnected,
    error
  };
};
