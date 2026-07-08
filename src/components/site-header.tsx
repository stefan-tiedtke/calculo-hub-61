import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/calculators/categories";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-foreground font-display text-sm font-bold">
            R
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Rechnerio
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-4 lg:flex">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to="/kategorie/$slug"
                params={{ slug: cat.slug }}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}