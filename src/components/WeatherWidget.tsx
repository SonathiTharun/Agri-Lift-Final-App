import { useState, useEffect } from "react";
import axios from "axios";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
  };
}

// ADD sunrise info (static for demo)
const sunriseTime = "5:42 AM";

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=auto:ip`
        );
        setWeather(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Could not fetch weather data");
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <aside className="fixed bottom-4 right-4 z-50 bg-white/90 shadow-lg rounded-lg px-5 py-4 max-w-xs min-w-[255px] border">
        Loading weather...
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="fixed bottom-4 right-4 z-50 bg-white/90 shadow-lg rounded-lg px-5 py-4 max-w-xs min-w-[255px] border">
        Error: {error}
      </aside>
    );
  }

  return (
    <aside className="fixed bottom-4 right-4 z-50 bg-white/90 shadow-lg rounded-lg px-5 py-4 max-w-xs min-w-[255px] border">
      {weather && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold">{weather.location.name}, {weather.location.region}</h2>
              <p className="text-sm text-gray-600">{weather.location.country}</p>
            </div>
            <img src={weather.current.condition.icon} alt={weather.current.condition.text} className="w-12 h-12" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">{weather.current.temp_c}°C</span>
            <span className="text-sm">{weather.current.condition.text}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-600 font-medium">Wind:</span>
            <span className="text-xs text-foliage-dark">{weather.current.wind_kph} km/h</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-600 font-medium">Humidity:</span>
            <span className="text-xs text-foliage-dark">{weather.current.humidity}%</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-gray-600 font-medium">Sunrise:</span>
            <span className="text-xs text-foliage-dark">{sunriseTime}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
