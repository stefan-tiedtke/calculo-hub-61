import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatNumber, parseNumber } from "@/lib/format";

/**
 * Wandelt das Katzenalter in ein vergleichbares Menschenalter um.
 * Gängige Näherung:
 * - 1 Katzenjahr  ≈ 15 Menschenjahre
 * - 2 Katzenjahre ≈ 24 Menschenjahre
 * - Jedes weitere Jahr ≈ +4 Menschenjahre
 */
function catToHumanYears(catYears: number): number {
  if (catYears <= 0) return 0;
  if (catYears <= 1) return catYears * 15;
  if (catYears <= 2) return 15 + (catYears - 1) * 9;
  return 24 + (catYears - 2) * 4;
}

function lifeStage(catYears: number): {
  label: string;
  description: string;
  tone: "info" | "positive" | "warning" | "critical";
} {
  if (catYears < 0.5) {
    return {
      label: "Kitten",
      description: "Erste Lebensmonate: viel Schlaf, schnelles Wachstum, erste Impfungen.",
      tone: "info",
    };
  }
  if (catYears < 2) {
    return {
      label: "Junior",
      description: "Jugendphase: Entdeckungsdrang, Spieltrieb, Geschlechtsreife.",
      tone: "info",
    };
  }
  if (catYears < 7) {
    return {
      label: "Erwachsene Katze",
      description: "Die ruhigsten Jahre: Körperlich fit, Persönlichkeit voll entwickelt.",
      tone: "positive",
    };
  }
  if (catYears < 11) {
    return {
      label: "Reife Katze",
      description: "Langsamer Übergang: Erste Alterszeichen können sichtbar werden.",
      tone: "warning",
    };
  }
  if (catYears < 15) {
    return {
      label: "Senior",
      description: "Regelmäßige Gesundheits-Checks werden wichtiger.",
      tone: "warning",
    };
  }
  return {
    label: "Geriatrische Katze",
    description: "Hohes Alter: Sanfte Haltung, angepasste Ernährung, tierärztliche Betreuung.",
    tone: "critical",
  };
}

export default function KatzenalterCalculator() {
  const [catYears, setCatYears] = useState("3");

  const result = useMemo(() => {
    const years = parseNumber(catYears);
    if (!Number.isFinite(years) || years < 0) return null;
    const humanYears = catToHumanYears(years);
    const stage = lifeStage(years);
    return { years, humanYears, stage };
  }, [catYears]);

  return (
    <CalculatorShell
      inputs={
        <NumberField
          label="Alter deiner Katze"
          unit="Jahre"
          value={catYears}
          onChange={setCatYears}
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
                : "Gib ein gültiges Katzenalter ein, um die Umrechnung zu sehen."
            }
            footer={
              result ? (
                <span>
                  {result.years < 1
                    ? "In den ersten Monaten altern Katzen besonders schnell."
                    : result.years < 3
                      ? "Die ersten beiden Lebensjahre entsprechen großen Entwicklungssprüngen."
                      : "Ab dem dritten Jahr entspricht jedes Katzenjahr etwa vier Menschenjahren."}
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
                  <span>Katzenalter</span>
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
