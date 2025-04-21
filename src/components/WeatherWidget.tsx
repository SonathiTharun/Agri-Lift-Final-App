
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Thermometer,
  Droplet,
  Wind,
  Sun,
  CloudRain,
  CloudMoon,
  Moon,
  CloudSun,
  Umbrella,
  AirVent,
  Calendar
} from "lucide-react";

// Weather data types
type WeatherDay = {
  date: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  aqi: number;
  pollen: string;
  drivingDifficulty: string;
};

type MoonInfo = {
  rise: string;
  set: string;
  phase: string;
};

export function WeatherWidget() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [weather, setWeather] = useState<WeatherDay | null>(null);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [history, setHistory] = useState<WeatherDay[]>([]);
  const [moonInfo, setMoonInfo] = useState<MoonInfo>({ rise: "5:42 AM", set: "7:18 PM", phase: "Waxing Crescent" });
  const [activeTab, setActiveTab] = useState("current");

  // Mock API response for demonstration
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      // Current weather
      setWeather({
        date: new Date().toLocaleDateString(),
        temp: 28,
        condition: "Sunny",
        icon: "sun",
        humidity: 45,
        wind: 12,
        aqi: 32, // Good AQI value
        pollen: "Moderate",
        drivingDifficulty: "Low"
      });

      // Generate forecast data
      const forecastData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        const conditions = ["Sunny", "Partly Cloudy", "Rain", "Cloudy", "Thunderstorm"];
        const icons = ["sun", "cloud-sun", "cloud-rain", "cloud", "cloud-lightning"];
        const randomIndex = Math.floor(Math.random() * conditions.length);
        
        return {
          date: date.toLocaleDateString(),
          temp: Math.floor(Math.random() * 10) + 25, // 25-35°C
          condition: conditions[randomIndex],
          icon: icons[randomIndex],
          humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
          wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
          aqi: Math.floor(Math.random() * 50) + 20, // 20-70 AQI
          pollen: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
          drivingDifficulty: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)]
        };
      });
      setForecast(forecastData);

      // Generate historical data
      const historyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (i + 1));
        const conditions = ["Sunny", "Partly Cloudy", "Rain", "Cloudy", "Thunderstorm"];
        const icons = ["sun", "cloud-sun", "cloud-rain", "cloud", "cloud-lightning"];
        const randomIndex = Math.floor(Math.random() * conditions.length);
        
        return {
          date: date.toLocaleDateString(),
          temp: Math.floor(Math.random() * 10) + 25, // 25-35°C
          condition: conditions[randomIndex],
          icon: icons[randomIndex],
          humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
          wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
          aqi: Math.floor(Math.random() * 50) + 20, // 20-70 AQI
          pollen: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
          drivingDifficulty: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)]
        };
      });
      setHistory(historyData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - startPos.x,
          y: e.clientY - startPos.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startPos]);

  // Function to get the appropriate icon component
  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case "sun": return <Sun className="h-6 w-6 text-wheat-dark" />;
      case "cloud-sun": return <CloudSun className="h-6 w-6 text-sky" />;
      case "cloud-rain": return <CloudRain className="h-6 w-6 text-sky" />;
      case "cloud-moon": return <CloudMoon className="h-6 w-6 text-sky-dark" />;
      default: return <Sun className="h-6 w-6 text-wheat-dark" />;
    }
  };

  // Function to determine AQI status class
  const getAqiStatusClass = (aqi: number) => {
    if (aqi <= 50) return "text-status-optimal";
    if (aqi <= 100) return "text-status-warning";
    return "text-status-danger";
  };

  // Function to determine pollen status class
  const getPollenStatusClass = (level: string) => {
    if (level === "Low") return "text-status-optimal";
    if (level === "Moderate") return "text-status-warning";
    return "text-status-danger";
  };

  return (
    <div
      className="absolute z-40 animate-fade-in shadow-lg"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className="w-[300px] bg-white/90 backdrop-blur-sm border border-sky-light">
        <div className="bg-gradient-to-r from-sky-dark to-sky p-2 text-white text-xs flex justify-between items-center">
          <div className="font-medium">Weather Insights</div>
          <div className="text-[10px] opacity-80">Drag to move</div>
        </div>
        
        <CardContent className="p-3">
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-3">
              {weather ? (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(weather.icon)}
                      <div>
                        <div className="font-bold text-xl">{weather.temp}°C</div>
                        <div className="text-xs text-gray-600">{weather.condition}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-xs text-gray-600">
                        <Droplet className="h-3 w-3" />
                        <span>{weather.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 text-xs text-gray-600">
                        <Wind className="h-3 w-3" />
                        <span>{weather.wind} km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <div className="bg-gray-50 p-2 rounded-md">
                      <div className="text-[10px] uppercase text-gray-500 font-medium">Air Quality</div>
                      <div className="flex items-center gap-1">
                        <AirVent className="h-4 w-4" />
                        <span className={`font-medium ${getAqiStatusClass(weather.aqi)}`}>
                          {weather.aqi} AQI
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded-md">
                      <div className="text-[10px] uppercase text-gray-500 font-medium">Pollen</div>
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${getPollenStatusClass(weather.pollen)}`}>
                          {weather.pollen}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-[10px] uppercase text-gray-500 font-medium">Moon Phase</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Moon className="h-4 w-4" />
                        <span className="text-sm">{moonInfo.phase}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>Rise: {moonInfo.rise}</div>
                        <div>Set: {moonInfo.set}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-[10px] uppercase text-gray-500 font-medium">Field Work</div>
                    <div className="flex items-center gap-1">
                      <span className={`font-medium ${getPollenStatusClass(weather.drivingDifficulty === "Low" ? "Low" : weather.drivingDifficulty === "Moderate" ? "Moderate" : "High")}`}>
                        {weather.drivingDifficulty} difficulty
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Loading weather data...</div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="forecast">
              <div className="max-h-[280px] overflow-y-auto pr-1">
                {forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center justify-center w-8">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-[10px] text-gray-500">{day.date.split('/')[1]}/{day.date.split('/')[0]}</span>
                      </div>
                      {getWeatherIcon(day.icon)}
                      <div>
                        <div className="font-medium">{day.temp}°C</div>
                        <div className="text-xs text-gray-600">{day.condition}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Droplet className="h-3 w-3" />
                        <span>{day.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="h-3 w-3" />
                        <span>{day.wind} km/h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="max-h-[280px] overflow-y-auto pr-1">
                {history.map((day, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-center justify-center w-8">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-[10px] text-gray-500">{day.date.split('/')[1]}/{day.date.split('/')[0]}</span>
                      </div>
                      {getWeatherIcon(day.icon)}
                      <div>
                        <div className="font-medium">{day.temp}°C</div>
                        <div className="text-xs text-gray-600">{day.condition}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Droplet className="h-3 w-3" />
                        <span>{day.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="h-3 w-3" />
                        <span>{day.wind} km/h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
