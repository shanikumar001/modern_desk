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
import { WidgetSize } from "../context/WidgetContext";

interface WeatherWidgetProps {
  size?: WidgetSize;
  width?: number;
  height?: number;
  isExpanded?: boolean;
}

export function WeatherWidget({ size = 'small', width = 200, height = 200, isExpanded = false }: WeatherWidgetProps) {
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

  // Calculate responsive scale based on actual dimensions
  const scale = isExpanded ? 1.5 : Math.min(width / 280, height / 320);
  
  // Determine widget modes
  const isMini = !isExpanded && (width < 200 || height < 200);
  const isCompact = !isExpanded && (width < 280 || height < 280);

  // ── MINI VIEW (180x180 or smaller) ──
  if (isMini) {
    const iconSize = Math.max(20, Math.min(width, height) * 0.3);
    const tempSize = Math.max(12, Math.min(width, height) * 0.16);
    const infoSize = Math.max(8, Math.min(width, height) * 0.08);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-1 animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-raw/10 to-transparent opacity-50" />

        {data ? (
          <>
            {/* Weather Icon with Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-accent-raw/20 blur-xl opacity-50 animate-pulse" />
              <WeatherIcon type={data.iconType} size={iconSize} />
            </div>

            {/* Temperature */}
            <div 
              className="font-bold text-white leading-none whitespace-nowrap mt-0.5" 
              style={{ fontSize: `${tempSize}px` }}
            >
              {data.temperature}°
            </div>

            {/* City Name */}
            <div 
              className="text-white/50 mt-0.5 font-medium truncate max-w-full px-1 text-center"
              style={{ fontSize: `${infoSize}px` }}
            >
              {data.cityName || 'Weather'}
            </div>

            {/* Humidity & Wind */}
            <div className="flex items-center gap-1 mt-0.5 text-white/40">
              <Droplets size={infoSize} />
              <span style={{ fontSize: `${infoSize}px` }}>{data.humidity}%</span>
              <Wind size={infoSize} className="ml-1" />
              <span style={{ fontSize: `${infoSize}px` }}>{data.windSpeed}</span>
            </div>
          </>
        ) : isLoading ? (
          <RefreshCw size={20} className="text-white/20 animate-spin" />
        ) : (
          <div className="flex flex-col items-center">
            <AlertTriangle size={20} className="text-rose-400/50 mb-1" />
            <p className="text-[6px] text-white/30 text-center px-1">Tap to load</p>
          </div>
        )}
      </div>
    );
  }

  // ── COMPACT VIEW (medium-small widgets ~280x280) ──
  if (isCompact) {
    const iconSize = Math.max(28, Math.min(width, height) * 0.3);
    const tempSize = Math.max(18, Math.min(width, height) * 0.18);
    const citySize = Math.max(8, Math.min(width, height) * 0.07);
    const infoSize = Math.max(9, Math.min(width, height) * 0.07);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-1.5 animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-raw/10 to-transparent opacity-50" />

        {data ? (
          <>
            {/* Weather Icon with Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-accent-raw/20 blur-xl opacity-50 animate-pulse" />
              <WeatherIcon type={data.iconType} size={iconSize} />
            </div>

            {/* Temperature */}
            <div 
              className="font-bold text-white leading-none whitespace-nowrap mt-0.5" 
              style={{ fontSize: `${tempSize}px` }}
            >
              {data.temperature}°
            </div>

            {/* City Name */}
            <div 
              className="text-white/50 mt-0.5 font-medium truncate max-w-full px-2 text-center"
              style={{ fontSize: `${citySize}px` }}
            >
              {data.cityName || 'Weather'}
            </div>

            {/* Humidity & Wind */}
            <div className="flex items-center gap-2 mt-0.5 text-white/40">
              <div className="flex items-center gap-0.5">
                <Droplets size={infoSize} />
                <span style={{ fontSize: `${infoSize}px` }}>{data.humidity}%</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-0.5">
                <Wind size={infoSize} />
                <span style={{ fontSize: `${infoSize}px` }}>{data.windSpeed}km/h</span>
              </div>
            </div>
          </>
        ) : isLoading ? (
          <RefreshCw size={24} className="text-white/20 animate-spin" />
        ) : (
          <div className="flex flex-col items-center">
            <AlertTriangle size={24} className="text-rose-400/50 mb-1" />
            <p className="text-[7px] text-white/30 text-center px-1">Tap to load</p>
          </div>
        )}
      </div>
    );
  }

  // ── STANDARD / LARGE / EXPANDED VIEW ──
  return (
    <div className={`flex flex-col h-full animate-fade-in relative transition-all duration-500 ${isExpanded ? 'p-6 lg:p-12 max-w-4xl mx-auto justify-center' : 'p-3 lg:p-5'} overflow-hidden`}>
      {/* Background elements */}
      {!isExpanded && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-raw/5 to-transparent pointer-events-none" />
      )}

      {/* Header */}
      <div className={`flex items-center justify-between ${isExpanded ? 'mb-6 lg:mb-8' : 'mb-2 lg:mb-4'}`}>
        <div className="flex flex-col min-w-0">
          <h2 
            className={`font-bold text-white truncate ${isExpanded ? 'text-3xl lg:text-4xl' : 'text-sm lg:text-lg'}`} 
            style={!isExpanded ? { fontSize: `${Math.max(12, 16 * scale)}px` } : {}}
          >
            {data?.cityName || 'Weather'}
          </h2>
          <p className="text-white/50 text-[8px] lg:text-[10px] uppercase tracking-widest font-medium truncate">
            {data?.condition || 'Loading...'}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {savedCity && (
            <button
              type="button"
              onClick={useLocation}
              className="glass-btn p-1 lg:p-1.5"
              title="Use my location"
            >
              <MapPin size={isExpanded ? 18 : Math.max(12, 14 * scale)} className="text-white/60" />
            </button>
          )}
          <button
            type="button"
            onClick={refresh}
            className="glass-btn p-1 lg:p-1.5"
            title="Refresh weather"
          >
            <RefreshCw
              size={isExpanded ? 18 : Math.max(12, 14 * scale)}
              className={`text-white/60 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className={`flex items-center ${isExpanded ? 'gap-8 lg:gap-12 mb-8 lg:mb-16' : 'gap-4 lg:gap-6 mb-3 lg:mb-6'}`}>
        <div className="relative group shrink-0">
          <WeatherIcon type={data?.iconType || 'clear'} size={isExpanded ? 120 : Math.max(48, 64 * scale)} />
          <div className="absolute inset-0 bg-accent-raw/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="min-w-0">
          <div 
            className={`${isExpanded ? 'text-6xl lg:text-9xl' : 'text-3xl lg:text-5xl'} font-bold text-white tracking-tighter leading-none truncate`} 
            style={!isExpanded ? { fontSize: `${Math.max(24, 42 * scale)}px` } : {}}
          >
            {data?.temperature || '--'}°
          </div>
        </div>
      </div>

      {/* Secondary Stats - Grid reflows based on aspect ratio */}
      <div className={`grid gap-2 lg:gap-4 ${isExpanded ? 'grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12' : width > 300 ? 'grid-cols-2' : 'grid-cols-1'} mb-3 lg:mb-6`}>
        <div className="glass-card bg-white/5 border-white/5 p-2 lg:p-3 flex items-center gap-2 lg:gap-3">
          <div className="w-6 lg:w-8 h-6 lg:h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400 shrink-0">
            <Droplets size={12} />
          </div>
          <div className="min-w-0">
            <div className="text-[6px] lg:text-[8px] text-white/30 uppercase font-bold tracking-wider truncate">Humidity</div>
            <div className="text-xs lg:text-sm text-white font-medium">{data?.humidity || '--'}%</div>
          </div>
        </div>
        <div className="glass-card bg-white/5 border-white/5 p-2 lg:p-3 flex items-center gap-2 lg:gap-3">
          <div className="w-6 lg:w-8 h-6 lg:h-8 rounded-lg bg-accent-raw/10 flex items-center justify-center text-accent-raw shrink-0">
            <Wind size={12} />
          </div>
          <div className="min-w-0">
            <div className="text-[6px] lg:text-[8px] text-white/30 uppercase font-bold tracking-wider truncate">Wind</div>
            <div className="text-xs lg:text-sm text-white font-medium whitespace-nowrap">{data?.windSpeed || '--'} <span className="text-[8px] lg:text-[10px] opacity-40">km/h</span></div>
          </div>
        </div>
      </div>

      {/* Search Bar - Always show in expanded, show in normal if height permits */}
      {isExpanded || height > 250 ? (
        <div className="mt-auto pt-2 lg:pt-4 border-t border-white/10 shrink-0">
          <form onSubmit={handleSearch} className="relative group max-w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city..."
              className="w-full glass-input pl-8 lg:pl-10 py-1.5 lg:py-2 text-[10px] lg:text-xs bg-white/5 border-white/10 group-focus-within:border-accent-raw transition-all"
            />
            <Search
              size={12}
              className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-raw transition-colors"
            />
          </form>

          {isExpanded && (
            <div className="mt-6 lg:mt-8">
              <h3 className="text-xs lg:text-sm font-semibold text-white/60 mb-3 lg:mb-4 uppercase tracking-widest">Environment Intel</h3>
              <p className="text-xs lg:text-sm text-white/40 leading-relaxed italic max-w-2xl">
                Tracking atmospheric metrics in {data?.cityName || 'current location'}.
                All systems synchronized with high-fidelity telemetry.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Error Overlay */}
      {isError && !isLoading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center p-3 lg:p-4 text-center z-20">
          <AlertTriangle size={20} className="text-rose-400 mb-2" />
          <h3 className="text-white text-[10px] lg:text-xs font-bold mb-1">Telemetry Error</h3>
          <button onClick={refresh} className="glass-btn px-3 lg:px-4 py-1 lg:py-1.5 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest mt-2 hover:bg-white hover:text-black transition-all">
            Re-Sync
          </button>
        </div>
      )}
    </div>
  );
}

