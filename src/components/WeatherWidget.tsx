
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedWeatherIcon } from "./WeatherWidget/AnimatedWeatherIcon";
import { WeatherDetails } from "./WeatherWidget/WeatherDetails";
import { WeatherAlerts } from "./WeatherWidget/WeatherAlerts";
import { AgricultureInsights } from "./WeatherWidget/AgricultureInsights";
import { HourlyForecast } from "./WeatherWidget/HourlyForecast";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, RefreshCw, MapPin, Maximize2, Minimize2, Bell, Tractor, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from './LanguageContext';

type WeatherDay = {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  aqi: number;
  uvIndex: number;
  pollen: string;
  drivingDifficulty: string;
  precipitation: number;
  cloudCover: number;
  dewPoint: number;
  feelsLike: number;
};

type HourlyWeather = {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  precipitation: number;
  uvIndex: number;
};

type WeatherAlert = {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  type: 'weather' | 'agriculture' | 'health';
  startTime: string;
  endTime: string;
};

type AgricultureData = {
  soilMoisture: number;
  growingConditions: 'poor' | 'fair' | 'good' | 'excellent';
  plantingRecommendation: string;
  harvestingCondition: string;
  irrigationNeeded: boolean;
  pestRisk: 'low' | 'medium' | 'high';
  diseaseRisk: 'low' | 'medium' | 'high';
  optimalCrops: string[];
};

type MoonInfo = {
  rise: string;
  set: string;
  phase: string;
  illumination: number;
};

const API_KEY = "6bae7433a583b203dfb57475dded77db";

function getTimeOfDay(): "day" | "afternoon" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "day";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

function getWeatherCondition(id: number, t: (key: string) => string): string {
  if (id >= 200 && id < 300) return t("thunderstorm");
  if (id >= 300 && id < 400) return t("drizzle");
  if (id >= 500 && id < 600) return t("rain");
  if (id >= 600 && id < 700) return t("snow");
  if (id >= 700 && id < 800) return t("fog");
  if (id === 800) return t("sunny");
  if (id > 800) return t("partly-cloudy");
  return t("unknown");
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

function getDrivingDifficulty(weatherId: number, humidity: number, t: (key: string) => string): string {
  if ((weatherId >= 500 && weatherId < 700) || humidity > 85) {
    return t("high");
  }
  if (weatherId >= 700 && weatherId < 800) {
    return t("moderate");
  }
  return t("low");
}

function getPollenLevel(weatherId: number, month: number, t: (key: string) => string): string {
  if (weatherId >= 500 && weatherId < 700) {
    return t("low");
  }
  if ((month >= 2 && month <= 4) || (month >= 8 && month <= 9)) {
    if (weatherId < 500 || weatherId >= 800) {
      return t("high");
    }
  }
  return t("moderate");
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function generateWeatherAlerts(weather: any, agriculture: any, t: (key: string) => string): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  // Temperature alerts
  if (weather.temp > 35) {
    alerts.push({
      id: 'heat-warning',
      title: t('heat-warning'),
      description: t('extreme-heat-conditions'),
      severity: 'high',
      type: 'agriculture',
      startTime: '12:00 PM',
      endTime: '6:00 PM'
    });
  }

  // Wind alerts
  if (weather.wind > 25) {
    alerts.push({
      id: 'wind-warning',
      title: t('strong-wind-alert'),
      description: t('high-winds-damage'),
      severity: 'medium',
      type: 'weather',
      startTime: t('now'),
      endTime: '8:00 PM'
    });
  }

  // Humidity alerts
  if (weather.humidity > 85) {
    alerts.push({
      id: 'humidity-alert',
      title: t('high-humidity'),
      description: t('increased-fungal-risk'),
      severity: 'medium',
      type: 'agriculture',
      startTime: t('now'),
      endTime: t('tomorrow')
    });
  }

  return alerts;
}

function generateAgricultureData(weather: any, t: (key: string) => string): AgricultureData {
  const soilMoisture = Math.max(0, Math.min(100,
    50 + (weather.humidity - 50) * 0.5 + (weather.precipitation || 0) * 5
  ));

  let growingConditions: 'poor' | 'fair' | 'good' | 'excellent' = 'fair';
  if (weather.temp >= 15 && weather.temp <= 30 && weather.humidity >= 40 && weather.humidity <= 70) {
    growingConditions = 'excellent';
  } else if (weather.temp >= 10 && weather.temp <= 35 && weather.humidity >= 30 && weather.humidity <= 80) {
    growingConditions = 'good';
  } else if (weather.temp < 5 || weather.temp > 40 || weather.humidity < 20 || weather.humidity > 90) {
    growingConditions = 'poor';
  }

  const pestRisk = weather.temp > 25 && weather.humidity > 70 ? 'high' :
                   weather.temp > 20 && weather.humidity > 60 ? 'medium' : 'low';

  const diseaseRisk = weather.humidity > 80 ? 'high' :
                      weather.humidity > 65 ? 'medium' : 'low';

  const optimalCrops = [];
  if (weather.temp >= 20 && weather.temp <= 30) optimalCrops.push('Tomatoes', 'Peppers');
  if (weather.temp >= 15 && weather.temp <= 25) optimalCrops.push('Lettuce', 'Spinach');
  if (weather.temp >= 25 && weather.temp <= 35) optimalCrops.push('Corn', 'Soybeans');
  if (soilMoisture > 60) optimalCrops.push('Rice', 'Watermelon');

  return {
    soilMoisture,
    growingConditions,
    plantingRecommendation: growingConditions === 'excellent' ? t('ideal-conditions-planting') :
                           growingConditions === 'good' ? t('good-conditions-hardy') :
                           growingConditions === 'fair' ? t('consider-waiting') :
                           t('not-recommended-planting'),
    harvestingCondition: weather.humidity < 60 ? t('good-harvesting-conditions') : t('wait-for-drier'),
    irrigationNeeded: soilMoisture < 40,
    pestRisk: pestRisk as 'low' | 'medium' | 'high',
    diseaseRisk: diseaseRisk as 'low' | 'medium' | 'high',
    optimalCrops
  };
}

function generateHourlyForecast(currentWeather: any): HourlyWeather[] {
  const hourly: HourlyWeather[] = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const tempVariation = Math.sin((i - 6) * Math.PI / 12) * 5; // Temperature curve

    hourly.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(currentWeather.temp + tempVariation + (Math.random() - 0.5) * 3),
      condition: currentWeather.condition,
      icon: currentWeather.icon,
      humidity: Math.max(20, Math.min(100, currentWeather.humidity + (Math.random() - 0.5) * 20)),
      wind: Math.max(0, currentWeather.wind + (Math.random() - 0.5) * 10),
      precipitation: Math.random() < 0.3 ? Math.random() * 5 : 0,
      uvIndex: i >= 6 && i <= 18 ? Math.floor(Math.random() * 11) : 0
    });
  }

  return hourly;
}

