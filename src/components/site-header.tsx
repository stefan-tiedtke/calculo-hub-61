import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/calculators/categories";
import { ThemeToggle } from "@/components/theme-toggle";
import { CalculatorSearch } from "@/components/calculator-search";
import logoAsset from "@/assets/rechnerio-logo.png.asset.json";
import wordmarkAsset from "@/assets/rechnerio-wordmark.png.asset.json";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-border overflow-hidden">
            <img
              src={logoAsset.url}
              alt="Rechnerio Logo"
              className="h-8 w-8 object-contain"
            />
          </span>
          <img
            src={wordmarkAsset.url}
            alt="Rechnerio"
            className="h-6 w-auto dark:[filter:invert(1)_hue-rotate(180deg)]"
          />
        </Link>
        <div className="hidden max-w-sm flex-1 md:block">
          <CalculatorSearch variant="compact" />
        </div>
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