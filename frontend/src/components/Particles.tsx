import { useMemo } from "react";
import type { WeatherIconType } from "../hooks/useWeather";

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: string;
  opacity: number;
}

const PARTICLE_COUNT = 28;

// Weather-based particle colors
const WEATHER_COLORS: Record<WeatherIconType | "default", string> = {
  default: "rgba(139, 92, 246, 0.25)", // Purple (accent)
  clear: "rgba(245, 158, 11, 0.35)", // Amber/sun
  "partly-cloudy": "rgba(250, 204, 21, 0.25)", // Yellow
  foggy: "rgba(156, 163, 175, 0.3)", // Gray
  rainy: "rgba(59, 130, 246, 0.35)", // Blue
  snowy: "rgba(199, 210, 254, 0.4)", // Light blue/white
  showers: "rgba(59, 130, 246, 0.35)", // Blue
  thunderstorm: "rgba(168, 85, 247, 0.4)", // Purple/lightning
};

interface ParticlesProps {
  weatherType?: WeatherIconType;
}

export function Particles({ weatherType }: ParticlesProps) {
  const particleColor = weatherType ? WEATHER_COLORS[weatherType] : WEATHER_COLORS.default;

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 20,
      drift: `${(Math.random() - 0.5) * 120}px`,
      opacity: 0.1 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={
            {
              left: p.left,
              bottom: "-20px",
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              background: particleColor,
              "--drift": p.drift,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
