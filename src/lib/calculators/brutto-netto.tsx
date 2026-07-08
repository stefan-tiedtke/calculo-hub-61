import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";
import { computeNettoJahr, type TaxClass, type Bundesland } from "./lohnsteuer";

type Period = "monat" | "jahr";
type YesNo = "ja" | "nein";

export default function BruttoNettoCalculator() {
  const [gross, setGross] = useState("4000");
  const [period, setPeriod] = useState<Period>("monat");
  const [klasse, setKlasse] = useState<TaxClass>("1");
  const [kirche, setKirche] = useState<YesNo>("nein");
  const [bundesland, setBundesland] = useState<Bundesland>("rest");
  const [kinder, setKinder] = useState<YesNo>("ja");
  const [zusatz, setZusatz] = useState("1.7");

  const result = useMemo(() => {
    const g = parseNumber(gross);
    if (!g || g <= 0) return null;
    const brutto = period === "monat" ? g * 12 : g;
    const e = computeNettoJahr(brutto, {
      klasse,
      kirche: kirche === "ja",
      bundesland,
      kinder: kinder === "ja",
      zusatzbeitragProzent: parseNumber(zusatz) || 0,
    });

    const factor = period === "monat" ? 1 / 12 : 1;
    return {
      brutto: e.brutto * factor,
      netto: e.netto * factor,
      lst: e.lst * factor,
      soli: e.soli * factor,
      kist: e.kist * factor,
      rv: e.rv * factor,
      av: e.av * factor,
      kv: e.kv * factor,
      pv: e.pv * factor,
      quote: e.netto / e.brutto,
    };
  }, [gross, period, klasse, kirche, bundesland, kinder, zusatz]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SegmentedControl
            label="Zeitraum"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "monat", label: "Monat" },
              { value: "jahr", label: "Jahr" },
            ]}
          />
          <NumberField
            label="Bruttogehalt"
            unit="€"
            value={gross}
            onChange={setGross}
            min={0}
            step={100}
          />
          <SegmentedControl
            label="Steuerklasse"
            value={klasse}
            onChange={setKlasse}
            options={[
              { value: "1", label: "I" },
              { value: "2", label: "II" },
              { value: "3", label: "III" },
              { value: "4", label: "IV" },
              { value: "5", label: "V" },
              { value: "6", label: "VI" },
            ]}
          />
          <SegmentedControl
            label="Kinder"
            value={kinder}
            onChange={setKinder}
            options={[
              { value: "ja", label: "Ja" },
              { value: "nein", label: "Nein" },
            ]}
          />
          <SegmentedControl
            label="Kirchensteuer"
            value={kirche}
            onChange={setKirche}
            options={[
              { value: "nein", label: "Nein" },
              { value: "ja", label: "Ja" },
            ]}
          />
          {kirche === "ja" && (
            <SegmentedControl
              label="Bundesland"
              value={bundesland}
              onChange={setBundesland}
              options={[
                { value: "by-bw", label: "BY / BW (8 %)" },
                { value: "rest", label: "Übrige (9 %)" },
              ]}
            />
          )}
          <NumberField
            label="KV-Zusatzbeitrag"
            unit="%"
            value={zusatz}
            onChange={setZusatz}
            hint="Kassenindividuell, im Schnitt 1,7 %."
            step={0.1}
            min={0}
            max={5}
          />
        </>
      }
      result={
        <ResultCard
          label={`Netto pro ${period === "monat" ? "Monat" : "Jahr"}`}
          value={result ? formatCurrency(result.netto) : "–"}
          badge={
            result
              ? {
                  label: `${Math.round(result.quote * 100)} % vom Brutto`,
                  tone: "info",
                }
              : undefined
          }
          description={
            result && (
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Brutto</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.brutto)}</dd>
                <dt>Lohnsteuer</dt>
                <dd className="text-right tabular-nums">−{formatCurrency(result.lst)}</dd>
                {result.soli > 0 && (
                  <>
                    <dt>Solidaritätszuschlag</dt>
                    <dd className="text-right tabular-nums">−{formatCurrency(result.soli)}</dd>
                  </>
                )}
                {result.kist > 0 && (
                  <>
                    <dt>Kirchensteuer</dt>
                    <dd className="text-right tabular-nums">−{formatCurrency(result.kist)}</dd>
                  </>
                )}
                <dt>Rentenversicherung</dt>
                <dd className="text-right tabular-nums">−{formatCurrency(result.rv)}</dd>
                <dt>Arbeitslosenversicherung</dt>
                <dd className="text-right tabular-nums">−{formatCurrency(result.av)}</dd>
                <dt>Krankenversicherung</dt>
                <dd className="text-right tabular-nums">−{formatCurrency(result.kv)}</dd>
                <dt>Pflegeversicherung</dt>
                <dd className="text-right tabular-nums">−{formatCurrency(result.pv)}</dd>
              </dl>
            )
          }
          footer={
            <span>
              Vereinfachte Berechnung (Werte 2025, Arbeitnehmeranteil, ohne Freibeträge & Zusatzeinkünfte).
            </span>
          }
        />
      }
    />
  );
}