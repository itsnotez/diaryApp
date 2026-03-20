export async function fetchCurrentWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await response.json();
    
    if (!data.current_weather) return null;

    const { temperature, weathercode, windspeed } = data.current_weather;
    
    let weather = mapWmoCodeToWeather(weathercode);
    
    // Override with 'windy' if wind speed is high (> 20 km/h) and not precipitating
    if (windspeed > 20 && ['sunny', 'cloudy'].includes(weather)) {
      weather = 'windy';
    }

    return {
      temperature: Math.round(temperature),
      weather
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}

function mapWmoCodeToWeather(code) {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  // 0: Clear sky
  if (code === 0) return 'sunny';
  
  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  // 45, 48: Fog
  if ([1, 2, 3, 45, 48].includes(code)) return 'cloudy';
  
  // 51-57: Drizzle
  // 61-67: Rain
  // 80-82: Rain showers
  // 95-99: Thunderstorm
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return 'rainy';
  
  // 71-77: Snow
  // 85-86: Snow showers
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy';
  
  return 'sunny'; // Default fallback
}
