
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedWeatherIcon } from "./WeatherWidget/AnimatedWeatherIcon";
import { WeatherDetails } from "./WeatherWidget/WeatherDetails";

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

function getTimeOfDay(): "day" | "afternoon" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "day";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

export function WeatherWidget() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [weather, setWeather] = useState<WeatherDay | null>(null);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [history, setHistory] = useState<WeatherDay[]>([]);
  const [moonInfo, setMoonInfo] = useState<MoonInfo>({ rise: "5:42 AM", set: "7:18 PM", phase: "Waxing Crescent" });
  const [expanded, setExpanded] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  // Simulate API response with extra fields for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      // Current weather (simulate more realistic changes here)
      const hour = new Date().getHours();
      let icon = "sun";
      let cond = "Sunny";
      if (hour >= 18 || hour < 5) { icon = "moon"; cond = "Night"; }
      else if (hour >= 15 && hour < 18) { icon = "sun"; cond = "Sunny"; }
      else if (hour >= 12 && hour < 15) { icon = "cloud-sun"; cond = "Partly Cloudy"; }
      else if (hour >= 8 && hour < 12) { icon = "cloud"; cond = "Cloudy"; }
      if (hour >= 1 && hour < 6) { icon = "cloud-moon"; cond = "Night"; }
      // You can simulate rainy conditions randomly:
      if (Math.random() > 0.7) { cond = "Rain"; icon = "cloud-rain"; }

      setWeather({
        date: new Date().toLocaleDateString(),
        temp: Math.floor(Math.random() * 10) + 25,
        condition: cond,
        icon,
        humidity: Math.floor(Math.random() * 30) + 40,
        wind: Math.floor(Math.random() * 15) + 5,
        aqi: Math.floor(Math.random() * 50) + 20,
        pollen: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
        drivingDifficulty: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)]
      });

      // Generate forecast data
      const forecastData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        const conds = ["Sunny", "Partly Cloudy", "Rain", "Cloudy", "Thunderstorm"];
        const randomIndex = Math.floor(Math.random() * conds.length);
        return {
          date: date.toLocaleDateString(),
          temp: Math.floor(Math.random() * 10) + 25,
          condition: conds[randomIndex],
          icon: conds[randomIndex] === "Rain" ? "cloud-rain" : conds[randomIndex] === "Sunny" ? "sun" : conds[randomIndex] === "Cloudy" ? "cloud" : conds[randomIndex] === "Partly Cloudy" ? "cloud-sun" : "cloud-lightning",
          humidity: Math.floor(Math.random() * 30) + 40,
          wind: Math.floor(Math.random() * 15) + 5,
          aqi: Math.floor(Math.random() * 50) + 20,
          pollen: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
          drivingDifficulty: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)]
        };
      });
      setForecast(forecastData);

      // Generate historical data
      const historyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (i + 1));
        const conds = ["Sunny", "Partly Cloudy", "Rain", "Cloudy", "Thunderstorm"];
        const randomIndex = Math.floor(Math.random() * conds.length);
        return {
          date: date.toLocaleDateString(),
          temp: Math.floor(Math.random() * 10) + 25,
          condition: conds[randomIndex],
          icon: conds[randomIndex] === "Rain" ? "cloud-rain" : conds[randomIndex] === "Sunny" ? "sun" : conds[randomIndex] === "Cloudy" ? "cloud" : conds[randomIndex] === "Partly Cloudy" ? "cloud-sun" : "cloud-lightning",
          humidity: Math.floor(Math.random() * 30) + 40,
          wind: Math.floor(Math.random() * 15) + 5,
          aqi: Math.floor(Math.random() * 50) + 20,
          pollen: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
          drivingDifficulty: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)]
        };
      });
      setHistory(historyData);

      // Simulate moon info, ideally from API
      setMoonInfo({
        rise: ["5:42 AM", "6:00 AM", "6:11 AM"][Math.floor(Math.random() * 3)],
        set: ["7:18 PM", "7:33 PM", "7:47 PM"][Math.floor(Math.random() * 3)],
        phase: ["Waxing Crescent", "First Quarter", "Full Moon"][Math.floor(Math.random() * 3)]
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Time of day handling for UI gradient/animation
  useEffect(() => {
    const intv = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(intv);
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
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startPos]);

  return (
    <div
      className={`absolute z-40 animate-fade-in shadow-lg select-none`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`bg-white/90 backdrop-blur-sm border border-sky-light rounded-lg transition-all duration-300
          ${expanded ? "w-[340px] h-auto" : "w-56 p-0"}
        `}
        onClick={() => !isDragging && setExpanded((v) => !v)}
      >
        <div className={`p-2 flex items-center justify-between ${expanded
            ? "bg-gradient-to-r from-sky-dark to-sky text-white text-xs"
            : "bg-gradient-to-r from-sky to-foliage-light text-foliage-dark text-xs"} rounded-t-md`}>
          <div className="font-medium tracking-wide">Weather</div>
          <div className="text-[10px] opacity-80">{expanded ? "Click to collapse" : "Click to expand"}</div>
        </div>
        <CardContent className={`${expanded ? "p-3 animate-fade-in" : "p-2"}`}>
          <div className={`flex flex-col justify-center items-center transition-all`}>
            {/* Animated weather icon, always shown */}
            <AnimatedWeatherIcon
              condition={weather?.condition || "Sunny"}
              timeOfDay={timeOfDay}
            />
            {/* Show summary, always */}
            <div className="my-1 text-center">
              <div className="font-semibold text-xl">
                {weather ? `${weather.temp}°C` : "..."}
              </div>
              <div className="text-xs text-gray-600">
                {weather?.condition || "Loading..."}
              </div>
            </div>
          </div>
          {expanded && (
            <div className="pt-2 animate-fade-in">
              <WeatherDetails
                weather={weather}
                forecast={forecast}
                history={history}
                moonInfo={moonInfo}
                timeOfDay={timeOfDay}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
