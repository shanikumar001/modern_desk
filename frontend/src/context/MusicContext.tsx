import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface Track {
    id: string;
    name: string;
    url: string;
}

interface MusicContextType {
    playlist: Track[];
    currentIndex: number;
    isPlaying: boolean;
    currentTrack: Track | null;
    progress: number;
    volume: number;
    currentTime: string;
    duration: string;
    addTracks: (files: FileList) => void;
    removeTrack: (index: number) => void;
    clearPlaylist: () => void;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setVolume: (volume: number) => void;
    selectTrack: (index: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentTrack = playlist[currentIndex] || null;

    // ─── Callbacks ─────────────────────────────────────────────────────

    const togglePlay = useCallback(() => {
        if (playlist.length > 0) {
            setIsPlaying(prev => !prev);
        }
    }, [playlist.length]);

    const nextTrack = useCallback(() => {
        if (playlist.length > 0) {
            setCurrentIndex(prev => (prev + 1) % playlist.length);
        }
    }, [playlist.length]);

    const prevTrack = useCallback(() => {
        if (playlist.length > 0) {
            setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length);
        }
    }, [playlist.length]);

    const selectTrack = useCallback((index: number) => {
        setCurrentIndex(index);
        setIsPlaying(true);
    }, []);

    const addTracks = useCallback((files: FileList) => {
        const newTracks: Track[] = Array.from(files)
            .filter(file => file.type.startsWith('audio/'))
            .map(file => ({
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name.replace(/\.[^/.]+$/, ""),
                url: URL.createObjectURL(file)
            }));

        if (newTracks.length > 0) {
            setPlaylist(prev => {
                const updated = [...prev, ...newTracks];
                if (prev.length === 0) {
                    setCurrentIndex(0);
                }
                return updated;
            });
            setIsPlaying(true);
        }
    }, []);

    const removeTrack = useCallback((index: number) => {
        setPlaylist(prev => prev.filter((_, i) => i !== index));
        if (index === currentIndex) {
            setIsPlaying(false);
            setPlaylist(prev => {
                if (prev.length > 0) setCurrentIndex(0);
                return prev;
            });
        } else if (index < currentIndex) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    const clearPlaylist = useCallback(() => {
        setPlaylist([]);
        setCurrentIndex(0);
        setIsPlaying(false);
    }, []);

    // ─── Effects ────────────────────────────────────────────────────────

    // Initialize audio element on mount
    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;
        audio.volume = volume;

        const handleTimeUpdate = () => {
            const current = audio.currentTime;
            const total = audio.duration;
            setProgress((current / total) * 100 || 0);
            setCurrentTime(formatTime(current));
            setDuration(formatTime(total));
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.pause();
            audio.src = "";
        };
    }, []);

    // Handle "ended" event separately to avoid stale closure
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            nextTrack();
        };

        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [nextTrack]);

    // Handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle track changes and play state
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;

        if (audio.src !== currentTrack.url) {
            audio.src = currentTrack.url;
        }

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => setIsPlaying(false));
            }
        } else {
            audio.pause();
        }
    }, [currentIndex, isPlaying, currentTrack]);

    return (
        <MusicContext.Provider value={{
            playlist,
            currentIndex,
            isPlaying,
            currentTrack,
            progress,
            volume,
            currentTime,
            duration,
            addTracks,
            removeTrack,
            clearPlaylist,
            togglePlay,
            nextTrack,
            prevTrack,
            setVolume,
            selectTrack
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};

