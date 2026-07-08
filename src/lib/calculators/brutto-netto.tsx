import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";

type Period = "monat" | "jahr";
type YesNo = "ja" | "nein";
type TaxClass = "1" | "2" | "3" | "4" | "5" | "6";
type Bundesland = "by-bw" | "rest";

// Vereinfachter Einkommensteuertarif 2025 (Grundtabelle)
function einkommensteuer(zvE: number): number {
  if (zvE <= 12096) return 0;
  if (zvE <= 17443) {
    const y = (zvE - 12096) / 10000;
    return (932.3 * y + 1400) * y;
  }
  if (zvE <= 68480) {
    const z = (zvE - 17443) / 10000;
    return (176.64 * z + 2397) * z + 1015.13;
  }
  if (zvE <= 277825) return 0.42 * zvE - 10911.92;
  return 0.45 * zvE - 19246.67;
}

// Splittingtarif (Steuerklasse 3): halbes zvE, dann Steuer * 2
function lohnsteuer(zvE: number, klasse: TaxClass): number {
  if (klasse === "3") return 2 * einkommensteuer(zvE / 2);
  if (klasse === "5" || klasse === "6") {
    // grob vereinfacht: höhere Belastung, ca. 1.15x Grundtarif
    return einkommensteuer(zvE) * 1.15;
  }
  return einkommensteuer(zvE);
}

export default function BruttoNettoCalculator() {
  const [gross, setGross] = useState("4000");
  const [period, setPeriod] = useState<Period>("monat");
  const [klasse, setKlasse] = useState<TaxClass>("1");
  const [kirche, setKirche] = useState<YesNo>("nein");
  const [bundesland, setBundesland] = useState<Bundesland>("rest");
  const [kinder, setKinder] = useState<YesNo>("ja");
  const [zusatz, setZusatz] = useState("1.7"); // KV-Zusatzbeitrag %

  const result = useMemo(() => {
    const g = parseNumber(gross);
    if (!g || g <= 0) return null;

    const brutto = period === "monat" ? g * 12 : g;

    // Beitragsbemessungsgrenzen 2025 (jährlich, West vereinfacht)
    const bbgRV = 96600; // Renten-/Arbeitslosen-V
    const bbgKV = 66150; // Kranken-/Pflege-V

    const rvBase = Math.min(brutto, bbgRV);
    const kvBase = Math.min(brutto, bbgKV);

    const zusatzPct = parseNumber(zusatz) || 0;
    const rv = rvBase * 0.093; // 18,6% / 2
    const av = rvBase * 0.013; // 2,6% / 2
    const kv = kvBase * (0.073 + zusatzPct / 200); // 14,6% / 2 + Zusatz/2
    const pvSatz = 0.017 + (kinder === "nein" ? 0.006 : 0); // 3,4%/2 + 0,6% Zuschlag
    const pv = kvBase * pvSatz;

    const sozial = rv + av + kv + pv;

    // Werbungskostenpauschale 1230, Sonderausgabenpauschale 36, Vorsorgepauschale ~ Sozial
    const zvE = Math.max(0, brutto - 1230 - 36 - sozial);
    const lst = lohnsteuer(zvE, klasse);

    // Soli: seit 2021 Freigrenze; grob: erst ab ~18.130 € Lohnsteuer (Alleinstehend)
    const soliFrei = klasse === "3" ? 36260 : 18130;
    const soli = lst > soliFrei ? lst * 0.055 : 0;

    const kist = kirche === "ja" ? lst * (bundesland === "by-bw" ? 0.08 : 0.09) : 0;

    const abgaben = lst + soli + kist + sozial;
    const netto = brutto - abgaben;

    const factor = period === "monat" ? 1 / 12 : 1;
    return {
      brutto: brutto * factor,
      netto: netto * factor,
      lst: lst * factor,
      soli: soli * factor,
      kist: kist * factor,
      rv: rv * factor,
      av: av * factor,
      kv: kv * factor,
      pv: pv * factor,
      quote: netto / brutto,
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