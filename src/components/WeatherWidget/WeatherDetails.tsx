
import React from "react";
import { AirVent, Moon, Droplet, Wind, Calendar, CloudSun } from "lucide-react";

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
};
export function WeatherDetails({
  weather,
  forecast,
  history,
  moonInfo,
  timeOfDay,
  location,
}: Props) {
  if (!weather) {
    return (
      <div className="h-32 flex items-center justify-center">
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
    <div className="">
      <div className="text-xs text-gray-600 mb-1 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <CloudSun className="h-3 w-3" />
          <span>{location}</span>
        </div>
        <span className="text-[10px] opacity-70">Updated: {new Date().toLocaleTimeString()}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 pb-2">
        {/* Core metrics */}
        <div className="rounded bg-gray-50 p-2">
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs font-bold">{weather.temp}°C</span>
            <span className="text-xs">{weather.condition}</span>
            <div className="flex gap-2 mt-1">
              <Droplet className="h-3 w-3 text-sky-600" />
              <span className="text-xs">{weather.humidity}%</span>
              <Wind className="h-3 w-3 text-sky-700" />
              <span className="text-xs">{weather.wind} km/h</span>
            </div>
          </div>
        </div>
        <div className="rounded bg-gray-50 p-2">
          <span className="text-[10px] uppercase text-gray-600">Moon</span>
          <div className="flex gap-2 items-center">
            <Moon className="h-4 w-4" />
            <span className="text-xs">{moonInfo.phase}</span>
          </div>
          <span className="block text-xs text-gray-600">Rise: {moonInfo.rise} | Set: {moonInfo.set}</span>
        </div>
        <div className="rounded bg-gray-50 p-2">
          <span className="text-[10px] uppercase text-gray-600">Air Quality</span>
          <div className="flex items-center gap-2">
            <AirVent className="h-4 w-4" />
            <span className={`text-xs ${getStatusClass(weather.aqi, "aqi")}`}>{weather.aqi} AQI</span>
          </div>
        </div>
        <div className="rounded bg-gray-50 p-2">
          <div className="text-[10px] uppercase text-gray-600">Pollen</div>
          <span className={`text-xs ${getStatusClass(weather.pollen, "pollen")}`}>{weather.pollen}</span>
        </div>
        <div className="rounded bg-gray-50 p-2">
          <span className="text-[10px] uppercase text-gray-600">Field Work</span>
          <span className={`text-xs ${getStatusClass(weather.drivingDifficulty, "difficulty")}`}>
            {weather.drivingDifficulty}
          </span>
        </div>
      </div>
      {/* Forecast/History */}
      <div className="mt-1">
        <span className="text-xs font-semibold block pb-1">Next 7 Days</span>
        <div className="flex gap-1 overflow-x-auto">
          {forecast.map((day, i) => (
            <div key={i} className="min-w-[60px] rounded bg-foliage-light/40 p-1 text-center text-xs flex flex-col items-center">
              <Calendar className="h-3 w-3 m-auto text-gray-400 mb-0.5" />
              <span className="">{day.date.split('/')[1]}/{day.date.split('/')[0]}</span>
              <span>{day.temp}°C</span>
              <span>{day.condition.substring(0, 4)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2">
        <span className="text-xs font-semibold block pb-1">Past 7 Days</span>
        <div className="flex gap-1 overflow-x-auto">
          {history.map((day, i) => (
            <div key={i} className="min-w-[60px] rounded bg-sky-light/30 p-1 text-center text-xs flex flex-col items-center">
              <Calendar className="h-3 w-3 m-auto text-gray-400 mb-0.5" />
              <span className="">{day.date.split('/')[1]}/{day.date.split('/')[0]}</span>
              <span>{day.temp}°C</span>
              <span>{day.condition.substring(0, 4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
