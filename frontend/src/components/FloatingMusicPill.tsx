import React from 'react';
import { Play, Pause, Music, Disc } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useWidgets } from '../context/WidgetContext';

export const FloatingMusicPill: React.FC = () => {
    const { isPlaying, currentTrack, playlist, togglePlay, nextTrack, prevTrack } = useMusic();
    const { setExpandedWidgetId, activeWidgets } = useWidgets();

    // Find the actual music widget ID from active widgets
    const musicWidget = activeWidgets.find(w => w.type === 'music');
    const musicWidgetId = musicWidget?.id || 'music-floating';

    const handleClick = () => {
        // Open the expanded music widget using actual widget ID
        setExpandedWidgetId(musicWidgetId);
    };

    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (playlist.length > 0) {
            togglePlay();
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        prevTrack();
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        nextTrack();
    };

    // Show mini player if there are tracks, otherwise show add music button
    const hasTracks = playlist.length > 0;

    return (
        <>
            {/* Divider */}
            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Music Pill */}
            <button
                type="button"
                onClick={handleClick}
                className="group flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-white/5 transition-all"
                aria-label="Music player"
            >
                {/* Animated Disc - shows when playing */}
                <div className={`relative flex items-center justify-center ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                        {hasTracks ? (
                            <Disc size={16} className="text-accent" />
                        ) : (
                            <Music size={14} className="text-white/40" />
                        )}
                    </div>
                    {/* Equalizer animation overlay when playing */}
                    {isPlaying && (
                        <div className="absolute -bottom-1 flex items-end gap-0.5">
                            {[1, 2, 3].map(i => (
                                <div 
                                    key={i} 
                                    className="w-0.5 bg-accent rounded-full animate-bounce" 
                                    style={{ height: '6px', animationDelay: `${i * 0.1}s` }} 
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Track name or status */}
                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-white/80 truncate max-w-[60px]">
                        {hasTracks ? currentTrack?.name || 'Playing' : 'Music'}
                    </span>
                    {hasTracks && (
                        <span className="text-[8px] text-white/40 uppercase">
                            {isPlaying ? 'Playing' : 'Paused'}
                        </span>
                    )}
                </div>
            </button>

            {/* Mini controls - only show when there are tracks */}
            {hasTracks && (
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={handlePrev}
                        className="p-1 text-white/30 hover:text-white transition-all active:scale-90"
                        aria-label="Previous track"
                    >
                        <Play size={10} className="-rotate-180" />
                    </button>
                    <button
                        onClick={handlePlayPause}
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <Pause size={12} fill="currentColor" />
                        ) : (
                            <Play size={12} fill="currentColor" className="ml-0.5" />
                        )}
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-1 text-white/30 hover:text-white transition-all active:scale-90"
                        aria-label="Next track"
                    >
                        <Play size={10} />
                    </button>
                </div>
            )}
        </>
    );
};

