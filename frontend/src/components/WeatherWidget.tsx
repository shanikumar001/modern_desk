import { useState } from "react";
import {
  AlertTriangle,
  Droplets,
  MapPin,
  RefreshCw,
  Search,
  Wind,
} from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import { WeatherIcon } from "./WeatherIcon";

export function WeatherWidget() {
  const {
    data,
    status,
    errorMessage,
    refresh,
    searchByCity,
    useLocation,
    savedCity,
  } = useWeather();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const isLoading = status === "locating" || status === "loading";
  const isError = status === "error" || status === "denied";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    await searchByCity(searchQuery.trim());
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col gap-3 animate-fade-in p-5">
      {/* Label */}
      <div className="flex items-center justify-between">
        <div className="widget-title" style={{ color: "var(--text-muted)" }}>
          Weather
        </div>
        <div className="flex items-center gap-2">
          {savedCity && (
            <button
              type="button"
              onClick={useLocation}
              className="glass-btn p-2"
              title="Use my location"
              aria-label="Use my location"
              style={{ padding: "6px" }}
            >
              <MapPin
                size={14}
                style={{ color: "var(--text-secondary)" }}
              />
            </button>
          )}
          <button
            type="button"
            data-ocid="weather.refresh"
            onClick={refresh}
            className="glass-btn p-2"
            title="Refresh weather"
            aria-label="Refresh weather"
          >
            <RefreshCw
              size={14}
              style={{
                color: "var(--text-secondary)",
                animation: isLoading
                  ? "spin 1s linear infinite"
                  : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city..."
            className="glass-input"
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              fontSize: "0.85rem",
              fontFamily: "Cabinet Grotesk, sans-serif",
            }}
          />
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="glass-btn px-3"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isSearching || !searchQuery.trim() ? 0.5 : 1,
          }}
        >
          <Search
            size={16}
            style={{ color: "var(--text-primary)" }}
          />
        </button>
      </form>

      {/* Saved city indicator */}
      {savedCity && data?.cityName && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            fontFamily: "Cabinet Grotesk, sans-serif",
          }}
        >
          <MapPin size={12} />
          <span>
            {data.cityName}
            {data.country && `, ${data.country}`}
          </span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div
          data-ocid="weather.loading_state"
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="shimmer"
              style={{ width: 64, height: 64, borderRadius: 12 }}
            />
            <div className="flex flex-col gap-2">
              <div
                className="shimmer"
                style={{ width: 100, height: 28, borderRadius: 6 }}
              />
              <div
                className="shimmer"
                style={{ width: 70, height: 18, borderRadius: 6 }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div
              className="shimmer"
              style={{ width: 80, height: 18, borderRadius: 6 }}
            />
            <div
              className="shimmer"
              style={{ width: 80, height: 18, borderRadius: 6 }}
            />
          </div>
        </div>
      )}

      {/* Error / Denied State */}
      {isError && !isLoading && (
        <div
          data-ocid="weather.error_state"
          className="flex flex-col items-center gap-4 py-4"
          style={{ color: "var(--text-secondary)" }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={20}
              style={{ color: "oklch(72% 0.20 80)" }}
            />
            <span
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              {errorMessage || "Location unavailable"}
            </span>
          </div>
          {!savedCity && (
            <button
              type="button"
              data-ocid="weather.refresh"
              onClick={refresh}
              className="glass-btn px-4 py-2 text-sm font-semibold flex items-center gap-2"
              style={{
                color: "var(--text-primary)",
                fontFamily: "Cabinet Grotesk, sans-serif",
              }}
            >
              <MapPin size={14} />
              Allow Location & Retry
            </button>
          )}
        </div>
      )}

      {/* Success State */}
      {data && !isLoading && (
        <div
          data-ocid="weather.success_state"
          className="flex flex-col gap-4"
        >
          {/* Main weather */}
          <div className="flex items-center gap-4">
            <div style={{ flexShrink: 0 }}>
              <WeatherIcon type={data.iconType} size={52} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 200,
                  fontSize: "clamp(28px, 4vw, 42px)",
                  lineHeight: 1,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
                className="text-glow"
              >
                {data.temperature}°
              </div>
              <div
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  marginTop: 4,
                  letterSpacing: "0.03em",
                }}
              >
                {data.condition}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex gap-5"
            style={{
              borderTop: "1px solid var(--glass-border)",
              paddingTop: "12px",
            }}
          >
            <div
              className="flex items-center gap-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              <Droplets
                size={14}
                style={{ color: "var(--accent-raw)" }}
              />
              <span
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                }}
              >
                {data.humidity}%
              </span>
              <span style={{ fontSize: "0.72rem", opacity: 0.6 }}>
                humidity
              </span>
            </div>
            <div
              className="flex items-center gap-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              <Wind
                size={14}
                style={{ color: "var(--accent-raw)" }}
              />
              <span
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                }}
              >
                {data.windSpeed} km/h
              </span>
              <span style={{ fontSize: "0.72rem", opacity: 0.6 }}>
                wind
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Idle state */}
      {status === "idle" && !isLoading && !data && (
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          Initializing…
        </div>
      )}
    </div>
  );
}
