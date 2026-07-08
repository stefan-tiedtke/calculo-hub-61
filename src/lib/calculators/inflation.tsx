import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

export default function InflationCalculator() {
  const [betrag, setBetrag] = useState("100000");
  const [rate, setRate] = useState("2.5");
  const [jahre, setJahre] = useState("20");

  const result = useMemo(() => {
    const B = parseNumber(betrag);
    const r = parseNumber(rate);
    const t = parseNumber(jahre);
    if (!Number.isFinite(B) || !Number.isFinite(r) || !Number.isFinite(t)) return null;
    if (B <= 0 || t <= 0) return null;

    const faktor = Math.pow(1 + r / 100, t);
    const kaufkraft = B / faktor;
    const verlust = B - kaufkraft;
    const verlustProzent = (verlust / B) * 100;
    // Nominalbetrag, der in t Jahren nötig ist, um heutige Kaufkraft zu erhalten
    const noetigerBetrag = B * faktor;

    const yearly: { jahr: number; kaufkraft: number }[] = [];
    for (let k = 1; k <= Math.min(Math.round(t), 50); k++) {
      yearly.push({ jahr: k, kaufkraft: B / Math.pow(1 + r / 100, k) });
    }

    return { kaufkraft, verlust, verlustProzent, noetigerBetrag, yearly };
  }, [betrag, rate, jahre]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Heutiger Betrag"
            value={betrag}
            onChange={setBetrag}
            unit="€"
            min={0}
            step={1000}
            hint="Der Geldbetrag, dessen zukünftige Kaufkraft du wissen möchtest."
          />
          <NumberField
            label="Inflationsrate pro Jahr"
            value={rate}
            onChange={setRate}
            unit="%"
            min={0}
            step={0.1}
            hint="Langjähriges Ziel der EZB liegt bei 2 %. Deutschland 2000–2024 im Schnitt ~2 %."
          />
          <NumberField
            label="Zeitraum"
            value={jahre}
            onChange={setJahre}
            unit="Jahre"
            min={1}
            step={1}
          />
        </>
      }
      result={
        result ? (
          <div className="space-y-4">
            <ResultCard
              label={`Kaufkraft in ${jahre} Jahren`}
              value={formatCurrency(result.kaufkraft)}
              badge={{
                label: `− ${formatNumber(result.verlustProzent, 1)} % Kaufkraft`,
                tone: "warning",
              }}
              description={
                <>
                  {formatCurrency(parseNumber(betrag))} von heute entsprechen in{" "}
                  {jahre} Jahren bei {rate} % Inflation nur noch{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(result.kaufkraft)}
                  </span>{" "}
                  in heutiger Kaufkraft.
                </>
              }
              footer={
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Kaufkraftverlust
                    </div>
                    <div className="mt-1 font-medium tabular-nums text-foreground">
                      {formatCurrency(result.verlust)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Nötig für gleiche Kaufkraft
                    </div>
                    <div className="mt-1 font-medium tabular-nums text-foreground">
                      {formatCurrency(result.noetigerBetrag)}
                    </div>
                  </div>
                </div>
              }
            />
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-sm font-medium text-foreground">
                Kaufkraft im Zeitverlauf
              </div>
              <div className="mt-4 max-h-64 overflow-y-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead className="sticky top-0 bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-2 font-medium">Jahr</th>
                      <th className="py-2 font-medium text-right">Heutige Kaufkraft</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.yearly.map((row) => (
                      <tr key={row.jahr}>
                        <td className="py-2 pr-2">nach {row.jahr} J.</td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(row.kaufkraft)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <ResultCard
            label="Kaufkraft"
            value="–"
            description="Bitte gültige Werte eingeben."
          />
        )
      }
    />
  );
}