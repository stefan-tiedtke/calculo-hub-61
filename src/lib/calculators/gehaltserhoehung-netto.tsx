import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";
import {
  computeNettoJahr,
  type Bundesland,
  type TaxClass,
} from "./lohnsteuer";

type Period = "monat" | "jahr";
type YesNo = "ja" | "nein";

export default function GehaltserhoehungNettoCalculator() {
  const [period, setPeriod] = useState<Period>("monat");
  const [gross, setGross] = useState("3500");
  const [erhoehung, setErhoehung] = useState("500");
  const [klasse, setKlasse] = useState<TaxClass>("1");
  const [kirche, setKirche] = useState<YesNo>("nein");
  const [bundesland, setBundesland] = useState<Bundesland>("rest");
  const [kinder, setKinder] = useState<YesNo>("ja");
  const [zusatz, setZusatz] = useState("1.7");

  const diff = useMemo(() => {
    const g = Math.max(0, parseNumber(gross) || 0);
    const e = Math.max(0, parseNumber(erhoehung) || 0);
    if (g <= 0) return null;

    const factorToJahr = period === "monat" ? 12 : 1;
    const bruttoAlt = g * factorToJahr;
    const bruttoNeu = (g + e) * factorToJahr;

    const opts = {
      klasse,
      kirche: kirche === "ja",
      bundesland,
      kinder: kinder === "ja",
      zusatzbeitragProzent: parseNumber(zusatz) || 0,
    };
    const alt = computeNettoJahr(bruttoAlt, opts);
    const neu = computeNettoJahr(bruttoNeu, opts);

    const factorFromJahr = period === "monat" ? 1 / 12 : 1;
    const dBrutto = (neu.brutto - alt.brutto) * factorFromJahr;
    const dSteuern = (neu.steuern - alt.steuern) * factorFromJahr;
    const dSozial = (neu.sozial - alt.sozial) * factorFromJahr;
    const dNetto = (neu.netto - alt.netto) * factorFromJahr;
    const quote = dBrutto > 0 ? dNetto / dBrutto : 0;

    // Warnhinweise: BBG/Soli-Übergang
    const bbgHit =
      alt.brutto <= 66150 && neu.brutto > 66150
        ? "Krankenversicherungs-BBG (66.150 €) überschritten – ab hier keine zusätzlichen KV-/PV-Beiträge."
        : alt.brutto <= 96600 && neu.brutto > 96600
          ? "Renten-/Arbeitslosen-BBG (96.600 €) überschritten – ab hier keine zusätzlichen RV-/AV-Beiträge."
          : null;

    return {
      alt,
      neu,
      dBrutto,
      dSteuern,
      dSozial,
      dNetto,
      quote,
      nettoAlt: alt.netto * factorFromJahr,
      nettoNeu: neu.netto * factorFromJahr,
      bbgHit,
    };
  }, [gross, erhoehung, period, klasse, kirche, bundesland, kinder, zusatz]);

  const presets = [100, 250, 500, 1000];
  const unit = period === "monat" ? "€/Monat" : "€/Jahr";

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
            label="Aktuelles Bruttogehalt"
            unit={unit}
            value={gross}
            onChange={setGross}
            min={0}
            step={100}
          />
          <div className="space-y-2">
            <NumberField
              label="Gehaltserhöhung"
              unit={unit}
              value={erhoehung}
              onChange={setErhoehung}
              min={0}
              step={50}
              hint="Wie viel mehr Brutto würdest du bekommen?"
            />
            <div className="flex flex-wrap gap-2">
              {presets.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setErhoehung(String(v))}
                  className="rounded-full border border-input bg-surface-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  +{formatNumber(v, 0)} €
                </button>
              ))}
            </div>
          </div>
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
          label={`Netto mehr pro ${period === "monat" ? "Monat" : "Jahr"}`}
          value={diff ? `+${formatCurrency(diff.dNetto)}` : "–"}
          badge={
            diff && diff.dBrutto > 0
              ? {
                  label: `${Math.round(diff.quote * 100)} ct von jedem € bleiben übrig`,
                  tone: "positive",
                }
              : undefined
          }
          description={
            diff && (
              <>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <dt>Brutto mehr</dt>
                  <dd className="text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                    +{formatCurrency(diff.dBrutto)}
                  </dd>
                  <dt>Steuern</dt>
                  <dd className="text-right tabular-nums text-destructive">
                    −{formatCurrency(diff.dSteuern)}
                  </dd>
                  <dt>Sozialabgaben</dt>
                  <dd className="text-right tabular-nums text-destructive">
                    −{formatCurrency(diff.dSozial)}
                  </dd>
                  <dt className="border-t pt-2 font-semibold text-foreground">
                    Netto mehr
                  </dt>
                  <dd className="border-t pt-2 text-right font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    +{formatCurrency(diff.dNetto)}
                  </dd>
                </dl>
                <div className="mt-4 rounded-lg bg-surface-muted p-3 text-xs">
                  <div className="text-muted-foreground">Vergleich Netto</div>
                  <div className="mt-1 flex items-baseline justify-between font-medium text-foreground">
                    <span className="tabular-nums">
                      {formatCurrency(diff.nettoAlt)}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="tabular-nums">
                      {formatCurrency(diff.nettoNeu)}
                    </span>
                  </div>
                </div>
                {diff.bbgHit && (
                  <p className="mt-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                    {diff.bbgHit}
                  </p>
                )}
              </>
            )
          }
          footer={
            <span>
              Vereinfachte Berechnung (Werte 2025, Arbeitnehmeranteil). Reale
              Progression, Freibeträge oder Zusatzeinkünfte können den Effekt
              verschieben.
            </span>
          }
        />
      }
    />
  );
}