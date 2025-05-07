
import React from "react";
import { AirVent, Moon, Droplet, Wind, Calendar, CloudSun } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

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

type Props = {
  weather: WeatherDay | null;
  forecast: WeatherDay[];
  history: WeatherDay[];
  moonInfo: MoonInfo;
  timeOfDay: "day" | "afternoon" | "night";
  location: string;
  isLoading?: boolean;
  sunrise?: string;
  activeTab: string;
};

export function WeatherDetails({
  weather,
  forecast,
  history,
  moonInfo,
  timeOfDay,
  location,
  isLoading = false,
  sunrise,
  activeTab,
}: Props) {
  if (isLoading || !weather) {
    return (
      <div className="h-20 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading weather data...</div>
      </div>
    );
  }

  const getStatusClass = (value: any, type: "aqi" | "pollen" | "difficulty") => {
    if (type === "aqi") {
      if (value <= 50) return "text-status-optimal";
      if (value <= 100) return "text-status-warning";
      return "text-status-danger";
    }
    if (type === "pollen") {
      if (value === "Low") return "text-status-optimal";
      if (value === "Moderate") return "text-status-warning";
      return "text-status-danger";
    }
    if (type === "difficulty") {
      if (value === "Low") return "text-status-optimal";
      if (value === "Moderate") return "text-status-warning";
      return "text-status-danger";
    }
    return "";
  };

  return (
    <div className="mt-0">
      <TabsContent value="details" className="p-0">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="rounded bg-gray-50 p-1">
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase text-gray-500">Humidity</span>
              <div className="flex gap-1 items-center">
                <Droplet className="h-3 w-3 text-sky-600" />
                <span>{weather.humidity}%</span>
              </div>
            </div>
          </div>
          <div className="rounded bg-gray-50 p-1">
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase text-gray-500">Wind</span>
              <div className="flex gap-1 items-center">
                <Wind className="h-3 w-3 text-sky-700" />
                <span>{weather.wind} km/h</span>
              </div>
            </div>
          </div>
          <div className="rounded bg-gray-50 p-1">
            <span className="text-[10px] uppercase text-gray-500">Air Quality</span>
            <div className="flex items-center gap-1">
              <AirVent className="h-3 w-3" />
              <span className={`${getStatusClass(weather.aqi, "aqi")}`}>{weather.aqi} AQI</span>
            </div>
          </div>
          <div className="rounded bg-gray-50 p-1">
            <div className="text-[10px] uppercase text-gray-500">Pollen</div>
            <span className={`${getStatusClass(weather.pollen, "pollen")}`}>{weather.pollen}</span>
          </div>
          <div className="rounded bg-gray-50 p-1 col-span-2">
            <span className="text-[10px] uppercase text-gray-500">Moon</span>
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <Moon className="h-3 w-3" />
                <span>{moonInfo.phase}</span>
              </div>
              <span className="text-[10px] text-gray-500">
                {moonInfo.rise} - {moonInfo.set}
              </span>
            </div>
          </div>
          <div className="rounded bg-gray-50 p-1 col-span-2">
            <span className="text-[10px] uppercase text-gray-500">Field Work</span>
            <span className={`block ${getStatusClass(weather.drivingDifficulty, "difficulty")}`}>
              {weather.drivingDifficulty} Difficulty
            </span>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="forecast" className="p-0">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {forecast.map((day, i) => (
            <div key={i} className="min-w-[60px] rounded bg-foliage-light/40 p-1 text-center text-xs flex flex-col items-center">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>{day.date.split('/')[1]}/{day.date.split('/')[0]}</span>
              <span>{day.temp}°C</span>
              <span>{day.condition.substring(0, 4)}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="history" className="p-0">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {history.map((day, i) => (
            <div key={i} className="min-w-[60px] rounded bg-sky-light/30 p-1 text-center text-xs flex flex-col items-center">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>{day.date.split('/')[1]}/{day.date.split('/')[0]}</span>
              <span>{day.temp}°C</span>
              <span>{day.condition.substring(0, 4)}</span>
            </div>
          ))}
        </div>
      </TabsContent>
    </div>
  );
}
