import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatInt, formatNumber, parseNumber } from "@/lib/format";

function formatHoursMinutes(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return "–";
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  if (h === 0) return `${m} Min.`;
  if (m === 0) return `${h} Std.`;
  return `${h} Std. ${m} Min.`;
}

export default function TrainingszeitCalculator() {
  const [einheitenProWoche, setEinheitenProWoche] = useState("3");
  const [dauerMinuten, setDauerMinuten] = useState("60");
  const [zeitraumWochen, setZeitraumWochen] = useState("4");

  const r = useMemo(() => {
    const einheiten = parseNumber(einheitenProWoche);
    const dauer = parseNumber(dauerMinuten);
    const wochen = parseNumber(zeitraumWochen);

    if (
      !Number.isFinite(einheiten) ||
      !Number.isFinite(dauer) ||
      !Number.isFinite(wochen) ||
      einheiten <= 0 ||
      dauer <= 0 ||
      wochen <= 0
    ) {
      return null;
    }

    const proWocheMin = einheiten * dauer;
    const gesamtMin = proWocheMin * wochen;
    const proTagMin = gesamtMin / (wochen * 7);

    return {
      einheiten,
      dauer,
      wochen,
      proWocheMin,
      gesamtMin,
      proTagMin,
    };
  }, [einheitenProWoche, dauerMinuten, zeitraumWochen]);

  return (
    <CalculatorShell
      inputs={
        <div className="space-y-5">
          <NumberField
            label="Trainingseinheiten pro Woche"
            unit="Einheiten"
            value={einheitenProWoche}
            onChange={setEinheitenProWoche}
            min={1}
            max={21}
            step={1}
            hint="Wie oft trainierst du in einer typischen Woche?"
          />
          <NumberField
            label="Dauer pro Trainingseinheit"
            unit="Min."
            value={dauerMinuten}
            onChange={setDauerMinuten}
            min={1}
            max={300}
            step={5}
            hint="Durchschnittliche Dauer einer Einheit in Minuten."
          />
          <NumberField
            label="Betrachtungszeitraum"
            unit="Wochen"
            value={zeitraumWochen}
            onChange={setZeitraumWochen}
            min={1}
            max={104}
            step={1}
            hint="Zum Beispiel 4 Wochen (1 Monat) oder 52 Wochen (1 Jahr)."
          />
        </div>
      }
      result={
        <ResultCard
          label="Gesamte Trainingszeit"
          value={r ? formatHoursMinutes(r.gesamtMin) : "–"}
          badge={
            r
              ? {
                  label: `${formatInt(r.wochen)} Wochen`,
                  tone: "info",
                }
              : undefined
          }
          description={
            r && (
              <>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt>Einheiten pro Woche</dt>
                  <dd className="text-right tabular-nums">
                    {formatInt(r.einheiten)}
                  </dd>
                  <dt>Dauer pro Einheit</dt>
                  <dd className="text-right tabular-nums">
                    {formatInt(r.dauer)} Min.
                  </dd>
                  <dt className="font-semibold text-foreground">
                    Zeit pro Woche
                  </dt>
                  <dd className="text-right font-semibold tabular-nums text-foreground">
                    {formatHoursMinutes(r.proWocheMin)}
                  </dd>
                  <dt>Gesamt im Zeitraum</dt>
                  <dd className="text-right tabular-nums">
                    {formatNumber(r.gesamtMin, 0)} Min.
                  </dd>
                  <dt>Ø pro Tag</dt>
                  <dd className="text-right tabular-nums">
                    {formatNumber(r.proTagMin, 1)} Min.
                  </dd>
                </dl>
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Umrechnung
                  </p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <dt>Gesamt in Stunden</dt>
                    <dd className="text-right tabular-nums">
                      {formatNumber(r.gesamtMin / 60, 1)} h
                    </dd>
                    <dt>Pro Woche in Stunden</dt>
                    <dd className="text-right tabular-nums">
                      {formatNumber(r.proWocheMin / 60, 1)} h
                    </dd>
                  </dl>
                </div>
              </>
            )
          }
          footer={
            <span>
              Beispiel: 3 × 60 Min. pro Woche über 4 Wochen = 12 Stunden
              Gesamttraining.
            </span>
          }
        />
      }
    />
  );
}
