import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";

type Ausschuett = "thesaurierend" | "ausschuettend";

export default function EtfSparplanCalculator() {
  const [start, setStart] = useState("0");
  const [rate, setRate] = useState("200");
  const [rendite, setRendite] = useState("7");
  const [ter, setTer] = useState("0.2");
  const [jahre, setJahre] = useState("25");
  const [dynamik, setDynamik] = useState("0"); // jährliche Ratensteigerung
  const [inflation, setInflation] = useState("2");
  const [teilfrei, setTeilfrei] = useState("30"); // Aktienfonds 30 %
  const [steuer, setSteuer] = useState("26.375"); // Abgeltung + Soli
  const [typ, setTyp] = useState<Ausschuett>("thesaurierend");

  const result = useMemo(() => {
    const K0 = parseNumber(start) || 0;
    const r0 = parseNumber(rate) || 0;
    const p = ((parseNumber(rendite) || 0) - (parseNumber(ter) || 0)) / 100;
    const N = Math.max(1, Math.round(parseNumber(jahre) || 0));
    const dyn = (parseNumber(dynamik) || 0) / 100;
    const infl = (parseNumber(inflation) || 0) / 100;
    const tf = (parseNumber(teilfrei) || 0) / 100;
    const tax = (parseNumber(steuer) || 0) / 100;

    const iMonat = Math.pow(1 + p, 1 / 12) - 1;

    let kapital = K0;
    let eingezahlt = K0;
    let rate_j = r0;
    const plan: { jahr: number; eingezahlt: number; endstand: number }[] = [];

    for (let j = 1; j <= N; j++) {
      for (let m = 0; m < 12; m++) {
        kapital = kapital * (1 + iMonat) + rate_j;
        eingezahlt += rate_j;
      }
      plan.push({ jahr: j, eingezahlt, endstand: kapital });
      rate_j *= 1 + dyn;
    }

    const gewinn = Math.max(0, kapital - eingezahlt);
    const steuerpflichtig = gewinn * (1 - tf);
    const steuerbetrag = typ === "thesaurierend" ? steuerpflichtig * tax : 0;
    // Ausschüttender: Steuer auf laufende Ausschüttungen wurde bereits über Jahre gezahlt –
    // vereinfacht rechnen wir das nicht separat, sondern zeigen den Bruttowert; Hinweis im Footer.

    const nettoKapital = kapital - steuerbetrag;
    const kaufkraft = nettoKapital / Math.pow(1 + infl, N);

    return {
      kapital,
      nettoKapital,
      eingezahlt,
      gewinn,
      steuerbetrag,
      kaufkraft,
      plan,
      N,
    };
  }, [start, rate, rendite, ter, jahre, dynamik, inflation, teilfrei, steuer, typ]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Einmalanlage"
            unit="€"
            value={start}
            onChange={setStart}
            min={0}
            step={500}
          />
          <NumberField
            label="Sparrate"
            unit="€/Monat"
            value={rate}
            onChange={setRate}
            min={0}
            step={25}
          />
          <NumberField
            label="Dynamik"
            unit="% p. a."
            value={dynamik}
            onChange={setDynamik}
            min={0}
            max={20}
            step={0.5}
            hint="Jährliche Erhöhung der Sparrate."
          />
          <NumberField
            label="Laufzeit"
            unit="Jahre"
            value={jahre}
            onChange={setJahre}
            min={1}
            max={60}
            step={1}
          />
          <NumberField
            label="Rendite"
            unit="% p. a."
            value={rendite}
            onChange={setRendite}
            min={0}
            max={20}
            step={0.1}
            hint="Erwartete Bruttorendite vor TER – langfristig oft 5 – 8 % bei Aktien-ETFs."
          />
          <NumberField
            label="TER (laufende Kosten)"
            unit="% p. a."
            value={ter}
            onChange={setTer}
            min={0}
            max={3}
            step={0.05}
          />
          <SegmentedControl
            label="ETF-Typ"
            value={typ}
            onChange={setTyp}
            options={[
              { value: "thesaurierend", label: "Thesaurierend" },
              { value: "ausschuettend", label: "Ausschüttend" },
            ]}
          />
          <NumberField
            label="Teilfreistellung"
            unit="%"
            value={teilfrei}
            onChange={setTeilfrei}
            min={0}
            max={100}
            step={5}
            hint="Aktien-ETF: 30 %, Misch-ETF: 15 %, Anleihen-ETF: 0 %."
          />
          <NumberField
            label="Steuersatz"
            unit="%"
            value={steuer}
            onChange={setSteuer}
            min={0}
            max={50}
            step={0.1}
            hint="Abgeltungssteuer 25 % + Soli 5,5 % = 26,375 % (ohne Kirchensteuer)."
          />
          <NumberField
            label="Inflation"
            unit="% p. a."
            value={inflation}
            onChange={setInflation}
            min={0}
            max={10}
            step={0.1}
          />
        </>
      }
      result={
        <ResultCard
          label="Endkapital netto"
          value={formatCurrency(result.nettoKapital)}
          badge={{
            label: `${formatCurrency(result.kaufkraft)} in heutiger Kaufkraft`,
            tone: "info",
          }}
          description={
            <>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Eingezahlt</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.eingezahlt)}</dd>
                <dt>Bruttoendkapital</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.kapital)}</dd>
                <dt>Gewinn</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.gewinn)}</dd>
                <dt>Steuer beim Verkauf</dt>
                <dd className="text-right tabular-nums">
                  −{formatCurrency(result.steuerbetrag)}
                </dd>
                <dt>Endkapital netto</dt>
                <dd className="text-right font-medium tabular-nums">
                  {formatCurrency(result.nettoKapital)}
                </dd>
                <dt>Kaufkraft (real)</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.kaufkraft)}</dd>
              </dl>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4">Jahr</th>
                      <th className="py-2 pr-4 text-right">Eingezahlt</th>
                      <th className="py-2 text-right">Depotwert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.plan
                      .filter(
                        (row) =>
                          row.jahr === 1 ||
                          row.jahr % 5 === 0 ||
                          row.jahr === result.N,
                      )
                      .map((row) => (
                        <tr
                          key={row.jahr}
                          className="border-b border-border/40 last:border-0"
                        >
                          <td className="py-2 pr-4 tabular-nums">{row.jahr}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">
                            {formatCurrency(row.eingezahlt)}
                          </td>
                          <td className="py-2 text-right tabular-nums">
                            {formatCurrency(row.endstand)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          }
          footer={
            <span>
              Vereinfachte Rechnung ohne Vorabpauschale und Sparerpauschbetrag (1.000 €/Jahr).
              Ausschüttende ETFs zahlen Steuern laufend – hier wird nur die Verkaufssteuer für
              Thesaurierer angesetzt.
            </span>
          }
        />
      }
    />
  );
}