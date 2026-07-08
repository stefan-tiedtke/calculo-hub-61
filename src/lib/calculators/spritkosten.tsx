import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

export default function SpritkostenCalculator() {
  const [strecke, setStrecke] = useState("100");
  const [verbrauch, setVerbrauch] = useState("6.5");
  const [preis, setPreis] = useState("1.75");
  const [mitfahrer, setMitfahrer] = useState("1");
  const [hinRueck, setHinRueck] = useState(true);

  const r = useMemo(() => {
    const s = Math.max(0, parseNumber(strecke) || 0);
    const v = Math.max(0, parseNumber(verbrauch) || 0);
    const p = Math.max(0, parseNumber(preis) || 0);
    const personen = Math.max(1, Math.floor(parseNumber(mitfahrer) || 1));
    const einfach = (s * v / 100) * p;
    const gesamtStrecke = hinRueck ? s * 2 : s;
    const gesamt = einfach * (hinRueck ? 2 : 1);
    return {
      einfach,
      gesamt,
      gesamtStrecke,
      proPerson: gesamt / personen,
      liter: (gesamtStrecke * v) / 100,
      personen,
    };
  }, [strecke, verbrauch, preis, mitfahrer, hinRueck]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Strecke (einfach)"
            unit="km"
            value={strecke}
            onChange={setStrecke}
            min={0}
            step={10}
            hint="Distanz für eine Richtung."
          />
          <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-3">
            <input
              id="hinrueck"
              type="checkbox"
              checked={hinRueck}
              onChange={(e) => setHinRueck(e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            <label htmlFor="hinrueck" className="text-sm font-medium">
              Hin- und Rückfahrt berechnen
            </label>
          </div>
          <NumberField
            label="Verbrauch"
            unit="l/100km"
            value={verbrauch}
            onChange={setVerbrauch}
            min={0}
            step={0.1}
            hint="Durchschnittsverbrauch laut Bordcomputer oder Fahrzeugschein."
          />
          <NumberField
            label="Spritpreis"
            unit="€/L"
            value={preis}
            onChange={setPreis}
            min={0}
            step={0.01}
            hint="Aktueller Preis pro Liter Benzin, Diesel oder E10."
          />
          <NumberField
            label="Personen im Auto"
            value={mitfahrer}
            onChange={setMitfahrer}
            min={1}
            step={1}
            hint="Inklusive Fahrer – Basis für Kosten pro Person."
          />
        </>
      }
      result={
        <ResultCard
          label="Gesamtkosten"
          value={formatCurrency(r.gesamt)}
          badge={{
            label: `${formatCurrency(r.proPerson)} / Person`,
            tone: "info",
          }}
          description={
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt>Einfache Fahrt</dt>
              <dd className="text-right tabular-nums">{formatCurrency(r.einfach)}</dd>
              <dt>{hinRueck ? "Hin + Rück" : "Nur Hinfahrt"}</dt>
              <dd className="text-right tabular-nums">{formatCurrency(r.gesamt)}</dd>
              <dt>Gesamtstrecke</dt>
              <dd className="text-right tabular-nums">
                {formatNumber(r.gesamtStrecke, 0)} km
              </dd>
              <dt>Verbrauch gesamt</dt>
              <dd className="text-right tabular-nums">{formatNumber(r.liter, 2)} L</dd>
              <dt>Kosten pro Person</dt>
              <dd className="text-right tabular-nums">{formatCurrency(r.proPerson)}</dd>
            </dl>
          }
          footer={
            <span>
              Basierend auf Durchschnittsverbrauch. Reale Kosten schwanken je nach
              Fahrstil, Beladung, Klima und Verkehr um ±10–20 %.
            </span>
          }
        />
      }
    />
  );
}