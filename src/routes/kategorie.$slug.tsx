import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCategory, categories } from "@/lib/calculators/categories";
import { getCalculatorsByCategory } from "@/lib/calculators/registry";
import { CalculatorCard } from "@/components/calculator-card";
import type { CategoryDef } from "@/lib/calculators/types";

export const Route = createFileRoute("/kategorie/$slug")({
  loader: ({ params }): { category: CategoryDef; calcSlugs: string[] } => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    const calcSlugs = getCalculatorsByCategory(category.slug).map((calc) => calc.slug);
    return { category, calcSlugs };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Kategorie nicht gefunden" }, { name: "robots", content: "noindex" }] };
    }
    const { category } = loaderData;
    const title = `${category.name}-Rechner – Rechnerio`;
    const desc = `${category.description} Alle ${category.name}-Rechner auf Rechnerio – kostenlos und ohne Anmeldung.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/kategorie/${category.slug}` },
      ],
      links: [{ rel: "canonical", href: `/kategorie/${category.slug}` }],
    };
  },
  component: CategoryPage,
  notFoundComponent: CategoryNotFound,
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl">Etwas ist schiefgelaufen</h1>
      <button onClick={reset} className="mt-4 rounded-md bg-brand px-4 py-2 text-brand-foreground">
        Erneut versuchen
      </button>
    </div>
  ),
});

function CategoryPage() {
  const { category, calcSlugs } = Route.useLoaderData();
  const calcs = getCalculatorsByCategory(category.slug).filter((calc) =>
    calcSlugs.includes(calc.slug),
  );
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Start</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>
      <header className="mt-6 flex items-start gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-muted text-2xl">
          {category.icon}
        </div>
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {category.name}-Rechner
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
        </div>
      </header>

      {calcs.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="text-muted-foreground">
            In dieser Kategorie sind noch keine Rechner verfügbar. Wir arbeiten daran.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
          >
            Zurück zur Startseite
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calcs.map((calc) => (
            <CalculatorCard key={calc.slug} calc={calc} />
          ))}
        </div>
      )}

      <section className="mt-16 border-t border-border pt-10">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Weitere Kategorien
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <Link
                key={c.slug}
                to="/kategorie/$slug"
                params={{ slug: c.slug }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
              >
                {c.icon} {c.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

function CategoryNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Kategorie nicht gefunden</h1>
      <p className="mt-2 text-muted-foreground">
        Diese Kategorie existiert nicht (mehr).
      </p>
      <Link to="/" className="mt-6 inline-block text-brand hover:underline">
        Zurück zur Startseite
      </Link>
    </div>
  );
}
