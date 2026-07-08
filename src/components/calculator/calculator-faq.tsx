import type { FaqItem } from "@/lib/calculators/types";

export function CalculatorFAQ({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        Häufige Fragen
      </h2>
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
        {items.map((item) => (
          <details key={item.question} className="group p-5 open:bg-surface/40">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-foreground [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}