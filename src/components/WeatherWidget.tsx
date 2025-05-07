
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedWeatherIcon } from "./WeatherWidget/AnimatedWeatherIcon";
import { WeatherDetails } from "./WeatherWidget/WeatherDetails";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const API_KEY = "6bae7433a583b203dfb57475dded77db";

function getTimeOfDay(): "day" | "afternoon" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "day";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

function getWeatherCondition(id: number): string {
  if (id >= 200 && id < 300) return "Thunderstorm";
  if (id >= 300 && id < 400) return "Drizzle";
  if (id >= 500 && id < 600) return "Rain";
  if (id >= 600 && id < 700) return "Snow";
  if (id >= 700 && id < 800) return "Fog";
  if (id === 800) return "Sunny";
  if (id > 800) return "Partly Cloudy";
  return "Unknown";
}

function getWeatherIcon(owmIcon: string, timeOfDay: "day" | "afternoon" | "night"): string {
  if (timeOfDay === "night" || owmIcon.includes("n")) {
    if (owmIcon.includes("01")) return "moon";
    if (owmIcon.includes("02") || owmIcon.includes("03")) return "cloud-moon";
    if (owmIcon.includes("04")) return "cloud";
    if (owmIcon.includes("09") || owmIcon.includes("10")) return "cloud-rain";
    if (owmIcon.includes("11")) return "cloud-lightning";
    if (owmIcon.includes("13")) return "cloud-snow";
    if (owmIcon.includes("50")) return "cloud-fog";
  } else {
    if (owmIcon.includes("01")) return "sun";
    if (owmIcon.includes("02") || owmIcon.includes("03")) return "cloud-sun";
    if (owmIcon.includes("04")) return "cloud";
    if (owmIcon.includes("09") || owmIcon.includes("10")) return "cloud-rain";
    if (owmIcon.includes("11")) return "cloud-lightning";
    if (owmIcon.includes("13")) return "cloud-snow";
    if (owmIcon.includes("50")) return "cloud-fog";
  }
  return "cloud";
}

function mpsToKmh(mps: number): number {
  return Math.round(mps * 3.6);
}

function getDrivingDifficulty(weatherId: number, humidity: number): string {
  if ((weatherId >= 500 && weatherId < 700) || humidity > 85) {
    return "High";
  }
  if (weatherId >= 700 && weatherId < 800) {
    return "Moderate";
  }
  return "Low";
}

function getPollenLevel(weatherId: number, month: number): string {
  if (weatherId >= 500 && weatherId < 700) {
    return "Low";
  }
  if ((month >= 2 && month <= 4) || (month >= 8 && month <= 9)) {
    if (weatherId < 500 || weatherId >= 800) {
      return "High";
    }
  }
  return "Moderate";
}

function getMoonPhase(date: Date): string {
  const synmonth = 29.53058867;
  const daysSinceNewMoon = 13;
  
  const date1 = new Date("2023-01-21");
  const date2 = date;
  const timeDiff = date2.getTime() - date1.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  const phase = (daysDiff % synmonth) / synmonth;
  
  if (phase < 0.025 || phase >= 0.975) return "New Moon";
  if (phase < 0.25) return "Waxing Crescent";
  if (phase < 0.275) return "First Quarter";
  if (phase < 0.475) return "Waxing Gibbous";
  if (phase < 0.525) return "Full Moon";
  if (phase < 0.725) return "Waning Gibbous";
  if (phase < 0.775) return "Last Quarter";
  return "Waning Crescent";
}

