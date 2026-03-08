/**
 * IndexedDB Utility for Music and Media Storage
 * Handles persistence of audio files and background media across browser sessions
 */

const DB_NAME = 'glassdash-db';
const DB_VERSION = 2;
const MUSIC_STORE_NAME = 'tracks';
const MEDIA_STORE_NAME = 'backgrounds';

interface StoredTrack {
    id: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
    blob: Blob;
}

interface StoredMedia {
    id: string;
    name: string;
    mediaType: 'image' | 'video';
    type: string;
    size: number;
    lastModified: number;
    blob: Blob;
}

interface TrackMetadata {
    id: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
}

export interface MediaMetadata {
    id: string;
    name: string;
    mediaType: 'image' | 'video';
    type: string;
    size: number;
    lastModified: number;
    url?: string;
}

/**
 * Open or create the IndexedDB database
 */
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Failed to open database:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            
            // Create music store if it doesn't exist
            if (!db.objectStoreNames.contains(MUSIC_STORE_NAME)) {
                const musicStore = db.createObjectStore(MUSIC_STORE_NAME, { keyPath: 'id' });
                musicStore.createIndex('name', 'name', { unique: false });
                musicStore.createIndex('lastModified', 'lastModified', { unique: false });
            }
            
            // Create media store if it doesn't exist
            if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
                const mediaStore = db.createObjectStore(MEDIA_STORE_NAME, { keyPath: 'id' });
                mediaStore.createIndex('name', 'name', { unique: false });
                mediaStore.createIndex('mediaType', 'mediaType', { unique: false });
            }
        };
    });
};

// ═══════════════════════════════════════════════════════════════
// MUSIC STORAGE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Save a track to IndexedDB
 */
export const saveTrack = async (track: StoredTrack): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MUSIC_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(MUSIC_STORE_NAME);
        const request = store.put(track);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

/**
 * Get a track from IndexedDB by ID
 */
export const getTrack = async (id: string): Promise<StoredTrack | undefined> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MUSIC_STORE_NAME], 'readonly');
        const store = transaction.objectStore(MUSIC_STORE_NAME);
        const request = store.get(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

/**
 * Get all tracks from IndexedDB
 */
export const getAllTracks = async (): Promise<StoredTrack[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MUSIC_STORE_NAME], 'readonly');
        const store = transaction.objectStore(MUSIC_STORE_NAME);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

/**
 * Get only metadata (without blob) for all tracks - faster for listing
 */
export const getAllTrackMetadata = async (): Promise<TrackMetadata[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MUSIC_STORE_NAME], 'readonly');
        const store = transaction.objectStore(MUSIC_STORE_NAME);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const tracks = request.result as StoredTrack[];
            resolve(tracks.map(({ blob, ...meta }) => meta));
        };
    });
};

/**
 * Delete a track from IndexedDB by ID
 */
export const deleteTrack = async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MUSIC_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(MUSIC_STORE_NAME);
        const request = store.delete(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

/**
 * Clear all tracks from IndexedDB
 */
export const clearAllTracks = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MUSIC_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(MUSIC_STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

/**
 * Save multiple tracks at once
 */
export const saveTracks = async (tracks: StoredTrack[]): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MUSIC_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(MUSIC_STORE_NAME);

        tracks.forEach(track => store.put(track));

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

// ═══════════════════════════════════════════════════════════════
// BACKGROUND MEDIA STORAGE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Save background media to IndexedDB
 */
export const saveBackgroundMedia = async (media: StoredMedia): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MEDIA_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(MEDIA_STORE_NAME);
        const request = store.put(media);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

/**
 * Get background media by ID
 */
export const getBackgroundMedia = async (id: string): Promise<StoredMedia | undefined> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MEDIA_STORE_NAME], 'readonly');
        const store = transaction.objectStore(MEDIA_STORE_NAME);
        const request = store.get(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

/**
 * Get all background media
 */
export const getAllBackgroundMedia = async (): Promise<StoredMedia[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MEDIA_STORE_NAME], 'readonly');
        const store = transaction.objectStore(MEDIA_STORE_NAME);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

/**
 * Get all background media metadata (without blobs)
 */
export const getAllBackgroundMediaMetadata = async (): Promise<MediaMetadata[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MEDIA_STORE_NAME], 'readonly');
        const store = transaction.objectStore(MEDIA_STORE_NAME);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const media = request.result as StoredMedia[];
            resolve(media.map(({ blob, ...meta }) => meta));
        };
    });
};

/**
 * Delete background media by ID
 */
export const deleteBackgroundMedia = async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MEDIA_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(MEDIA_STORE_NAME);
        const request = store.delete(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

/**
 * Clear all background media from IndexedDB
 */
export const clearAllBackgroundMedia = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([MEDIA_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(MEDIA_STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

/**
 * Save a new background media file
 */
export const addBackgroundMedia = async (file: File): Promise<MediaMetadata> => {
    const id = `bg-${file.name}-${file.lastModified}-${Math.random().toString(36).substr(2, 9)}`;
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    
    const storedMedia: StoredMedia = {
        id,
        name: file.name,
        mediaType,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        blob: file
    };
    
    await saveBackgroundMedia(storedMedia);
    
    return {
        id,
        name: file.name,
        mediaType,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
    };
};

/**
 * Get full media with URL for playback/display
 */
export const getBackgroundMediaWithUrl = async (id: string): Promise<{ metadata: MediaMetadata; url: string } | null> => {
    const stored = await getBackgroundMedia(id);
    if (!stored) return null;
    
    const url = URL.createObjectURL(stored.blob);
    
    return {
        metadata: {
            id: stored.id,
            name: stored.name,
            mediaType: stored.mediaType,
            type: stored.type,
            size: stored.size,
            lastModified: stored.lastModified
        },
        url
    };
};

/**
 * Get all background media with URLs for preview thumbnails
 */
export const getAllBackgroundMediaWithUrls = async (): Promise<{ metadata: MediaMetadata; url: string }[]> => {
    const allMedia = await getAllBackgroundMedia();
    const result: { metadata: MediaMetadata; url: string }[] = [];
    
    for (const stored of allMedia) {
        const url = URL.createObjectURL(stored.blob);
        result.push({
            metadata: {
                id: stored.id,
                name: stored.name,
                mediaType: stored.mediaType,
                type: stored.type,
                size: stored.size,
                lastModified: stored.lastModified
            },
            url
        });
    }
    
    return result;
};

// ═══════════════════════════════════════════════════════════════
// FILE SYSTEM ACCESS API
// ═══════════════════════════════════════════════════════════════

/**
 * Check if File System Access API is supported
 */
export const isFileSystemAccessSupported = (): boolean => {
    return 'showDirectoryPicker' in window;
};

/**
 * Open directory picker and get files (File System Access API)
 */
export const openDirectoryPicker = async (): Promise<File[]> => {
    if (!isFileSystemAccessSupported()) {
        throw new Error('File System Access API not supported');
    }

    const dirHandle = await (window as any).showDirectoryPicker();
    const files: File[] = [];

    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && entry.name.match(/\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i)) {
            const file = await entry.getFile();
            files.push(file);
        }
    }

    return files;
};

