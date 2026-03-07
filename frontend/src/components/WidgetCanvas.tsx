import React from 'react';
import { useWidgets } from '../context/WidgetContext';
import { WidgetContainer } from './WidgetContainer';
import { ClockWidget } from './ClockWidget';
import { WeatherWidget } from './WeatherWidget';
import { TodoWidget } from './TodoWidget';
import { MusicWidget } from './MusicWidget';
import { CalculatorWidget } from './CalculatorWidget';

export const WidgetCanvas: React.FC = () => {
    const { activeWidgets } = useWidgets();

    const renderWidgetContent = (type: string) => {
        switch (type) {
            case 'clock': return <ClockWidget />;
            case 'weather': return <WeatherWidget />;
            case 'todo': return <TodoWidget />;
            case 'music': return <MusicWidget />;
            case 'calculator': return <CalculatorWidget />;
            default: return null;
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
            <div className="relative w-full h-full pointer-events-auto">
                {activeWidgets.map((widget) => (
                    <WidgetContainer
                        key={widget.id}
                        id={widget.id}
                        type={widget.type}
                        position={widget.position}
                        size={widget.size}
                    >
                        {renderWidgetContent(widget.type)}
                    </WidgetContainer>
                ))}
            </div>
        </div>
    );
};
