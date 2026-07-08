import { Link } from "@tanstack/react-router";
import type { CalculatorDef } from "@/lib/calculators/types";
import { getCategory } from "@/lib/calculators/categories";

export function CalculatorCard({ calc }: { calc: CalculatorDef }) {
  const cat = getCategory(calc.category);
  return (
    <Link
      to="/rechner/$slug"
      params={{ slug: calc.slug }}
      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>{cat?.icon}</span>
          <span>{cat?.name}</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-foreground group-hover:text-brand">
          {calc.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{calc.shortDescription}</p>
      </div>
      <div className="mt-6 text-sm font-medium text-brand">
        Öffnen <span aria-hidden>→</span>
      </div>
    </Link>
  );
}