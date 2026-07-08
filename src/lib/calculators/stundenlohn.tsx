import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";

type Mode = "aus-monat" | "aus-jahr" | "aus-stunde";

export default function StundenlohnCalculator() {
  const [mode, setMode] = useState<Mode>("aus-monat");
  const [monat, setMonat] = useState("3000");
  const [jahr, setJahr] = useState("42000");
  const [stunde, setStunde] = useState("20");
  const [wochenstunden, setWochenstunden] = useState("40");
  const [urlaub, setUrlaub] = useState("30");
  const [feiertage, setFeiertage] = useState("10");
  const [krank, setKrank] = useState("0");

  const result = useMemo(() => {
    const wStd = parseNumber(wochenstunden);
    if (!wStd || wStd <= 0) return null;

    // Arbeitstage pro Jahr (5-Tage-Woche als Basis)
    const arbeitstageBrutto = 260; // 52 Wochen × 5 Tage
    const urlaubT = parseNumber(urlaub) || 0;
    const feiertageT = parseNumber(feiertage) || 0;
    const krankT = parseNumber(krank) || 0;
    const arbeitstageNetto = Math.max(0, arbeitstageBrutto - urlaubT - feiertageT - krankT);

    const stdProTag = wStd / 5;
    const jahresStundenBrutto = wStd * 52;                 // vertragliche Stunden
    const jahresStundenNetto = arbeitstageNetto * stdProTag; // tatsächlich gearbeitete Stunden
    const monatsStunden = jahresStundenBrutto / 12;

    let jahresBrutto = 0;
    let stundenlohn = 0;
    let monatslohn = 0;

    if (mode === "aus-monat") {
      const m = parseNumber(monat) || 0;
      monatslohn = m;
      jahresBrutto = m * 12;
      stundenlohn = monatsStunden > 0 ? m / monatsStunden : 0;
    } else if (mode === "aus-jahr") {
      const j = parseNumber(jahr) || 0;
      jahresBrutto = j;
      monatslohn = j / 12;
      stundenlohn = jahresStundenBrutto > 0 ? j / jahresStundenBrutto : 0;
    } else {
      const s = parseNumber(stunde) || 0;
      stundenlohn = s;
      jahresBrutto = s * jahresStundenBrutto;
      monatslohn = jahresBrutto / 12;
    }

    const effektivStundenlohn =
      jahresStundenNetto > 0 ? jahresBrutto / jahresStundenNetto : 0;
    const tageslohn = stdProTag * stundenlohn;
    const wochenlohn = wStd * stundenlohn;

    return {
      stundenlohn,
      effektivStundenlohn,
      tageslohn,
      wochenlohn,
      monatslohn,
      jahresBrutto,
      monatsStunden,
      jahresStundenBrutto,
      jahresStundenNetto,
    };
  }, [mode, monat, jahr, stunde, wochenstunden, urlaub, feiertage, krank]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SegmentedControl
            label="Berechnen aus"
            value={mode}
            onChange={setMode}
            options={[
              { value: "aus-monat", label: "Monatslohn" },
              { value: "aus-jahr", label: "Jahreslohn" },
              { value: "aus-stunde", label: "Stundenlohn" },
            ]}
          />
          {mode === "aus-monat" && (
            <NumberField
              label="Bruttomonatslohn"
              unit="€"
              value={monat}
              onChange={setMonat}
              min={0}
              step={100}
            />
          )}
          {mode === "aus-jahr" && (
            <NumberField
              label="Bruttojahreslohn"
              unit="€"
              value={jahr}
              onChange={setJahr}
              min={0}
              step={500}
            />
          )}
          {mode === "aus-stunde" && (
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
            hint="Vertragliche Stunden pro Woche (Basis: 5-Tage-Woche)."
          />
          <NumberField
            label="Urlaubstage"
            unit="Tage"
            value={urlaub}
            onChange={setUrlaub}
            min={0}
            max={60}
          />
          <NumberField
            label="Feiertage (arbeitsfrei)"
            unit="Tage"
            value={feiertage}
            onChange={setFeiertage}
            min={0}
            max={20}
            hint="Gesetzliche Feiertage, die auf Werktage fallen."
          />
          <NumberField
            label="Krankheitstage"
            unit="Tage"
            value={krank}
            onChange={setKrank}
            min={0}
            max={60}
            hint="Optionaler Durchschnittswert pro Jahr."
          />
        </>
      }
      result={
        <ResultCard
          label="Bruttostundenlohn"
          value={result ? formatCurrency(result.stundenlohn) : "–"}
          badge={
            result
              ? {
                  label: `Effektiv ${formatCurrency(result.effektivStundenlohn)} / Std.`,
                  tone: "info",
                }
              : undefined
          }
          description={
            result && (
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Tageslohn</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.tageslohn)}</dd>
                <dt>Wochenlohn</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.wochenlohn)}</dd>
                <dt>Monatslohn</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.monatslohn)}</dd>
                <dt>Jahreslohn</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.jahresBrutto)}</dd>
                <dt>Monatsstunden</dt>
                <dd className="text-right tabular-nums">
                  {result.monatsStunden.toFixed(1)} Std.
                </dd>
                <dt>Arbeitsstunden / Jahr</dt>
                <dd className="text-right tabular-nums">
                  {Math.round(result.jahresStundenNetto)} Std.
                </dd>
              </dl>
            )
          }
          footer={
            <span>
              Bruttowerte, vor Steuern und Sozialabgaben. Der effektive Stundenlohn berücksichtigt
              Urlaub, Feiertage und Krankheit.
            </span>
          }
        />
      }
    />
  );
}