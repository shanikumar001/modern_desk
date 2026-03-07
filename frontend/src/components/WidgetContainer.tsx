import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Move, Settings2 } from 'lucide-react';
import { useWidgets, WidgetPosition, WidgetSize } from '../context/WidgetContext';

interface WidgetContainerProps {
    id: string;
    type: string;
    position: WidgetPosition;
    size: WidgetSize;
    children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ id, type, position, size, children }) => {
    const { updateWidget, removeWidget, setExpandedWidgetId, expandedWidgetId } = useWidgets();
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [initialRect, setInitialRect] = useState<WidgetPosition | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const isExpanded = expandedWidgetId === id;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isExpanded) return;
        if ((e.target as HTMLElement).closest('.widget-handle')) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(direction);
        setDragOffset({ x: e.clientX, y: e.clientY });
        setInitialRect({ ...position });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                updateWidget(id, {
                    position: {
                        ...position,
                        x: e.clientX - dragOffset.x,
                        y: e.clientY - dragOffset.y,
                    }
                });
            } else if (isResizing && initialRect) {
                const dx = e.clientX - dragOffset.x;
                const dy = e.clientY - dragOffset.y;
                let { x, y, width, height } = initialRect;

                if (isResizing.includes('right')) width = Math.max(100, initialRect.width + dx);
                if (isResizing.includes('left')) {
                    const newWidth = Math.max(100, initialRect.width - dx);
                    if (newWidth !== 100) {
                        x = initialRect.x + dx;
                        width = newWidth;
                    }
                }
                if (isResizing.includes('bottom')) height = Math.max(100, initialRect.height + dy);
                if (isResizing.includes('top')) {
                    const newHeight = Math.max(100, initialRect.height - dy);
                    if (newHeight !== 100) {
                        y = initialRect.y + dy;
                        height = newHeight;
                    }
                }

                updateWidget(id, {
                    position: { x, y, width, height }
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(null);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset, id, updateWidget, position, initialRect]);

    const cycleSize = (e: React.MouseEvent) => {
        e.stopPropagation();
        const sizes: WidgetSize[] = ['small', 'medium', 'large'];
        const nextSize = sizes[(sizes.indexOf(size) + 1) % sizes.length];
        updateWidget(id, { size: nextSize });
    };

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedWidgetId(isExpanded ? null : id);
    };

    const containerStyle: React.CSSProperties = isExpanded ? {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '1000px',
        height: '80vh',
        zIndex: 2000,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    } : {
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        zIndex: isDragging || isResizing ? 1500 : 100,
        transition: isDragging || isResizing ? 'none' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isDragging || isResizing ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragging || isResizing ? '0 20px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px var(--accent-glow)' : '',
    };

    const resizeHandles = [
        { dir: 'n', class: 'top-0 left-0 right-0 h-1 cursor-ns-resize' },
        { dir: 's', class: 'bottom-0 left-0 right-0 h-1 cursor-ns-resize' },
        { dir: 'e', class: 'top-0 bottom-0 right-0 w-1 cursor-ew-resize' },
        { dir: 'w', class: 'top-0 bottom-0 left-0 w-1 cursor-ew-resize' },
        { dir: 'nw', class: 'top-0 left-0 w-4 h-4 cursor-nwse-resize z-20' },
        { dir: 'ne', class: 'top-0 right-0 w-4 h-4 cursor-nesw-resize z-20' },
        { dir: 'sw', class: 'bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-20' },
        { dir: 'se', class: 'bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-20' },
    ];

    return (
        <>
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1999] animate-in fade-in duration-700"
                    onClick={() => setExpandedWidgetId(null)}
                />
            )}

            <div
                ref={containerRef}
                style={containerStyle}
                className={`glass-card widget-container group overflow-hidden flex flex-col ${isExpanded ? 'rounded-3xl shadow-2xl' : ''} ${isResizing ? 'ring-2 ring-accent-raw/50' : ''}`}
                onMouseDown={handleMouseDown}
            >
                {/* Resize Handles */}
                {!isExpanded && resizeHandles.map(handle => (
                    <div
                        key={handle.dir}
                        className={`absolute ${handle.class} opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-raw/20`}
                        onMouseDown={(e) => handleResizeStart(e, handle.dir)}
                    />
                ))}

                {/* Widget Header */}
                <div className={`absolute z-10 w-full flex items-center justify-between p-2 border-b border-white/10 ${!isExpanded ? 'opacity-0 group-hover:opacity-100 ' : ''} transition-opacity widget-handle cursor-move bg-white/5`}>
                    <div className="flex items-center gap-2">
                        <Move size={12} className="text-white/40" />
                        <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium select-none">
                            {type}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {!isExpanded && (
                            <button
                                onClick={cycleSize}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-accent-raw"
                                title="Snap to Size"
                            >
                                <Maximize2 size={12} />
                            </button>
                        )}
                        <button
                            onClick={toggleExpand}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-accent-raw"
                            title={isExpanded ? "Minimize" : "Edit / Expand"}
                        >
                            {isExpanded ? <Minimize2 size={12} /> : <Settings2 size={12} />}
                        </button>
                        <button
                            onClick={() => removeWidget(id)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-rose-400"
                            title="Remove"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>

                {/* Widget Content */}
                <div
                    className="flex-1 overflow-hidden relative"
                    onClick={!isExpanded && position.width < 200 && position.height < 200 ? toggleExpand : undefined}
                >
                    {React.cloneElement(children as React.ReactElement<any>, {
                        size,
                        width: position.width,
                        height: position.height,
                        isExpanded,
                        id
                    })}
                </div>
            </div>
        </>
    );
};
