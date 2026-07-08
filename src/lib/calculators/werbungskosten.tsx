import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, parseNumber } from "@/lib/format";

const PAUSCHBETRAG = 1230;

const POSTEN: { key: string; label: string; hint: string }[] = [
  { key: "fahrten", label: "Fahrten zur Arbeit / Pendlerpauschale", hint: "Entfernungspauschale (0,30 € / 0,38 €/km × Pendlertage)." },
  { key: "homeoffice", label: "Homeoffice-Pauschale", hint: "6 €/Tag, max. 1.260 € pro Jahr." },
  { key: "arbeitsmittel", label: "Arbeitsmittel", hint: "Laptop, Bürostuhl, Fachliteratur, Werkzeug – bis 952 € brutto sofort absetzbar." },
  { key: "arbeitszimmer", label: "Häusliches Arbeitszimmer", hint: "Nur bei Mittelpunkt der Tätigkeit voll, sonst Homeoffice-Pauschale." },
  { key: "fortbildung", label: "Fort- & Weiterbildung", hint: "Kursgebühren, Fachbücher, Reisekosten zur Fortbildung." },
  { key: "bewerbung", label: "Bewerbungskosten", hint: "Porto, Mappen, Fahrten, Online-Bewerbungen (Pauschal ~2,50 €/Online, ~8,50 €/Post)." },
  { key: "gewerkschaft", label: "Beiträge (Gewerkschaft, Berufsverband)", hint: "Voll absetzbar." },
  { key: "reise", label: "Beruflich veranlasste Reisen", hint: "Auswärtstätigkeiten, Verpflegungsmehraufwand, Übernachtungen." },
  { key: "kontofuehrung", label: "Kontoführungspauschale", hint: "Ohne Nachweis 16 €/Jahr." },
  { key: "sonstiges", label: "Sonstige Werbungskosten", hint: "Steuerberatung (Arbeitnehmerteil), Rechtsschutz, Unfallkosten auf Dienstreise." },
];

export default function WerbungskostenCalculator() {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(POSTEN.map((p) => [p.key, ""])),
  );
  const [grenzsteuer, setGrenzsteuer] = useState("30");

  const set = (key: string, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const r = useMemo(() => {
    const summe = POSTEN.reduce(
      (s, p) => s + Math.max(0, parseNumber(values[p]?.length ? p.key : p.key) || 0),
      0,
    );
    // recompute properly
    const gesamt = POSTEN.reduce(
      (s, p) => s + Math.max(0, parseNumber(values[p.key]) || 0),
      0,
    );
    const angesetzt = Math.max(gesamt, PAUSCHBETRAG);
    const differenz = gesamt - PAUSCHBETRAG;
    const zusaetzlichAbsetzbar = Math.max(0, differenz);
    const satz = Math.max(0, Math.min(100, parseNumber(grenzsteuer) || 0)) / 100;
    const ersparnis = zusaetzlichAbsetzbar * satz;
    return { gesamt, angesetzt, differenz, zusaetzlichAbsetzbar, ersparnis, _summe: summe };
  }, [values, grenzsteuer]);

  return (
    <CalculatorShell
      layout="input-heavy"
      inputs={
        <>
          <p className="text-sm text-muted-foreground">
            Trage deine Werbungskosten pro Kategorie ein (Jahresbeträge in €). Leere
            Felder werden als 0 gewertet.
          </p>
          <div className="space-y-3">
            {POSTEN.map((p) => (
              <NumberField
                key={p.key}
                label={p.label}
                unit="€"
                value={values[p.key]}
                onChange={(v) => set(p.key, v)}
                min={0}
                step={10}
                placeholder="0"
                hint={p.hint}
              />
            ))}
          </div>
          <NumberField
            label="Persönlicher Grenzsteuersatz"
            unit="%"
            value={grenzsteuer}
            onChange={setGrenzsteuer}
            min={0}
            max={45}
            step={1}
            hint="Typisch 25–42 %. Richtwert 30 % bei mittlerem Einkommen."
          />
        </>
      }
      result={
        <ResultCard
          label="Werbungskosten gesamt"
          value={formatCurrency(r.gesamt)}
          badge={
            r.differenz > 0
              ? {
                  label: `+ ${formatCurrency(r.differenz)} über Pauschbetrag`,
                  tone: "positive",
                }
              : {
                  label: `${formatCurrency(-r.differenz)} unter Pauschbetrag`,
                  tone: "warning",
                }
          }
          description={
            <>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Arbeitnehmer-Pauschbetrag</dt>
                <dd className="text-right tabular-nums">{formatCurrency(PAUSCHBETRAG)}</dd>
                <dt>Vom Finanzamt angesetzt</dt>
                <dd className="text-right tabular-nums">{formatCurrency(r.angesetzt)}</dd>
                <dt>Zusätzlich absetzbar</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(r.zusaetzlichAbsetzbar)}
                </dd>
                <dt>Geschätzte Steuerersparnis</dt>
                <dd className="text-right font-semibold tabular-nums text-foreground">
                  {formatCurrency(r.ersparnis)}
                </dd>
              </dl>
              {r.differenz <= 0 ? (
                <p className="mt-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                  Deine Werbungskosten liegen unter dem Arbeitnehmer-Pauschbetrag von{" "}
                  {formatCurrency(PAUSCHBETRAG)}. Diesen zieht das Finanzamt automatisch
                  ab – ein Einzelnachweis lohnt sich hier steuerlich nicht.
                </p>
              ) : (
                <p className="mt-3 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-400">
                  Ein Einzelnachweis in der Steuererklärung lohnt sich – deine
                  Werbungskosten übersteigen den Pauschbetrag um{" "}
                  {formatCurrency(r.differenz)}.
                </p>
              )}
            </>
          }
          footer={
            <span>
              Werte 2024/2025. Die Steuerersparnis ist eine Näherung
              (absetzbarer Betrag × Grenzsteuersatz), der exakte Effekt ergibt sich
              erst aus dem Steuerbescheid.
            </span>
          }
        />
      }
    />
  );
}