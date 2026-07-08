import type { ExampleItem } from "@/lib/calculators/types";

export function CalculatorExamples({ examples }: { examples: ExampleItem[] }) {
  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Beispiele</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {examples.map((ex) => (
          <div
            key={ex.title}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="font-display text-base font-semibold">{ex.title}</div>
            <div className="mt-2 text-sm text-muted-foreground">{ex.inputs}</div>
            <div className="mt-3 text-sm">
              <span className="text-muted-foreground">Ergebnis: </span>
              <span className="font-medium text-foreground">{ex.result}</span>
            </div>
            {ex.note && <p className="mt-2 text-xs text-muted-foreground">{ex.note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}