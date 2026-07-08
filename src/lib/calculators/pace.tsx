import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatNumber, parseNumber } from "@/lib/format";

type Modus = "pace" | "zeit" | "distanz";

const PRESETS: { label: string; km: number }[] = [
  { label: "5 km", km: 5 },
  { label: "10 km", km: 10 },
  { label: "Halbmarathon", km: 21.0975 },
  { label: "Marathon", km: 42.195 },
];

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, "0");
}

function formatHms(totalSec: number): string {
  if (!Number.isFinite(totalSec) || totalSec < 0) return "–";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function formatPace(secPerKm: number): string {
  if (!Number.isFinite(secPerKm) || secPerKm <= 0) return "–";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${pad(s)}`;
}

export default function PaceCalculator() {
  const [modus, setModus] = useState<Modus>("pace");

  // Distanz in km (für Modus "pace" & "zeit")
  const [distanz, setDistanz] = useState("42.195");

  // Zielzeit (für Modus "pace" & "distanz")
  const [zielH, setZielH] = useState("4");
  const [zielM, setZielM] = useState("0");
  const [zielS, setZielS] = useState("0");

  // Pace (für Modus "zeit" & "distanz")
  const [paceM, setPaceM] = useState("5");
  const [paceS, setPaceS] = useState("30");

  const r = useMemo(() => {
    const d = parseNumber(distanz) || 0;
    const zielSec =
      (parseNumber(zielH) || 0) * 3600 +
      (parseNumber(zielM) || 0) * 60 +
      (parseNumber(zielS) || 0);
    const paceSec = (parseNumber(paceM) || 0) * 60 + (parseNumber(paceS) || 0);

    let paceSecOut = 0;
    let zeitSecOut = 0;
    let distOut = 0;

    if (modus === "pace") {
      paceSecOut = d > 0 ? zielSec / d : 0;
      zeitSecOut = zielSec;
      distOut = d;
    } else if (modus === "zeit") {
      zeitSecOut = paceSec * d;
      paceSecOut = paceSec;
      distOut = d;
    } else {
      distOut = paceSec > 0 ? zielSec / paceSec : 0;
      paceSecOut = paceSec;
      zeitSecOut = zielSec;
    }

    const kmh = paceSecOut > 0 ? 3600 / paceSecOut : 0;
    const paceMile = paceSecOut * 1.609344;

    // Split-Tabelle: kumulierte Zeit pro km (max. 10 Zeilen, gleichmäßig verteilt)
    const splits: { km: number; zeit: number }[] = [];
    if (distOut > 0 && paceSecOut > 0) {
      const kmList: number[] = [];
      // Immer 1, 5, 10, HM, M-Marken innerhalb der Distanz
      const marks = [1, 5, 10, 21.0975, 42.195];
      for (const m of marks) if (m <= distOut) kmList.push(m);
      if (kmList[kmList.length - 1] !== distOut) kmList.push(distOut);
      for (const km of kmList) {
        splits.push({ km, zeit: km * paceSecOut });
      }
    }

    return {
      paceSec: paceSecOut,
      zeitSec: zeitSecOut,
      dist: distOut,
      kmh,
      paceMile,
      splits,
    };
  }, [modus, distanz, zielH, zielM, zielS, paceM, paceS]);

  const primary =
    modus === "pace"
      ? { label: "Benötigte Pace", value: `${formatPace(r.paceSec)} min/km` }
      : modus === "zeit"
        ? { label: "Endzeit", value: formatHms(r.zeitSec) }
        : { label: "Erreichbare Distanz", value: `${formatNumber(r.dist, 2)} km` };

  return (
    <CalculatorShell
      inputs={
        <>
          <SegmentedControl
            label="Berechnen"
            value={modus}
            onChange={setModus}
            options={[
              { value: "pace", label: "Pace" },
              { value: "zeit", label: "Endzeit" },
              { value: "distanz", label: "Distanz" },
            ]}
          />

          {(modus === "pace" || modus === "zeit") && (
            <div className="space-y-2">
              <NumberField
                label="Distanz"
                unit="km"
                value={distanz}
                onChange={setDistanz}
                min={0}
                step={0.1}
              />
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setDistanz(String(p.km))}
                    className="rounded-full border border-input bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(modus === "pace" || modus === "distanz") && (
            <div className="space-y-1.5">
              <div className="text-sm font-medium text-foreground">Zielzeit</div>
              <div className="grid grid-cols-3 gap-2">
                <NumberField
                  label="Std."
                  value={zielH}
                  onChange={setZielH}
                  min={0}
                  max={24}
                  step={1}
                />
                <NumberField
                  label="Min."
                  value={zielM}
                  onChange={setZielM}
                  min={0}
                  max={59}
                  step={1}
                />
                <NumberField
                  label="Sek."
                  value={zielS}
                  onChange={setZielS}
                  min={0}
                  max={59}
                  step={1}
                />
              </div>
            </div>
          )}

          {(modus === "zeit" || modus === "distanz") && (
            <div className="space-y-1.5">
              <div className="text-sm font-medium text-foreground">Pace</div>
              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="Min./km"
                  value={paceM}
                  onChange={setPaceM}
                  min={0}
                  max={30}
                  step={1}
                />
                <NumberField
                  label="Sek./km"
                  value={paceS}
                  onChange={setPaceS}
                  min={0}
                  max={59}
                  step={1}
                />
              </div>
            </div>
          )}
        </>
      }
      result={
        <ResultCard
          label={primary.label}
          value={primary.value}
          badge={{
            label: `${formatNumber(r.kmh, 2)} km/h`,
            tone: "info",
          }}
          description={
            <>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Pace</dt>
                <dd className="text-right tabular-nums">
                  {formatPace(r.paceSec)} min/km
                </dd>
                <dt>Endzeit</dt>
                <dd className="text-right tabular-nums">{formatHms(r.zeitSec)}</dd>
                <dt>Distanz</dt>
                <dd className="text-right tabular-nums">
                  {formatNumber(r.dist, 2)} km
                </dd>
                <dt>Pace (Meile)</dt>
                <dd className="text-right tabular-nums">
                  {formatPace(r.paceMile)} min/mi
                </dd>
              </dl>
              {r.splits.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Zwischenzeiten
                  </p>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {r.splits.map((s) => (
                      <div key={s.km} className="contents">
                        <dt>bei {formatNumber(s.km, s.km % 1 === 0 ? 0 : 3)} km</dt>
                        <dd className="text-right tabular-nums">
                          {formatHms(s.zeit)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </>
          }
          footer={
            <span>
              Beispiel: Marathon (42,195 km) unter 4:00:00 h erfordert eine Pace von{" "}
              <strong>5:41 min/km</strong>.
            </span>
          }
        />
      }
    />
  );
}