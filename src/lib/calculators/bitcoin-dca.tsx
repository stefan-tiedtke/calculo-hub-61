import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, parseNumber } from "@/lib/format";
import { BTC_EUR_MONTHLY } from "./btc-prices";

function formatBtc(n: number) {
  return `${n.toLocaleString("de-DE", { maximumFractionDigits: 6 })} BTC`;
}

export default function BitcoinDcaCalculator() {
  const monate = BTC_EUR_MONTHLY;
  const defaultStart = monate[Math.max(0, monate.length - 61)][0]; // ~5 Jahre
  const defaultEnd = monate[monate.length - 1][0];
  const [rate, setRate] = useState("100");
  const [start, setStart] = useState(defaultStart);
  const [ende, setEnde] = useState(defaultEnd);

  const result = useMemo(() => {
    const r = parseNumber(rate) || 0;
    if (r <= 0) return null;

    const startIdx = monate.findIndex((m) => m[0] === start);
    const endeIdx = monate.findIndex((m) => m[0] === ende);
    if (startIdx < 0 || endeIdx < 0 || endeIdx < startIdx) return null;

    let btc = 0;
    let investiert = 0;
    const punkte: {
      monat: string;
      preis: number;
      btc: number;
      wert: number;
      investiert: number;
    }[] = [];

    for (let i = startIdx; i <= endeIdx; i++) {
      const [monat, preis] = monate[i];
      const kauf = r / preis;
      btc += kauf;
      investiert += r;
      punkte.push({
        monat,
        preis,
        btc,
        wert: btc * preis,
        investiert,
      });
    }

    const aktuellerPreis = monate[endeIdx][1];
    const wert = btc * aktuellerPreis;
    const gewinn = wert - investiert;
    const roi = investiert > 0 ? gewinn / investiert : 0;
    const durchschnitt = btc > 0 ? investiert / btc : 0;

    return {
      btc,
      investiert,
      wert,
      gewinn,
      roi,
      durchschnitt,
      aktuellerPreis,
      monate: endeIdx - startIdx + 1,
      punkte,
    };
  }, [rate, start, ende, monate]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Monatliche Sparrate"
            unit="€"
            value={rate}
            onChange={setRate}
            min={1}
            step={10}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Startmonat</span>
            <select
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            >
              {monate.map(([m]) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Endmonat</span>
            <select
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={ende}
              onChange={(e) => setEnde(e.target.value)}
            >
              {monate.map(([m]) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-muted-foreground">
            Backtest gegen historische monatliche BTC/EUR-Schlusskurse. Werte sind gerundet und
            dienen als Orientierung.
          </p>
        </>
      }
      result={
        <ResultCard
          label="Aktueller Depotwert"
          value={result ? formatCurrency(result.wert) : "–"}
          badge={
            result
              ? {
                  label: `${result.roi >= 0 ? "+" : ""}${(result.roi * 100).toFixed(1)} % Rendite`,
                  tone: "info",
                }
              : undefined
          }
          description={
            result && (
              <>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt>Angesparte Bitcoin</dt>
                  <dd className="text-right tabular-nums">{formatBtc(result.btc)}</dd>
                  <dt>Investiert gesamt</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.investiert)}
                  </dd>
                  <dt>Zeitraum</dt>
                  <dd className="text-right tabular-nums">{result.monate} Monate</dd>
                  <dt>Ø Einstiegskurs</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.durchschnitt)}
                  </dd>
                  <dt>Aktueller Kurs</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.aktuellerPreis)}
                  </dd>
                  <dt>Gewinn / Verlust</dt>
                  <dd
                    className={`text-right font-medium tabular-nums ${
                      result.gewinn >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {result.gewinn >= 0 ? "+" : ""}
                    {formatCurrency(result.gewinn)}
                  </dd>
                </dl>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-2 pr-4">Monat</th>
                        <th className="py-2 pr-4 text-right">Kurs</th>
                        <th className="py-2 pr-4 text-right">BTC gesamt</th>
                        <th className="py-2 text-right">Depotwert</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.punkte
                        .filter(
                          (_, i, arr) =>
                            i === 0 ||
                            i === arr.length - 1 ||
                            i % Math.max(1, Math.floor(arr.length / 12)) === 0,
                        )
                        .map((row) => (
                          <tr
                            key={row.monat}
                            className="border-b border-border/40 last:border-0"
                          >
                            <td className="py-2 pr-4 tabular-nums">{row.monat}</td>
                            <td className="py-2 pr-4 text-right tabular-nums">
                              {formatCurrency(row.preis)}
                            </td>
                            <td className="py-2 pr-4 text-right tabular-nums">
                              {row.btc.toLocaleString("de-DE", {
                                maximumFractionDigits: 5,
                              })}
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              {formatCurrency(row.wert)}
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
              Backtest ohne Gebühren, Spread oder Steuern. Historische Renditen sind keine Garantie
              für die Zukunft.
            </span>
          }
        />
      }
    />
  );
}