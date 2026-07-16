import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

// GWG-Grenze 2024/2025: 800 € netto = 952 € brutto (sofort abschreibbar).
const GWG_NETTO = 800;
const GWG_BRUTTO = 952;

type PreisArt = "brutto" | "netto";

interface Vorschlag {
  key: string;
  label: string;
  jahre: number;
}

const VORSCHLAEGE: Vorschlag[] = [
  { key: "computer", label: "Computer / Laptop / Software", jahre: 1 },
  { key: "handy", label: "Smartphone", jahre: 5 },
  { key: "buerostuhl", label: "Bürostuhl", jahre: 13 },
  { key: "schreibtisch", label: "Schreibtisch / Büromöbel", jahre: 13 },
  { key: "drucker", label: "Drucker / Peripherie", jahre: 3 },
  { key: "werkzeug", label: "Werkzeug", jahre: 5 },
  { key: "fachbuch", label: "Fachliteratur", jahre: 1 },
  { key: "sonstiges", label: "Sonstiges Arbeitsmittel", jahre: 5 },
];

export default function ArbeitsmittelAfaCalculator() {
  const [preis, setPreis] = useState("1200");
  const [preisArt, setPreisArt] = useState<PreisArt>("brutto");
  const [anteil, setAnteil] = useState("100");
  const [nutzungsdauer, setNutzungsdauer] = useState("3");
  const [kaufmonat, setKaufmonat] = useState("1");
  const [grenzsteuer, setGrenzsteuer] = useState("30");
  const [vorschlag, setVorschlag] = useState<string>("computer");

  const applyVorschlag = (key: string) => {
    setVorschlag(key);
    const v = VORSCHLAEGE.find((x) => x.key === key);
    if (v) setNutzungsdauer(String(v.jahre));
  };

  const r = useMemo(() => {
    const p = Math.max(0, parseNumber(preis) || 0);
    const anteilPct = Math.max(0, Math.min(100, parseNumber(anteil) || 0)) / 100;
    const jahre = Math.max(1, Math.round(parseNumber(nutzungsdauer) || 1));
    const monat = Math.max(1, Math.min(12, Math.round(parseNumber(kaufmonat) || 1)));
    const satz = Math.max(0, Math.min(100, parseNumber(grenzsteuer) || 0)) / 100;

    // GWG-Prüfung erfolgt am Nettopreis
    const nettoGesamt = preisArt === "netto" ? p : p / 1.19;
    const bruttoGesamt = preisArt === "brutto" ? p : p * 1.19;
    const gwgTauglich = nettoGesamt <= GWG_NETTO;

    // Absetzbare Grundlage = Kaufpreis (brutto für Arbeitnehmer) × beruflicher Anteil
    const basis = bruttoGesamt * anteilPct;

    // Sofortabzug (GWG oder Computerhardware/Software = 1 Jahr Nutzungsdauer)
    const sofortMoeglich = gwgTauglich || jahre <= 1;

    let jahresverlauf: { jahr: number; betrag: number; monate: number }[] = [];
    if (sofortMoeglich) {
      jahresverlauf = [{ jahr: 1, betrag: basis, monate: 12 }];
    } else {
      const jahresAfa = basis / jahre;
      const monateJahr1 = 13 - monat; // pro-rata-temporis
      const anteilJahr1 = monateJahr1 / 12;
      jahresverlauf.push({ jahr: 1, betrag: jahresAfa * anteilJahr1, monate: monateJahr1 });
      for (let i = 2; i <= jahre; i++) {
        jahresverlauf.push({ jahr: i, betrag: jahresAfa, monate: 12 });
      }
      const restMonate = 12 - monateJahr1;
      if (restMonate > 0) {
        jahresverlauf.push({
          jahr: jahre + 1,
          betrag: jahresAfa * (restMonate / 12),
          monate: restMonate,
        });
      }
    }

    const ersteJahreErsparnis = jahresverlauf[0]?.betrag * satz || 0;
    const gesamtErsparnis = basis * satz;

    return {
      nettoGesamt,
      bruttoGesamt,
      gwgTauglich,
      sofortMoeglich,
      basis,
      jahresverlauf,
      ersteJahreErsparnis,
      gesamtErsparnis,
      jahre,
    };
  }, [preis, preisArt, anteil, nutzungsdauer, kaufmonat, grenzsteuer]);

  return (
    <CalculatorShell
      layout="input-heavy"
      inputs={
        <>
          <NumberField
            label="Kaufpreis"
            unit="€"
            value={preis}
            onChange={setPreis}
            min={0}
            step={10}
            hint="Anschaffungskosten des Arbeitsmittels."
          />
          <SegmentedControl
            label="Preisangabe"
            value={preisArt}
            onChange={(v) => setPreisArt(v)}
            options={[
              { value: "brutto", label: "Brutto (inkl. USt)" },
              { value: "netto", label: "Netto" },
            ]}
          />
          <NumberField
            label="Beruflicher Nutzungsanteil"
            unit="%"
            value={anteil}
            onChange={setAnteil}
            min={0}
            max={100}
            step={5}
            hint="Anteil, den du das Gerät beruflich nutzt. Bei > 90 % gilt es meist als voll beruflich."
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Typisches Arbeitsmittel</label>
            <select
              value={vorschlag}
              onChange={(e) => applyVorschlag(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-shadow focus:ring-2 focus:ring-ring"
            >
              {VORSCHLAEGE.map((v) => (
                <option key={v.key} value={v.key}>
                  {v.label} · {v.jahre} {v.jahre === 1 ? "Jahr" : "Jahre"}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Setzt die Nutzungsdauer laut AfA-Tabelle. Computer & Software: seit 2021 1 Jahr (BMF).
            </p>
          </div>
          <NumberField
            label="Nutzungsdauer (AfA)"
            unit="Jahre"
            value={nutzungsdauer}
            onChange={setNutzungsdauer}
            min={1}
            max={30}
            step={1}
            hint="Bei GWG (netto ≤ 800 €) und Computerhardware/Software ist Sofortabzug möglich."
          />
          <NumberField
            label="Kaufmonat"
            unit="Monat"
            value={kaufmonat}
            onChange={setKaufmonat}
            min={1}
            max={12}
            step={1}
            hint="1 = Januar. Die AfA im ersten Jahr wird monatsgenau (pro rata temporis) aufgeteilt."
          />
          <NumberField
            label="Persönlicher Grenzsteuersatz"
            unit="%"
            value={grenzsteuer}
            onChange={setGrenzsteuer}
            min={0}
            max={45}
            step={1}
            hint="Typisch 25 – 42 %. Richtwert 30 % bei mittlerem Einkommen."
          />
        </>
      }
      result={
        <ResultCard
          label={r.sofortMoeglich ? "Sofort absetzbar" : "AfA über " + r.jahre + " Jahre"}
          value={formatCurrency(r.basis)}
          badge={
            r.sofortMoeglich
              ? {
                  label: r.gwgTauglich
                    ? `GWG · netto ≤ ${formatCurrency(GWG_NETTO)}`
                    : "Sofortabzug (1 Jahr Nutzungsdauer)",
                  tone: "positive",
                }
              : {
                  label: "Verteilung linear über Nutzungsdauer",
                  tone: "info",
                }
          }
          description={
            <>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Kaufpreis brutto</dt>
                <dd className="text-right tabular-nums">{formatCurrency(r.bruttoGesamt)}</dd>
                <dt>Kaufpreis netto</dt>
                <dd className="text-right tabular-nums">{formatCurrency(r.nettoGesamt)}</dd>
                <dt>GWG-Grenze (netto / brutto)</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(GWG_NETTO)} / {formatCurrency(GWG_BRUTTO)}
                </dd>
                <dt>Absetzbare Basis</dt>
                <dd className="text-right tabular-nums">{formatCurrency(r.basis)}</dd>
                <dt>Ersparnis Jahr 1</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(r.ersteJahreErsparnis)}
                </dd>
                <dt>Gesamte Steuerersparnis</dt>
                <dd className="text-right font-semibold tabular-nums text-foreground">
                  {formatCurrency(r.gesamtErsparnis)}
                </dd>
              </dl>

              <div className="mt-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Abschreibungsverlauf
                </div>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-muted text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Jahr</th>
                        <th className="px-3 py-2 text-right">Monate</th>
                        <th className="px-3 py-2 text-right">AfA-Betrag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {r.jahresverlauf.map((row) => (
                        <tr key={row.jahr}>
                          <td className="px-3 py-2">Jahr {row.jahr}</td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {formatNumber(row.monate, 0)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium tabular-nums">
                            {formatCurrency(row.betrag)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          }
          footer={
            <span>
              Werte 2024/2025. Grenzen und AfA-Tabellen nach § 7 EStG / BMF. Die
              Steuerersparnis ist eine Näherung (Basis × Grenzsteuersatz).
            </span>
          }
        />
      }
    />
  );
}