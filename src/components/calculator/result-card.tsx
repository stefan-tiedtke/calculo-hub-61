import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "positive" | "warning" | "critical" | "info";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-surface-muted text-foreground",
  positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  critical: "bg-destructive/10 text-destructive",
  info: "bg-brand/10 text-brand",
};

interface ResultCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  badge?: { label: string; tone?: Tone };
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Consistent hero result display for every calculator. */
export function ResultCard({
  label,
  value,
  unit,
  badge,
  description,
  footer,
  className,
}: ResultCardProps) {
  const tone = badge?.tone ?? "neutral";
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-6",
        className,
      )}
    >
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="font-display text-6xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </div>
          {unit && (
            <div className="text-xl font-medium text-muted-foreground">{unit}</div>
          )}
        </div>
        {badge && (
          <div
            className={cn(
              "mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium",
              toneStyles[tone],
            )}
          >
            {badge.label}
          </div>
        )}
        {description && (
          <div className="mt-4 text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}