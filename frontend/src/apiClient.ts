// Use environment variable for API URL (set in Render), fallback to relative path for local dev
const API_BASE = import.meta.env.VITE_API_URL || "";

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: number;
}

export interface Preferences {
    theme: string;
    accentColor: string;
}

export interface GeocodeResult {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface ApiClient {
    listTodos(): Promise<Todo[]>;
    addTodo(text: string): Promise<Todo>;
    updateTodo(id: number, text: string, completed: boolean): Promise<Todo>;
    deleteTodo(id: number): Promise<void>;
    getPreferences(): Promise<Preferences>;
    setPreferences(theme: string, accentColor: string): Promise<Preferences>;
    fetchWeather(lat: number, lon: number): Promise<any>;
    geocode(city: string): Promise<GeocodeResult>;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`API error ${res.status}: ${body}`);
    }
    return res.json();
}

export const apiClient: ApiClient = {
    listTodos: () => request<Todo[]>("/todos"),

    addTodo: (text: string) =>
        request<Todo>("/todos", {
            method: "POST",
            body: JSON.stringify({ text }),
        }),

    updateTodo: (id: number, text: string, completed: boolean) =>
        request<Todo>(`/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify({ text, completed }),
        }),

    deleteTodo: (id: number) =>
        request<void>(`/todos/${id}`, { method: "DELETE" }),

    getPreferences: () => request<Preferences>("/preferences"),

    setPreferences: (theme: string, accentColor: string) =>
        request<Preferences>("/preferences", {
            method: "PUT",
            body: JSON.stringify({ theme, accentColor }),
        }),

    fetchWeather: (lat: number, lon: number) =>
        request<any>(`/weather?lat=${lat}&lon=${lon}`),

    geocode: (city: string) =>
        request<GeocodeResult>(`/geocode?city=${encodeURIComponent(city)}`),
};
