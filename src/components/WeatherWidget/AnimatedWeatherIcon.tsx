
import React from "react";

type WeatherIconProps = {
  condition: string;
  timeOfDay: "day" | "afternoon" | "night";
};

export function AnimatedWeatherIcon({ condition, timeOfDay }: WeatherIconProps) {
  // Set background gradient and icon based on time of day and condition
  let bgGradient = "";
  let iconSvg = null;
  
  // Enhanced time of day gradients
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

  // More detailed and accurate weather icons with enhanced animations
  if (condition === "Rain" || condition === "Showers" || condition === "Light Rain") {
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
  } else if (condition === "Heavy Rain" || condition === "Thunderstorm with Rain") {
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <ellipse cx="32" cy="37" rx="20" ry="12" fill="#64748b" className="animate-pulse" />
        <g>
          <line x1="18" y1="48" x2="18" y2="58" stroke="#0ea5e9" strokeWidth="4" className="animate-[slide-in-right_0.5s_infinite_alternate]" />
          <line x1="26" y1="46" x2="26" y2="57" stroke="#0ea5e9" strokeWidth="4" className="animate-[slide-in-right_0.45s_infinite_alternate]" />
          <line x1="34" y1="44" x2="34" y2="56" stroke="#0ea5e9" strokeWidth="4" className="animate-[slide-in-right_0.55s_infinite_alternate]" />
          <line x1="42" y1="46" x2="42" y2="58" stroke="#0ea5e9" strokeWidth="4" className="animate-[slide-in-right_0.5s_infinite_alternate]" />
        </g>
      </svg>
    );
  } else if (condition === "Cloudy" || condition === "Partly Cloudy" || condition === "Overcast") {
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <ellipse cx="32" cy="36" rx="20" ry="10" fill="#b0bec5" />
        <ellipse cx="42" cy="32" rx="10" ry="7" fill="#eceff1" className="animate-pulse" />
        <ellipse cx="20" cy="34" rx="8" ry="5" fill="#cfd8dc" className="animate-[fade-in_2s_infinite_alternate]" />
      </svg>
    );
  } else if (condition === "Thunderstorm" || condition === "Lightning") {
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <ellipse cx="32" cy="37" rx="20" ry="12" fill="#b3b3b3" />
        <polygon points="28,44 36,44 30,56 39,50 30,50" fill="#ffd700" className="animate-bounce" />
        <polygon points="35,38 43,38 37,48 46,42 37,42" fill="#ffd700" className="animate-bounce" style={{animationDelay: "0.3s"}} />
      </svg>
    );
  } else if (condition === "Foggy" || condition === "Mist" || condition === "Haze") {
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <rect x="10" y="30" width="44" height="3" rx="1.5" fill="#e2e8f0" className="animate-[fade-in_1.5s_infinite_alternate]" />
        <rect x="14" y="36" width="36" height="3" rx="1.5" fill="#e2e8f0" className="animate-[fade-in_2s_infinite_alternate]" style={{animationDelay: "0.3s"}} />
        <rect x="18" y="42" width="28" height="3" rx="1.5" fill="#e2e8f0" className="animate-[fade-in_1.8s_infinite_alternate]" style={{animationDelay: "0.6s"}} />
      </svg>
    );
  } else if (condition === "Night" || condition === "Clear Night") {
    iconSvg = (
      <svg className="w-11 h-11" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="13" fill="#fde68a" opacity="0.7" />
        <circle cx="40" cy="28" r="11" fill="#22223b" />
        <circle cx="24" cy="20" r="1" fill="#f8fafc" className="animate-pulse" />
        <circle cx="45" cy="35" r="1" fill="#f8fafc" className="animate-pulse" style={{animationDelay: "0.5s"}} />
        <circle cx="36" cy="15" r="1" fill="#f8fafc" className="animate-pulse" style={{animationDelay: "1s"}} />
      </svg>
    );
  } else if (condition === "Snow" || condition === "Light Snow") {
    iconSvg = (
      <svg className="w-11 h-11 animate-float" viewBox="0 0 64 64">
        <ellipse cx="32" cy="37" rx="20" ry="12" fill="#b0bec5" className="animate-pulse" />
        <g>
          <circle cx="22" y="48" r="2" fill="#f8fafc" className="animate-[slide-in-right_1.7s_infinite_alternate]" />
          <circle cx="32" y="50" r="2" fill="#f8fafc" className="animate-[slide-in-right_1.9s_infinite_alternate]" />
          <circle cx="42" y="48" r="2" fill="#f8fafc" className="animate-[slide-in-right_2.1s_infinite_alternate]" />
          <circle cx="27" y="52" r="2" fill="#f8fafc" className="animate-[slide-in-right_1.8s_infinite_alternate]" />
          <circle cx="37" y="54" r="2" fill="#f8fafc" className="animate-[slide-in-right_2s_infinite_alternate]" />
        </g>
      </svg>
    );
  } else {
    // Default: Sunny or Clear
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
