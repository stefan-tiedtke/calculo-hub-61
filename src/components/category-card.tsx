import { Link } from "@tanstack/react-router";
import type { CategoryDef } from "@/lib/calculators/types";
import { getCalculatorsByCategory } from "@/lib/calculators/registry";

export function CategoryCard({ category }: { category: CategoryDef }) {
  const count = getCalculatorsByCategory(category.slug).length;
  return (
    <Link
      to="/kategorie/$slug"
      params={{ slug: category.slug }}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-xl">
        {category.icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-semibold text-foreground group-hover:text-brand">
            {category.name}
          </h3>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground">
            {count}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {category.description}
        </p>
      </div>
    </Link>
  );
}