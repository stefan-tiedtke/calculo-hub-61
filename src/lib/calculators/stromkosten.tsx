import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";

type Modus = "verbrauch" | "geraet" | "haushalt";

const HAUSHALT_KWH: Record<string, number> = {
  "1": 1500,
  "2": 2500,
  "3": 3500,
  "4": 4250,
  "5": 5000,
};

export default function StromkostenCalculator() {
  const [modus, setModus] = useState<Modus>("verbrauch");
  const [preis, setPreis] = useState("35"); // ct/kWh
  const [grund, setGrund] = useState("12"); // €/Monat
  const [kwh, setKwh] = useState("3500");
  const [watt, setWatt] = useState("100");
  const [stundenProTag, setStundenProTag] = useState("4");
  const [tageProJahr, setTageProJahr] = useState("365");
  const [personen, setPersonen] = useState<"1" | "2" | "3" | "4" | "5">("2");

  const result = useMemo(() => {
    const preisEur = (parseNumber(preis) || 0) / 100;
    const grundpreis = (parseNumber(grund) || 0) * 12;

    let verbrauch = 0; // kWh/Jahr
    if (modus === "verbrauch") {
      verbrauch = parseNumber(kwh) || 0;
    } else if (modus === "geraet") {
      const w = parseNumber(watt) || 0;
      const h = parseNumber(stundenProTag) || 0;
      const d = parseNumber(tageProJahr) || 0;
      verbrauch = (w * h * d) / 1000;
    } else {
      verbrauch = HAUSHALT_KWH[personen] || 2500;
    }

    const arbeitspreis = verbrauch * preisEur;
    const gesamt = arbeitspreis + grundpreis;

    return {
      verbrauch,
      arbeitspreis,
      grundpreis,
      gesamt,
      proMonat: gesamt / 12,
      proTag: gesamt / 365,
      co2: verbrauch * 0.38, // kg CO2, dt. Strommix ~380 g/kWh
    };
  }, [modus, preis, grund, kwh, watt, stundenProTag, tageProJahr, personen]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SegmentedControl
            label="Berechnen für"
            value={modus}
            onChange={setModus}
            options={[
              { value: "verbrauch", label: "Jahresverbrauch" },
              { value: "haushalt", label: "Haushaltsgröße" },
              { value: "geraet", label: "Einzelnes Gerät" },
            ]}
          />
          {modus === "verbrauch" && (
            <NumberField
              label="Jahresverbrauch"
              unit="kWh"
              value={kwh}
              onChange={setKwh}
              min={0}
              step={100}
            />
          )}
          {modus === "haushalt" && (
            <SegmentedControl
              label="Personen im Haushalt"
              value={personen}
              onChange={setPersonen}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5+" },
              ]}
            />
          )}
          {modus === "geraet" && (
            <>
              <NumberField
                label="Leistung"
                unit="Watt"
                value={watt}
                onChange={setWatt}
                min={0}
                step={10}
              />
              <NumberField
                label="Nutzung"
                unit="Std./Tag"
                value={stundenProTag}
                onChange={setStundenProTag}
                min={0}
                max={24}
                step={0.5}
              />
              <NumberField
                label="Nutzungstage"
                unit="Tage/Jahr"
                value={tageProJahr}
                onChange={setTageProJahr}
                min={0}
                max={365}
                step={1}
              />
            </>
          )}
          <NumberField
            label="Arbeitspreis"
            unit="ct/kWh"
            value={preis}
            onChange={setPreis}
            min={0}
            step={0.5}
            hint="2025 im Schnitt ca. 35 ct/kWh, oft im Vertrag genannt."
          />
          <NumberField
            label="Grundpreis"
            unit="€/Monat"
            value={grund}
            onChange={setGrund}
            min={0}
            step={0.5}
            hint="Monatliche Grundgebühr laut Stromvertrag."
          />
        </>
      }
      result={
        <ResultCard
          label="Stromkosten pro Jahr"
          value={formatCurrency(result.gesamt)}
          badge={{
            label: `${formatCurrency(result.proMonat)} / Monat`,
            tone: "info",
          }}
          description={
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt>Verbrauch</dt>
              <dd className="text-right tabular-nums">
                {result.verbrauch.toLocaleString("de-DE", { maximumFractionDigits: 0 })} kWh/Jahr
              </dd>
              <dt>Arbeitspreis</dt>
              <dd className="text-right tabular-nums">{formatCurrency(result.arbeitspreis)}</dd>
              <dt>Grundpreis</dt>
              <dd className="text-right tabular-nums">{formatCurrency(result.grundpreis)}</dd>
              <dt>Kosten pro Tag</dt>
              <dd className="text-right tabular-nums">{formatCurrency(result.proTag)}</dd>
              <dt>CO₂-Ausstoß</dt>
              <dd className="text-right tabular-nums">
                {result.co2.toLocaleString("de-DE", { maximumFractionDigits: 0 })} kg/Jahr
              </dd>
            </dl>
          }
          footer={
            <span>
              Bruttowerte inkl. Steuern und Abgaben laut Stromvertrag. CO₂ auf Basis des deutschen
              Strommixes (~380 g/kWh).
            </span>
          }
        />
      }
    />
  );
}