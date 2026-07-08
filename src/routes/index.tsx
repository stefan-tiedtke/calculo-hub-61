import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/calculators/categories";
import { calculators, getPopularCalculators } from "@/lib/calculators/registry";
import { CategoryCard } from "@/components/category-card";
import { CalculatorCard } from "@/components/calculator-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rechnerio – Kostenlose Online-Rechner für Alltag & Finanzen" },
      {
        name: "description",
        content:
          "Über 30 kostenlose Online-Rechner für Finanzen, Steuern, Immobilien, Gesundheit, Sport und Reisen. Klar, schnell und ohne Anmeldung – für jedes Gerät.",
      },
      {
        property: "og:title",
        content: "Rechnerio – Kostenlose Online-Rechner für Alltag & Finanzen",
      },
      {
        property: "og:description",
        content:
          "Über 30 kostenlose Online-Rechner für Finanzen, Steuern, Immobilien, Gesundheit, Sport und Reisen – ohne Anmeldung.",
      },
      { property: "og:url", content: "https://rechnerio.com/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://rechnerio.com/" }],
  }),
  component: Index,
});

function Index() {
  const popular = getPopularCalculators(6);
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-surface to-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {calculators.length} Rechner online · laufend erweitert
            </div>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Alle wichtigen Rechner an einem Ort.
              <br />
              <span className="text-brand">Kostenlos, schnell und ohne Anmeldung.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Rechner für Finanzen, Steuern, Gesundheit und Alltag – klar aufgebaut,
              blitzschnell und für jedes Gerät optimiert.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Kategorien
            </div>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              Wähle dein Thema
            </h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Beliebt
            </div>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              Häufig genutzte Rechner
            </h2>
          </div>
          <Link
            to="/kategorie/$slug"
            params={{ slug: "gesundheit" }}
            className="hidden text-sm font-medium text-brand hover:underline md:inline"
          >
            Alle ansehen →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((calc) => (
            <CalculatorCard key={calc.slug} calc={calc} />
          ))}
        </div>
      </section>
    </div>
  );
}
