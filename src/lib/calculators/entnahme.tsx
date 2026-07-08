import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

type Mode = "monatlich" | "fire" | "reichweite";

/**
 * Simuliert Portfolioentwicklung mit jährlicher Entnahme.
 * Rückgabe: Jahre bis zum Aufbrauchen (oder Infinity, wenn das Portfolio wächst).
 */
function simuliereReichweite(
  startkapital: number,
  jahresentnahme: number,
  renditePct: number,
  inflationPct: number,
  maxJahre = 100,
): { jahre: number; verlauf: { jahr: number; wert: number; entnahme: number }[]; nachhaltig: boolean } {
  let balance = startkapital;
  let entnahme = jahresentnahme;
  const r = renditePct / 100;
  const infl = inflationPct / 100;
  const verlauf: { jahr: number; wert: number; entnahme: number }[] = [];

  for (let j = 1; j <= maxJahre; j++) {
    // Rendite auf verbleibendes Kapital, dann Entnahme am Jahresende
    balance = balance * (1 + r) - entnahme;
    verlauf.push({ jahr: j, wert: Math.max(0, balance), entnahme });
    if (balance <= 0) {
      return { jahre: j, verlauf, nachhaltig: false };
    }
    entnahme = entnahme * (1 + infl);
  }
  return { jahre: maxJahre, verlauf, nachhaltig: true };
}

