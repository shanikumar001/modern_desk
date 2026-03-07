import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

interface Coords {
  lat: number;
  lon: number;
  name?: string;
  country?: string;
}

export function useWeather(): WeatherState {
  const { api } = useApi();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [internalStatus, setInternalStatus] = useState<"idle" | "locating" | "denied">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [savedCity, setSavedCity] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(SAVED_CITY_KEY);
    } catch {
      return null;
    }
  });

  // Main Weather Query
  const {
    data: weatherData,
    status: queryStatus,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon],
    queryFn: async () => {
      if (!coords) return null;
      const parsed = await api.fetchWeather(coords.lat, coords.lon);
      const current = parsed?.current;
      if (!current) throw new Error("Invalid weather response");

      const code = current.weather_code ?? 0;
      const { condition, iconType } = getCondition(code);

      return {
        temperature: Math.round(current.temperature_2m ?? 0),
        humidity: Math.round(current.relative_humidity_2m ?? 0),
        windSpeed: Math.round(current.wind_speed_10m ?? 0),
        weatherCode: code,
        condition,
        iconType,
        cityName: coords.name,
        country: coords.country,
      } as WeatherData;
    },
    enabled: !!coords,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt * 2000, 10000), // Exponential backoff
  });

  const searchByCity = useCallback(
    async (city: string): Promise<boolean> => {
      setInternalStatus("idle");
      setErrorMessage("");
      try {
        const result = await api.geocode(city);
        if (result && result.latitude && result.longitude) {
          setCoords({
            lat: result.latitude,
            lon: result.longitude,
            name: result.name,
            country: result.country,
          });
          setSavedCity(city);
          try {
            window.localStorage.setItem(SAVED_CITY_KEY, city);
          } catch { }
          return true;
        }
        setErrorMessage("City not found");
        return false;
      } catch (err) {
        console.error("City search error:", err);
        setErrorMessage("Failed to find city");
        return false;
      }
    },
    [api],
  );

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setInternalStatus("denied");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }
    setInternalStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setInternalStatus("idle");
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
        setInternalStatus("denied");
        setErrorMessage("Location permission denied.");
      },
      { timeout: 10000 },
    );
  }, []);

  const useLocation = useCallback(() => {
    setSavedCity(null);
    setCoords(null);
    try {
      window.localStorage.removeItem(SAVED_CITY_KEY);
    } catch { }
    requestLocation();
  }, [requestLocation]);

  // Initial load
  useEffect(() => {
    if (coords === null && internalStatus === "idle") {
      if (savedCity) {
        searchByCity(savedCity);
      } else {
        requestLocation();
      }
    }
  }, [coords, internalStatus, savedCity, searchByCity, requestLocation]);

  // Map status
  let status: WeatherStatus = "idle";
  if (internalStatus === "locating") status = "locating";
  else if (internalStatus === "denied") status = "denied";
  else if (queryStatus === "pending" && coords) status = "loading";
  else if (queryStatus === "success") status = "success";
  else if (queryStatus === "error" || errorMessage) status = "error";

  return {
    data: weatherData || null,
    status,
    errorMessage: errorMessage || (queryError ? "Failed to load weather data." : ""),
    refresh: () => refetch(),
    searchByCity,
    useLocation,
    savedCity,
  };
}
