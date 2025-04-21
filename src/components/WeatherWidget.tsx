import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedWeatherIcon } from "./WeatherWidget/AnimatedWeatherIcon";
import { WeatherDetails } from "./WeatherWidget/WeatherDetails";
import { toast } from "@/components/ui/use-toast";

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
  const [location, setLocation] = useState("Loading location...");
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lon: longitude });
          
          // Fetch location name
          fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=DEMO_KEY`)
            .then(res => {
              // Since we're using a demo key, we'll simulate the response
              setLocation("Delhi, India");
            })
            .catch(() => {
              setLocation("Location unavailable");
            });
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Using default weather data",
          });
          setLocation("Delhi, India");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  // Generate realistic weather data based on location and time
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate realistic seasons and weather patterns
      const month = new Date().getMonth(); // 0-11
      const hour = new Date().getHours();
      
      // Determine seasonal temperature ranges
      let baseTemp = 25; // default base temp
      let tempVariation = 5;
      
      // Seasonal adjustments
      if (month >= 11 || month <= 1) { // Winter (Dec-Feb)
        baseTemp = 15;
        tempVariation = 8;
      } else if (month >= 2 && month <= 4) { // Spring (Mar-May)
        baseTemp = 22;
        tempVariation = 7;
      } else if (month >= 5 && month <= 8) { // Summer (Jun-Sep)
        baseTemp = 32;
        tempVariation = 6;
      } else { // Fall (Oct-Nov)
        baseTemp = 24;
        tempVariation = 7;
      }
      
      // Diurnal temperature variations
      if (hour >= 0 && hour < 6) baseTemp -= 3; // Early morning
      else if (hour >= 6 && hour < 12) baseTemp += 1; // Morning
      else if (hour >= 12 && hour < 18) baseTemp += 4; // Afternoon
      else baseTemp -= 1; // Evening
      
      // Determine appropriate weather conditions based on season and randomness
      const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rain", "Thunderstorm"];
      const seasonalProbabilities = {
        winter: [0.4, 0.3, 0.2, 0.1, 0.0], // Higher chance of clear in winter
        spring: [0.3, 0.3, 0.2, 0.15, 0.05], 
        summer: [0.2, 0.3, 0.2, 0.2, 0.1], // Higher chance of storms in summer
        fall: [0.3, 0.3, 0.2, 0.15, 0.05]
      };
      
      // Select probabilities based on current season
      let probs;
      if (month >= 11 || month <= 1) probs = seasonalProbabilities.winter;
      else if (month >= 2 && month <= 4) probs = seasonalProbabilities.spring;
      else if (month >= 5 && month <= 8) probs = seasonalProbabilities.summer;
      else probs = seasonalProbabilities.fall;
      
      // Weighted selection of condition
      const rand = Math.random();
      let cumulativeProb = 0;
      let conditionIndex = 0;
      
      for (let i = 0; i < probs.length; i++) {
        cumulativeProb += probs[i];
        if (rand <= cumulativeProb) {
          conditionIndex = i;
          break;
        }
      }
      
      const condition = conditions[conditionIndex];
      let icon = "";
      
      // Set icon based on condition and time
      if (hour >= 18 || hour < 6) {
        icon = "moon";
        if (condition === "Partly Cloudy") icon = "cloud-moon";
      } else {
        if (condition === "Sunny") icon = "sun";
        else if (condition === "Partly Cloudy") icon = "cloud-sun";
        else if (condition === "Cloudy") icon = "cloud";
        else if (condition === "Rain") icon = "cloud-rain";
        else if (condition === "Thunderstorm") icon = "cloud-lightning";
      }
      
      // Calculate temperature with some randomness
      const temp = Math.round(baseTemp + (Math.random() * 2 - 1) * tempVariation);
      
      // More realistic humidity based on conditions
      let humidity = 50;
      if (condition === "Rain" || condition === "Thunderstorm") humidity = 70 + Math.floor(Math.random() * 20);
      else if (condition === "Cloudy") humidity = 60 + Math.floor(Math.random() * 15);
      else if (condition === "Partly Cloudy") humidity = 50 + Math.floor(Math.random() * 15);
      else humidity = 40 + Math.floor(Math.random() * 15);
      
      // AQI calculations based on conditions
      let aqi = Math.floor(Math.random() * 50) + 20;
      if (condition === "Cloudy" || condition === "Rain") aqi += 10;
      
      // Create current weather
      setWeather({
        date: new Date().toLocaleDateString(),
        temp,
        condition,
        icon,
        humidity,
        wind: Math.floor(Math.random() * 15) + 5,
        aqi,
        pollen: condition === "Rain" ? "Low" : ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
        drivingDifficulty: condition === "Rain" || condition === "Thunderstorm" ? "High" : condition === "Cloudy" ? "Moderate" : "Low"
      });

      // Generate forecast data with realistic progression
      const forecastData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        
        // Each day has some relationship to the previous
        const isRainy = i > 0 ? 
          (forecastData[i-1]?.condition === "Rain" || forecastData[i-1]?.condition === "Thunderstorm") ? 
            Math.random() > 0.7 : Math.random() > 0.85 :
          condition === "Rain" || condition === "Thunderstorm" ? 
            Math.random() > 0.7 : Math.random() > 0.85;
        
        const isCloudy = i > 0 ?
          (forecastData[i-1]?.condition === "Cloudy" || forecastData[i-1]?.condition === "Partly Cloudy") ?
            Math.random() > 0.6 : Math.random() > 0.7 :
          condition === "Cloudy" || condition === "Partly Cloudy" ?
            Math.random() > 0.6 : Math.random() > 0.7;
        
        let forecastCondition;
        if (isRainy) {
          forecastCondition = Math.random() > 0.7 ? "Thunderstorm" : "Rain";
        } else if (isCloudy) {
          forecastCondition = Math.random() > 0.5 ? "Cloudy" : "Partly Cloudy";
        } else {
          forecastCondition = "Sunny";
        }

        // Calculate future temperature with some progression
        const dayOffset = i - 3; // Creates a wave pattern over 7 days
        const forecastTemp = Math.round(baseTemp + dayOffset + (Math.random() * 4 - 2));
        
        // Icon for forecast
        const forecastIcon = 
          forecastCondition === "Rain" ? "cloud-rain" :
          forecastCondition === "Sunny" ? "sun" :
          forecastCondition === "Cloudy" ? "cloud" :
          forecastCondition === "Partly Cloudy" ? "cloud-sun" : 
          "cloud-lightning";
        
        return {
          date: date.toLocaleDateString(),
          temp: forecastTemp,
          condition: forecastCondition,
          icon: forecastIcon,
          humidity: forecastCondition.includes("Rain") ? 
            70 + Math.floor(Math.random() * 20) : 
            40 + Math.floor(Math.random() * 30),
          wind: Math.floor(Math.random() * 15) + 5,
          aqi: Math.floor(Math.random() * 50) + 20,
          pollen: forecastCondition.includes("Rain") ? "Low" : ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
          drivingDifficulty: forecastCondition.includes("Rain") ? "High" : 
            forecastCondition === "Cloudy" ? "Moderate" : "Low"
        };
      });
      
      setForecast(forecastData);

      // Generate historical data with realistic values
      const historyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (i + 1));
        
        // Simulate past weather based on season patterns
        const pastDay = date.getDate();
        const pastCondition = Math.random() > 0.7 ? 
          conditions[Math.floor(Math.random() * conditions.length)] :
          condition; // Higher chance of matching current pattern
        
        return {
          date: date.toLocaleDateString(),
          temp: Math.round(baseTemp + (Math.random() * 6 - 3)), // Similar to current temp with variation
          condition: pastCondition,
          icon: pastCondition === "Rain" ? "cloud-rain" :
                pastCondition === "Sunny" ? "sun" :
                pastCondition === "Cloudy" ? "cloud" :
                pastCondition === "Partly Cloudy" ? "cloud-sun" : 
                "cloud-lightning",
          humidity: pastCondition.includes("Rain") ? 
            70 + Math.floor(Math.random() * 20) : 
            40 + Math.floor(Math.random() * 30),
          wind: Math.floor(Math.random() * 15) + 5,
          aqi: Math.floor(Math.random() * 50) + 20,
          pollen: pastCondition.includes("Rain") ? "Low" : ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
          drivingDifficulty: pastCondition.includes("Rain") ? "High" : 
            pastCondition === "Cloudy" ? "Moderate" : "Low"
        };
      });
      
      setHistory(historyData);

      // Moon phases calculation - actual algorithm would be more complex
      const moonPhases = [
        "New Moon", "Waxing Crescent", "First Quarter", 
        "Waxing Gibbous", "Full Moon", "Waning Gibbous", 
        "Last Quarter", "Waning Crescent"
      ];
      
      const dayOfMonth = new Date().getDate();
      const moonPhaseIndex = Math.floor((dayOfMonth % 28) / 3.5);
      
      // Get realistic rise and set times based on moon phase
      let riseHour, setHour;
      if (moonPhaseIndex <= 1 || moonPhaseIndex >= 6) {
        // New moon and crescent moons rise and set roughly with the sun
        riseHour = 6 + Math.floor(Math.random() * 2);
        setHour = 17 + Math.floor(Math.random() * 2);
      } else if (moonPhaseIndex === 4) {
        // Full moon rises at sunset and sets at sunrise
        riseHour = 17 + Math.floor(Math.random() * 2);
        setHour = 6 + Math.floor(Math.random() * 2);
      } else {
        // Other phases have intermediate times
        riseHour = 11 + Math.floor(moonPhaseIndex * 2) + Math.floor(Math.random() * 2);
        setHour = (riseHour + 12) % 24;
      }
      
      const riseMinute = Math.floor(Math.random() * 60);
      const setMinute = Math.floor(Math.random() * 60);
      
      const riseTime = `${riseHour % 12 || 12}:${riseMinute.toString().padStart(2, '0')} ${riseHour >= 12 ? 'PM' : 'AM'}`;
      const setTime = `${setHour % 12 || 12}:${setMinute.toString().padStart(2, '0')} ${setHour >= 12 ? 'PM' : 'AM'}`;
      
      setMoonInfo({
        rise: riseTime,
        set: setTime,
        phase: moonPhases[moonPhaseIndex]
      });

    }, 1000);

    return () => clearTimeout(timer);
  }, [userCoords]);

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
                location={location}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
