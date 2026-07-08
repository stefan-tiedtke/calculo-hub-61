import { useMemo, useState } from "react";

function classify(bmi: number): { label: string; tone: string } {
  if (bmi < 18.5) return { label: "Untergewicht", tone: "text-brand" };
  if (bmi < 25) return { label: "Normalgewicht", tone: "text-emerald-600" };
  if (bmi < 30) return { label: "Übergewicht", tone: "text-amber-600" };
  return { label: "Adipositas", tone: "text-destructive" };
}

export default function BmiCalculator() {
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");

  const result = useMemo(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w || h <= 0) return null;
    const bmi = w / (h * h);
    return { bmi, ...classify(bmi) };
  }, [height, weight]);

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="height">
            Körpergröße (cm)
          </label>
          <input
            id="height"
            type="number"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="weight">
            Gewicht (kg)
          </label>
          <input
            id="weight"
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-surface p-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Dein BMI
          </div>
          <div className="mt-2 font-display text-6xl font-semibold tracking-tight text-foreground">
            {result ? result.bmi.toFixed(1) : "–"}
          </div>
          {result && (
            <div className={`mt-2 text-lg font-medium ${result.tone}`}>{result.label}</div>
          )}
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Der Body-Mass-Index (BMI) ist ein Richtwert zur Einordnung des Körpergewichts im
            Verhältnis zur Größe.
          </p>
          <p className="text-xs">Formel: BMI = Gewicht (kg) / Größe (m)²</p>
        </div>
      </div>
    </div>
  );
}