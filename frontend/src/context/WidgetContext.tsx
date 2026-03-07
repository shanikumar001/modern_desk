import React, { createContext, useContext, useEffect, useState } from 'react';

export interface WidgetPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetConfig {
    id: string;
    type: 'clock' | 'weather' | 'todo' | 'music' | 'calculator';
    position: WidgetPosition;
    size: WidgetSize;
    settings?: Record<string, any>;
}

interface WidgetContextType {
    activeWidgets: WidgetConfig[];
    addWidget: (type: WidgetConfig['type']) => void;
    removeWidget: (id: string) => void;
    updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
    expandedWidgetId: string | null;
    setExpandedWidgetId: (id: string | null) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

const STORAGE_KEY = 'dashboard_widgets_v2';

const DEFAULT_SIZES: Record<WidgetConfig['type'], WidgetPosition> = {
    clock: { x: 50, y: 50, width: 200, height: 200 },
    weather: { x: 280, y: 50, width: 220, height: 200 },
    todo: { x: 50, y: 280, width: 300, height: 350 },
    music: { x: 380, y: 280, width: 320, height: 400 },
    calculator: { x: 720, y: 50, width: 280, height: 450 },
};

const SIZE_DIMENSIONS: Record<WidgetSize, { width: number; height: number }> = {
    small: { width: 180, height: 180 },
    medium: { width: 320, height: 350 },
    large: { width: 450, height: 500 },
};

export const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeWidgets, setActiveWidgets] = useState<WidgetConfig[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [expandedWidgetId, setExpandedWidgetId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeWidgets));
    }, [activeWidgets]);

    const addWidget = (type: WidgetConfig['type']) => {
        const id = `${type}-${Date.now()}`;
        const dimensions = SIZE_DIMENSIONS['small'];
        const newWidget: WidgetConfig = {
            id,
            type,
            position: { ...DEFAULT_SIZES[type], ...dimensions },
            size: 'small',
            settings: {},
        };
        setActiveWidgets((prev) => [...prev, newWidget]);
    };

    const removeWidget = (id: string) => {
        setActiveWidgets((prev) => prev.filter((w) => w.id !== id));
        if (expandedWidgetId === id) setExpandedWidgetId(null);
    };

    const updateWidget = (id: string, updates: Partial<WidgetConfig>) => {
        setActiveWidgets((prev) =>
            prev.map((w) => {
                if (w.id === id) {
                    const newWidget = { ...w, ...updates };
                    // If size is explicitly updated (e.g., via cycle size button),
                    // then we snap to the preset dimensions.
                    // Otherwise, we allow custom position/width/height to persist.
                    if (updates.size && updates.size !== w.size && !updates.position) {
                        newWidget.position = {
                            ...newWidget.position,
                            ...SIZE_DIMENSIONS[updates.size as WidgetSize]
                        };
                    }
                    return newWidget;
                }
                return w;
            })
        );
    };

    return (
        <WidgetContext.Provider
            value={{
                activeWidgets,
                addWidget,
                removeWidget,
                updateWidget,
                expandedWidgetId,
                setExpandedWidgetId,
            }}
        >
            {children}
        </WidgetContext.Provider>
    );
};

export const useWidgets = () => {
    const context = useContext(WidgetContext);
    if (!context) {
        throw new Error('useWidgets must be used within a WidgetProvider');
    }
    return context;
};
