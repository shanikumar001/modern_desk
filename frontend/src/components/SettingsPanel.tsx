import { Image, Moon, Palette, Sun, Trash2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTheme, ACCENT_COLORS } from "../hooks/useTheme";
import type { AccentColor, ThemeState } from "../hooks/useTheme";

interface SettingsPanelProps extends Omit<ThemeState, 'setTheme'> {
  open: boolean;
  onClose: () => void;
  backgroundUrl: string | null;
  onSetBackground: (url: string, type: "image" | "video") => void;
  onRemoveBackground: () => void;
  backgroundType: "image" | "video" | null;
}

export function SettingsPanel({
  open,
  onClose,
  theme,
  accent,
  customAccentColor,
  setCustomAccentColor,
  toggleTheme,
  setAccent,
  backgroundUrl,
  onSetBackground,
  onRemoveBackground,
  backgroundType,
}: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLButtonElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useLocalStorage<string | null>(
    "bg_preview",
    null,
  );
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(
    null,
  );

  const processFile = useCallback(
    (file: File) => {
      const type = file.type.startsWith("video/") ? "video" : "image";
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewType(type);
    },
    [setPreviewUrl],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (
        file &&
        (file.type.startsWith("image/") || file.type.startsWith("video/"))
      ) {
        processFile(file);
      }
    },
    [processFile],
  );

  const applyBackground = () => {
    if (previewUrl && previewType) {
      onSetBackground(previewUrl, previewType);
      setPreviewUrl(null);
      setPreviewType(null);
    }
  };

  const discardPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewType(null);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`settings-overlay${open ? " open" : ""}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`settings-panel${open ? " open" : ""}`}
        aria-label="Settings panel"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--glass-border)" }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Settings
            </h2>
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              Customize your dashboard
            </p>
          </div>
          <button
            type="button"
            data-ocid="settings.close_button"
            onClick={onClose}
            className="glass-btn p-2"
            aria-label="Close settings"
          >
            <X size={16} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-6">
          {/* ── Theme Section ── */}
          <section>
            <p
              className="widget-title mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Theme
            </p>
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--glass-border)" }}
            >
              <button
                type="button"
                data-ocid="theme.toggle"
                onClick={() => {
                  if (theme !== "dark") toggleTheme();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all"
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  background:
                    theme === "dark" ? "var(--accent-soft)" : "transparent",
                  color:
                    theme === "dark"
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  borderRight: "1px solid var(--glass-border)",
                  boxShadow:
                    theme === "dark"
                      ? "inset 0 0 12px var(--accent-soft)"
                      : "none",
                  transition: "all 0.2s ease",
                }}
                aria-pressed={theme === "dark"}
              >
                <Moon size={14} />
                Dark
              </button>
              <button
                type="button"
                data-ocid="theme.toggle"
                onClick={() => {
                  if (theme !== "light") toggleTheme();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all"
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  background:
                    theme === "light" ? "var(--accent-soft)" : "transparent",
                  color:
                    theme === "light"
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  boxShadow:
                    theme === "light"
                      ? "inset 0 0 12px var(--accent-soft)"
                      : "none",
                  transition: "all 0.2s ease",
                }}
                aria-pressed={theme === "light"}
              >
                <Sun size={14} />
                Light
              </button>
            </div>
          </section>

          {/* ── Accent Colors ── */}
          <section>
            <p
              className="widget-title mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Accent Color
            </p>
            <div className="flex gap-3 flex-wrap mb-3">
              {ACCENT_COLORS.map((ac) => (
                <button
                  key={ac.id}
                  type="button"
                  data-ocid={`accent.${ac.id}`}
                  onClick={() => setAccent(ac.id)}
                  className={`accent-swatch${accent === ac.id ? " active" : ""}`}
                  style={{ background: ac.color }}
                  title={ac.label}
                  aria-label={`${ac.label} accent`}
                  aria-pressed={accent === ac.id}
                />
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-ocid="accent.custom"
                onClick={() => setAccent("custom")}
                className={`accent-swatch${accent === "custom" ? " active" : ""}`}
                style={{
                  background: customAccentColor || "linear-gradient(135deg, #ff0000, #00ff00, #0000ff)",
                  backgroundImage: customAccentColor
                    ? customAccentColor
                    : "conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b)"
                }}
                title="Custom Color"
                aria-label="Custom color picker"
                aria-pressed={accent === "custom"}
              >
                <Palette size={14} style={{ color: "white", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
              </button>
              <div className="flex-1 relative">
                <input
                  type="color"
                  value={customAccentColor || "#8b5cf6"}
                  onChange={(e) => setCustomAccentColor(e.target.value)}
                  className="w-full h-9 rounded-lg cursor-pointer opacity-0 absolute inset-0"
                  style={{
                    padding: 0,
                    border: "1px solid var(--glass-border)",
                    background: "var(--glass-bg)"
                  }}
                  aria-label="Choose custom accent color"
                />
                <div
                  className="glass-input px-3 py-1.5 flex items-center gap-2 pointer-events-none"
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontSize: "0.75rem"
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-md border border-white/20"
                    style={{ background: customAccentColor || "#8b5cf6" }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {customAccentColor || "#8b5cf6"} (Custom)
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Background ── */}
          <section>
            <p
              className="widget-title mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Background
            </p>

            {/* Current bg indicator */}
            {backgroundUrl && !previewUrl && (
              <div
                className="flex items-center justify-between rounded-xl p-3 mb-3"
                style={{
                  background: "var(--accent-soft)",
                  border: "1px solid var(--accent-raw)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Image size={14} style={{ color: "var(--accent-raw)" }} />
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      fontFamily: "Cabinet Grotesk, sans-serif",
                    }}
                  >
                    Custom {backgroundType} applied
                  </span>
                </div>
                <button
                  type="button"
                  data-ocid="bg.delete_button"
                  onClick={onRemoveBackground}
                  className="glass-btn p-1.5"
                  title="Remove background"
                  aria-label="Remove custom background"
                >
                  <Trash2 size={12} style={{ color: "oklch(65% 0.22 10)" }} />
                </button>
              </div>
            )}

            {/* Preview */}
            {previewUrl && (
              <div
                className="rounded-xl overflow-hidden mb-3"
                style={{ border: "1px solid var(--glass-border)" }}
              >
                {previewType === "video" ? (
                  <video
                    src={previewUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: 140, objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Background preview"
                    style={{ width: "100%", height: 140, objectFit: "cover" }}
                  />
                )}
                <div className="flex gap-2 p-2">
                  <button
                    type="button"
                    onClick={applyBackground}
                    className="glass-btn flex-1 py-2 text-xs font-semibold"
                    style={{
                      background: "var(--accent-soft)",
                      borderColor: "var(--accent-raw)",
                      color: "var(--text-primary)",
                      fontFamily: "Cabinet Grotesk, sans-serif",
                    }}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={discardPreview}
                    className="glass-btn flex-1 py-2 text-xs font-semibold"
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "Cabinet Grotesk, sans-serif",
                    }}
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}

            {/* Drop zone */}
            <button
              ref={dropZoneRef}
              type="button"
              data-ocid="bg.dropzone"
              className={`bg-dropzone w-full${isDragOver ? " drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload background image or video"
            >
              <Upload
                size={24}
                style={{
                  margin: "0 auto 8px",
                  color: isDragOver ? "var(--accent-raw)" : "var(--text-muted)",
                }}
              />
              <p style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                Drop an image or video here
              </p>
              <p style={{ fontSize: "0.72rem", opacity: 0.6, marginTop: 4 }}>
                or click to browse
              </p>
            </button>

            <input
              ref={fileInputRef}
              data-ocid="bg.upload_button"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              aria-label="Upload background"
            />

            {backgroundUrl && (
              <button
                type="button"
                data-ocid="bg.delete_button"
                onClick={onRemoveBackground}
                className="glass-btn w-full mt-2 py-2 text-sm flex items-center justify-center gap-2"
                style={{
                  color: "oklch(65% 0.22 10)",
                  fontFamily: "Cabinet Grotesk, sans-serif",
                }}
              >
                <Trash2 size={14} />
                Remove Background
              </button>
            )}
          </section>

          {/* ── About ── */}
          <section>
            <p
              className="widget-title mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              About
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                fontFamily: "Sora, sans-serif",
              }}
            >
              GlassDash — your premium smart wallpaper homepage. Built by {" "}
              <a
                href={`https://frontend-3ckl.onrender.com/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-raw)" }}
              >
                shani kumar
              </a>
            </p>
          </section>
        </div>
      </aside>
    </>
  );
}
