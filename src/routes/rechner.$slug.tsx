import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCalculator, getCalculatorsByCategory } from "@/lib/calculators/registry";
import { getCategory } from "@/lib/calculators/categories";
import { CalculatorCard } from "@/components/calculator-card";
import type { CalculatorDef, CategoryDef } from "@/lib/calculators/types";

export const Route = createFileRoute("/rechner/$slug")({
  loader: ({ params }): { calc: CalculatorDef; category: CategoryDef | undefined; related: CalculatorDef[] } => {
    const calc = getCalculator(params.slug);
    if (!calc) throw notFound();
    const category = getCategory(calc.category);
    const related = getCalculatorsByCategory(calc.category)
      .filter((c) => c.slug !== calc.slug)
      .slice(0, 3);
    return { calc, category, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Rechner nicht gefunden" }, { name: "robots", content: "noindex" }] };
    }
    const { calc } = loaderData;
    const title = `${calc.name} – Rechnerio`;
    return {
      meta: [
        { title },
        { name: "description", content: calc.description },
        { name: "keywords", content: calc.keywords.join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: calc.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/rechner/${calc.slug}` },
      ],
      links: [{ rel: "canonical", href: `/rechner/${calc.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: calc.name,
            description: calc.description,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }),
        },
      ],
    };
  },
  component: CalculatorPage,
  notFoundComponent: CalcNotFound,
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl">Etwas ist schiefgelaufen</h1>
      <button onClick={reset} className="mt-4 rounded-md bg-brand px-4 py-2 text-brand-foreground">
        Erneut versuchen
      </button>
    </div>
  ),
});

function CalculatorPage() {
  const { calc, category, related } = Route.useLoaderData();
  const CalcComponent = calc.component;
  return (
    <article className="mx-auto max-w-4xl px-6 py-14">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Start</Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link
              to="/kategorie/$slug"
              params={{ slug: category.slug }}
              className="hover:text-foreground"
            >
              {category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-foreground">{calc.name}</span>
      </nav>

      <header className="mt-6">
        {category && (
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </div>
        )}
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {calc.name}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{calc.description}</p>
      </header>

      <section className="mt-10">
        <CalcComponent />
      </section>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Ähnliche Rechner
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r: CalculatorDef) => (
              <CalculatorCard key={r.slug} calc={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function CalcNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Rechner nicht gefunden</h1>
      <p className="mt-2 text-muted-foreground">
        Diesen Rechner gibt es (noch) nicht.
      </p>
      <Link to="/" className="mt-6 inline-block text-brand hover:underline">
        Zurück zur Startseite
      </Link>
    </div>
  );
}