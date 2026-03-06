import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  glass = false,
  ...props
}: React.ComponentProps<"input"> & { glass?: boolean }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        glass
          ? "glass-input backdrop-blur-[12px] bg-[var(--glass-bg)] border-[var(--glass-border)] focus:border-[var(--accent-raw)] focus:shadow-[0_0_0_3px_var(--accent-soft),0_0_20px_var(--accent-glow),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
