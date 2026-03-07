import React from 'react';
import { X, Plus, Clock, CloudSun, CheckSquare, Music, Calculator } from 'lucide-react';
import { useWidgets, WidgetConfig } from '../context/WidgetContext';

interface WidgetLibraryProps {
    isOpen: boolean;
    onClose: () => void;
}

const AVAILABLE_WIDGETS: { type: WidgetConfig['type']; name: string; icon: React.ReactNode; description: string }[] = [
    { type: 'clock', name: 'Digital Clock', icon: <Clock size={24} />, description: 'Minimalist time display' },
    { type: 'weather', name: 'Weather', icon: <CloudSun size={24} />, description: 'Current conditions & forecast' },
    { type: 'todo', name: 'Tasks', icon: <CheckSquare size={24} />, description: 'Manage your daily to-dos' },
    { type: 'music', name: 'Music Player', icon: <Music size={24} />, description: 'Play your local music files' },
    { type: 'calculator', name: 'Calculator', icon: <Calculator size={24} />, description: 'Quick calculations' },
];

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ isOpen, onClose }) => {
    const { addWidget } = useWidgets();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl glass-card bg-black/20 backdrop-blur-2xl border-white/10 rounded-3xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Widget Library</h2>
                        <p className="text-white/50 text-sm">Personalize your dashboard with premium widgets</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
                    {AVAILABLE_WIDGETS.map((widget) => (
                        <div
                            key={widget.type}
                            className="glass-card bg-white/5 border-white/5 p-6 flex flex-col items-center text-center gap-4 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1 group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-accent-raw/10 text-accent-raw flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-raw/20 transition-all">
                                {widget.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{widget.name}</h3>
                                <p className="text-xs text-white/40 mt-1">{widget.description}</p>
                            </div>
                            <button
                                onClick={() => {
                                    addWidget(widget.type);
                                    onClose();
                                }}
                                className="mt-2 w-full glass-btn py-2.5 flex items-center justify-center gap-2 group-hover:bg-accent-raw group-hover:text-white transition-all"
                            >
                                <Plus size={16} />
                                <span>Add to Screen</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
