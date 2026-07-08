import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, parseNumber } from "@/lib/format";

type Modus = "rate" | "laufzeit";

export default function KreditCalculator() {
  const [modus, setModus] = useState<Modus>("rate");
  const [betrag, setBetrag] = useState("20000");
  const [zins, setZins] = useState("5");
  const [jahre, setJahre] = useState("5");
  const [rate, setRate] = useState("400");

  const result = useMemo(() => {
    const K = parseNumber(betrag);
    const p = parseNumber(zins);
    if (!K || K <= 0 || p == null || p < 0) return null;
    const iMonat = p / 100 / 12;

    let n = 0;
    let r = 0;

    if (modus === "rate") {
      const j = parseNumber(jahre) || 0;
      n = Math.round(j * 12);
      if (n <= 0) return null;
      r =
        iMonat === 0
          ? K / n
          : (K * iMonat) / (1 - Math.pow(1 + iMonat, -n));
    } else {
      r = parseNumber(rate) || 0;
      if (r <= 0) return null;
      if (iMonat === 0) {
        n = Math.ceil(K / r);
      } else {
        // Rate muss > Zinsen im ersten Monat sein
        if (r <= K * iMonat) return { impossible: true } as const;
        n = Math.ceil(-Math.log(1 - (K * iMonat) / r) / Math.log(1 + iMonat));
      }
    }

    // Tilgungsplan (jahresweise)
    let rest = K;
    let zinsenGesamt = 0;
    const plan: {
      jahr: number;
      zinsen: number;
      tilgung: number;
      rest: number;
    }[] = [];
    for (let m = 1; m <= n; m++) {
      const z = rest * iMonat;
      let t = r - z;
      if (m === n) {
        // letzte Rate ggf. anpassen
        t = rest;
      }
      rest -= t;
      zinsenGesamt += z;
      if (m % 12 === 0 || m === n) {
        plan.push({
          jahr: Math.ceil(m / 12),
          zinsen: zinsenGesamt,
          tilgung: K - Math.max(0, rest),
          rest: Math.max(0, rest),
        });
      }
    }

    return {
      impossible: false,
      rate: r,
      monate: n,
      jahre: n / 12,
      gesamt: r * (n - 1) + (r + (rest < 0 ? rest : 0)),
      zinsenGesamt,
      plan,
    };
  }, [modus, betrag, zins, jahre, rate]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SegmentedControl
            label="Berechnen"
            value={modus}
            onChange={setModus}
            options={[
              { value: "rate", label: "Monatsrate" },
              { value: "laufzeit", label: "Laufzeit" },
            ]}
          />
          <NumberField
            label="Kreditbetrag"
            unit="€"
            value={betrag}
            onChange={setBetrag}
            min={0}
            step={1000}
          />
          <NumberField
            label="Sollzins p. a."
            unit="%"
            value={zins}
            onChange={setZins}
            min={0}
            max={30}
            step={0.1}
          />
          {modus === "rate" ? (
            <NumberField
              label="Laufzeit"
              unit="Jahre"
              value={jahre}
              onChange={setJahre}
              min={0.5}
              max={40}
              step={0.5}
            />
          ) : (
            <NumberField
              label="Monatsrate"
              unit="€"
              value={rate}
              onChange={setRate}
              min={0}
              step={50}
              hint="Muss größer sein als die monatlichen Zinsen."
            />
          )}
        </>
      }
      result={
        <ResultCard
          label={modus === "rate" ? "Monatliche Rate" : "Laufzeit"}
          value={
            !result
              ? "–"
              : result.impossible
                ? "Rate zu niedrig"
                : modus === "rate"
                  ? formatCurrency(result.rate)
                  : `${result.jahre.toFixed(1)} Jahre`
          }
          badge={
            result && !result.impossible
              ? {
                  label: `${formatCurrency(result.zinsenGesamt)} Zinsen gesamt`,
                  tone: "info",
                }
              : undefined
          }
          description={
            result && !result.impossible && (
              <>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt>Kreditbetrag</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(parseNumber(betrag) || 0)}
                  </dd>
                  <dt>Rate</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.rate)}
                  </dd>
                  <dt>Laufzeit</dt>
                  <dd className="text-right tabular-nums">
                    {result.monate} Monate ({result.jahre.toFixed(1)} Jahre)
                  </dd>
                  <dt>Zinskosten</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.zinsenGesamt)}
                  </dd>
                  <dt>Rückzahlung gesamt</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency((parseNumber(betrag) || 0) + result.zinsenGesamt)}
                  </dd>
                </dl>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-2 pr-4">Jahr</th>
                        <th className="py-2 pr-4 text-right">Zinsen kumuliert</th>
                        <th className="py-2 pr-4 text-right">Getilgt</th>
                        <th className="py-2 text-right">Restschuld</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.plan.map((row) => (
                        <tr key={row.jahr} className="border-b border-border/40 last:border-0">
                          <td className="py-2 pr-4 tabular-nums">{row.jahr}</td>
                          <td className="py-2 pr-4 text-right tabular-nums">
                            {formatCurrency(row.zinsen)}
                          </td>
                          <td className="py-2 pr-4 text-right tabular-nums">
                            {formatCurrency(row.tilgung)}
                          </td>
                          <td className="py-2 text-right tabular-nums">
                            {formatCurrency(row.rest)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
          }
          footer={
            <span>
              Annuitätendarlehen mit konstanter Monatsrate. Ohne Gebühren, Restschuldversicherung
              oder Sondertilgungen.
            </span>
          }
        />
      }
    />
  );
}