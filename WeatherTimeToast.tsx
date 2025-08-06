import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle,
  Cloudy,
  CloudFog,
  Wind,
  Thermometer
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
}

interface WeatherTimeToastProps {
  className?: string;
}

const WeatherTimeToast: React.FC<WeatherTimeToastProps> = ({ className = '' }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get user's location and weather
  useEffect(() => {
    const getWeatherData = async () => {
      try {
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false
          });
        });

        const { latitude, longitude } = position.coords;

        // Try to get weather from OpenWeatherMap (free tier)
        // Note: In production, you'd want to store the API key securely
        const API_KEY = 'demo'; // Replace with actual API key
        
        try {
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
          );
          
          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            setWeather({
              temperature: Math.round(weatherData.main.temp),
              condition: weatherData.weather[0].main.toLowerCase(),
              location: weatherData.name
            });
          } else {
            throw new Error('Weather API failed');
          }
        } catch (apiError) {
          // Fallback to IP-based location and mock weather
          const ipResponse = await fetch('https://ipapi.co/json/');
          const ipData = await ipResponse.json();
          
          setWeather({
            temperature: Math.floor(Math.random() * 30) + 50, // Random temp between 50-80°F
            condition: ['clear', 'clouds', 'rain', 'drizzle'][Math.floor(Math.random() * 4)],
            location: ipData.city || 'Current Location'
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error getting weather data:', error);
        // Ultimate fallback data
        setWeather({
          temperature: 72,
          condition: 'clear',
          location: 'Location Unavailable'
        });
        setLoading(false);
      }
    };

    getWeatherData();
  }, []);

  const getWeatherIcon = (condition: string) => {
    const iconProps = { size: 16, className: "text-zinc-600" };
    
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun {...iconProps} className="text-yellow-500" />;
      case 'clouds':
      case 'cloudy':
        return <Cloud {...iconProps} />;
      case 'rain':
        return <CloudRain {...iconProps} className="text-blue-500" />;
      case 'drizzle':
        return <CloudDrizzle {...iconProps} className="text-blue-400" />;
      case 'snow':
        return <CloudSnow {...iconProps} className="text-blue-200" />;
      case 'thunderstorm':
        return <CloudLightning {...iconProps} className="text-purple-500" />;
      case 'fog':
      case 'mist':
        return <CloudFog {...iconProps} className="text-gray-400" />;
      case 'wind':
        return <Wind {...iconProps} />;
      default:
        return <Thermometer {...iconProps} />;
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center py-4 bg-transparent ${className}`}>
        <div 
          className="bg-stone-50/90 backdrop-blur-sm border border-stone-200 rounded-full px-4 py-2 shadow-lg"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          <span className="text-xs text-zinc-500">loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center py-4 bg-transparent ${className}`}>
      <div 
        className="bg-stone-50/90 backdrop-blur-sm border border-stone-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
      >
        <div className="flex items-center space-x-3 text-xs">
          {/* Time */}
          <span className="text-zinc-800 font-medium">
            {currentTime}
          </span>
          
          {/* Separator */}
          <span className="text-zinc-300">•</span>
          
          {/* Weather */}
          {weather && (
            <div className="flex items-center space-x-2">
              {getWeatherIcon(weather.condition)}
              <span className="text-zinc-600">
                {weather.temperature}°F
              </span>
              <span className="text-zinc-500 capitalize">
                {weather.condition}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherTimeToast;