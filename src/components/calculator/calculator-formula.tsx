import type { FormulaBlock } from "@/lib/calculators/types";

export function CalculatorFormula({ formula }: { formula: FormulaBlock }) {
  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Formel</h2>
      <div className="mt-5 rounded-2xl border border-border bg-surface p-6">
        <code className="block font-display text-lg text-foreground">
          {formula.expression}
        </code>
        {formula.explanation && (
          <p className="mt-3 text-sm text-muted-foreground">{formula.explanation}</p>
        )}
        {formula.variables && formula.variables.length > 0 && (
          <dl className="mt-5 grid gap-2 sm:grid-cols-2">
            {formula.variables.map((v) => (
              <div key={v.symbol} className="flex gap-3 text-sm">
                <dt className="font-mono font-semibold text-foreground">{v.symbol}</dt>
                <dd className="text-muted-foreground">{v.description}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}