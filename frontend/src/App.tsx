import { Toaster } from "@/components/ui/sonner";
import {
  CheckSquare,
  Clock,
  CloudSun,
  Settings,
  Plus,
  Music,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Particles } from "./components/Particles";
import { SettingsPanel } from "./components/SettingsPanel";
import { WidgetPill } from "./components/WidgetPill";
import { FloatingMusicPill } from "./components/FloatingMusicPill";
import { useClock } from "./hooks/useClock";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTheme } from "./hooks/useTheme";
import { useWeather } from "./hooks/useWeather";
import { WeatherIcon } from "./components/WeatherIcon";
import { WidgetCanvas } from "./components/WidgetCanvas";
import { WidgetLibrary } from "./components/WidgetLibrary";
import { useWidgets } from "./context/WidgetContext";
import { MusicWidget } from "./components/MusicWidget";
import { ClockWidget } from "./components/ClockWidget";
import { WeatherWidget } from "./components/WeatherWidget";
import { TodoWidget } from "./components/TodoWidget";
import { CalculatorWidget } from "./components/CalculatorWidget";

interface BackgroundState {
  url: string;
  type: "image" | "video";
}

// Weather-based accent colors
const WEATHER_ACCENTS: Record<
  string,
  { accent: string; accentRaw: string; accentGlow: string; accentSoft: string }
> = {
  clear: {
    accent: "0.65 0.25 40",
    accentRaw: "oklch(65% 0.25 40)",
    accentGlow: "rgba(251, 146, 60, 0.35)",
    accentSoft: "rgba(251, 146, 60, 0.12)",
  },
  "partly-cloudy": {
    accent: "0.65 0.25 180",
    accentRaw: "oklch(65% 0.25 180)",
    accentGlow: "rgba(45, 212, 191, 0.35)",
    accentSoft: "rgba(45, 212, 191, 0.12)",
  },
  foggy: {
    accent: "0.65 0.25 240",
    accentRaw: "oklch(65% 0.25 240)",
    accentGlow: "rgba(96, 165, 250, 0.35)",
    accentSoft: "rgba(96, 165, 250, 0.12)",
  },
  rainy: {
    accent: "0.65 0.22 240",
    accentRaw: "oklch(65% 0.22 240)",
    accentGlow: "rgba(59, 130, 246, 0.35)",
    accentSoft: "rgba(59, 130, 246, 0.12)",
  },
  snowy: {
    accent: "0.65 0.15 250",
    accentRaw: "oklch(65% 0.15 250)",
    accentGlow: "rgba(147, 197, 253, 0.35)",
    accentSoft: "rgba(147, 197, 253, 0.12)",
  },
  showers: {
    accent: "0.65 0.22 240",
    accentRaw: "oklch(65% 0.22 240)",
    accentGlow: "rgba(59, 130, 246, 0.35)",
    accentSoft: "rgba(59, 130, 246, 0.12)",
  },
  thunderstorm: {
    accent: "0.65 0.25 270",
    accentRaw: "oklch(65% 0.25 270)",
    accentGlow: "rgba(139, 92, 246, 0.4)",
    accentSoft: "rgba(139, 92, 246, 0.15)",
  },
};

