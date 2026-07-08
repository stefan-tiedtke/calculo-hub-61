import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatNumber, parseNumber } from "@/lib/format";

type Tone = "info" | "positive" | "warning" | "critical";

function classify(bmi: number): { label: string; tone: Tone } {
  if (bmi < 18.5) return { label: "Untergewicht", tone: "info" };
  if (bmi < 25) return { label: "Normalgewicht", tone: "positive" };
  if (bmi < 30) return { label: "Übergewicht", tone: "warning" };
  return { label: "Adipositas", tone: "critical" };
}

export default function BmiCalculator() {
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");

  const result = useMemo(() => {
    const h = parseNumber(height) / 100;
    const w = parseNumber(weight);
    if (!h || !w || h <= 0) return null;
    const bmi = w / (h * h);
    return { bmi, ...classify(bmi) };
  }, [height, weight]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Körpergröße"
            unit="cm"
            value={height}
            onChange={setHeight}
            min={50}
            max={250}
          />
          <NumberField
            label="Gewicht"
            unit="kg"
            value={weight}
            onChange={setWeight}
            min={20}
            max={400}
          />
        </>
      }
      result={
        <ResultCard
          label="Dein BMI"
          value={result ? formatNumber(result.bmi, 1) : "–"}
          badge={result ? { label: result.label, tone: result.tone } : undefined}
          description="Der Body-Mass-Index ist ein Richtwert zur Einordnung des Körpergewichts im Verhältnis zur Größe."
          footer={<span>WHO-Klassifikation für Erwachsene ab 18 Jahren.</span>}
        />
      }
    />
  );
}