import { useId } from "react";
import { cn } from "@/lib/utils";

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  hint?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * Standard numeric input used by every calculator.
 * Handles label, unit suffix, hint text and consistent focus styling.
 */
export function NumberField({
  label,
  value,
  onChange,
  unit,
  hint,
  placeholder,
  min,
  max,
  step,
  className,
}: NumberFieldProps) {
  const id = useId();
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full rounded-lg border border-input bg-background px-4 py-3 text-lg tabular-nums outline-none transition-shadow focus:ring-2 focus:ring-ring",
            unit && "pr-14",
          )}
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}