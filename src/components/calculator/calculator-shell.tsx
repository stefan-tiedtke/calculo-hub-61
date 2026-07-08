import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalculatorShellProps {
  inputs: ReactNode;
  result: ReactNode;
  className?: string;
  /** Layout ratio between inputs and result column. Defaults to equal. */
  layout?: "equal" | "input-heavy" | "result-heavy";
}

/**
 * Shared 2-column calculator layout: inputs left, result right on desktop;
 * stacked on mobile with the result pinned near the top for visibility.
 */
export function CalculatorShell({
  inputs,
  result,
  className,
  layout = "equal",
}: CalculatorShellProps) {
  const cols =
    layout === "input-heavy"
      ? "md:grid-cols-[3fr_2fr]"
      : layout === "result-heavy"
        ? "md:grid-cols-[2fr_3fr]"
        : "md:grid-cols-2";
  return (
    <div className={cn("grid gap-6", cols, className)}>
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        {inputs}
      </div>
      <div className="md:sticky md:top-24 md:self-start">{result}</div>
    </div>
  );
}