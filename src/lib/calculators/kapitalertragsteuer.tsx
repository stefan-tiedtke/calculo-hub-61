import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";

type Veranlagung = "einzel" | "zusammen";
type Kirche = "keine" | "8" | "9";
type Fondstyp = "keine" | "aktien" | "misch" | "immo";

const TEILFREI: Record<Fondstyp, number> = {
  keine: 0,
  aktien: 0.3,
  misch: 0.15,
  immo: 0.6,
};

export default function KapitalertragsteuerCalculator() {
  const [gewinn, setGewinn] = useState("5000");
  const [veranlagung, setVeranlagung] = useState<Veranlagung>("einzel");
  const [freibetragGenutzt, setFreibetragGenutzt] = useState("0");
  const [kirche, setKirche] = useState<Kirche>("keine");
  const [fonds, setFonds] = useState<Fondstyp>("keine");

  const r = useMemo(() => {
    const brutto = Math.max(0, parseNumber(gewinn) || 0);
    const pauschbetrag = veranlagung === "zusammen" ? 2000 : 1000;
    const bereitsGenutzt = Math.max(0, parseNumber(freibetragGenutzt) || 0);
    const restFreibetrag = Math.max(0, pauschbetrag - bereitsGenutzt);
    const teilfrei = TEILFREI[fonds];
    const nachTeilfreistellung = brutto * (1 - teilfrei);
    const steuerpflichtig = Math.max(0, nachTeilfreistellung - restFreibetrag);

    const kestSatz = 0.25;
    const soliSatz = 0.055;
    const kircheSatz = kirche === "keine" ? 0 : parseInt(kirche) / 100;

    // Kirchensteuer mindert KESt: KESt = 25% · Einkünfte / (1 + 0,25·KiSt)
    // Kompaktformel BMF
    const kestBrutto = kircheSatz > 0
      ? steuerpflichtig * kestSatz / (1 + kestSatz * kircheSatz)
      : steuerpflichtig * kestSatz;
    const kircheSteuer = kestBrutto * kircheSatz;
    const soli = kestBrutto * soliSatz;
    const gesamtSteuer = kestBrutto + soli + kircheSteuer;
    const nettoGewinn = brutto - gesamtSteuer;
    const effektivSatz = brutto > 0 ? gesamtSteuer / brutto : 0;

    return {
      brutto,
      pauschbetrag,
      restFreibetrag,
      steuerpflichtig,
      teilfrei,
      nachTeilfreistellung,
      kestBrutto,
      soli,
      kircheSteuer,
      gesamtSteuer,
      nettoGewinn,
      effektivSatz,
    };
  }, [gewinn, veranlagung, freibetragGenutzt, kirche, fonds]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Kapitalerträge / Gewinn"
            unit="€"
            value={gewinn}
            onChange={setGewinn}
            min={0}
            step={100}
            hint="Zinsen, Dividenden, realisierte Kursgewinne im Jahr (brutto)."
          />
          <SegmentedControl
            label="Veranlagung"
            value={veranlagung}
            onChange={(v) => setVeranlagung(v as Veranlagung)}
            options={[
              { value: "einzel", label: "Einzel (1.000 €)" },
              { value: "zusammen", label: "Verheiratet (2.000 €)" },
            ]}
          />
          <NumberField
            label="Bereits genutzter Freistellungsauftrag"
            unit="€"
            value={freibetragGenutzt}
            onChange={setFreibetragGenutzt}
            min={0}
            step={50}
            hint="Bei anderen Banken bereits ausgeschöpfter Sparerpauschbetrag."
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Fondstyp (Teilfreistellung)</label>
            <SegmentedControl
              value={fonds}
              onChange={(v) => setFonds(v as Fondstyp)}
              options={[
                { value: "keine", label: "Keine (Zinsen/Aktien)" },
                { value: "aktien", label: "Aktienfonds (30 %)" },
                { value: "misch", label: "Mischfonds (15 %)" },
                { value: "immo", label: "Immobilienfonds (60 %)" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              Fonds ab bestimmten Aktien- bzw. Immobilienquoten haben einen steuerfreien Anteil der Erträge.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Kirchensteuer</label>
            <SegmentedControl
              value={kirche}
              onChange={(v) => setKirche(v as Kirche)}
              options={[
                { value: "keine", label: "Keine" },
                { value: "8", label: "8 % (BW, BY)" },
                { value: "9", label: "9 % (Rest)" },
              ]}
            />
          </div>
        </>
      }
      result={
        <ResultCard
          label="Steuer auf Kapitalerträge"
          value={formatCurrency(r.gesamtSteuer)}
          badge={{
            label: `Netto: ${formatCurrency(r.nettoGewinn)}`,
            tone: "info",
          }}
          description={
            <>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Bruttoerträge</dt>
                <dd className="text-right tabular-nums">{formatCurrency(r.brutto)}</dd>
                {r.teilfrei > 0 && (
                  <>
                    <dt>Nach Teilfreistellung ({Math.round(r.teilfrei * 100)} %)</dt>
                    <dd className="text-right tabular-nums">
                      {formatCurrency(r.nachTeilfreistellung)}
                    </dd>
                  </>
                )}
                <dt>Sparerpauschbetrag (verbleibend)</dt>
                <dd className="text-right tabular-nums">
                  − {formatCurrency(r.restFreibetrag)}
                </dd>
                <dt>Steuerpflichtiger Betrag</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(r.steuerpflichtig)}
                </dd>
              </dl>
              <div className="mt-4 border-t pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Aufschlüsselung
                </p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt>Kapitalertragsteuer (25 %)</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(r.kestBrutto)}
                  </dd>
                  <dt>Solidaritätszuschlag (5,5 %)</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.soli)}</dd>
                  {r.kircheSteuer > 0 && (
                    <>
                      <dt>Kirchensteuer</dt>
                      <dd className="text-right tabular-nums">
                        {formatCurrency(r.kircheSteuer)}
                      </dd>
                    </>
                  )}
                  <dt>Effektiver Steuersatz</dt>
                  <dd className="text-right tabular-nums">
                    {(r.effektivSatz * 100).toFixed(2).replace(".", ",")} %
                  </dd>
                </dl>
              </div>
            </>
          }
          footer={
            <span>
              Werte 2024/2025: Abgeltungsteuer 25 % + Soli, Sparerpauschbetrag 1.000 € /
              2.000 €. Bei niedrigem Einkommen kann die Günstigerprüfung sinnvoll sein.
            </span>
          }
        />
      }
    />
  );
}