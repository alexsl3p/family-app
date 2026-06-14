import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface WeatherData {
  temp: number;
  condition: string;
  conditionIcon: string;
  city: string;
}

function weatherCodeToRu(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Ясно', icon: '☀️' };
  if (code <= 2) return { label: 'Переменная облачность', icon: '⛅' };
  if (code === 3) return { label: 'Пасмурно', icon: '☁️' };
  if (code <= 48) return { label: 'Туман', icon: '🌫️' };
  if (code <= 57) return { label: 'Морось', icon: '🌦️' };
  if (code <= 67) return { label: 'Дождь', icon: '🌧️' };
  if (code <= 77) return { label: 'Снег', icon: '❄️' };
  if (code <= 82) return { label: 'Ливень', icon: '⛈️' };
  if (code <= 99) return { label: 'Гроза', icon: '🌩️' };
  return { label: 'Облачно', icon: '☁️' };
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      let lat = 55.7558;
      let lon = 37.6176;
      let city = 'Москва';

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
          lat = loc.coords.latitude;
          lon = loc.coords.longitude;
          const [addr] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
          city = addr.city ?? addr.region ?? addr.country ?? 'Мой город';
        }
      } catch {}

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        const { label, icon } = weatherCodeToRu(data.current.weather_code);
        if (!cancelled) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            condition: label,
            conditionIcon: icon,
            city,
          });
        }
      } catch {}

      if (!cancelled) setLoading(false);
    }

    fetchWeather();
    return () => { cancelled = true; };
  }, []);

  return { weather, loading };
}
