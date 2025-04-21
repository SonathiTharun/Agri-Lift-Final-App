
import React from "react";
import { CloudSun, MapPin } from "lucide-react";

type Props = {
  country: string;
};

const countryWeatherPresets: Record<string, {
  temp: string;
  desc: string;
  icon: React.ReactNode;
  city: string;
}> = {
  "India": {
    temp: "31°C",
    desc: "Mostly Sunny",
    icon: <CloudSun className="w-10 h-10 text-sky-400" />,
    city: "New Delhi",
  },
  "United States": {
    temp: "21°C",
    desc: "Cloudy",
    icon: <CloudSun className="w-10 h-10 text-gray-400" />,
    city: "Washington",
  },
  "Brazil": {
    temp: "28°C",
    desc: "Partly Cloudy",
    icon: <CloudSun className="w-10 h-10 text-yellow-400" />,
    city: "Brasília",
  },
};

export default function WeatherCard({ country }: Props) {
  const weather = countryWeatherPresets[country] || countryWeatherPresets["India"];
  return (
    <div className="bg-white/80 shadow-md rounded-lg p-5 flex items-center gap-5 min-w-[270px]">
      <div>{weather.icon}</div>
      <div>
        <div className="text-xl font-bold text-soil-dark leading-tight">{weather.temp}</div>
        <div className="text-sm text-gray-700">{weather.desc}</div>
        <div className="flex items-center gap-1 text-xs text-foliage-dark mt-1">
          <MapPin className="w-3 h-3" /> {weather.city}, {country}
        </div>
      </div>
    </div>
  );
}
