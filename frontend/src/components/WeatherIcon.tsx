import type { WeatherIconType } from "../hooks/useWeather";

interface WeatherIconProps {
  type: WeatherIconType;
  size?: number;
}

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];
const FOG_ROWS = [0.3, 0.45, 0.6, 0.72];
const RAIN_POS = [0.3, 0.5, 0.7];
const SNOW_POS = [0.3, 0.5, 0.7];
const SHOWER_POS = [0.3, 0.55];

export function WeatherIcon({ type, size = 64 }: WeatherIconProps) {
  const s = size;
  const half = s / 2;
  const r = s * 0.28;

  switch (type) {
    case "clear":
      return (
        <svg
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          fill="none"
          role="img"
          aria-label="Clear sky"
        >
          <title>Clear sky</title>
          <g className="weather-sun" transform={`rotate(0 ${half} ${half})`}>
            {RAYS.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = half + (r + 4) * Math.cos(rad);
              const y1 = half + (r + 4) * Math.sin(rad);
              const x2 = half + (r + 12) * Math.cos(rad);
              const y2 = half + (r + 12) * Math.sin(rad);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="oklch(72% 0.20 80)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
          <circle cx={half} cy={half} r={r} fill="oklch(82% 0.22 80)" />
        </svg>
      );

    case "partly-cloudy":
      return (
        <svg
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          fill="none"
          role="img"
          aria-label="Partly cloudy"
        >
          <title>Partly cloudy</title>
          <g
            className="weather-sun"
            transform={`rotate(0 ${s * 0.38} ${s * 0.38})`}
          >
            <circle
              cx={s * 0.38}
              cy={s * 0.38}
              r={s * 0.16}
              fill="oklch(82% 0.22 80)"
            />
          </g>
          <g className="weather-cloud">
            <ellipse
              cx={s * 0.6}
              cy={s * 0.62}
              rx={s * 0.28}
              ry={s * 0.16}
              fill="rgba(255,255,255,0.85)"
            />
            <circle
              cx={s * 0.52}
              cy={s * 0.58}
              r={s * 0.13}
              fill="rgba(255,255,255,0.85)"
            />
            <circle
              cx={s * 0.65}
              cy={s * 0.55}
              r={s * 0.11}
              fill="rgba(255,255,255,0.85)"
            />
          </g>
        </svg>
      );

    case "foggy":
      return (
        <svg
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          fill="none"
          role="img"
          aria-label="Foggy"
        >
          <title>Foggy</title>
          <g className="weather-cloud">
            {FOG_ROWS.map((y, i) => (
              <rect
                key={y}
                x={s * 0.1}
                y={s * y}
                width={s * (0.6 + (i % 2) * 0.15)}
                height={s * 0.04}
                rx={s * 0.02}
                fill="rgba(255,255,255,0.55)"
                style={{ opacity: 0.3 + i * 0.15 }}
              />
            ))}
          </g>
        </svg>
      );

    case "rainy":
      return (
        <svg
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          fill="none"
          role="img"
          aria-label="Rainy"
        >
          <title>Rainy</title>
          <g className="weather-cloud">
            <ellipse
              cx={half}
              cy={s * 0.38}
              rx={s * 0.32}
              ry={s * 0.18}
              fill="rgba(180,200,230,0.85)"
            />
            <circle
              cx={s * 0.38}
              cy={s * 0.32}
              r={s * 0.16}
              fill="rgba(180,200,230,0.85)"
            />
            <circle
              cx={s * 0.6}
              cy={s * 0.3}
              r={s * 0.13}
              fill="rgba(180,200,230,0.85)"
            />
          </g>
          {RAIN_POS.map((x) => (
            <line
              key={x}
              className="weather-rain-drop"
              x1={s * x}
              y1={s * 0.6}
              x2={s * (x - 0.04)}
              y2={s * 0.78}
              stroke="oklch(65% 0.12 240)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ animationDelay: `${x * 0.3}s` }}
            />
          ))}
        </svg>
      );

    case "snowy":
      return (
        <svg
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          fill="none"
          role="img"
          aria-label="Snowy"
        >
          <title>Snowy</title>
          <g className="weather-cloud">
            <ellipse
              cx={half}
              cy={s * 0.35}
              rx={s * 0.3}
              ry={s * 0.16}
              fill="rgba(220,235,255,0.85)"
            />
            <circle
              cx={s * 0.4}
              cy={s * 0.3}
              r={s * 0.14}
              fill="rgba(220,235,255,0.85)"
            />
            <circle
              cx={s * 0.6}
              cy={s * 0.28}
              r={s * 0.12}
              fill="rgba(220,235,255,0.85)"
            />
          </g>
          {SNOW_POS.map((x) => (
            <text
              key={x}
              className="weather-snow-flake"
              x={s * x - 5}
              y={s * 0.72}
              fontSize={s * 0.18}
              fill="rgba(220,235,255,0.9)"
              style={{ animationDelay: `${x * 0.4}s` }}
            >
              ❄
            </text>
          ))}
        </svg>
      );

    case "showers":
      return (
        <svg
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          fill="none"
          role="img"
          aria-label="Showers"
        >
          <title>Showers</title>
          <g className="weather-cloud">
            <ellipse
              cx={half}
              cy={s * 0.36}
              rx={s * 0.32}
              ry={s * 0.17}
              fill="rgba(180,200,230,0.75)"
            />
            <circle
              cx={s * 0.38}
              cy={s * 0.3}
              r={s * 0.15}
              fill="rgba(180,200,230,0.75)"
            />
            <circle
              cx={s * 0.6}
              cy={s * 0.28}
              r={s * 0.12}
              fill="rgba(180,200,230,0.75)"
            />
          </g>
          <circle
            cx={s * 0.75}
            cy={s * 0.22}
            r={s * 0.1}
            fill="oklch(82% 0.22 80)"
            opacity="0.7"
          />
          {SHOWER_POS.map((x) => (
            <line
              key={x}
              className="weather-rain-drop"
              x1={s * x}
              y1={s * 0.6}
              x2={s * (x - 0.04)}
              y2={s * 0.76}
              stroke="oklch(65% 0.12 240)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ animationDelay: `${x * 0.3}s` }}
            />
          ))}
        </svg>
      );

    case "thunderstorm":
      return (
        <svg
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          fill="none"
          role="img"
          aria-label="Thunderstorm"
        >
          <title>Thunderstorm</title>
          <g className="weather-cloud">
            <ellipse
              cx={half}
              cy={s * 0.32}
              rx={s * 0.35}
              ry={s * 0.19}
              fill="rgba(120,130,160,0.85)"
            />
            <circle
              cx={s * 0.36}
              cy={s * 0.26}
              r={s * 0.16}
              fill="rgba(120,130,160,0.85)"
            />
            <circle
              cx={s * 0.62}
              cy={s * 0.24}
              r={s * 0.13}
              fill="rgba(120,130,160,0.85)"
            />
          </g>
          <path
            className="weather-lightning"
            d={`M ${s * 0.52} ${s * 0.55} L ${s * 0.42} ${s * 0.7} L ${s * 0.5} ${s * 0.7} L ${s * 0.4} ${s * 0.88} L ${s * 0.56} ${s * 0.68} L ${s * 0.48} ${s * 0.68} Z`}
            fill="oklch(90% 0.20 80)"
          />
        </svg>
      );

    default:
      return null;
  }
}
