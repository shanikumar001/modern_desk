import React, { useState } from 'react';
import { WidgetSize } from '../context/WidgetContext';
import { Delete, RotateCcw, Equal, Percent, Divide, X, Minus, Plus } from 'lucide-react';

interface CalculatorWidgetProps {
    size?: WidgetSize;
    width?: number;
    height?: number;
    isExpanded?: boolean;
}

export const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({ 
    size = 'small', 
    width = 280, 
    height = 400, 
    isExpanded = false 
}) => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handleNumber = (num: string) => {
        const maxLength = isExpanded ? 16 : 14;
        if (display.length > maxLength) return;
        setDisplay(prev => prev === '0' ? num : prev + num);
    };

    const handleOperator = (op: string) => {
        setEquation(display + ' ' + op + ' ');
        setDisplay('0');
    };

    const calculate = () => {
        try {
            const result = eval(equation + display);
            setDisplay(String(Number(result.toFixed(8))));
            setEquation('');
        } catch {
            setDisplay('Error');
        }
    };

    const clear = () => {
        setDisplay('0');
        setEquation('');
    };

    const backspace = () => {
        setDisplay(prev => prev.slice(0, -1) || '0');
    };

    // Calculate responsive values based on actual dimensions
    const scale = isExpanded ? 1.3 : Math.min(width / 280, height / 380);
    const gap = Math.max(4, 8 * scale);
    const padding = isExpanded ? 24 : Math.max(8, 12 * scale);
    
    // Determine if we're in mini mode (very small widget)
    const isMini = !isExpanded && (width < 200 || height < 200);
    const isCompact = !isExpanded && (width < 260 || height < 300);

    // ── MINI VIEW (180x180 or smaller) ──
    if (isMini) {
        const iconSize = Math.min(width, height) * 0.12;
        const fontSize = Math.max(10, Math.min(width, height) * 0.15);
        
        return (
            <div className="flex flex-col h-full p-1.5 animate-fade-in">
                {/* Compact Display */}
                <div className="flex-1 flex items-end justify-end min-h-0">
                    <div 
                        className="font-bold text-white truncate text-right leading-none"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        {display}
                    </div>
                </div>
                
                {/* Minimal Grid - 4 columns, fewer rows visible */}
                <div className="grid grid-cols-4 gap-1" style={{ height: `${Math.min(width, height) * 0.5}px` }}>
                    <button 
                        onClick={clear} 
                        className="rounded-lg flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 transition-all"
                    >
                        <RotateCcw size={iconSize} />
                    </button>
                    <button 
                        onClick={backspace} 
                        className="rounded-lg flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 transition-all"
                    >
                        <Delete size={iconSize} />
                    </button>
                    <button 
                        onClick={() => handleOperator('%')} 
                        className="rounded-lg flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all"
                    >
                        <Percent size={iconSize} />
                    </button>
                    <button 
                        onClick={() => handleOperator('/')} 
                        className="rounded-lg flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all"
                    >
                        <Divide size={iconSize} />
                    </button>
                    
                    {[7, 8, 9].map(n => (
                        <button 
                            key={n} 
                            onClick={() => handleNumber(String(n))} 
                            className="rounded-lg flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold"
                        >
                            <span style={{ fontSize: `${fontSize}px` }}>{n}</span>
                        </button>
                    ))}
                    <button 
                        onClick={() => handleOperator('*')} 
                        className="rounded-lg flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all"
                    >
                        <X size={iconSize} />
                    </button>
                    
                    {[4, 5, 6].map(n => (
                        <button 
                            key={n} 
                            onClick={() => handleNumber(String(n))} 
                            className="rounded-lg flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold"
                        >
                            <span style={{ fontSize: `${fontSize}px` }}>{n}</span>
                        </button>
                    ))}
                    <button 
                        onClick={() => handleOperator('-')} 
                        className="rounded-lg flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all"
                    >
                        <Minus size={iconSize} />
                    </button>
                    
                    {[1, 2, 3].map(n => (
                        <button 
                            key={n} 
                            onClick={() => handleNumber(String(n))} 
                            className="rounded-lg flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold"
                        >
                            <span style={{ fontSize: `${fontSize}px` }}>{n}</span>
                        </button>
                    ))}
                    <button 
                        onClick={() => handleOperator('+')} 
                        className="rounded-lg flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all"
                    >
                        <Plus size={iconSize} />
                    </button>
                    
                    <button 
                        onClick={() => handleNumber('0')} 
                        className="col-span-2 rounded-lg flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold"
                    >
                        <span style={{ fontSize: `${fontSize}px` }}>0</span>
                    </button>
                    <button 
                        onClick={() => handleNumber('.')} 
                        className="rounded-lg flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold"
                    >
                        <span style={{ fontSize: `${fontSize}px` }}>.</span>
                    </button>
                    <button 
                        onClick={calculate} 
                        className="rounded-lg flex items-center justify-center bg-accent-raw text-white shadow-lg"
                    >
                        <Equal size={iconSize} />
                    </button>
                </div>
            </div>
        );
    }

    // ── COMPACT VIEW (medium-small widgets) ──
    if (isCompact) {
        const iconSize = Math.max(12, 16 * scale);
        const fontSize = Math.max(12, 16 * scale);
        
        return (
            <div className="flex flex-col h-full p-2 animate-fade-in">
                {/* Display Area */}
                <div className="w-full flex flex-col justify-end items-end mb-2 px-2">
                    <div 
                        className="text-white/30 font-medium tracking-wider truncate w-full text-right"
                        style={{ fontSize: `${Math.max(8, 10 * scale)}px`, height: `${Math.max(10, 12 * scale)}px` }}
                    >
                        {equation || '\u00A0'}
                    </div>
                    <div 
                        className="font-bold text-white truncate w-full text-right"
                        style={{ fontSize: `${Math.max(18, 28 * scale)}px` }}
                    >
                        {display}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 flex-1 gap-1.5">
                    <button onClick={clear} className="rounded-xl flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 transition-all">
                        <RotateCcw size={iconSize} />
                    </button>
                    <button onClick={backspace} className="rounded-xl flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 transition-all">
                        <Delete size={iconSize} />
                    </button>
                    <button onClick={() => handleOperator('%')} className="rounded-xl flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all">
                        <Percent size={iconSize} />
                    </button>
                    <button onClick={() => handleOperator('/')} className="rounded-xl flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all">
                        <Divide size={iconSize} />
                    </button>

                    {[7, 8, 9].map(n => (
                        <button key={n} onClick={() => handleNumber(String(n))} className="rounded-xl flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold" style={{ fontSize: `${fontSize}px` }}>
                            {n}
                        </button>
                    ))}
                    <button onClick={() => handleOperator('*')} className="rounded-xl flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all">
                        <X size={iconSize} />
                    </button>

                    {[4, 5, 6].map(n => (
                        <button key={n} onClick={() => handleNumber(String(n))} className="rounded-xl flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold" style={{ fontSize: `${fontSize}px` }}>
                            {n}
                        </button>
                    ))}
                    <button onClick={() => handleOperator('-')} className="rounded-xl flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all">
                        <Minus size={iconSize} />
                    </button>

                    {[1, 2, 3].map(n => (
                        <button key={n} onClick={() => handleNumber(String(n))} className="rounded-xl flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold" style={{ fontSize: `${fontSize}px` }}>
                            {n}
                        </button>
                    ))}
                    <button onClick={() => handleOperator('+')} className="rounded-xl flex items-center justify-center bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 transition-all">
                        <Plus size={iconSize} />
                    </button>

                    <button onClick={() => handleNumber('0')} className="col-span-2 rounded-xl flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold" style={{ fontSize: `${fontSize}px` }}>
                        0
                    </button>
                    <button onClick={() => handleNumber('.')} className="rounded-xl flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all font-bold" style={{ fontSize: `${fontSize}px` }}>
                        .
                    </button>
                    <button onClick={calculate} className="rounded-xl flex items-center justify-center bg-accent-raw text-white shadow-lg">
                        <Equal size={iconSize} />
                    </button>
                </div>
            </div>
        );
    }

    // ── STANDARD / LARGE / EXPANDED VIEW ──
    const btnBase = "w-full rounded-2xl flex items-center justify-center font-bold transition-all active:scale-95 shadow-lg border border-white/5";
    const btnClass = `${btnBase} bg-white/5 text-white hover:bg-white/10`;
    const opClass = `${btnBase} bg-accent-raw/20 text-accent-raw hover:bg-accent-raw/30 border-accent-raw/20`;
    const specialClass = `${btnBase} bg-white/10 text-white/60 hover:bg-white/20`;

    return (
        <div className={`flex flex-col h-full animate-fade-in transition-all duration-500 ${isExpanded ? 'p-4 lg:p-8 items-center justify-center' : 'p-4'}`}>

            {/* Display Area */}
            <div className={`w-full flex flex-col justify-end items-end mb-4 lg:mb-8 px-4 ${isExpanded ? 'max-w-2xl' : ''}`}>
                <div
                    className="text-white/30 font-medium tracking-wider mb-1 uppercase truncate w-full text-right"
                    style={{ fontSize: `${Math.max(10, 12 * scale)}px`, minHeight: `${Math.max(14, 16 * scale)}px` }}
                >
                    {equation || '\u00A0'}
                </div>
                <div
                    className="font-bold text-white tracking-tight truncate w-full text-right"
                    style={{ fontSize: `${Math.max(28, 48 * scale)}px` }}
                >
                    {display}
                </div>
            </div>

            {/* Grid Area */}
            <div
                className={`grid grid-cols-4 w-full ${isExpanded ? 'max-w-2xl lg:max-w-md' : ''}`}
                style={{ gap: `${gap}px` }}
            >
                <button onClick={clear} className={specialClass} style={{ fontSize: `${Math.max(12, 16 * scale)}px`, padding: `${Math.max(8, 12 * scale)}px` }}>
                    <RotateCcw size={Math.max(14, 20 * scale)} />
                </button>
                <button onClick={backspace} className={specialClass} style={{ fontSize: `${Math.max(12, 16 * scale)}px`, padding: `${Math.max(8, 12 * scale)}px` }}>
                    <Delete size={Math.max(14, 20 * scale)} />
                </button>
                <button onClick={() => handleOperator('%')} className={specialClass} style={{ fontSize: `${Math.max(12, 16 * scale)}px`, padding: `${Math.max(8, 12 * scale)}px` }}>
                    <Percent size={Math.max(14, 20 * scale)} />
                </button>
                <button onClick={() => handleOperator('/')} className={opClass} style={{ fontSize: `${Math.max(12, 16 * scale)}px`, padding: `${Math.max(8, 12 * scale)}px` }}>
                    <Divide size={Math.max(14, 20 * scale)} />
                </button>

                {[7, 8, 9].map(n => (
                    <button key={n} onClick={() => handleNumber(String(n))} className={btnClass} style={{ fontSize: `${Math.max(16, 22 * scale)}px`, padding: `${Math.max(10, 14 * scale)}px` }}>
                        {n}
                    </button>
                ))}
                <button onClick={() => handleOperator('*')} className={opClass} style={{ fontSize: `${Math.max(12, 16 * scale)}px`, padding: `${Math.max(8, 12 * scale)}px` }}>
                    <X size={Math.max(14, 20 * scale)} />
                </button>

                {[4, 5, 6].map(n => (
                    <button key={n} onClick={() => handleNumber(String(n))} className={btnClass} style={{ fontSize: `${Math.max(16, 22 * scale)}px`, padding: `${Math.max(10, 14 * scale)}px` }}>
                        {n}
                    </button>
                ))}
                <button onClick={() => handleOperator('-')} className={opClass} style={{ fontSize: `${Math.max(12, 16 * scale)}px`, padding: `${Math.max(8, 12 * scale)}px` }}>
                    <Minus size={Math.max(14, 20 * scale)} />
                </button>

                {[1, 2, 3].map(n => (
                    <button key={n} onClick={() => handleNumber(String(n))} className={btnClass} style={{ fontSize: `${Math.max(16, 22 * scale)}px`, padding: `${Math.max(10, 14 * scale)}px` }}>
                        {n}
                    </button>
                ))}
                <button onClick={() => handleOperator('+')} className={opClass} style={{ fontSize: `${Math.max(12, 16 * scale)}px`, padding: `${Math.max(8, 12 * scale)}px` }}>
                    <Plus size={Math.max(14, 20 * scale)} />
                </button>

                <button onClick={() => handleNumber('0')} className={`${btnClass} col-span-2`} style={{ fontSize: `${Math.max(16, 22 * scale)}px`, padding: `${Math.max(10, 14 * scale)}px` }}>
                    0
                </button>
                <button onClick={() => handleNumber('.')} className={btnClass} style={{ fontSize: `${Math.max(16, 22 * scale)}px`, padding: `${Math.max(10, 14 * scale)}px` }}>
                    .
                </button>
                <button onClick={calculate} className="w-full rounded-2xl flex items-center justify-center bg-accent-raw text-white shadow-[0_0_20px_var(--accent-glow)] transition-all active:scale-95" style={{ padding: `${Math.max(10, 14 * scale)}px` }}>
                    <Equal size={Math.max(18, 24 * scale)} />
                </button>
            </div>

            {isExpanded && (
                <div className="mt-8 lg:mt-16 text-center max-w-2xl animate-in fade-in duration-1000">
                    <p className="text-white/20 text-xs lg:text-[10px] uppercase tracking-[0.3em] font-black italic">
                        Precision Computation Engine • V2.0
                    </p>
                </div>
            )}
        </div>
    );
};

