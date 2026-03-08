import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { saveTrack, getAllTracks, deleteTrack, clearAllTracks } from '../lib/musicStorage';

interface Track {
    id: string;
    name: string;
    url: string;
    type?: string;
    size?: number;
    lastModified?: number;
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
    isLoading: boolean;
    addTracks: (files: FileList | File[]) => Promise<void>;
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
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentTrack = playlist[currentIndex] || null;

    // Load tracks from IndexedDB on mount
    useEffect(() => {
        const loadSavedTracks = async () => {
            try {
                const savedTracks = await getAllTracks();
                
                if (savedTracks && savedTracks.length > 0) {
                    const tracks: Track[] = savedTracks.map(stored => ({
                        id: stored.id,
                        name: stored.name,
                        url: URL.createObjectURL(stored.blob),
                        type: stored.type,
                        size: stored.size,
                        lastModified: stored.lastModified
                    }));
                    
                    setPlaylist(tracks);
                    if (tracks.length > 0) {
                        setCurrentIndex(0);
                    }
                }
            } catch (error) {
                console.error('Failed to load saved tracks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedTracks();
    }, []);

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

    const addTracks = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        
        const newTracks: Track[] = [];
        
        for (const file of fileArray) {
            if (file.type.startsWith('audio/')) {
                const id = `${file.name}-${file.lastModified}-${Math.random().toString(36).substr(2, 9)}`;
                const name = file.name.replace(/\.[^/.]+$/, "");
                
                // Save to IndexedDB for persistence
                try {
                    await saveTrack({
                        id,
                        name,
                        type: file.type,
                        size: file.size,
                        lastModified: file.lastModified,
                        blob: file
                    });
                } catch (error) {
                    console.error('Failed to save track to database:', error);
                }

                newTracks.push({
                    id,
                    name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified
                });
            }
        }

        if (newTracks.length > 0) {
            setPlaylist(prev => {
                const updated = [...prev, ...newTracks];
                if (prev.length === 0) {
                    setCurrentIndex(0);
                    setIsPlaying(true);
                }
                return updated;
            });
        }
    }, []);

    const removeTrack = useCallback((index: number) => {
        const trackToRemove = playlist[index];
        
        if (trackToRemove) {
            // Revoke the blob URL to free memory
            URL.revokeObjectURL(trackToRemove.url);
            
            // Remove from IndexedDB
            deleteTrack(trackToRemove.id).catch(err => 
                console.error('Failed to delete track from database:', err)
            );
        }
        
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
    }, [currentIndex, playlist]);

    const clearPlaylist = useCallback(() => {
        // Revoke all blob URLs
        playlist.forEach(track => {
            URL.revokeObjectURL(track.url);
        });
        
        // Clear from IndexedDB
        clearAllTracks().catch(err => 
            console.error('Failed to clear tracks from database:', err)
        );
        
        setPlaylist([]);
        setCurrentIndex(0);
        setIsPlaying(false);
    }, [playlist]);

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

    // Save volume to localStorage
    useEffect(() => {
        localStorage.setItem('music-volume', String(volume));
    }, [volume]);

    // Load volume from localStorage on mount
    useEffect(() => {
        const savedVolume = localStorage.getItem('music-volume');
        if (savedVolume) {
            setVolume(parseFloat(savedVolume));
        }
    }, []);

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
            isLoading,
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

