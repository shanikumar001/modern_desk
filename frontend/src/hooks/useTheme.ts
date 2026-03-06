import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "dark" | "light";
export type AccentColor =
  | "purple"
  | "blue"
  | "teal"
  | "rose"
  | "amber"
  | "green"
  | "custom";

export interface ThemeState {
  theme: Theme;
  accent: AccentColor;
  customAccentColor: string | null;
  setTheme: (t: Theme) => void;
  setAccent: (a: AccentColor) => void;
  setCustomAccentColor: (color: string | null) => void;
  toggleTheme: () => void;
}

// Predefined accent colors
export const ACCENT_COLORS: { id: AccentColor; label: string; color: string }[] = [
  { id: "purple", label: "Purple", color: "oklch(65% 0.25 290)" },
  { id: "blue", label: "Blue", color: "oklch(65% 0.22 240)" },
  { id: "teal", label: "Teal", color: "oklch(65% 0.18 185)" },
  { id: "rose", label: "Rose", color: "oklch(65% 0.22 10)" },
  { id: "amber", label: "Amber", color: "oklch(72% 0.20 80)" },
  { id: "green", label: "Green", color: "oklch(65% 0.20 145)" },
];

export function useTheme(): ThemeState {
  const [theme, setThemeStored] = useLocalStorage<Theme>(
    "dashboard_theme",
    "dark",
  );
  const [accent, setAccentStored] = useLocalStorage<AccentColor>(
    "dashboard_accent",
    "purple",
  );
  const [customAccentColor, setCustomAccentColor] = useLocalStorage<string | null>(
    "dashboard_custom_accent",
    null,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-accent", accent);

    // Apply custom accent color if set
    if (accent === "custom" && customAccentColor) {
      root.style.setProperty("--accent-raw", customAccentColor);
      root.style.setProperty("--accent-glow", `${customAccentColor}59`); // 35% opacity
      root.style.setProperty("--accent-soft", `${customAccentColor}1F`); // 12% opacity
      root.style.setProperty("--particle-color", `${customAccentColor}40`); // 25% opacity
      
      // Calculate gradient colors based on custom color
      root.style.setProperty("--grad-start", customAccentColor);
      root.style.setProperty("--grad-mid", `${customAccentColor}80`);
      root.style.setProperty("--grad-end", `${customAccentColor}50`);
    } else {
      // Reset to predefined colors
      root.style.removeProperty("--accent-raw");
      root.style.removeProperty("--accent-glow");
      root.style.removeProperty("--accent-soft");
      root.style.removeProperty("--particle-color");
      root.style.removeProperty("--grad-start");
      root.style.removeProperty("--grad-mid");
      root.style.removeProperty("--grad-end");
    }
  }, [theme, accent, customAccentColor]);

  return {
    theme,
    accent,
    customAccentColor,
    setTheme: (t: Theme) => setThemeStored(t),
    setAccent: (a: AccentColor) => {
      setAccentStored(a);
      if (a !== "custom") {
        setCustomAccentColor(null);
      }
    },
    setCustomAccentColor: (color: string | null) => {
      setCustomAccentColor(color);
      if (color) {
        setAccentStored("custom");
      }
    },
    toggleTheme: () => setThemeStored((t) => (t === "dark" ? "light" : "dark")),
  };
}
