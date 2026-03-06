import type { ReactNode } from "react";

interface WidgetPillProps {
    icon: ReactNode;
    value: string;
    label: string;
    active?: boolean;
    dimmed?: boolean;
    onClick: () => void;
}

export function WidgetPill({
    icon,
    value,
    label,
    active = false,
    dimmed = false,
    onClick,
}: WidgetPillProps) {
    const className = [
        "widget-pill",
        active && "active",
        dimmed && "dimmed",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button type="button" className={className} onClick={onClick}>
            <span className="widget-pill__icon">{icon}</span>
            <span className="widget-pill__value">{value}</span>
            <span className="widget-pill__label">{label}</span>
        </button>
    );
}