function getMoonPhase(date: Date, t: (key: string) => string): string {
  const synmonth = 29.53058867;
  const daysSinceNewMoon = 13;

  const date1 = new Date("2023-01-21");
  const date2 = date;
  const timeDiff = date2.getTime() - date1.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  const phase = (daysDiff % synmonth) / synmonth;

  if (phase < 0.025 || phase >= 0.975) return t("new-moon");
  if (phase < 0.25) return t("waxing-crescent");
  if (phase < 0.275) return t("first-quarter");
  if (phase < 0.475) return t("waxing-gibbous");
  if (phase < 0.525) return t("full-moon");
  if (phase < 0.725) return t("waning-gibbous");
  if (phase < 0.775) return t("last-quarter");
  return t("waning-crescent");
}

export function WeatherWidget() {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [weather, setWeather] = useState<WeatherDay | null>(null);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyWeather[]>([]);
  const [history, setHistory] = useState<WeatherDay[]>([]);
  const [moonInfo, setMoonInfo] = useState<MoonInfo>({ rise: "", set: "", phase: "", illumination: 0 });
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [agricultureData, setAgricultureData] = useState<AgricultureData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [location, setLocation] = useState(t("loading-location"));
  const [userCoords, setUserCoords] = useState<{lat: number, lon: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sunrise, setSunrise] = useState("");
  const [activeTab, setActiveTab] = useState("forecast");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lon: longitude });

          try {
            // Use multiple location APIs for better accuracy
            const [reverseGeoResponse, nominatimResponse] = await Promise.allSettled([
              fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`),
              fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`)
            ]);

            let locationName = "Unknown Location";

            // Try OpenWeatherMap first
            if (reverseGeoResponse.status === 'fulfilled') {
              const owmData = await reverseGeoResponse.value.json();
              if (owmData && owmData.length > 0) {
                const place = owmData[0];
                locationName = place.state ?
                  `${place.name}, ${place.state}, ${place.country}` :
                  `${place.name}, ${place.country}`;
              }
            }

            // Fallback to Nominatim for more detailed location
            if (locationName === "Unknown Location" && nominatimResponse.status === 'fulfilled') {
              const nominatimData = await nominatimResponse.value.json();
              if (nominatimData && nominatimData.address) {
                const addr = nominatimData.address;
                const city = addr.city || addr.town || addr.village || addr.hamlet;
                const state = addr.state || addr.region;
                const country = addr.country;

                if (city && state && country) {
                  locationName = `${city}, ${state}, ${country}`;
                } else if (city && country) {
                  locationName = `${city}, ${country}`;
                } else if (country) {
                  locationName = country;
                }
              }
            }

            setLocation(locationName);
          } catch (error) {
            console.error("Location fetch error:", error);
            setLocation(t("location-unavailable"));
            toast({
              title: t("location-error"),
              description: t("could-not-retrieve-location"),
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = t("location-access-denied");

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t("location-access-denied");
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t("location-information-unavailable");
              break;
            case error.TIMEOUT:
              errorMessage = t("location-request-timed-out");
              break;
          }

          toast({
            title: t("location-error"),
            description: errorMessage + ". " + t("using-default-location"),
          });
          setLocation("New Delhi, India");
          setUserCoords({ lat: 28.6139, lon: 77.2090 });
        },
        {
          timeout: 15000,
          enableHighAccuracy: true,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    } else {
      setLocation(t("geolocation-not-supported"));
      setUserCoords({ lat: 28.6139, lon: 77.2090 });
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Auto-refresh weather when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userCoords) {
        console.log("Page visible, refreshing weather...");
        fetchWeatherData();
      }
    };

    const handleFocus = () => {
      if (userCoords) {
        console.log("Window focused, refreshing weather...");
        fetchWeatherData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userCoords]);

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
        throw new Error(`${t("weather-api-error")}: ${weatherResponse.status}`);
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
        
        const currentWeatherData = {
          date: currentDate.toLocaleDateString(),
          temp: Math.round(weatherData.main.temp),
          tempMin: Math.round(weatherData.main.temp_min),
          tempMax: Math.round(weatherData.main.temp_max),
          condition: getWeatherCondition(weatherId, t),
          icon: getWeatherIcon(weatherData.weather[0].icon, timeOfDay),
          humidity: weatherData.main.humidity,
          wind: mpsToKmh(weatherData.wind.speed),
          windDirection: weatherData.wind.deg ? getWindDirection(weatherData.wind.deg) : 'N/A',
          pressure: weatherData.main.pressure,
          visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 10,
          aqi: aqiData.list && aqiData.list[0] ? aqiData.list[0].main.aqi * 25 : 50,
          uvIndex: Math.floor(Math.random() * 11), // Mock UV index
          pollen: getPollenLevel(weatherId, currentMonth, t),
          drivingDifficulty: getDrivingDifficulty(weatherId, weatherData.main.humidity, t),
          precipitation: 0, // Will be updated from forecast data
          cloudCover: weatherData.clouds?.all || 0,
          dewPoint: Math.round(weatherData.main.temp - ((100 - weatherData.main.humidity) / 5)),
          feelsLike: Math.round(weatherData.main.feels_like)
        };

        setWeather(currentWeatherData);

        // Generate additional data
        const agriData = generateAgricultureData(currentWeatherData, t);
        setAgricultureData(agriData);

        const alerts = generateWeatherAlerts(currentWeatherData, agriData, t);
        setWeatherAlerts(alerts);

        const hourly = generateHourlyForecast(currentWeatherData);
        setHourlyForecast(hourly);
        
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
                condition: getWeatherCondition(item.weather[0].id, t),
                icon: getWeatherIcon(item.weather[0].icon, timeOfDay),
                humidity: item.main.humidity,
                wind: mpsToKmh(item.wind.speed),
                aqi: 50,
                pollen: getPollenLevel(item.weather[0].id, forecastDate.getMonth(), t),
                drivingDifficulty: getDrivingDifficulty(item.weather[0].id, item.main.humidity, t)
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
            condition: getWeatherCondition(pastWeatherId, t),
            icon: getWeatherIcon("01d", timeOfDay),
            humidity: weatherData.main.humidity + Math.floor(Math.random() * 10 - 5),
            wind: mpsToKmh(weatherData.wind.speed) + Math.floor(Math.random() * 6 - 3),
            aqi: (aqiData.list && aqiData.list[0] ? aqiData.list[0].main.aqi * 25 : 50) + Math.floor(Math.random() * 20 - 10),
            pollen: getPollenLevel(pastWeatherId, pastDate.getMonth(), t),
            drivingDifficulty: getDrivingDifficulty(pastWeatherId, weatherData.main.humidity, t)
          };
        });
        
        setHistory(historicalData);
        
        const moonPhase = getMoonPhase(currentDate, t);
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
        
        const illumination = moonPhase === "Full Moon" ? 100 :
                         moonPhase === "New Moon" ? 0 :
                         moonPhase.includes("Gibbous") ? 75 :
                         moonPhase.includes("Quarter") ? 50 : 25;

        setMoonInfo({
          rise: `${moonriseHour % 12 || 12}:${moonriseMinute.toString().padStart(2, '0')} ${moonriseHour >= 12 ? 'PM' : 'AM'}`,
          set: `${moonsetHour % 12 || 12}:${moonsetMinute.toString().padStart(2, '0')} ${moonsetHour >= 12 ? 'PM' : 'AM'}`,
          phase: moonPhase,
          illumination
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
          title: t("weather-api-error"),
          description: weatherData.message || t("could-not-retrieve-weather"),
        });
      }
    } catch (error: any) {
      console.error("Weather fetch error:", error);
      toast({
        title: t("weather-api-error"),
        description: error.message || t("failed-to-fetch-weather"),
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

  const dismissAlert = (alertId: string) => {
    setWeatherAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };



  const getBackgroundGradient = () => {
    if (!weather) return "from-slate-400 via-slate-500 to-slate-600";

    const condition = weather.condition;

    switch (timeOfDay) {
      case "night":
        if (condition === "Rain") return "from-slate-800 via-slate-900 to-blue-900";
        if (condition === "Snow") return "from-indigo-900 via-slate-800 to-purple-900";
        if (condition === "Thunderstorm") return "from-gray-900 via-slate-900 to-black";
        if (condition === "Cloudy") return "from-slate-700 via-gray-800 to-slate-900";
        return "from-indigo-900 via-purple-900 to-slate-800"; // Clear night

      case "afternoon":
        if (condition === "Rain") return "from-gray-500 via-slate-600 to-blue-700";
        if (condition === "Snow") return "from-gray-300 via-slate-400 to-blue-400";
        if (condition === "Thunderstorm") return "from-gray-700 via-slate-800 to-gray-900";
        if (condition === "Cloudy") return "from-gray-400 via-slate-500 to-gray-600";
        return "from-orange-400 via-red-400 to-pink-500"; // Clear afternoon

      default: // day
        if (condition === "Rain") return "from-gray-400 via-slate-500 to-blue-600";
        if (condition === "Snow") return "from-gray-200 via-slate-300 to-blue-300";
        if (condition === "Thunderstorm") return "from-gray-600 via-slate-700 to-gray-800";
        if (condition === "Cloudy" || condition === "Partly Cloudy") return "from-gray-300 via-slate-400 to-blue-400";
        if (condition === "Sunny") return "from-yellow-300 via-orange-400 to-blue-500";
        return "from-blue-400 via-cyan-500 to-blue-600"; // Default clear day
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed z-40 select-none ${isFullscreen ? 'inset-4' : ''}`}
        style={!isFullscreen ? {
          top: `${position.y}px`,
          left: `${position.x}px`,
          cursor: isDragging ? "grabbing" : "grab",
        } : {}}
        onMouseDown={!isFullscreen ? handleMouseDown : undefined}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`relative overflow-hidden rounded-xl shadow-xl backdrop-blur-xl border border-white/20 transition-all duration-500 ${
            isFullscreen ? 'w-full h-full' : expanded ? "w-[320px]" : "w-48"
          }`}
          layout
        >
          {/* Dynamic background with particles */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          {/* Realistic Weather particles overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {weather?.condition === "Rain" && (
              <div className="rain-animation">
                {/* Heavy rain drops with realistic physics */}
                {[...Array(expanded || isFullscreen ? 60 : 25)].map((_, i) => {
                  const speed = 0.5 + Math.random() * 0.8;
                  const size = 0.8 + Math.random() * 1.5;
                  const angle = 15 + Math.random() * 10;
                  return (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 110 - 5}%`,
                        width: `${size}px`,
                        height: `${12 + Math.random() * 8}px`,
                        background: `linear-gradient(${angle}deg, rgba(173, 216, 230, 0.8) 0%, rgba(135, 206, 235, 0.9) 50%, rgba(100, 149, 237, 0.7) 100%)`,
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        transform: `rotate(${angle}deg)`,
                        filter: 'blur(0.3px)',
                        boxShadow: '0 0 2px rgba(173, 216, 230, 0.5)'
                      }}
                      animate={{
                        y: ["-25vh", "125vh"],
                        x: [0, Math.random() * 20 - 10],
                        opacity: [0, 0.9, 0.9, 0],
                        scale: [0.8, 1, 1, 0.6]
                      }}
                      transition={{
                        duration: speed,
                        repeat: Infinity,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: Math.random() * 3
                      }}
                    />
                  );
                })}

                {/* Rain splash effects with ripples */}
                {[...Array(expanded || isFullscreen ? 12 : 6)].map((_, i) => (
                  <motion.div
                    key={`splash-${i}`}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      bottom: `${5 + Math.random() * 15}%`,
                      width: '4px',
                      height: '4px'
                    }}
                    animate={{
                      scale: [0, 2, 0],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  >
                    <div className="w-full h-full bg-blue-300/70 rounded-full" />
                    <motion.div
                      className="absolute inset-0 border border-blue-200/50 rounded-full"
                      animate={{
                        scale: [1, 3, 5],
                        opacity: [0.8, 0.3, 0]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  </motion.div>
                ))}

                {/* Rain mist effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/10 to-blue-200/20"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            {weather?.condition === "Snow" && (
              <div className="snow-animation">
                {/* Large snowflakes */}
                {[...Array(expanded || isFullscreen ? 20 : 8)].map((_, i) => {
                  const size = 3 + Math.random() * 5;
                  const drift = Math.random() * 60 - 30;
                  return (
                    <motion.div
                      key={`large-${i}`}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 110 - 5}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                      animate={{
                        y: ["-15vh", "115vh"],
                        x: [0, drift, drift * 0.7, drift * 1.2],
                        rotate: [0, 360, 720],
                        opacity: [0, 1, 1, 0.8, 0]
                      }}
                      transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 6
                      }}
                    >
                      <div className="w-full h-full bg-white rounded-full shadow-lg opacity-90"
                           style={{
                             filter: 'blur(0.5px)',
                             boxShadow: '0 0 4px rgba(255, 255, 255, 0.8), inset 0 0 2px rgba(200, 200, 255, 0.3)'
                           }} />
                    </motion.div>
                  );
                })}

                {/* Medium snowflakes */}
                {[...Array(expanded || isFullscreen ? 30 : 15)].map((_, i) => {
                  const size = 1.5 + Math.random() * 3;
                  const drift = Math.random() * 40 - 20;
                  return (
                    <motion.div
                      key={`medium-${i}`}
                      className="absolute bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 110 - 5}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        filter: 'blur(0.3px)',
                        boxShadow: '0 0 2px rgba(255, 255, 255, 0.6)'
                      }}
                      animate={{
                        y: ["-12vh", "112vh"],
                        x: [0, drift, drift * 0.8],
                        rotate: [0, 180, 360],
                        opacity: [0, 0.9, 0.9, 0]
                      }}
                      transition={{
                        duration: 6 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                      }}
                    />
                  );
                })}

                {/* Small snowflakes */}
                {[...Array(expanded || isFullscreen ? 40 : 20)].map((_, i) => {
                  const size = 0.8 + Math.random() * 1.5;
                  const drift = Math.random() * 25 - 12;
                  return (
                    <motion.div
                      key={`small-${i}`}
                      className="absolute bg-white rounded-full opacity-70"
                      style={{
                        left: `${Math.random() * 110 - 5}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        filter: 'blur(0.2px)'
                      }}
                      animate={{
                        y: ["-8vh", "108vh"],
                        x: [0, drift],
                        opacity: [0, 0.7, 0.7, 0]
                      }}
                      transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 4
                      }}
                    />
                  );
                })}

                {/* Snow accumulation effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-white/30 to-transparent"
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            {weather?.condition === "Thunderstorm" && (
              <div className="thunderstorm-animation">
                {/* Realistic lightning bolts */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`lightning-${i}`}
                    className="absolute"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: '10%',
                      width: '2px',
                      height: '60%',
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(173, 216, 230, 0.8) 50%, rgba(255, 255, 255, 0.7) 100%)',
                      filter: 'blur(1px)',
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(173, 216, 230, 0.6)',
                      clipPath: 'polygon(45% 0%, 55% 0%, 60% 35%, 65% 35%, 50% 60%, 45% 60%, 40% 35%, 45% 35%)'
                    }}
                    animate={{
                      opacity: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
                      scale: [0.8, 0.8, 0.8, 0.8, 1.2, 0.9, 1.1, 0.8, 0.8, 0.8, 0.8, 0.8]
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      repeatDelay: 4 + Math.random() * 6,
                      delay: i * 0.1
                    }}
                  />
                ))}

                {/* Lightning flash overlay */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.3) 0%, rgba(173, 216, 230, 0.2) 30%, transparent 60%)'
                  }}
                  animate={{
                    opacity: [0, 0, 0, 0, 0.8, 0, 0.6, 0, 0, 0, 0, 0]
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    repeatDelay: 4 + Math.random() * 6
                  }}
                />

                {/* Heavy storm rain */}
                {[...Array(expanded || isFullscreen ? 80 : 35)].map((_, i) => {
                  const speed = 0.3 + Math.random() * 0.4;
                  const size = 1 + Math.random() * 2;
                  const angle = 20 + Math.random() * 15;
                  return (
                    <motion.div
                      key={`storm-rain-${i}`}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 110 - 5}%`,
                        width: `${size}px`,
                        height: `${15 + Math.random() * 10}px`,
                        background: `linear-gradient(${angle}deg, rgba(100, 149, 237, 0.9) 0%, rgba(135, 206, 235, 0.8) 50%, rgba(70, 130, 180, 0.7) 100%)`,
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        transform: `rotate(${angle}deg)`,
                        filter: 'blur(0.2px)',
                        boxShadow: '0 0 1px rgba(100, 149, 237, 0.6)'
                      }}
                      animate={{
                        y: ["-25vh", "125vh"],
                        x: [0, Math.random() * 30 - 15],
                        opacity: [0, 1, 1, 0],
                        scale: [0.8, 1, 1, 0.6]
                      }}
                      transition={{
                        duration: speed,
                        repeat: Infinity,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: Math.random() * 2
                      }}
                    />
                  );
                })}

                {/* Storm clouds effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-gray-800/20 via-gray-600/10 to-transparent"
                  animate={{
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            {(weather?.condition === "Cloudy" || weather?.condition === "Partly Cloudy") && (
              <div className="clouds-animation">
                {/* Large background clouds */}
                {[...Array(isFullscreen ? 4 : 2)].map((_, i) => (
                  <motion.div
                    key={`bg-cloud-${i}`}
                    className="absolute"
                    style={{
                      left: `${-30 + i * 40}%`,
                      top: `${5 + i * 15}%`,
                      width: `${(isFullscreen ? 120 : 80) + Math.random() * 60}px`,
                      height: `${(isFullscreen ? 60 : 40) + Math.random() * 30}px`,
                    }}
                    animate={{
                      x: ["-150px", isFullscreen ? "700px" : "500px"],
                      opacity: [0, 0.4, 0.4, 0]
                    }}
                    transition={{
                      duration: (isFullscreen ? 35 : 25) + Math.random() * 15,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 8
                    }}
                  >
                    {/* Cloud layers for 3D effect */}
                    <div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      style={{ filter: 'blur(8px)' }}
                    />
                    <div
                      className="absolute inset-2 bg-white/25 rounded-full"
                      style={{ filter: 'blur(4px)' }}
                    />
                    <div
                      className="absolute inset-4 bg-white/30 rounded-full"
                      style={{ filter: 'blur(2px)' }}
                    />
                  </motion.div>
                ))}

                {/* Medium clouds */}
                {[...Array(isFullscreen ? 6 : 3)].map((_, i) => (
                  <motion.div
                    key={`mid-cloud-${i}`}
                    className="absolute"
                    style={{
                      left: `${-20 + i * 25}%`,
                      top: `${15 + i * 10}%`,
                      width: `${(isFullscreen ? 80 : 60) + Math.random() * 40}px`,
                      height: `${(isFullscreen ? 40 : 30) + Math.random() * 20}px`,
                    }}
                    animate={{
                      x: ["-100px", isFullscreen ? "600px" : "450px"],
                      opacity: [0, 0.5, 0.5, 0],
                      scale: [0.8, 1, 1, 0.8]
                    }}
                    transition={{
                      duration: (isFullscreen ? 30 : 22) + Math.random() * 10,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 5
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-white/25 rounded-full"
                      style={{ filter: 'blur(6px)' }}
                    />
                    <div
                      className="absolute inset-1 bg-white/35 rounded-full"
                      style={{ filter: 'blur(3px)' }}
                    />
                  </motion.div>
                ))}

                {/* Small wispy clouds */}
                {[...Array(isFullscreen ? 8 : 4)].map((_, i) => (
                  <motion.div
                    key={`small-cloud-${i}`}
                    className="absolute bg-white/15 rounded-full"
                    style={{
                      left: `${-10 + i * 20}%`,
                      top: `${20 + i * 8}%`,
                      width: `${(isFullscreen ? 40 : 30) + Math.random() * 25}px`,
                      height: `${(isFullscreen ? 20 : 15) + Math.random() * 15}px`,
                      filter: 'blur(3px)'
                    }}
                    animate={{
                      x: ["-80px", isFullscreen ? "500px" : "380px"],
                      opacity: [0, 0.3, 0.3, 0],
                      y: [0, Math.random() * 10 - 5]
                    }}
                    transition={{
                      duration: (isFullscreen ? 25 : 18) + Math.random() * 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 3
                    }}
                  />
                ))}

                {/* Atmospheric haze */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-gray-200/10 via-white/5 to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            {weather?.condition === "Sunny" && timeOfDay === "day" && (
              <div className="sunny-animation">
                {/* Central sun core */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    left: "47%",
                    top: "18%",
                    width: isFullscreen ? "24px" : "16px",
                    height: isFullscreen ? "24px" : "16px",
                    background: 'radial-gradient(circle, rgba(255, 255, 0, 0.9) 0%, rgba(255, 215, 0, 0.8) 40%, rgba(255, 165, 0, 0.6) 100%)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.4)',
                    filter: 'blur(0.5px)'
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Primary sun rays */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`primary-ray-${i}`}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "20%",
                      width: isFullscreen ? "3px" : "2px",
                      height: isFullscreen ? "50px" : "30px",
                      background: 'linear-gradient(180deg, rgba(255, 255, 0, 0.8) 0%, rgba(255, 215, 0, 0.6) 50%, rgba(255, 165, 0, 0.3) 100%)',
                      transformOrigin: `center ${isFullscreen ? "100px" : "60px"}`,
                      transform: `rotate(${i * 30}deg)`,
                      borderRadius: '50%',
                      filter: 'blur(0.5px)',
                      boxShadow: '0 0 4px rgba(255, 215, 0, 0.6)'
                    }}
                    animate={{
                      opacity: [0.4, 0.9, 0.4],
                      scale: [1, 1.3, 1],
                      rotate: [i * 30, i * 30 + 360]
                    }}
                    transition={{
                      opacity: { duration: 3, repeat: Infinity, delay: i * 0.1 },
                      scale: { duration: 3, repeat: Infinity, delay: i * 0.1 },
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                  />
                ))}

                {/* Secondary shorter rays */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`secondary-ray-${i}`}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "20%",
                      width: isFullscreen ? "2px" : "1px",
                      height: isFullscreen ? "30px" : "20px",
                      background: 'linear-gradient(180deg, rgba(255, 255, 0, 0.6) 0%, rgba(255, 215, 0, 0.4) 100%)',
                      transformOrigin: `center ${isFullscreen ? "70px" : "45px"}`,
                      transform: `rotate(${i * 45 + 22.5}deg)`,
                      borderRadius: '50%',
                      filter: 'blur(0.3px)'
                    }}
                    animate={{
                      opacity: [0.2, 0.6, 0.2],
                      scale: [0.8, 1.1, 0.8],
                      rotate: [i * 45 + 22.5, i * 45 + 22.5 - 360]
                    }}
                    transition={{
                      opacity: { duration: 4, repeat: Infinity, delay: i * 0.15 },
                      scale: { duration: 4, repeat: Infinity, delay: i * 0.15 },
                      rotate: { duration: 25, repeat: Infinity, ease: "linear" }
                    }}
                  />
                ))}

                {/* Sun glow halos */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`halo-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${45 - i * 2}%`,
                      top: `${15 - i * 2}%`,
                      width: `${(isFullscreen ? 40 : 30) + i * 20}px`,
                      height: `${(isFullscreen ? 40 : 30) + i * 20}px`,
                      background: `radial-gradient(circle, rgba(255, 255, 0, ${0.3 - i * 0.1}) 0%, rgba(255, 215, 0, ${0.2 - i * 0.05}) 50%, transparent 70%)`,
                      filter: `blur(${2 + i * 2}px)`
                    }}
                    animate={{
                      opacity: [0.3 - i * 0.1, 0.6 - i * 0.1, 0.3 - i * 0.1],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5
                    }}
                  />
                ))}

                {/* Atmospheric shimmer */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 25%, rgba(255, 255, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 40%, transparent 70%)'
                  }}
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            {/* Always show some ambient particles for visual interest */}
            {(expanded || isFullscreen) && (
              <div className="ambient-particles">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`ambient-${i}`}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Header */}
          <motion.div
            className={`relative z-10 flex items-center justify-between bg-black/20 backdrop-blur-sm ${
              expanded || isFullscreen ? 'p-3' : 'p-2'
            }`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <motion.div
                className={`rounded-full bg-white/20 backdrop-blur-sm ${
                  expanded || isFullscreen ? 'p-2' : 'p-1'
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <MapPin className={`text-white ${expanded || isFullscreen ? 'h-4 w-4' : 'h-3 w-3'}`} />
              </motion.div>
              <div className="min-w-0 flex-1">
                <h3 className={`text-white font-semibold ${expanded || isFullscreen ? 'text-sm' : 'text-xs'}`}>
                  Weather
                </h3>
                <p className={`text-white/80 truncate ${expanded || isFullscreen ? 'text-xs' : 'text-xs'}`}>
                  {location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Alert indicator */}
              {weatherAlerts.length > 0 && (
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                    onClick={() => setShowAlerts(!showAlerts)}
                  >
                    <Bell className="h-3 w-3" />
                  </Button>
                  <motion.div
                    className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="text-xs text-white font-bold">{weatherAlerts.length}</span>
                  </motion.div>
                </motion.div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 refresh-button text-white hover:bg-white/20"
                onClick={refreshWeather}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>

              {/* Control buttons based on current state */}
              {isFullscreen ? (
                /* Fullscreen mode - show exit fullscreen button */
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-white hover:bg-white/20"
                  onClick={() => {
                    setIsFullscreen(false);
                    setExpanded(true); // Go back to expanded mode
                  }}
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
              ) : expanded ? (
                /* Expanded mode - show minimize and maximize buttons */
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                    onClick={() => setExpanded(false)}
                    title="Minimize to compact view"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                    onClick={() => setIsFullscreen(true)}
                    title="Maximize to fullscreen"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                /* Compact mode - show expand and maximize buttons */
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 expand-toggle text-white hover:bg-white/20"
                    onClick={() => setExpanded(true)}
                    title="Expand widget"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                    onClick={() => setIsFullscreen(true)}
                    title="Maximize to fullscreen"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className={`relative z-10 ${expanded || isFullscreen ? 'p-4' : 'p-3'}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {!expanded && !isFullscreen ? (
              /* Compact View */
              <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                  <AnimatedWeatherIcon
                    condition={weather?.condition || "Sunny"}
                    timeOfDay={timeOfDay}
                    compact={true}
                  />
                </div>
                <div className="text-right flex-1 ml-2">
                  <motion.div
                    className="font-bold text-lg text-white leading-tight"
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {weather ? `${weather.temp}°` : "..."}
                  </motion.div>
                  <div className="text-white/90 text-xs leading-tight">{weather?.condition || "Loading..."}</div>
                  <div className="text-white/70 text-xs">
                    {weather?.humidity || 0}% • {weather?.wind || 0}km/h
                  </div>
                </div>
              </div>
            ) : (
              /* Expanded/Fullscreen View */
              <div className="space-y-4">
                {/* Current Weather Display */}
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-center mb-4">
                    <AnimatedWeatherIcon
                      condition={weather?.condition || "Sunny"}
                      timeOfDay={timeOfDay}
                      compact={false}
                    />
                  </div>

                  <motion.div
                    className="text-6xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {weather ? `${weather.temp}°` : "..."}
                  </motion.div>

                  <div className="text-white/90 text-xl mb-1">{weather?.condition || "Loading..."}</div>
                  <div className="text-white/70 text-sm">
                    Feels like {weather?.feelsLike || 0}°C • {sunrise ? `🌅 ${sunrise}` : ""}
                  </div>

                  {/* Temperature range */}
                  <div className="flex justify-center gap-4 mt-3 text-white/80 text-sm">
                    <span>↑ {weather?.tempMax || 0}°</span>
                    <span>↓ {weather?.tempMin || 0}°</span>
                  </div>
                </motion.div>

                {/* Weather Alerts */}
                <AnimatePresence>
                  {showAlerts && weatherAlerts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-black/20 backdrop-blur-sm rounded-xl p-3"
                    >
                      <WeatherAlerts
                        alerts={weatherAlerts}
                        onDismiss={dismissAlert}
                        compact={!isFullscreen}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Tabs */}
                <Tabs defaultValue="forecast" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5 h-10 bg-black/20 backdrop-blur-sm border-0">
                    <TabsTrigger value="forecast" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      Forecast
                    </TabsTrigger>
                    <TabsTrigger value="hourly" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      Hourly
                    </TabsTrigger>
                    <TabsTrigger value="agriculture" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      <Tractor className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="history" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      History
                    </TabsTrigger>
                    <TabsTrigger value="details" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                      Details
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4 bg-black/10 backdrop-blur-sm rounded-xl p-3 max-h-96 overflow-y-auto border border-white/10">
                    {/* Weather condition indicator */}
                    {weather?.condition && (expanded || isFullscreen) && (
                      <div className="mb-3 flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-white/10">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white/90 text-xs font-medium">
                          Live Weather: {weather.condition}
                        </span>
                        <div className="ml-auto text-white/70 text-xs">
                          Updated {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    )}

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

                    {activeTab === "hourly" && (
                      <HourlyForecast
                        hourlyData={hourlyForecast}
                        compact={!isFullscreen}
                      />
                    )}

                    {activeTab === "agriculture" && agricultureData && (
                      <AgricultureInsights
                        data={agricultureData}
                        weather={weather}
                        compact={!isFullscreen}
                      />
                    )}
                  </div>
                </Tabs>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
