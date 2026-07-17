import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

interface Geraet {
  id: string;
  name: string;
  watt: string;
  stundenProTag: string;
  anzahl: string;
}

interface Preset {
  name: string;
  watt: number;
  stundenProTag: number;
}

const PRESETS: Preset[] = [
  { name: "Fernseher (Standby)", watt: 1.5, stundenProTag: 20 },
  { name: "TV-Receiver / Sat-Box", watt: 8, stundenProTag: 22 },
  { name: "Spielkonsole (Ruhemodus)", watt: 10, stundenProTag: 22 },
  { name: "WLAN-Router (Dauerbetrieb)", watt: 8, stundenProTag: 24 },
  { name: "PC-Monitor (Standby)", watt: 0.5, stundenProTag: 22 },
  { name: "Desktop-PC (Standby)", watt: 3, stundenProTag: 20 },
  { name: "Drucker (Bereitschaft)", watt: 4, stundenProTag: 22 },
  { name: "Mikrowelle (Uhr)", watt: 3, stundenProTag: 23 },
  { name: "Kaffeemaschine (Standby)", watt: 2, stundenProTag: 22 },
  { name: "Ladegerät (leer, eingesteckt)", watt: 0.3, stundenProTag: 20 },
];

let nextId = 0;
const uid = () => `g-${++nextId}`;

const START_GERAETE: Geraet[] = [
  { id: uid(), name: "Fernseher (Standby)", watt: "1,5", stundenProTag: "20", anzahl: "1" },
  { id: uid(), name: "TV-Receiver / Sat-Box", watt: "8", stundenProTag: "22", anzahl: "1" },
  { id: uid(), name: "WLAN-Router (Dauerbetrieb)", watt: "8", stundenProTag: "24", anzahl: "1" },
  { id: uid(), name: "Spielkonsole (Ruhemodus)", watt: "10", stundenProTag: "22", anzahl: "1" },
  { id: uid(), name: "Ladegerät (leer, eingesteckt)", watt: "0,3", stundenProTag: "20", anzahl: "3" },
];

export default function StandbyKostenCalculator() {
  const [preis, setPreis] = useState("35"); // ct/kWh
  const [geraete, setGeraete] = useState<Geraet[]>(START_GERAETE);

  const update = (id: string, patch: Partial<Geraet>) =>
    setGeraete((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  const remove = (id: string) =>
    setGeraete((prev) => prev.filter((g) => g.id !== id));
  const addLeer = () =>
    setGeraete((prev) => [
      ...prev,
      { id: uid(), name: "Neues Gerät", watt: "5", stundenProTag: "22", anzahl: "1" },
    ]);
  const addPreset = (p: Preset) =>
    setGeraete((prev) => [
      ...prev,
      {
        id: uid(),
        name: p.name,
        watt: p.watt.toString().replace(".", ","),
        stundenProTag: p.stundenProTag.toString(),
        anzahl: "1",
      },
    ]);

  const result = useMemo(() => {
    const preisEur = (parseNumber(preis) || 0) / 100;
    const rows = geraete.map((g) => {
      const w = parseNumber(g.watt) || 0;
      const h = parseNumber(g.stundenProTag) || 0;
      const n = parseNumber(g.anzahl) || 0;
      const kwhJahr = (w * h * 365 * n) / 1000;
      const kosten = kwhJahr * preisEur;
      return { id: g.id, name: g.name, kwhJahr, kosten };
    });
    const kwhGesamt = rows.reduce((s, r) => s + r.kwhJahr, 0);
    const kostenGesamt = kwhGesamt * preisEur;
    return {
      rows,
      kwhGesamt,
      kostenGesamt,
      kostenMonat: kostenGesamt / 12,
      co2: kwhGesamt * 0.38,
    };
  }, [preis, geraete]);

  return (
    <CalculatorShell
      layout="input-heavy"
      inputs={
        <>
          <NumberField
            label="Strompreis"
            unit="ct/kWh"
            value={preis}
            onChange={setPreis}
            min={0}
            step={0.5}
            hint="Aktueller Arbeitspreis laut deiner Stromrechnung."
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">Geräte im Standby</div>
              <button
                type="button"
                onClick={addLeer}
                className="rounded-md border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium hover:bg-surface"
              >
                + Gerät hinzufügen
              </button>
            </div>

            <div className="space-y-2">
              {geraete.map((g) => (
                <div
                  key={g.id}
                  className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-border bg-background p-3"
                >
                  <input
                    type="text"
                    value={g.name}
                    onChange={(e) => update(g.id, { name: e.target.value })}
                    className="col-span-2 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Gerätename"
                  />
                  <div className="col-span-2 grid grid-cols-3 gap-2">
                    <label className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Watt</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={g.watt}
                        onChange={(e) => update(g.id, { watt: e.target.value })}
                        min={0}
                        step={0.1}
                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ring"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Std./Tag</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={g.stundenProTag}
                        onChange={(e) => update(g.id, { stundenProTag: e.target.value })}
                        min={0}
                        max={24}
                        step={0.5}
                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ring"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Anzahl</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={g.anzahl}
                        onChange={(e) => update(g.id, { anzahl: e.target.value })}
                        min={0}
                        step={1}
                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ring"
                      />
                    </label>
                  </div>
                  <div className="col-span-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="tabular-nums">
                      {formatCurrency(
                        ((parseNumber(g.watt) || 0) *
                          (parseNumber(g.stundenProTag) || 0) *
                          365 *
                          (parseNumber(g.anzahl) || 0) *
                          (parseNumber(preis) || 0)) /
                          100000,
                      )}{" "}
                      / Jahr
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(g.id)}
                      className="text-xs font-medium text-muted-foreground hover:text-destructive"
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Typisches Gerät hinzufügen</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => addPreset(p)}
                  className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface"
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>
        </>
      }
      result={
        <ResultCard
          label="Standby-Kosten pro Jahr"
          value={formatCurrency(result.kostenGesamt)}
          badge={{
            label: `${formatCurrency(result.kostenMonat)} / Monat`,
            tone: "info",
          }}
          description={
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt>Verbrauch</dt>
              <dd className="text-right tabular-nums">
                {formatNumber(result.kwhGesamt, 0)} kWh/Jahr
              </dd>
              <dt>CO₂-Ausstoß</dt>
              <dd className="text-right tabular-nums">
                {formatNumber(result.co2, 0)} kg/Jahr
              </dd>
              <dt>Geräte</dt>
              <dd className="text-right tabular-nums">{result.rows.length}</dd>
            </dl>
          }
          footer={
            result.rows.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Aufschlüsselung
                </div>
                <ul className="space-y-1 text-xs">
                  {result.rows
                    .slice()
                    .sort((a, b) => b.kosten - a.kosten)
                    .map((r) => (
                      <li key={r.id} className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-foreground">{r.name}</span>
                        <span className="shrink-0 tabular-nums text-muted-foreground">
                          {formatCurrency(r.kosten)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )
          }
        />
      }
    />
  );
}