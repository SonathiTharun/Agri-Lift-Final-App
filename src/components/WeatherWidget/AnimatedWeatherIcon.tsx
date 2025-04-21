
import React from "react";

type WeatherIconProps = {
  condition: string;
  timeOfDay: "day" | "afternoon" | "night";
};

export function AnimatedWeatherIcon({ condition, timeOfDay }: WeatherIconProps) {
  // Set background gradient and icon based on time of day and condition
  let bgGradient = "";
  let iconSvg = null;
  switch (timeOfDay) {
    case "night":
      bgGradient = "bg-gradient-to-b from-[#0f2027] to-[#2c5364]";
      break;
    case "afternoon":
      bgGradient = "bg-gradient-to-b from-[#fbc2eb] to-[#a6c1ee]";
      break;
    default:
      bgGradient = "bg-gradient-to-b from-[#89f7fe] to-[#66a6ff]";
  }

  if (condition === "Rain" || condition === "Showers") {
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <ellipse cx="32" cy="37" rx="20" ry="12" fill="#90caf9" className="animate-pulse" />
        <g>
          <line x1="22" y1="48" x2="22" y2="55" stroke="#0ea5e9" strokeWidth="3" className="animate-[slide-in-right_0.7s_infinite_alternate]" />
          <line x1="32" y1="50" x2="32" y2="59" stroke="#0ea5e9" strokeWidth="3" className="animate-[slide-in-right_0.6s_infinite_alternate]" />
          <line x1="42" y1="48" x2="42" y2="55" stroke="#0ea5e9" strokeWidth="3" className="animate-[slide-in-right_0.8s_infinite_alternate]" />
        </g>
      </svg>
    );
  } else if (condition === "Cloudy" || condition === "Partly Cloudy") {
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <ellipse cx="32" cy="36" rx="20" ry="10" fill="#b0bec5" />
        <ellipse cx="42" cy="32" rx="10" ry="7" fill="#eceff1" className="animate-pulse" />
      </svg>
    );
  } else if (condition === "Thunderstorm") {
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <ellipse cx="32" cy="37" rx="20" ry="12" fill="#b3b3b3" />
        <polygon points="28,44 36,44 30,56 39,50 30,50" fill="#ffd700" className="animate-bounce" />
      </svg>
    );
  } else if (condition === "Night") {
    iconSvg = (
      <svg className="w-11 h-11" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="13" fill="#fde68a" opacity="0.7" />
        <circle cx="40" cy="28" r="11" fill="#22223b" />
      </svg>
    );
  } else {
    // Default: Sunny
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="13" fill="#fde047" className="animate-pulse" />
        {[...Array(8)].map((_, i) => (
          <rect
            key={i}
            x="30"
            y="7"
            width="4"
            height="12"
            fill="#fde047"
            rx="2"
            className={`origin-center rotate-${i * 45}`}
            style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: "32px 32px" }}
          />
        ))}
      </svg>
    );
  }

  return (
    <div className={`rounded-lg flex items-center justify-center w-16 h-16 ${bgGradient} transition-all`}>
      {iconSvg}
    </div>
  );
}
