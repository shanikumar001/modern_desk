import { useClock } from "../hooks/useClock";
import { WidgetSize } from "../context/WidgetContext";
import { Globe, Clock, Settings2 } from "lucide-react";

interface ClockWidgetProps {
  size?: WidgetSize;
  width?: number;
  height?: number;
  isExpanded?: boolean;
}

export function ClockWidget({ size = 'small', width = 180, height = 180, isExpanded = false }: ClockWidgetProps) {
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

  // Determine widget modes
  const isMini = !isExpanded && (width < 160 || height < 160);
  const isCompact = !isExpanded && (width < 220 || height < 220);

  // Calculate responsive clock dimensions
  let clockSize: number;
  if (isExpanded) {
    clockSize = Math.min(width * 0.4, height * 0.5, 350);
  } else if (isMini) {
    clockSize = Math.min(width, height) * 0.7;
  } else if (isCompact) {
    clockSize = Math.min(width, height) * 0.8;
  } else {
    clockSize = Math.min(width, height) * 0.85;
  }
  
  const center = clockSize / 2;
  const hourHandLength = clockSize * 0.28;
  const minuteHandLength = clockSize * 0.38;
  const secondHandLength = clockSize * 0.42;
  const centerDot = Math.max(4, clockSize * 0.04);

  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30 - 90;
    const rad = (angle * Math.PI) / 180;
    const isMain = i % 3 === 0;
    const markerLength = isMain ? (clockSize * 0.08) : (clockSize * 0.04);
    const markerWidth = isMain ? Math.max(1, clockSize * 0.015) : Math.max(1, clockSize * 0.008);
    const innerRadius = clockSize / 2 - markerLength - (clockSize * 0.05);

    return {
      x1: center + innerRadius * Math.cos(rad),
      y1: center + innerRadius * Math.sin(rad),
      x2: center + (clockSize / 2 - (clockSize * 0.05)) * Math.cos(rad),
      y2: center + (clockSize / 2 - (clockSize * 0.05)) * Math.sin(rad),
      strokeWidth: markerWidth,
      opacity: isMain ? 1 : 0.5,
    };
  });

  // ── MINI VIEW (very small widgets) ──
  if (isMini) {
    const fontSize = Math.max(16, Math.min(width, height) * 0.22);
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-1 animate-fade-in overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-raw/5 to-transparent opacity-50" />
        
        {/* Simple digital display */}
        <div className="text-center">
          <div 
            className="font-bold text-white tracking-wider text-glow" 
            style={{ fontSize: `${fontSize}px` }}
          >
            {hours}:{minutes}
          </div>
          <div 
            className="text-white/40 uppercase tracking-wider mt-0.5"
            style={{ fontSize: `${fontSize * 0.4}px` }}
          >
            {ampm}
          </div>
        </div>
      </div>
    );
  }

  // ── COMPACT VIEW (small widgets) ──
  if (isCompact) {
    const fontSize = Math.max(12, Math.min(width, height) * 0.12);
    const digitalSize = clockSize * 0.16;
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-1.5 animate-fade-in overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-raw/5 to-transparent opacity-50" />
        
        {/* Analog Clock */}
        <div
          style={{
            position: "relative",
            width: clockSize,
            height: clockSize,
            borderRadius: "50%",
            background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid var(--glass-border)",
            boxShadow: `0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 15px var(--accent-glow-subtle)`,
          }}
          className="shrink-0"
        >
          <svg width={clockSize} height={clockSize} style={{ position: "absolute", top: 0, left: 0 }}>
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

          {/* Hands */}
          <div style={{ position: "absolute", top: center, left: center, width: hourHandLength, height: Math.max(2, clockSize * 0.02), background: "linear-gradient(90deg, transparent 0%, var(--text-primary) 100%)", borderRadius: 4, transformOrigin: "0 50%", transform: `rotate(${hourAngle - 90}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
          <div style={{ position: "absolute", top: center, left: center, width: minuteHandLength, height: Math.max(1.5, clockSize * 0.015), background: "linear-gradient(90deg, transparent 0%, var(--text-primary) 100%)", borderRadius: 3, transformOrigin: "0 50%", transform: `rotate(${minuteAngle - 90}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
          <div style={{ position: "absolute", top: center, left: center, width: secondHandLength, height: Math.max(1, clockSize * 0.008), background: "var(--accent-raw)", borderRadius: 1, transformOrigin: "0 50%", transform: `rotate(${secondAngle - 90}deg)`, boxShadow: "0 0 8px var(--accent-glow)", transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }} />
          <div style={{ position: "absolute", top: center - centerDot / 2, left: center - centerDot / 2, width: centerDot, height: centerDot, borderRadius: "50%", background: "var(--accent-raw)", boxShadow: "0 0 10px var(--accent-glow)", zIndex: 10 }} />

          {/* Digital Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-[12%]">
            <div className="font-bold text-white tracking-wider" style={{ fontSize: `${digitalSize}px` }}>
              {hours}:{minutes}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STANDARD VIEW (not expanded) ──
  if (!isExpanded) {
    return (
      <div className="flex flex-col h-full animate-fade-in relative items-center justify-center transition-all duration-500 p-3 lg:p-4 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-raw/5 to-transparent pointer-events-none opacity-50" />

        {/* Main Container */}
        <div className="flex flex-col items-center gap-3 lg:gap-6">

          {/* Analog Face */}
          <div
            style={{
              position: "relative",
              width: clockSize,
              height: clockSize,
              borderRadius: "50%",
              background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid var(--glass-border)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px var(--accent-glow-subtle)`,
            }}
            className="group shrink-0"
          >
            <svg width={clockSize} height={clockSize} style={{ position: "absolute", top: 0, left: 0 }}>
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

            {/* Hands */}
            <div style={{ position: "absolute", top: center, left: center, width: hourHandLength, height: Math.max(2, clockSize * 0.02), background: "linear-gradient(90deg, transparent 0%, var(--text-primary) 100%)", borderRadius: 4, transformOrigin: "0 50%", transform: `rotate(${hourAngle - 90}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            <div style={{ position: "absolute", top: center, left: center, width: minuteHandLength, height: Math.max(1.5, clockSize * 0.015), background: "linear-gradient(90deg, transparent 0%, var(--text-primary) 100%)", borderRadius: 3, transformOrigin: "0 50%", transform: `rotate(${minuteAngle - 90}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            <div style={{ position: "absolute", top: center, left: center, width: secondHandLength, height: Math.max(1, clockSize * 0.008), background: "var(--accent-raw)", borderRadius: 1, transformOrigin: "0 50%", transform: `rotate(${secondAngle - 90}deg)`, boxShadow: "0 0 12px var(--accent-glow)", transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            <div style={{ position: "absolute", top: center - centerDot / 2, left: center - centerDot / 2, width: centerDot, height: centerDot, borderRadius: "50%", background: "var(--accent-raw)", boxShadow: "0 0 15px var(--accent-glow)", zIndex: 10 }} />

            {/* Digital Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-[15%]">
              <div className="font-light text-white tracking-widest text-glow" style={{ fontSize: `${clockSize * 0.18}px` }}>
                {hours}:{minutes}
              </div>
            </div>
          </div>

          {/* Labels & Details */}
          <div className="text-center">
            <div className="text-white/80 font-medium" style={{ fontSize: `${Math.max(10, clockSize * 0.08)}px` }}>
              {dateString}
            </div>
            <div className="text-white/30 uppercase tracking-[0.3em] font-black mt-1" style={{ fontSize: `${Math.max(8, clockSize * 0.04)}px` }}>
              {ampm || 'Local Time'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── EXPANDED VIEW ──
  return (
    <div className="flex flex-col h-full animate-fade-in relative transition-all duration-500 p-4 lg:p-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-raw/10 to-transparent pointer-events-none" />

      {/* Main Content - Side by Side Layout */}
      <div className="flex flex-1 items-center justify-center gap-8 lg:gap-16">
        
        {/* Left Side - Large Clock */}
        <div className="flex flex-col items-center">
          {/* Analog Face - Large */}
          <div
            style={{
              position: "relative",
              width: clockSize,
              height: clockSize,
              borderRadius: "50%",
              background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              border: "2px solid var(--glass-border)",
              boxShadow: `0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 80px var(--accent-glow)`,
            }}
            className="group shrink-0"
          >
            <svg width={clockSize} height={clockSize} style={{ position: "absolute", top: 0, left: 0 }}>
              {hourMarkers.map((marker, i) => (
                <line
                  key={i}
                  x1={marker.x1}
                  y1={marker.y1}
                  x2={marker.x2}
                  y2={marker.y2}
                  stroke="var(--text-secondary)"
                  strokeWidth={marker.strokeWidth * 1.5}
                  strokeLinecap="round"
                  opacity={marker.opacity}
                />
              ))}
            </svg>

            {/* Hands */}
            <div style={{ position: "absolute", top: center, left: center, width: hourHandLength, height: Math.max(3, clockSize * 0.025), background: "linear-gradient(90deg, transparent 0%, var(--text-primary) 100%)", borderRadius: 6, transformOrigin: "0 50%", transform: `rotate(${hourAngle - 90}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            <div style={{ position: "absolute", top: center, left: center, width: minuteHandLength, height: Math.max(2, clockSize * 0.018), background: "linear-gradient(90deg, transparent 0%, var(--text-primary) 100%)", borderRadius: 4, transformOrigin: "0 50%", transform: `rotate(${minuteAngle - 90}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            <div style={{ position: "absolute", top: center, left: center, width: secondHandLength, height: Math.max(1.5, clockSize * 0.01), background: "var(--accent-raw)", borderRadius: 2, transformOrigin: "0 50%", transform: `rotate(${secondAngle - 90}deg)`, boxShadow: "0 0 15px var(--accent-glow)", transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            <div style={{ position: "absolute", top: center - centerDot / 2, left: center - centerDot / 2, width: centerDot * 1.5, height: centerDot * 1.5, borderRadius: "50%", background: "var(--accent-raw)", boxShadow: "0 0 20px var(--accent-glow)", zIndex: 10 }} />

            {/* Digital Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-[12%]">
              <div className="font-bold text-white tracking-wider" style={{ fontSize: `${clockSize * 0.2}px` }}>
                {hours}:{minutes}
              </div>
              <div className="text-white/50 uppercase tracking-widest mt-1" style={{ fontSize: `${clockSize * 0.06}px` }}>
                {seconds}
              </div>
            </div>
          </div>

          {/* Date and AM/PM */}
          <div className="mt-6 text-center">
            <div className="text-2xl lg:text-3xl text-white font-medium">
              {dateString}
            </div>
            <div className="text-white/40 uppercase tracking-[0.3em] font-bold mt-1 text-sm">
              {ampm || 'Local Time'} • {is24h ? '24-Hour' : '12-Hour'}
            </div>
          </div>
        </div>

        {/* Right Side - Controls and Info */}
        <div className="flex flex-col gap-6 lg:gap-8 max-w-md">
          
          {/* Global Telemetry */}
          <div className="glass-card bg-white/5 border-white/5 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-accent-raw">
              <Globe size={24} />
              <h3 className="text-lg font-bold uppercase tracking-[0.2em]">Global Telemetry</h3>
            </div>
            <div className="space-y-3">
              {[
                { city: 'New York', t: 'EST', h: '-5', time: `${(parseInt(hours) + 19) % 24}:${minutes}` },
                { city: 'London', t: 'GMT', h: '+0', time: `${(parseInt(hours) + 24) % 24}:${minutes}` },
                { city: 'Tokyo', t: 'JST', h: '+9', time: `${(parseInt(hours) + 9) % 24}:${minutes}` }
              ].map(tz => (
                <div key={tz.city} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm text-white/80 font-medium">{tz.city}</span>
                    <span className="text-[10px] text-white/40">UTC {tz.h}</span>
                  </div>
                  <span className="text-lg text-accent-raw font-mono font-bold">{tz.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Synchronization */}
          <div className="glass-card bg-white/5 border-white/5 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-blue-400">
              <Settings2 size={24} />
              <h3 className="text-lg font-bold uppercase tracking-[0.2em]">Synchronization</h3>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={toggle24h}
                className="w-full glass-btn py-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl"
              >
                Toggle {is24h ? '12-Hour' : '24-Hour'} Precision
              </button>
              <div className="text-[10px] text-white/30 text-center leading-relaxed italic uppercase tracking-widest font-bold">
                Master clock frequency: 1Hz stable
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

