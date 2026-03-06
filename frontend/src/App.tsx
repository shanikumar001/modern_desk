import { Toaster } from "@/components/ui/sonner";
import {
  CheckSquare,
  Clock,
  CloudSun,
  Settings,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ClockWidget } from "./components/ClockWidget";
import { Particles } from "./components/Particles";
import { SettingsPanel } from "./components/SettingsPanel";
import { TodoWidget } from "./components/TodoWidget";
import { WeatherWidget } from "./components/WeatherWidget";
import { WidgetPill } from "./components/WidgetPill";
import { useClock } from "./hooks/useClock";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTheme } from "./hooks/useTheme";
import { useWeather } from "./hooks/useWeather";
import { WeatherIcon } from "./components/WeatherIcon";

interface BackgroundState {
  url: string;
  type: "image" | "video";
}

type ExpandedWidget = "clock" | "weather" | "todo" | null;

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expandedWidget, setExpandedWidget] = useState<ExpandedWidget>(null);
  const [bg, setBg] = useLocalStorage<BackgroundState | null>(
    "dashboard_bg_v2",
    null,
  );

  // Todo count for pill — read from localStorage
  const [todoCount, setTodoCount] = useState(0);
  useEffect(() => {
    const updateCount = () => {
      try {
        const raw = window.localStorage.getItem("dashboard_todos");
        if (raw) {
          const todos = JSON.parse(raw) as Array<{ completed: boolean }>;
          setTodoCount(todos.filter((t) => !t.completed).length);
        }
      } catch {
        /* empty */
      }
    };
    updateCount();
    // Listen for storage changes from TodoWidget
    window.addEventListener("storage", updateCount);
    const id = setInterval(updateCount, 1000);
    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(id);
    };
  }, []);

  // Weather accent
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

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (settingsOpen) setSettingsOpen(false);
        else if (expandedWidget) setExpandedWidget(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [settingsOpen, expandedWidget]);

  const handleSetBackground = useCallback(
    (url: string, type: "image" | "video") => {
      setBg({ url, type });
    },
    [setBg],
  );

  const handleRemoveBackground = useCallback(() => {
    setBg(null);
  }, [setBg]);

  const toggleWidget = useCallback(
    (widget: ExpandedWidget) => {
      setExpandedWidget((prev) => (prev === widget ? null : widget));
    },
    [],
  );

  const closePanel = useCallback(() => {
    setExpandedWidget(null);
  }, []);

  // Pill data
  const clockTime = `${clockState.hours}:${clockState.minutes}`;
  const weatherTemp = weatherState.data
    ? `${weatherState.data.temperature}°`
    : "—";
  const todoLabel = todoCount === 0 ? "Done!" : `${todoCount}`;

  const isExpanded = expandedWidget !== null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* ── Layer 0: Background ── */}
      {bg ? (
        bg.type === "video" ? (
          <video
            className="bg-media"
            src={bg.url}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img className="bg-media" src={bg.url} alt="Background" />
        )
      ) : (
        <div className="dashboard-bg no-image" aria-hidden="true" />
      )}

      {/* ── Layer 1: Overlay ── */}
      <div className="bg-overlay" aria-hidden="true" />

      {/* ── Layer 2: Particles ── */}
      <Particles weatherType={weatherState.data?.iconType} />

      {/* ── Widget Bar (bottom-center pills) ── */}
      <nav className="widget-bar" aria-label="Widget bar">
        <WidgetPill
          icon={<Clock size={18} />}
          value={clockTime}
          label="Clock"
          active={expandedWidget === "clock"}
          dimmed={isExpanded && expandedWidget !== "clock"}
          onClick={() => toggleWidget("clock")}
        />

        <div className="widget-bar__divider" />

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
          active={expandedWidget === "weather"}
          dimmed={isExpanded && expandedWidget !== "weather"}
          onClick={() => toggleWidget("weather")}
        />

        <div className="widget-bar__divider" />

        <WidgetPill
          icon={<CheckSquare size={18} />}
          value={todoLabel}
          label="Tasks"
          active={expandedWidget === "todo"}
          dimmed={isExpanded && expandedWidget !== "todo"}
          onClick={() => toggleWidget("todo")}
        />

        <div className="widget-bar__divider" />

        {/* Settings gear in the bar */}
        <button
          type="button"
          data-ocid="settings.open_modal_button"
          className={`gear-button glass-btn settings-btn${isExpanded ? " dimmed" : ""}`}
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          aria-expanded={settingsOpen}
          style={{
            position: "static",
            width: 44,
            height: 44,
            opacity: isExpanded ? 0.35 : 1,
            filter: isExpanded ? "blur(1px)" : "none",
            pointerEvents: isExpanded ? "none" : "all",
            transition: "opacity 0.3s ease, filter 0.3s ease",
          }}
        >
          <Settings size={20} style={{ transition: "none" }} />
        </button>
      </nav>

      {/* ── Expanded Overlay ── */}
      <div
        className={`widget-expanded-overlay${isExpanded ? " visible" : ""}`}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* ── Expanded Panel ── */}
      <div
        className={`widget-panel-wrapper${isExpanded ? " visible" : ""}`}
      >
        <div className="widget-panel" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button
            type="button"
            className="widget-panel__close"
            onClick={closePanel}
            aria-label="Close panel"
          >
            <X size={16} />
          </button>

          {/* Render the active widget's expanded content */}
          {expandedWidget === "clock" && <ClockWidget />}
          {expandedWidget === "weather" && <WeatherWidget />}
          {expandedWidget === "todo" && <TodoWidget />}
        </div>
      </div>

      {/* ── Settings Panel ── */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        {...themeState}
        backgroundUrl={bg?.url ?? null}
        backgroundType={bg?.type ?? null}
        onSetBackground={handleSetBackground}
        onRemoveBackground={handleRemoveBackground}
      />

      {/* ── Footer ── */}
      <footer
        style={{
          position: "fixed",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          fontSize: "0.6rem",
          color: "var(--text-muted)",
          fontFamily: "Cabinet Grotesk, sans-serif",
          letterSpacing: "0.04em",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        © {new Date().getFullYear()}.{" "}
        <span style={{ pointerEvents: "all" }}>
          <a
            href={`https://frontend-3ckl.onrender.com/`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-raw)", textDecoration: "none" }}
          >
            Built By shani kumar
          </a>
        </span>
      </footer>

      <Toaster />
    </div>
  );
}