export default function App() {
  const themeState = useTheme();
  const weatherState = useWeather();
  const clockState = useClock();
  const { expandedWidgetId, setExpandedWidgetId, activeWidgets } = useWidgets();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [bg, setBg] = useLocalStorage<BackgroundState | null>(
    "dashboard_bg_v2",
    null,
  );

  // Todo count for pill
  const [todoCount, setTodoCount] = useState(0);
  useEffect(() => {
    const updateCount = () => {
      try {
        const raw = window.localStorage.getItem("dashboard_todos");
        if (raw) {
          const todos = JSON.parse(raw) as Array<{ completed: boolean }>;
          setTodoCount(todos.filter((t) => !t.completed).length);
        }
      } catch { /* empty */ }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    const id = setInterval(updateCount, 1000);
    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(id);
    };
  }, []);

  // Weather accent logic
  const weatherAccent = weatherState.data?.iconType
    ? WEATHER_ACCENTS[weatherState.data.iconType]
    : null;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeState.theme);
    document.documentElement.setAttribute("data-accent", themeState.accent);
  }, [themeState.theme, themeState.accent]);

  useEffect(() => {
    if (weatherAccent) {
      document.documentElement.style.setProperty("--accent", weatherAccent.accent);
      document.documentElement.style.setProperty("--accent-raw", weatherAccent.accentRaw);
      document.documentElement.style.setProperty("--accent-glow", weatherAccent.accentGlow);
      document.documentElement.style.setProperty("--accent-soft", weatherAccent.accentSoft);
    } else {
      document.documentElement.style.setProperty("--accent", "0.65 0.25 290");
      document.documentElement.style.setProperty("--accent-raw", "oklch(65% 0.25 290)");
      document.documentElement.style.setProperty("--accent-glow", "rgba(139, 92, 246, 0.35)");
      document.documentElement.style.setProperty("--accent-soft", "rgba(139, 92, 246, 0.12)");
    }
  }, [weatherAccent]);

  // Global Keybindings
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (settingsOpen) setSettingsOpen(false);
        else if (libraryOpen) setLibraryOpen(false);
        else if (expandedWidgetId) setExpandedWidgetId(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [settingsOpen, libraryOpen, expandedWidgetId, setExpandedWidgetId]);

  const handleSetBackground = useCallback(
    (url: string, type: "image" | "video") => setBg({ url, type }),
    [setBg],
  );

  const handleRemoveBackground = useCallback(() => setBg(null), [setBg]);

  // Pill data
  const clockTime = `${clockState.hours}:${clockState.minutes}`;
  const weatherTemp = weatherState.data ? `${weatherState.data.temperature}°` : "—";
  const todoLabel = todoCount === 0 ? "Done!" : `${todoCount}`;

  const isAnyWidgetExpanded = expandedWidgetId !== null;
  const isFloatingExpansion = expandedWidgetId && !activeWidgets.some(w => w.id === expandedWidgetId);
  const expandedType = expandedWidgetId?.split('-')[0];

  const renderExpandedWidget = () => {
    if (!expandedType) return null;

    const props = { size: 'large' as const, isExpanded: true };

    switch (expandedType) {
      case 'clock': return <ClockWidget {...props} />;
      case 'weather': return <WeatherWidget {...props} />;
      case 'todo': return <TodoWidget {...props} />;
      case 'music': return <MusicWidget {...props} />;
      case 'calculator': return <CalculatorWidget {...props} />;
      default: return null;
    }
  };

  const handlePillClick = (type: string) => {
    const existing = activeWidgets.find(w => w.type === type);
    if (existing) {
      setExpandedWidgetId(existing.id);
    } else {
      setExpandedWidgetId(`${type}-floating`);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black select-none">
      {/* ── Layer 0: Background ── */}
      {bg ? (
        bg.type === "video" ? (
          <video
            className="bg-media object-cover w-full h-full"
            src={bg.url}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img className="bg-media object-cover w-full h-full" src={bg.url} alt="Background" />
        )
      ) : (
        <div className="dashboard-bg no-image absolute inset-0 bg-zinc-950" aria-hidden="true" />
      )}

      {/* ── Layer 1: Overlay ── */}
      <div className={`bg-overlay absolute inset-0 bg-black/40 transition-opacity duration-700 ${isAnyWidgetExpanded ? 'opacity-80' : 'opacity-40'}`} aria-hidden="true" />

      {/* ── Layer 2: Particles ── */}
      <Particles weatherType={weatherState.data?.iconType} />

      {/* ── Layer 3: Widget Canvas ── */}
      <WidgetCanvas />

      {/* ── UI Components (Library + Settings) ── */}
      <WidgetLibrary isOpen={libraryOpen} onClose={() => setLibraryOpen(false)} />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        {...themeState}
        backgroundUrl={bg?.url ?? null}
        backgroundType={bg?.type ?? null}
        onSetBackground={handleSetBackground}
        onRemoveBackground={handleRemoveBackground}
      />

      {/* ── Generic Expanded Widget Overlay (for Floating or Nav expansion) ── */}
      {isFloatingExpansion && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1999] animate-in fade-in duration-500"
            onClick={() => setExpandedWidgetId(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1000px] h-[70vh] md:h-[80vh] z-[2000]">
            <div className="glass-card w-full h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-4">Floating Expansion • {expandedType}</span>
                <button onClick={() => setExpandedWidgetId(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                {renderExpandedWidget()}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Floating Navigation Bar ── */}
      <nav
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full glass-card border-white/5 shadow-2xl z-50 transition-all duration-500 ${isAnyWidgetExpanded ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
        aria-label="Main navigation"
      >
        <button
          type="button"
          className="w-11 h-11 glass-btn flex items-center justify-center rounded-full hover:bg-accent-raw hover:text-white transition-all hover:scale-110 active:scale-90"
          onClick={() => setLibraryOpen(true)}
          aria-label="Add widget"
        >
          <Plus size={20} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <WidgetPill
          icon={<Clock size={18} />}
          value={clockTime}
          label="Clock"
          onClick={() => handlePillClick('clock')}
        />

        <div className="w-px h-6 bg-white/10 mx-1" />

        <WidgetPill
          icon={
            weatherState.data?.iconType ? (
              <WeatherIcon type={weatherState.data.iconType} size={20} />
            ) : (
              <CloudSun size={18} />
            )
          }
          value={weatherTemp}
          label="Weather"
          onClick={() => handlePillClick('weather')}
        />

        <div className="w-px h-6 bg-white/10 mx-1" />

        <WidgetPill
          icon={<CheckSquare size={18} />}
          value={todoLabel}
          label="Tasks"
          onClick={() => handlePillClick('todo')}
        />

        <FloatingMusicPill />

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          className="w-11 h-11 glass-btn flex items-center justify-center rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        >
          <Settings size={20} className="text-white/60" />
        </button>
      </nav>

      {/* ── Footer ── */}
      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 z-10 text-[10px] text-white/20 uppercase tracking-widest font-bold pointer-events-none">
        © {new Date().getFullYear()} Precision Dashboard • Built by Shani Kumar
      </footer>

      <Toaster />
    </div>
  );
}
