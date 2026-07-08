import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";

type Basis = "monat" | "stunde";

export default function UeberstundenCalculator() {
  const [basis, setBasis] = useState<Basis>("monat");
  const [monat, setMonat] = useState("3000");
  const [stunde, setStunde] = useState("20");
  const [wochenstunden, setWochenstunden] = useState("40");
  const [ueberstunden, setUeberstunden] = useState("10");
  const [zuschlag, setZuschlag] = useState("25");
  const [zeitraum, setZeitraum] = useState<"monat" | "jahr">("monat");

  const result = useMemo(() => {
    const wStd = parseNumber(wochenstunden);
    if (!wStd || wStd <= 0) return null;
    const monatsStunden = (wStd * 52) / 12;

    let stundenlohn = 0;
    if (basis === "monat") {
      const m = parseNumber(monat) || 0;
      stundenlohn = monatsStunden > 0 ? m / monatsStunden : 0;
    } else {
      stundenlohn = parseNumber(stunde) || 0;
    }

    const anzahl = parseNumber(ueberstunden) || 0;
    const zPct = parseNumber(zuschlag) || 0;
    const stundenlohnMitZuschlag = stundenlohn * (1 + zPct / 100);
    const zuschlagBetrag = stundenlohn * (zPct / 100) * anzahl;
    const grundBetrag = stundenlohn * anzahl;
    const gesamt = grundBetrag + zuschlagBetrag;

    const factor = zeitraum === "jahr" ? 12 : 1;
    return {
      stundenlohn,
      stundenlohnMitZuschlag,
      anzahl: anzahl * factor,
      grundBetrag: grundBetrag * factor,
      zuschlagBetrag: zuschlagBetrag * factor,
      gesamt: gesamt * factor,
      monatsStunden,
    };
  }, [basis, monat, stunde, wochenstunden, ueberstunden, zuschlag, zeitraum]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SegmentedControl
            label="Lohnbasis"
            value={basis}
            onChange={setBasis}
            options={[
              { value: "monat", label: "Monatslohn" },
              { value: "stunde", label: "Stundenlohn" },
            ]}
          />
          {basis === "monat" ? (
            <NumberField
              label="Bruttomonatslohn"
              unit="€"
              value={monat}
              onChange={setMonat}
              min={0}
              step={100}
            />
          ) : (
            <NumberField
              label="Bruttostundenlohn"
              unit="€"
              value={stunde}
              onChange={setStunde}
              min={0}
              step={0.5}
            />
          )}
          <NumberField
            label="Wochenarbeitszeit"
            unit="Std."
            value={wochenstunden}
            onChange={setWochenstunden}
            min={1}
            max={80}
            step={0.5}
          />
          <SegmentedControl
            label="Zeitraum Überstunden"
            value={zeitraum}
            onChange={setZeitraum}
            options={[
              { value: "monat", label: "pro Monat" },
              { value: "jahr", label: "pro Jahr" },
            ]}
          />
          <NumberField
            label={`Überstunden pro ${zeitraum === "monat" ? "Monat" : "Monat (Basis)"}`}
            unit="Std."
            value={ueberstunden}
            onChange={setUeberstunden}
            min={0}
            step={1}
            hint="Anzahl der Überstunden pro Monat – die Auswertung skaliert auf den gewählten Zeitraum."
          />
          <NumberField
            label="Überstundenzuschlag"
            unit="%"
            value={zuschlag}
            onChange={setZuschlag}
            min={0}
            max={100}
            step={5}
            hint="Üblich: 25 % (werktags), 50 % (Sonntag), 100 % (Feiertag)."
          />
        </>
      }
      result={
        <ResultCard
          label={`Vergütung Überstunden pro ${zeitraum === "monat" ? "Monat" : "Jahr"}`}
          value={result ? formatCurrency(result.gesamt) : "–"}
          badge={
            result
              ? {
                  label: `${formatCurrency(result.stundenlohnMitZuschlag)} / Überstunde`,
                  tone: "info",
                }
              : undefined
          }
          description={
            result && (
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Bruttostundenlohn</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.stundenlohn)}</dd>
                <dt>Überstunden gesamt</dt>
                <dd className="text-right tabular-nums">
                  {result.anzahl.toFixed(0)} Std.
                </dd>
                <dt>Grundvergütung</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.grundBetrag)}</dd>
                <dt>Zuschlag</dt>
                <dd className="text-right tabular-nums">
                  +{formatCurrency(result.zuschlagBetrag)}
                </dd>
                <dt>Monatsstunden (Basis)</dt>
                <dd className="text-right tabular-nums">
                  {result.monatsStunden.toFixed(1)} Std.
                </dd>
              </dl>
            )
          }
          footer={
            <span>
              Bruttowerte vor Steuern und Sozialabgaben. Ob und wie Überstunden vergütet werden,
              regelt dein Arbeits- oder Tarifvertrag.
            </span>
          }
        />
      }
    />
  );
}