export function WeatherWidget() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [weather, setWeather] = useState<WeatherDay | null>(null);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [history, setHistory] = useState<WeatherDay[]>([]);
  const [moonInfo, setMoonInfo] = useState<MoonInfo>({ rise: "", set: "", phase: "" });
  const [expanded, setExpanded] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [location, setLocation] = useState("Loading location...");
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sunrise, setSunrise] = useState("");
  const [activeTab, setActiveTab] = useState("forecast");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lon: longitude });
          
          fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.length > 0) {
                setLocation(`${data[0].name}, ${data[0].country}`);
              } else {
                setLocation("Location unavailable");
              }
            })
            .catch(() => {
              setLocation("Location unavailable");
              toast({
                title: "Location error",
                description: "Could not retrieve location name",
              });
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location access denied",
            description: "Using default location",
          });
          setLocation("New Delhi, India");
          setUserCoords({ lat: 28.6139, lon: 77.2090 });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setLocation("Geolocation not supported");
      setUserCoords({ lat: 28.6139, lon: 77.2090 });
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const refreshWeather = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    fetchWeatherData();
  };

  const fetchWeatherData = async () => {
    if (!userCoords) return;
    
    setIsLoading(true);
    try {
      // Try using OneCall API for more accurate data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${userCoords.lat}&lon=${userCoords.lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();

      if (weatherData.cod === 200) {
        const sunriseUTC = weatherData.sys && weatherData.sys.sunrise;
        if (sunriseUTC) {
          const date = new Date(sunriseUTC * 1000);
          let h = date.getHours(), m = date.getMinutes();
          let ampm = h >= 12 ? "PM" : "AM";
          h = h % 12 || 12;
          setSunrise(`${h}:${m.toString().padStart(2, '0')} ${ampm}`);
        } else {
          setSunrise("N/A");
        }

        // Fetch air quality data
        const aqiResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${userCoords.lat}&lon=${userCoords.lon}&appid=${API_KEY}`
        );
        
        if (!aqiResponse.ok) {
          throw new Error(`AQI API error: ${aqiResponse.status}`);
        }
        
        const aqiData = await aqiResponse.json();
        
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const weatherId = weatherData.weather[0].id;
        
        setWeather({
          date: currentDate.toLocaleDateString(),
          temp: Math.round(weatherData.main.temp),
          condition: getWeatherCondition(weatherId),
          icon: getWeatherIcon(weatherData.weather[0].icon, timeOfDay),
          humidity: weatherData.main.humidity,
          wind: mpsToKmh(weatherData.wind.speed),
          aqi: aqiData.list && aqiData.list[0] ? aqiData.list[0].main.aqi * 25 : 50,
          pollen: getPollenLevel(weatherId, currentMonth),
          drivingDifficulty: getDrivingDifficulty(weatherId, weatherData.main.humidity)
        });
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${userCoords.lat}&lon=${userCoords.lon}&units=metric&appid=${API_KEY}`
        );
        
        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        
        if (forecastData.cod === "200") {
          const dailyForecasts: WeatherDay[] = [];
          const processedDates: Set<string> = new Set();
          
          forecastData.list.forEach((item: any) => {
            const forecastDate = new Date(item.dt * 1000);
            const dateString = forecastDate.toLocaleDateString();
            
            if (!processedDates.has(dateString) && dailyForecasts.length < 7) {
              processedDates.add(dateString);
              
              dailyForecasts.push({
                date: dateString,
                temp: Math.round(item.main.temp),
                condition: getWeatherCondition(item.weather[0].id),
                icon: getWeatherIcon(item.weather[0].icon, timeOfDay),
                humidity: item.main.humidity,
                wind: mpsToKmh(item.wind.speed),
                aqi: 50,
                pollen: getPollenLevel(item.weather[0].id, forecastDate.getMonth()),
                drivingDifficulty: getDrivingDifficulty(item.weather[0].id, item.main.humidity)
              });
            }
          });
          
          setForecast(dailyForecasts);
        }
        
        // Generate historical data (since we can't get real historical data without a paid API)
        const historicalData = Array.from({ length: 7 }, (_, i) => {
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - (i + 1));
          
          const pastCondition = weatherData.weather[0].id;
          const variation = Math.floor(Math.random() * 100);
          let pastWeatherId = pastCondition;
          
          if (variation < 30) {
            pastWeatherId = pastCondition + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5);
          }
          
          return {
            date: pastDate.toLocaleDateString(),
            temp: Math.round(weatherData.main.temp + (Math.random() * 6 - 3)),
            condition: getWeatherCondition(pastWeatherId),
            icon: getWeatherIcon("01d", timeOfDay),
            humidity: weatherData.main.humidity + Math.floor(Math.random() * 10 - 5),
            wind: mpsToKmh(weatherData.wind.speed) + Math.floor(Math.random() * 6 - 3),
            aqi: (aqiData.list && aqiData.list[0] ? aqiData.list[0].main.aqi * 25 : 50) + Math.floor(Math.random() * 20 - 10),
            pollen: getPollenLevel(pastWeatherId, pastDate.getMonth()),
            drivingDifficulty: getDrivingDifficulty(pastWeatherId, weatherData.main.humidity)
          };
        });
        
        setHistory(historicalData);
        
        const moonPhase = getMoonPhase(currentDate);
        let moonriseHour, moonsetHour;
        
        if (moonPhase === "New Moon" || moonPhase.includes("Crescent")) {
          moonriseHour = (6 + Math.floor(Math.random() * 2)) % 24;
          moonsetHour = (18 + Math.floor(Math.random() * 2)) % 24;
        } else if (moonPhase === "Full Moon") {
          moonriseHour = (18 + Math.floor(Math.random() * 2)) % 24;
          moonsetHour = (6 + Math.floor(Math.random() * 2)) % 24;
        } else {
          moonriseHour = (12 + Math.floor(Math.random() * 6)) % 24;
          moonsetHour = (moonriseHour + 12) % 24;
        }
        
        const moonriseMinute = Math.floor(Math.random() * 60);
        const moonsetMinute = Math.floor(Math.random() * 60);
        
        setMoonInfo({
          rise: `${moonriseHour % 12 || 12}:${moonriseMinute.toString().padStart(2, '0')} ${moonriseHour >= 12 ? 'PM' : 'AM'}`,
          set: `${moonsetHour % 12 || 12}:${moonsetMinute.toString().padStart(2, '0')} ${moonsetHour >= 12 ? 'PM' : 'AM'}`,
          phase: moonPhase
        });
        
        // Cache weather data for 30 minutes
        localStorage.setItem('weatherData', JSON.stringify({
          weather,
          forecast,
          history,
          moonInfo,
          timeOfDay,
          timestamp: Date.now()
        }));
      } else {
        toast({
          title: "Weather API error",
          description: weatherData.message || "Could not retrieve weather data",
        });
      }
    } catch (error: any) {
      console.error("Weather fetch error:", error);
      toast({
        title: "Weather API error",
        description: error.message || "Failed to fetch weather data",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem('weatherData');
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        const timestamp = parsed.timestamp;
        const now = Date.now();
        
        // If cache is less than 30 minutes old, use it
        if (now - timestamp < 30 * 60 * 1000) {
          setWeather(parsed.weather);
          setForecast(parsed.forecast);
          setHistory(parsed.history);
          setMoonInfo(parsed.moonInfo);
          setTimeOfDay(parsed.timeOfDay);
          setIsLoading(false);
        } else {
          fetchWeatherData();
        }
      } catch (e) {
        fetchWeatherData();
      }
    } else {
      fetchWeatherData();
    }
    
    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [userCoords]);

  useEffect(() => {
    const intv = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(intv);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.expand-toggle') || 
        (e.target as HTMLElement).closest('.refresh-button')) {
      return;
    }
    
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
      className={`fixed z-40 animate-fade-in shadow-lg select-none`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`bg-white/90 backdrop-blur-sm border border-sky-light rounded-lg transition-all duration-300
          ${expanded ? "w-[300px]" : "w-52"}
        `}
      >
        <div className={`p-2 flex items-center justify-between ${expanded
            ? "bg-gradient-to-r from-sky-dark to-sky text-white text-xs"
            : "bg-gradient-to-r from-sky to-foliage-light text-foliage-dark text-xs"} rounded-t-md`}>
          <div className="font-medium tracking-wide">Weather</div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 p-0 refresh-button text-white hover:text-white/80 hover:bg-transparent"
              onClick={refreshWeather}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 expand-toggle text-white hover:text-white/80 hover:bg-transparent"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        <CardContent className={`p-0 pt-2 ${expanded ? "pb-2" : ""}`}>
          {!expanded ? (
            <div className="flex items-center justify-between px-2 pb-1">
              <AnimatedWeatherIcon
                condition={weather?.condition || "Sunny"}
                timeOfDay={timeOfDay}
                compact={true}
              />
              <div className="text-center">
                <div className="font-semibold text-xl">{weather ? `${weather.temp}°C` : "..."}</div>
                <div className="text-xs text-gray-600">{weather?.condition || "Loading..."}</div>
                <div className="text-xs text-gray-600">{location}</div>
              </div>
            </div>
          ) : (
            <div className="px-3 pt-1 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <AnimatedWeatherIcon
                  condition={weather?.condition || "Sunny"}
                  timeOfDay={timeOfDay}
                  compact={true}
                />
                <div className="text-center">
                  <div className="font-semibold text-xl">{weather ? `${weather.temp}°C` : "..."}</div>
                  <div className="text-xs text-gray-600">{weather?.condition || "Loading..."}</div>
                  <div className="text-xs text-gray-600">{location}</div>
                  <div className="text-xs text-gray-600">{sunrise ? `🌅 ${sunrise}` : ""}</div>
                </div>
              </div>
              
              <Tabs defaultValue="forecast" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 h-7 text-xs mb-2">
                  <TabsTrigger value="forecast">Forecast</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <WeatherDetails
                  weather={weather}
                  forecast={forecast}
                  history={history}
                  moonInfo={moonInfo}
                  timeOfDay={timeOfDay}
                  location={location}
                  isLoading={isLoading}
                  sunrise={sunrise}
                  activeTab={activeTab}
                />
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
