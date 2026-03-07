import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, FolderPlus, FilePlus, ListMusic, X, Disc, Trash2 } from 'lucide-react';
import { WidgetSize } from '../context/WidgetContext';
import { useMusic } from '../context/MusicContext';

interface MusicWidgetProps {
    size?: WidgetSize;
    isExpanded?: boolean;
}

interface MusicWidgetProps {
    size?: WidgetSize;
    width?: number;
    height?: number;
    isExpanded?: boolean;
}

export const MusicWidget: React.FC<MusicWidgetProps> = ({ size = 'small', width = 320, height = 400, isExpanded = false }) => {
    const {
        playlist,
        isPlaying,
        currentIndex,
        progress,
        volume,
        currentTime,
        duration,
        currentTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        removeTrack,
        clearPlaylist,
        addTracks,
        selectTrack,
        setVolume
    } = useMusic();

    const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addTracks(e.target.files);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addTracks(e.target.files);
    };

    const isMini = !isExpanded && (width < 280 || height < 280);
    const showLibrary = isExpanded || (width > 500 && height > 400);
    const scale = isExpanded ? 1.2 : Math.min(width / 400, height / 500);

    // ── Render: Mini Player (Compact) ──
    if (isMini) {
        const artworkSize = Math.min(width, height) * 0.4;
        return (
            <div className={`group relative flex flex-col items-center justify-center h-full w-full p-2 overflow-hidden transition-all duration-700 ${isPlaying ? 'bg-accent/5' : ''}`}>
                {isPlaying && (
                    <div className="absolute inset-0 z-0 opacity-20 animate-pulse">
                        <div className="absolute inset-[-50%] bg-[radial-gradient(circle_at_center,oklch(var(--accent))_0%,transparent_70%)] blur-[40px] animate-[spin_10s_linear_infinite]" />
                    </div>
                )}

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`relative ${isPlaying ? 'animate-[spin_15s_linear_infinite]' : ''}`}>
                        <div
                            className="rounded-full bg-gradient-to-tr from-white/20 to-white/5 border border-white/10 flex items-center justify-center shadow-xl relative overflow-hidden"
                            style={{ width: artworkSize, height: artworkSize }}
                        >
                            <Disc size={artworkSize * 0.6} className="text-white/20" />
                        </div>
                    </div>

                    {height > 180 && (
                        <div className="text-center w-full px-2">
                            <div className="text-[10px] font-black text-white/80 uppercase tracking-widest truncate">
                                {currentTrack?.name || 'No Track'}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-4 mt-1">
                        <button onClick={(e) => { e.stopPropagation(); prevTrack(); }} className="text-white/30 hover:text-white transition-all"><SkipBack size={14} fill="currentColor" /></button>
                        <button
                            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); nextTrack(); }} className="text-white/30 hover:text-white transition-all"><SkipForward size={14} fill="currentColor" /></button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render: Standard / Expanded View ──
    return (
        <div className={`flex flex-col h-full text-white animate-fade-in transition-all duration-500 relative overflow-hidden ${isExpanded ? 'p-12' : 'p-6'} ${isPlaying ? 'bg-accent/5' : ''}`}>
            {/* Animated Mesh Gradients */}
            {isPlaying && (
                <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-accent/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-full h-full bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
                </div>
            )}

            <div className={`relative z-10 flex h-full gap-8 ${showLibrary && width > 600 ? 'flex-row' : 'flex-col'} min-h-0`}>

                {/* Left/Main Player Section */}
                <div className={`flex flex-col shrink-0 ${showLibrary && width > 600 ? 'w-1/2' : 'w-full'} justify-center`}>
                    <div className={`flex items-center gap-6 ${isExpanded || width > 400 ? 'flex-row' : 'flex-col text-center'}`}>
                        {/* Artwork */}
                        <div className="relative group shrink-0">
                            <div
                                className="bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                                style={{ width: Math.max(120, 200 * scale), height: Math.max(120, 200 * scale) }}
                            >
                                <Disc size={100 * scale} className={`text-white/5 ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`} />
                                <div className="absolute inset-0 bg-accent/5 mix-blend-overlay" />
                            </div>
                            {isPlaying && <div className="absolute -inset-4 border border-accent/20 rounded-[2.5rem] animate-ping opacity-20 pointer-events-none" />}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-black text-white truncate text-glow leading-tight" style={{ fontSize: `${Math.max(18, 28 * scale)}px` }}>
                                {currentTrack?.name || 'Local Music Master'}
                            </h3>
                            <p className="text-accent/60 uppercase tracking-[0.3em] font-black mt-2" style={{ fontSize: `${Math.max(10, 12 * scale)}px` }}>
                                {isPlaying ? 'Streaming Fidelity' : 'Standby'}
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-8 space-y-3">
                        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="absolute h-full bg-accent shadow-[0_0_15px_oklch(var(--accent))]" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest font-mono">
                            <span>{currentTime}</span>
                            <span>{duration}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={prevTrack} className="text-white/40 hover:text-white transition-all transform hover:scale-110"><SkipBack size={24} fill="currentColor" /></button>
                            <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform hover:scale-105 active:scale-95 transition-all">
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                            </button>
                            <button onClick={nextTrack} className="text-white/40 hover:text-white transition-all transform hover:scale-110"><SkipForward size={24} fill="currentColor" /></button>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                            <Volume2 size={16} className="text-accent/60" />
                            <input
                                type="range" min="0" max="1" step="0.01" value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-24 h-1 bg-white/10 rounded-full appearance-none accent-accent cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Right/Library Section - Conditional */}
                {showLibrary && (
                    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-white/5 rounded-3xl border border-white/5 p-6 backdrop-blur-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Library Telemetry</h4>
                            <div className="flex gap-2">
                                <label className="p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-white/40 hover:text-accent"><FolderPlus size={18} /><input type="file" multiple
                                    // @ts-ignore
                                    webkitdirectory="true" onChange={handleFolderUpload} className="hidden" /></label>
                                <label className="p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-all text-white/40 hover:text-accent"><FilePlus size={18} /><input type="file" multiple onChange={handleFileUpload} className="hidden" /></label>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                            {playlist.map((track, idx) => (
                                <div
                                    key={track.id}
                                    onClick={() => selectTrack(idx)}
                                    className={`p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${idx === currentIndex ? 'bg-accent/20 border border-accent/20' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <span className={`text-[10px] font-black ${idx === currentIndex ? 'text-accent' : 'text-white/20'}`}>{String(idx + 1).padStart(2, '0')}</span>
                                    <span className={`flex-1 truncate text-xs font-bold ${idx === currentIndex ? 'text-white' : 'text-white/40'}`}>{track.name}</span>
                                    <button onClick={(e) => { e.stopPropagation(); removeTrack(idx); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/20 text-rose-500/40 hover:text-rose-500 rounded-lg"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

