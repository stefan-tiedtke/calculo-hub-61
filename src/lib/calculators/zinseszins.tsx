import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";

type Frequency = "jaehrlich" | "monatlich";
type ContribTiming = "monat" | "jahr" | "keine";

export default function ZinseszinsCalculator() {
  const [startkapital, setStartkapital] = useState("10000");
  const [zinssatz, setZinssatz] = useState("5");
  const [jahre, setJahre] = useState("15");
  const [sparrate, setSparrate] = useState("200");
  const [rateTyp, setRateTyp] = useState<ContribTiming>("monat");
  const [frequenz, setFrequenz] = useState<Frequency>("jaehrlich");

  const result = useMemo(() => {
    const P = parseNumber(startkapital);
    const rPct = parseNumber(zinssatz);
    const t = parseNumber(jahre);
    const contrib = rateTyp === "keine" ? 0 : parseNumber(sparrate) || 0;
    if (!Number.isFinite(P) || !Number.isFinite(rPct) || !Number.isFinite(t)) return null;
    if (t <= 0) return null;

    const n = frequenz === "monatlich" ? 12 : 1;
    const r = rPct / 100;
    const periods = Math.round(t * n);
    const iPeriod = r / n;

    // Sparrate pro Periode (Beitrag jeweils am Ende der Periode)
    let perPeriodContribution = 0;
    if (rateTyp === "monat") {
      // Monatliche Sparrate → auf Periodenlänge umlegen
      perPeriodContribution = contrib * (12 / n);
    } else if (rateTyp === "jahr") {
      perPeriodContribution = contrib / n;
    }

    let balance = P;
    const yearly: { jahr: number; wert: number; einzahlung: number; zinsen: number }[] = [];
    let cumulativeContrib = 0;

    for (let k = 1; k <= periods; k++) {
      const interest = balance * iPeriod;
      balance = balance + interest + perPeriodContribution;
      cumulativeContrib += perPeriodContribution;
      if (k % n === 0) {
        const jahr = k / n;
        yearly.push({
          jahr,
          wert: balance,
          einzahlung: P + cumulativeContrib,
          zinsen: balance - P - cumulativeContrib,
        });
      }
    }

    const totalContribution = P + cumulativeContrib;
    const totalInterest = balance - totalContribution;

    return {
      endkapital: balance,
      einzahlungen: totalContribution,
      zinsen: totalInterest,
      yearly,
    };
  }, [startkapital, zinssatz, jahre, sparrate, rateTyp, frequenz]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Startkapital"
            value={startkapital}
            onChange={setStartkapital}
            unit="€"
            min={0}
            step={100}
          />
          <NumberField
            label="Zinssatz pro Jahr"
            value={zinssatz}
            onChange={setZinssatz}
            unit="%"
            min={0}
            step={0.1}
            hint="Erwartete jährliche Rendite (z. B. 5 % bei breit gestreuten ETFs)."
          />
          <NumberField
            label="Anlagedauer"
            value={jahre}
            onChange={setJahre}
            unit="Jahre"
            min={1}
            step={1}
          />
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Sparrate</div>
            <SegmentedControl
              value={rateTyp}
              onChange={(v) => setRateTyp(v as ContribTiming)}
              options={[
                { value: "monat", label: "Monatlich" },
                { value: "jahr", label: "Jährlich" },
                { value: "keine", label: "Keine" },
              ]}
            />
          </div>
          {rateTyp !== "keine" && (
            <NumberField
              label={rateTyp === "monat" ? "Monatliche Sparrate" : "Jährliche Sparrate"}
              value={sparrate}
              onChange={setSparrate}
              unit="€"
              min={0}
              step={50}
            />
          )}
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Zinsgutschrift</div>
            <SegmentedControl
              value={frequenz}
              onChange={(v) => setFrequenz(v as Frequency)}
              options={[
                { value: "jaehrlich", label: "Jährlich" },
                { value: "monatlich", label: "Monatlich" },
              ]}
            />
          </div>
        </>
      }
      result={
        result ? (
          <div className="space-y-4">
            <ResultCard
              label="Endkapital"
              value={formatCurrency(result.endkapital)}
              badge={{
                label: `+ ${formatCurrency(result.zinsen)} Zinsen`,
                tone: "positive",
              }}
              description={
                <>
                  Nach {jahre} Jahren bei {zinssatz}% p. a.
                </>
              }
              footer={
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Einzahlungen
                    </div>
                    <div className="mt-1 font-medium tabular-nums text-foreground">
                      {formatCurrency(result.einzahlungen)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Zinserträge
                    </div>
                    <div className="mt-1 font-medium tabular-nums text-foreground">
                      {formatCurrency(result.zinsen)}
                    </div>
                  </div>
                </div>
              }
            />
            {result.yearly.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="text-sm font-medium text-foreground">
                  Entwicklung im Zeitverlauf
                </div>
                <div className="mt-4 max-h-64 overflow-y-auto">
                  <table className="w-full text-sm tabular-nums">
                    <thead className="sticky top-0 bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-2 pr-2 font-medium">Jahr</th>
                        <th className="py-2 pr-2 font-medium">Einzahlungen</th>
                        <th className="py-2 pr-2 font-medium">Zinsen</th>
                        <th className="py-2 font-medium text-right">Wert</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.yearly.map((row) => (
                        <tr key={row.jahr}>
                          <td className="py-2 pr-2">{row.jahr}</td>
                          <td className="py-2 pr-2 text-muted-foreground">
                            {formatCurrency(row.einzahlung)}
                          </td>
                          <td className="py-2 pr-2 text-muted-foreground">
                            {formatCurrency(row.zinsen)}
                          </td>
                          <td className="py-2 text-right font-medium">
                            {formatCurrency(row.wert)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ResultCard label="Endkapital" value="–" description="Bitte gültige Werte eingeben." />
        )
      }
    />
  );
}