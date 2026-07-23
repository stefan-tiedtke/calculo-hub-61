import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatNumber, formatInt, parseNumber } from "@/lib/format";

type Sex = "m" | "w";
type Aktivitaet = "gering" | "normal" | "hoch";
type Temperatur = "kalt" | "mild" | "hitze";

// Basisbedarf ml pro kg Körpergewicht je nach Alter (Richtwerte DGE/EFSA)
function basisProKg(alter: number): number {
  if (alter < 19) return 40;
  if (alter < 51) return 35;
  if (alter < 65) return 30;
  return 28;
}

const AKTIV_BONUS: Record<Aktivitaet, number> = {
  gering: 0,
  normal: 300,
  hoch: 600,
};

const AKTIV_HINT: Record<Aktivitaet, string> = {
  gering: "Sitzende Tätigkeit, wenig Bewegung im Alltag.",
  normal: "Leichte Bewegung, gelegentliche Aktivität.",
  hoch: "Körperlich fordernder Alltag oder Beruf.",
};

const TEMP_BONUS: Record<Temperatur, number> = {
  kalt: 0,
  mild: 300,
  hitze: 800,
};

const TEMP_HINT: Record<Temperatur, string> = {
  kalt: "Unter 20 °C – kein zusätzlicher Bedarf.",
  mild: "20–30 °C – moderat erhöhter Flüssigkeitsverlust.",
  hitze: "Über 30 °C – deutlich erhöhter Bedarf durch Schwitzen.",
};

export default function WasserbedarfCalculator() {
  const [gewicht, setGewicht] = useState("70");
  const [alter, setAlter] = useState("30");
  const [sex, setSex] = useState<Sex>("m");
  const [aktivitaet, setAktivitaet] = useState<Aktivitaet>("normal");
  const [sportMin, setSportMin] = useState("30");
  const [temperatur, setTemperatur] = useState<Temperatur>("mild");

  const r = useMemo(() => {
    const kg = Math.max(0, parseNumber(gewicht) || 0);
    const j = Math.max(0, parseNumber(alter) || 0);
    const min = Math.max(0, parseNumber(sportMin) || 0);
    if (kg <= 0 || j <= 0) return null;

    // Basisbedarf leicht geschlechtsabhängig anpassen (Männer ~5 % mehr)
    const basisMl = kg * basisProKg(j) * (sex === "m" ? 1 : 0.95);
    const aktivMl = AKTIV_BONUS[aktivitaet];
    // Sport: ~500 ml zusätzlich pro 30 Min moderater Belastung
    const sportMl = (min / 30) * 500;
    const tempMl = TEMP_BONUS[temperatur];
    const gesamtMl = basisMl + aktivMl + sportMl + tempMl;

    return {
      basisMl,
      aktivMl,
      sportMl,
      tempMl,
      gesamtMl,
      basisL: basisMl / 1000,
      sportL: sportMl / 1000,
      tempL: tempMl / 1000,
      gesamtL: gesamtMl / 1000,
      glaeser: Math.round(gesamtMl / 250),
    };
  }, [gewicht, alter, sex, aktivitaet, sportMin, temperatur]);

  // Fortschritts-/Füllstandsanzeige – Skala bis 4 L
  const fillPct = r ? Math.min(100, (r.gesamtL / 4) * 100) : 0;

  return (
    <CalculatorShell
      inputs={
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              label="Körpergewicht"
              unit="kg"
              value={gewicht}
              onChange={setGewicht}
              min={20}
              max={250}
              step={1}
            />
            <NumberField
              label="Alter"
              unit="J"
              value={alter}
              onChange={setAlter}
              min={10}
              max={110}
              step={1}
            />
          </div>
          <SegmentedControl
            label="Geschlecht"
            value={sex}
            onChange={setSex}
            options={[
              { value: "m", label: "Männlich" },
              { value: "w", label: "Weiblich" },
            ]}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Aktivitätslevel</label>
            <SegmentedControl
              value={aktivitaet}
              onChange={(v) => setAktivitaet(v as Aktivitaet)}
              options={[
                { value: "gering", label: "Gering" },
                { value: "normal", label: "Normal" },
                { value: "hoch", label: "Hoch" },
              ]}
            />
            <p className="text-xs text-muted-foreground">{AKTIV_HINT[aktivitaet]}</p>
          </div>
          <NumberField
            label="Sport pro Tag"
            unit="Min"
            value={sportMin}
            onChange={setSportMin}
            min={0}
            max={480}
            step={5}
            hint="Moderate bis intensive Belastung – rund 500 ml Zusatzbedarf je 30 Minuten."
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Außentemperatur</label>
            <SegmentedControl
              value={temperatur}
              onChange={(v) => setTemperatur(v as Temperatur)}
              options={[
                { value: "kalt", label: "< 20 °C" },
                { value: "mild", label: "20–30 °C" },
                { value: "hitze", label: "> 30 °C" },
              ]}
            />
            <p className="text-xs text-muted-foreground">{TEMP_HINT[temperatur]}</p>
          </div>
        </>
      }
      result={
        <ResultCard
          label="Empfohlene Trinkmenge"
          value={r ? formatNumber(r.gesamtL, 1) : "–"}
          unit="Liter / Tag"
          badge={
            r
              ? {
                  label: `≈ ${r.glaeser} Gläser (à 250 ml)`,
                  tone: "info",
                }
              : undefined
          }
          description={
            r && (
              <>
                <div className="mt-2">
                  <div className="relative h-6 w-full overflow-hidden rounded-full border border-border bg-surface-muted">
                    <div
                      className="h-full bg-brand transition-all"
                      style={{ width: `${fillPct}%` }}
                      aria-hidden
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
                      {formatNumber(r.gesamtL, 1)} L
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>0 L</span>
                    <span>2 L</span>
                    <span>4 L</span>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm">
                  <dt>Basisbedarf</dt>
                  <dd className="text-right tabular-nums">
                    {formatInt(Math.round(r.basisMl))} ml
                  </dd>
                  <dt>Aktivitätslevel</dt>
                  <dd className="text-right tabular-nums">
                    +{formatInt(r.aktivMl)} ml
                  </dd>
                  <dt>Sport</dt>
                  <dd className="text-right tabular-nums">
                    +{formatInt(Math.round(r.sportMl))} ml
                  </dd>
                  <dt>Temperatur</dt>
                  <dd className="text-right tabular-nums">
                    +{formatInt(r.tempMl)} ml
                  </dd>
                  <dt className="font-semibold text-foreground">Gesamt</dt>
                  <dd className="text-right font-semibold tabular-nums text-foreground">
                    {formatNumber(r.gesamtL, 2)} L
                  </dd>
                </dl>
              </>
            )
          }
          footer={
            <span>
              Rund 20 % des Bedarfs deckst du über feste Nahrung (Obst, Gemüse, Suppen).
              Der Rest sollte über Wasser oder ungesüßte Getränke aufgenommen werden.
            </span>
          }
        />
      }
    />
  );
}