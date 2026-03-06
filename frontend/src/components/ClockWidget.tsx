import { useClock } from "../hooks/useClock";

export function ClockWidget() {
  const {
    hours,
    minutes,
    seconds,
    ampm,
    dateString,
    is24h,
    toggle24h,
  } = useClock();

  const hour24 = parseInt(hours, 10);
  const minuteVal = parseInt(minutes, 10);
  const secondVal = parseInt(seconds, 10);

  const displayHours = is24h ? hour24 : (hour24 % 12 || 12);
  const hourAngle = ((displayHours % 12) + minuteVal / 60) * 30;
  const minuteAngle = minuteVal * 6;
  const secondAngle = secondVal * 6;

  const clockSize = 180;
  const center = clockSize / 2;
  const hourHandLength = clockSize * 0.28;
  const minuteHandLength = clockSize * 0.38;
  const secondHandLength = clockSize * 0.42;
  const centerDot = 8;

  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30 - 90;
    const rad = (angle * Math.PI) / 180;
    const isMain = i % 3 === 0;
    const markerLength = isMain ? 12 : 6;
    const markerWidth = isMain ? 3 : 1.5;
    const innerRadius = clockSize / 2 - markerLength - 4;

    return {
      x1: center + innerRadius * Math.cos(rad),
      y1: center + innerRadius * Math.sin(rad),
      x2: center + (clockSize / 2 - 4) * Math.cos(rad),
      y2: center + (clockSize / 2 - 4) * Math.sin(rad),
      strokeWidth: markerWidth,
      opacity: isMain ? 1 : 0.5,
    };
  });

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-2">
      {/* Label */}
      <div className="widget-title" style={{ color: "var(--text-muted)" }}>
        Local Time
      </div>

      {/* Analog Watch Face */}
      <div className="flex justify-center items-center">
        <div
          style={{
            position: "relative",
            width: clockSize,
            height: clockSize,
            borderRadius: "50%",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid var(--glass-border)",
            boxShadow: `
              0 4px 20px rgba(0,0,0,0.15),
              inset 0 1px 0 rgba(255,255,255,0.1),
              0 0 40px var(--accent-glow)
            `,
          }}
        >
          <svg
            width={clockSize}
            height={clockSize}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {hourMarkers.map((marker, i) => (
              <line
                key={i}
                x1={marker.x1}
                y1={marker.y1}
                x2={marker.x2}
                y2={marker.y2}
                stroke="var(--text-secondary)"
                strokeWidth={marker.strokeWidth}
                strokeLinecap="round"
                opacity={marker.opacity}
              />
            ))}
          </svg>

          {/* Hour hand */}
          <div
            style={{
              position: "absolute",
              top: center,
              left: center,
              width: hourHandLength,
              height: 4,
              background:
                "linear-gradient(90deg, transparent 0%, var(--text-primary) 100%)",
              borderRadius: 2,
              transformOrigin: "0 50%",
              transform: `rotate(${hourAngle - 90}deg)`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Minute hand */}
          <div
            style={{
              position: "absolute",
              top: center,
              left: center,
              width: minuteHandLength,
              height: 3,
              background:
                "linear-gradient(90deg, transparent 0%, var(--text-primary) 100%)",
              borderRadius: 2,
              transformOrigin: "0 50%",
              transform: `rotate(${minuteAngle - 90}deg)`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Second hand */}
          <div
            style={{
              position: "absolute",
              top: center,
              left: center,
              width: secondHandLength,
              height: 1.5,
              background: "var(--accent-raw)",
              borderRadius: 1,
              transformOrigin: "0 50%",
              transform: `rotate(${secondAngle - 90}deg)`,
              boxShadow: "0 0 8px var(--accent-glow)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Center dot */}
          <div
            style={{
              position: "absolute",
              top: center - centerDot / 2,
              left: center - centerDot / 2,
              width: centerDot,
              height: centerDot,
              borderRadius: "50%",
              background: "var(--accent-raw)",
              boxShadow: "0 0 10px var(--accent-glow)",
              zIndex: 10,
            }}
          />

          {/* Digital time in center */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 200,
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              {hours}:{minutes}
            </div>
            {ampm && (
              <div
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {ampm}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date */}
      <div
        className="clock-date"
        style={{ color: "var(--text-secondary)", textAlign: "center" }}
      >
        {dateString}
      </div>

      {/* Format Toggle */}
      <button
        type="button"
        data-ocid="clock.toggle"
        onClick={toggle24h}
        className="glass-btn self-center px-4 py-1.5 text-xs font-semibold"
        style={{
          fontFamily: "Cabinet Grotesk, sans-serif",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {is24h ? "12h" : "24h"}
      </button>
    </div>
  );
}