export default function EntnahmeCalculator() {
  const [mode, setMode] = useState<Mode>("monatlich");
  const [vermoegen, setVermoegen] = useState("500000");
  const [rate, setRate] = useState("4"); // Entnahmerate in %
  const [monatlich, setMonatlich] = useState("2000");
  const [rendite, setRendite] = useState("6");
  const [inflation, setInflation] = useState("2");

  const result = useMemo(() => {
    const v = parseNumber(vermoegen);
    const q = parseNumber(rate);
    const m = parseNumber(monatlich);
    const r = parseNumber(rendite);
    const infl = parseNumber(inflation);

    if (mode === "monatlich") {
      if (!Number.isFinite(v) || !Number.isFinite(q) || v <= 0 || q <= 0) return null;
      const jahresentnahme = v * (q / 100);
      const monatsentnahme = jahresentnahme / 12;
      const sim = simuliereReichweite(v, jahresentnahme, r, infl);
      return {
        primary: { label: "Monatliche Entnahme", value: formatCurrency(monatsentnahme), badge: `${formatNumber(q, 1)} % p. a.` },
        stats: [
          { label: "Jährliche Entnahme", value: formatCurrency(jahresentnahme) },
          { label: "Reichweite (real)", value: sim.nachhaltig ? "über 100 Jahre" : `${sim.jahre} Jahre` },
        ],
        sim,
      };
    }
    if (mode === "fire") {
      if (!Number.isFinite(m) || !Number.isFinite(q) || m <= 0 || q <= 0) return null;
      const benoetigt = (m * 12) / (q / 100);
      const jahresentnahme = m * 12;
      const sim = simuliereReichweite(benoetigt, jahresentnahme, r, infl);
      return {
        primary: {
          label: "Benötigtes Vermögen (FIRE-Zahl)",
          value: formatCurrency(benoetigt),
          badge: `${formatNumber(100 / q, 1)}× Jahresausgaben`,
        },
        stats: [
          { label: "Jährliche Entnahme", value: formatCurrency(jahresentnahme) },
          { label: "Reichweite (real)", value: sim.nachhaltig ? "über 100 Jahre" : `${sim.jahre} Jahre` },
        ],
        sim,
      };
    }
    // reichweite
    if (!Number.isFinite(v) || !Number.isFinite(m) || v <= 0 || m <= 0) return null;
    const jahresentnahme = m * 12;
    const sim = simuliereReichweite(v, jahresentnahme, r, infl);
    return {
      primary: {
        label: "Reichweite deines Vermögens",
        value: sim.nachhaltig ? "> 100" : String(sim.jahre),
        badge: sim.nachhaltig ? "nachhaltig" : "endlich",
        unit: "Jahre",
      },
      stats: [
        { label: "Jährliche Entnahme (Start)", value: formatCurrency(jahresentnahme) },
        { label: "Effektive Entnahmerate", value: `${formatNumber((jahresentnahme / v) * 100, 2)} %` },
      ],
      sim,
    };
  }, [mode, vermoegen, rate, monatlich, rendite, inflation]);

  return (
    <CalculatorShell
      inputs={
        <>
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Modus</div>
            <SegmentedControl
              value={mode}
              onChange={(v) => setMode(v as Mode)}
              options={[
                { value: "monatlich", label: "Monatliche Entnahme" },
                { value: "fire", label: "FIRE-Zahl" },
                { value: "reichweite", label: "Reichweite" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {mode === "monatlich" &&
                "Wie viel kann ich mir bei gegebenem Vermögen pro Monat auszahlen?"}
              {mode === "fire" &&
                "Welches Vermögen brauche ich, um monatlich X € entnehmen zu können?"}
              {mode === "reichweite" &&
                "Wie lange reicht mein Vermögen bei fester monatlicher Entnahme?"}
            </p>
          </div>

          {(mode === "monatlich" || mode === "reichweite") && (
            <NumberField
              label="Vorhandenes Vermögen"
              value={vermoegen}
              onChange={setVermoegen}
              unit="€"
              min={0}
              step={10000}
            />
          )}
          {(mode === "monatlich" || mode === "fire") && (
            <NumberField
              label="Entnahmerate pro Jahr"
              value={rate}
              onChange={setRate}
              unit="%"
              min={0.1}
              step={0.1}
              hint="Klassische 4-%-Regel (Trinity-Studie): 4 % ≈ 25 Jahresausgaben als FIRE-Zahl."
            />
          )}
          {(mode === "fire" || mode === "reichweite") && (
            <NumberField
              label="Gewünschte monatliche Entnahme"
              value={monatlich}
              onChange={setMonatlich}
              unit="€"
              min={0}
              step={100}
            />
          )}
          <NumberField
            label="Erwartete Rendite p. a."
            value={rendite}
            onChange={setRendite}
            unit="%"
            min={0}
            step={0.1}
            hint="Nominale Rendite deines Portfolios vor Steuern."
          />
          <NumberField
            label="Inflation p. a."
            value={inflation}
            onChange={setInflation}
            unit="%"
            min={0}
            step={0.1}
            hint="Entnahme wird jährlich mit der Inflation erhöht, um reale Kaufkraft zu erhalten."
          />
        </>
      }
      result={
        result ? (
          <div className="space-y-4">
            <ResultCard
              label={result.primary.label}
              value={result.primary.value}
              unit={"unit" in result.primary ? result.primary.unit : undefined}
              badge={{
                label: result.primary.badge,
                tone: result.sim.nachhaltig ? "positive" : "warning",
              }}
              description={
                result.sim.nachhaltig
                  ? "Das Portfolio bleibt über den Simulationszeitraum erhalten – die Entnahme gilt als nachhaltig."
                  : `Das Portfolio ist nach ca. ${result.sim.jahre} Jahren aufgebraucht (bei ${rendite} % Rendite und ${inflation} % Inflation).`
              }
              footer={
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {result.stats.map((s) => (
                    <div key={s.label}>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </div>
                      <div className="mt-1 font-medium tabular-nums text-foreground">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-sm font-medium text-foreground">
                Portfolio-Entwicklung
              </div>
              <div className="mt-4 max-h-64 overflow-y-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead className="sticky top-0 bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-2 font-medium">Jahr</th>
                      <th className="py-2 pr-2 font-medium">Entnahme</th>
                      <th className="py-2 font-medium text-right">Restvermögen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.sim.verlauf.slice(0, 60).map((row) => (
                      <tr key={row.jahr}>
                        <td className="py-2 pr-2">{row.jahr}</td>
                        <td className="py-2 pr-2 text-muted-foreground">
                          {formatCurrency(row.entnahme)}
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
          </div>
        ) : (
          <ResultCard
            label="Ergebnis"
            value="–"
            description="Bitte gültige Werte eingeben."
          />
        )
      }
    />
  );
}