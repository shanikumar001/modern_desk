import React, { useMemo } from "react";
import { Disc } from "lucide-react";

interface MusicArtworkAnimationProps {
  isPlaying: boolean;
  size: number;
}

export const MusicArtworkAnimation: React.FC<MusicArtworkAnimationProps> = ({
  isPlaying,
  size,
}) => {
  const bars = useMemo(() => Array.from({ length: 5 }), []);

  const particles = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        left: 20 + Math.random() * 60,
        top: 20 + Math.random() * 60,
        duration: 3 + Math.random() * 4,
        delay: i * 0.4,
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
      })),
    []
  );

  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden">

      {/* Pulse Ring */}
      {isPlaying && (
        <div className="absolute inset-2 rounded-full border border-white/20 animate-pulseRing opacity-40" />
      )}

      {/* Glow Layer */}
      <div
        className={`absolute inset-3 rounded-full blur-2xl transition-opacity duration-700 ${
          isPlaying ? "opacity-100 bg-accent/20" : "opacity-0"
        }`}
      />

      {/* Rotating Disc */}
      <div
        className={`relative z-10 flex items-center justify-center ${
          isPlaying ? "animate-discSpin" : ""
        }`}
        style={{
          animationPlayState: isPlaying ? "running" : "paused",
        }}
      >
        <div className="rounded-full bg-gradient-to-tr from-white/10 to-transparent p-4 border border-white/10 shadow-inner backdrop-blur-md">
          <Disc
            size={size * 0.45}
            className={`transition-colors duration-700 ${
              isPlaying ? "text-accent/50" : "text-white/10"
            }`}
          />
        </div>
      </div>

      {/* Floating Particles */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-floatParticle"
              style={
                {
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  "--float-x": `${p.x}px`,
                  "--float-y": `${p.y}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Equalizer */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
        {bars.map((_, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full bg-accent/70 ${
              isPlaying ? "animate-eq" : "h-[3px]"
            }`}
            style={{
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      <style >{`
        @keyframes discSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-discSpin {
          animation: discSpin 18s linear infinite;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.9);
            opacity: 0.5;
          }
          70% {
            transform: scale(1.15);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-pulseRing {
          animation: pulseRing 3s ease-out infinite;
        }

        @keyframes floatParticle {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0;
          }
          50% {
            transform: translate(var(--float-x), var(--float-y));
            opacity: 0.7;
          }
        }

        .animate-floatParticle {
          animation: floatParticle linear infinite;
        }

        @keyframes eq {
          0%,
          100% {
            height: 4px;
          }
          50% {
            height: 16px;
          }
        }

        .animate-eq {
          animation: eq 0.7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};