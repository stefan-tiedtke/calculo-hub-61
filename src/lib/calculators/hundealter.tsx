import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatNumber, parseNumber } from "@/lib/format";

/**
 * Wandelt das Hundealter in ein vergleichbares Menschenalter um.
 * Gängige Näherung:
 * - 1 Hundejahr  ≈ 15 Menschenjahre
 * - 2 Hundejahre ≈ 24 Menschenjahre
 * - Jedes weitere Jahr ≈ +5 Menschenjahre
 */
function dogToHumanYears(dogYears: number): number {
  if (dogYears <= 0) return 0;
  if (dogYears <= 1) return dogYears * 15;
  if (dogYears <= 2) return 15 + (dogYears - 1) * 9;
  return 24 + (dogYears - 2) * 5;
}

function lifeStage(dogYears: number): {
  label: string;
  description: string;
  tone: "info" | "positive" | "warning" | "critical";
} {
  if (dogYears < 0.5) {
    return {
      label: "Welpe",
      description: "Erste Monate: Sozialisierung, Impfungen, stubenrein werden.",
      tone: "info",
    };
  }
  if (dogYears < 2) {
    return {
      label: "Junger Hund",
      description: "Jugendphase: Viel Energie, Ausbildung, Wachstumsschübe.",
      tone: "info",
    };
  }
  if (dogYears < 7) {
    return {
      label: "Erwachsener Hund",
      description: "Die sportlichsten Jahre: Körperlich fit, Charakter voll entwickelt.",
      tone: "positive",
    };
  }
  if (dogYears < 10) {
    return {
      label: "Reifer Hund",
      description: "Erste Alterszeichen können sichtbar werden – regelmäßige Checks lohnen sich.",
      tone: "warning",
    };
  }
  if (dogYears < 13) {
    return {
      label: "Senior",
      description: "Langsamere Bewegung, angepasste Ernährung und mehr Ruhe.",
      tone: "warning",
    };
  }
  return {
    label: "Geriatrischer Hund",
    description: "Hohes Alter: Sanfte Bewegung, tierärztliche Betreuung und Komfort sind wichtig.",
    tone: "critical",
  };
}

export default function HundealterCalculator() {
  const [dogYears, setDogYears] = useState("3");

  const result = useMemo(() => {
    const years = parseNumber(dogYears);
    if (!Number.isFinite(years) || years < 0) return null;
    const humanYears = dogToHumanYears(years);
    const stage = lifeStage(years);
    return { years, humanYears, stage };
  }, [dogYears]);

  return (
    <CalculatorShell
      inputs={
        <NumberField
          label="Alter deines Hundes"
          unit="Jahre"
          value={dogYears}
          onChange={setDogYears}
          min={0}
          max={30}
          step={0.1}
          placeholder="z. B. 3"
          hint="Du kannst auch Dezimalzahlen eingeben, z. B. 1,5 für 18 Monate."
        />
      }
      result={
        <div className="space-y-6">
          <ResultCard
            label="Entspricht in Menschenjahren"
            value={result ? formatNumber(result.humanYears, 1) : "–"}
            unit="Jahre"
            badge={
              result
                ? { label: result.stage.label, tone: result.stage.tone }
                : undefined
            }
            description={
              result
                ? `${result.stage.description} Die Umrechnung ist eine Orientierung, keine medizinische Aussage.`
                : "Gib ein gültiges Hundealter ein, um die Umrechnung zu sehen."
            }
            footer={
              result ? (
                <span>
                  {result.years < 1
                    ? "In den ersten Monaten altern Hunde besonders schnell."
                    : result.years < 3
                      ? "Die ersten beiden Lebensjahre entsprechen großen Entwicklungssprüngen."
                      : "Ab dem dritten Jahr entspricht jedes Hundejahr etwa fünf Menschenjahren."}
                </span>
              ) : undefined
            }
          />

          {result && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Vergleich
              </div>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Hundealter</span>
                  <span className="font-medium text-foreground">
                    {formatNumber(result.years, 1)} {result.years === 1 ? "Jahr" : "Jahre"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Menschenalter</span>
                  <span className="font-medium text-foreground">
                    {formatNumber(result.humanYears, 1)} {result.humanYears === 1 ? "Jahr" : "Jahre"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Verhältnis</span>
                  <span className="font-medium text-foreground">
                    ≈ 1:{formatNumber(result.humanYears / result.years, 1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
