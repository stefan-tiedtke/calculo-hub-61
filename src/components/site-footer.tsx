import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/calculators/categories";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_2fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-foreground font-display text-sm font-bold">
              R
            </span>
            <span className="font-display text-lg font-semibold">Rechnerio</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Hochwertige Online-Rechner für Finanzen, Gesundheit, Alltag und mehr – klar,
            schnell und ohne Ablenkung.
          </p>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Kategorien
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/kategorie/$slug"
                  params={{ slug: c.slug }}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Rechnerio. Alle Angaben ohne Gewähr.
      </div>
    </footer>
  );
}