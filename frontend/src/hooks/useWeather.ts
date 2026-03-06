import { useCallback, useEffect, useState } from "react";
import { useApi } from "./useActor";

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  iconType: WeatherIconType;
  cityName?: string;
  country?: string;
}

export type WeatherIconType =
  | "clear"
  | "partly-cloudy"
  | "foggy"
  | "rainy"
  | "snowy"
  | "showers"
  | "thunderstorm";

export type WeatherStatus =
  | "idle"
  | "locating"
  | "loading"
  | "success"
  | "error"
  | "denied";

export interface WeatherState {
  data: WeatherData | null;
  status: WeatherStatus;
  errorMessage: string;
  refresh: () => void;
  searchByCity: (city: string) => Promise<boolean>;
  useLocation: () => void;
  savedCity: string | null;
}

function getCondition(code: number): {
  condition: string;
  iconType: WeatherIconType;
} {
  if (code === 0) return { condition: "Clear Sky", iconType: "clear" };
  if (code <= 3)
    return { condition: "Partly Cloudy", iconType: "partly-cloudy" };
  if (code === 45 || code === 48)
    return { condition: "Foggy", iconType: "foggy" };
  if ([51, 53, 55, 61, 63, 65].includes(code))
    return { condition: "Rainy", iconType: "rainy" };
  if ([71, 73, 75, 77].includes(code))
    return { condition: "Snowy", iconType: "snowy" };
  if ([80, 81, 82].includes(code))
    return { condition: "Showers", iconType: "showers" };
  if ([95, 96, 99].includes(code))
    return { condition: "Thunderstorm", iconType: "thunderstorm" };
  return { condition: "Unknown", iconType: "clear" };
}

const SAVED_CITY_KEY = "weather_saved_city";

export function useWeather(): WeatherState {
  const { api } = useApi();
  const [data, setData] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [savedCity, setSavedCity] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(SAVED_CITY_KEY);
    } catch {
      return null;
    }
  });

  const fetchWeatherData = useCallback(
    async (lat: number, lon: number, cityName?: string, country?: string) => {
      setStatus("loading");
      try {
        const parsed = await api.fetchWeather(lat, lon);
        const current = parsed?.current;
        if (!current) throw new Error("Invalid weather response");
        const code = current.weather_code ?? 0;
        const { condition, iconType } = getCondition(code);
        setData({
          temperature: Math.round(current.temperature_2m ?? 0),
          humidity: Math.round(current.relative_humidity_2m ?? 0),
          windSpeed: Math.round(current.wind_speed_10m ?? 0),
          weatherCode: code,
          condition,
          iconType,
          cityName,
          country,
        });
        setStatus("success");
      } catch (err) {
        console.error("Weather fetch error:", err);
        setErrorMessage("Failed to load weather data.");
        setStatus("error");
      }
    },
    [api],
  );

  const searchByCity = useCallback(
    async (city: string): Promise<boolean> => {
      setStatus("loading");
      setErrorMessage("");
      try {
        const result = await api.geocode(city);
        if (result && result.latitude && result.longitude) {
          await fetchWeatherData(
            result.latitude,
            result.longitude,
            result.name,
            result.country,
          );
          setSavedCity(city);
          try {
            window.localStorage.setItem(SAVED_CITY_KEY, city);
          } catch {}
          return true;
        }
        setErrorMessage("City not found");
        setStatus("error");
        return false;
      } catch (err) {
        console.error("City search error:", err);
        setErrorMessage("Failed to find city");
        setStatus("error");
        return false;
      }
    },
    [api, fetchWeatherData],
  );

  const useLocation = useCallback(() => {
    setSavedCity(null);
    try {
      window.localStorage.removeItem(SAVED_CITY_KEY);
    } catch {}
    requestLocation();
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherData(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setStatus("denied");
        setErrorMessage("Location permission denied.");
      },
      { timeout: 10000 },
    );
  }, [fetchWeatherData]);

  useEffect(() => {
    if (status === "idle") {
      // If there's a saved city, use it; otherwise use location
      if (savedCity) {
        searchByCity(savedCity);
      } else {
        requestLocation();
      }
    }
  }, [status, savedCity, requestLocation, searchByCity]);

  return {
    data,
    status,
    errorMessage,
    refresh: savedCity ? () => searchByCity(savedCity) : requestLocation,
    searchByCity,
    useLocation,
    savedCity,
  };
}
