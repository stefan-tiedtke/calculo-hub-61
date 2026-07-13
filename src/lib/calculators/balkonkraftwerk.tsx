import { useId, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { Slider } from "@/components/ui/slider";
import { formatCurrency, formatInt, formatNumber, parseNumber } from "@/lib/format";

// ---------------------------------------------------------------------------
// Balkonkraftwerk-Wirtschaftlichkeitsrechner
// ---------------------------------------------------------------------------
// Die Berechnung ist bewusst modular aufgebaut, damit spätere Erweiterungen
// (Batteriespeicher, dynamische Tarife, regionale Einstrahlung, monatliche
// Prognosen, PV-Vergleich) ohne Umbau ergänzt werden können.

type Leistung = "300" | "600" | "800" | "1000" | "custom";
type Ausrichtung = "sued" | "suedost" | "suedwest" | "ost" | "west" | "nord";
type Neigung = "0" | "15" | "30" | "45" | "60" | "90";

const LEISTUNG_LABEL: Record<Leistung, string> = {
  "300": "300 W",
  "600": "600 W",
  "800": "800 W",
  "1000": "1000 W",
  custom: "Individuell",
};

const AUSRICHTUNG_LABEL: Record<Ausrichtung, string> = {
  sued: "Süd",
  suedost: "Südost",
  suedwest: "Südwest",
  ost: "Ost",
  west: "West",
  nord: "Nord",
};

/** Ertragsfaktor relativ zu optimaler Süd-Ausrichtung. */
const AUSRICHTUNG_FAKTOR: Record<Ausrichtung, number> = {
  sued: 1.0,
  suedost: 0.95,
  suedwest: 0.95,
  ost: 0.85,
  west: 0.85,
  nord: 0.6,
};

const NEIGUNG_LABEL: Record<Neigung, string> = {
  "0": "Flach (0°)",
  "15": "15°",
  "30": "30°",
  "45": "45°",
  "60": "60°",
  "90": "Senkrecht (90°)",
};

/** Ertragsfaktor abhängig vom Neigungswinkel (Deutschland-Mittel). */
const NEIGUNG_FAKTOR: Record<Neigung, number> = {
  "0": 0.88,
  "15": 0.95,
  "30": 1.0,
  "45": 0.97,
  "60": 0.9,
  "90": 0.72,
};

/** Bundesweiter Basisertrag pro kWp bei optimaler Ausrichtung (kWh/kWp/Jahr). */
const BASIS_ERTRAG_KWH_PRO_KWP = 950;
/** CO₂-Emission des dt. Strommixes in kg pro kWh. */
const CO2_KG_PRO_KWH = 0.38;

interface EnergieAnnahmen {
  ertragsFaktor: number; // Szenariofaktor (0.85 / 1.0 / 1.1 ...)
}

interface CalcInput {
  kosten: number;
  wattPeak: number;
  ausrichtung: Ausrichtung;
  neigung: Neigung;
  strompreis: number; // €/kWh
  eigenverbrauch: number; // 0..1
  preissteigerung: number; // 0..1
  jahre: number;
}

interface JahresZeile {
  jahr: number;
  strompreis: number;
  ertrag: number;
  eigenverbrauchKwh: number;
  ersparnisJahr: number;
  kumErsparnis: number;
  gewinnKum: number;
}

interface CalcResult {
  jahresErtrag: number; // kWh
  eigenverbrauchKwh: number; // kWh
  ersparnisJahr1: number; // €
  gesamtErsparnis: number; // €
  gewinn: number; // €
  amortisation: number | null; // Jahre (null wenn nicht erreicht)
  roi: number; // %
  gesparterStromKwh: number;
  co2Kg: number;
  jahre: JahresZeile[];
}

function berechne(input: CalcInput, annahmen: EnergieAnnahmen): CalcResult {
  const kWp = input.wattPeak / 1000;
  const spezifisch =
    BASIS_ERTRAG_KWH_PRO_KWP *
    AUSRICHTUNG_FAKTOR[input.ausrichtung] *
    NEIGUNG_FAKTOR[input.neigung] *
    annahmen.ertragsFaktor;
  const jahresErtrag = kWp * spezifisch;
  const eigenverbrauchKwh = jahresErtrag * input.eigenverbrauch;
  const ersparnisJahr1 = eigenverbrauchKwh * input.strompreis;

  const jahre: JahresZeile[] = [];
  let kum = 0;
  let amortisation: number | null = null;
  for (let j = 1; j <= input.jahre; j++) {
    const strompreis = input.strompreis * Math.pow(1 + input.preissteigerung, j - 1);
    const ersparnisJahr = eigenverbrauchKwh * strompreis;
    kum += ersparnisJahr;
    const gewinnKum = kum - input.kosten;
    if (amortisation === null && kum >= input.kosten) {
      // linear interpolieren innerhalb des Jahres
      const previous = kum - ersparnisJahr;
      const rest = input.kosten - previous;
      amortisation = j - 1 + rest / ersparnisJahr;
    }
    jahre.push({
      jahr: j,
      strompreis,
      ertrag: jahresErtrag,
      eigenverbrauchKwh,
      ersparnisJahr,
      kumErsparnis: kum,
      gewinnKum,
    });
  }

  const gesamtErsparnis = kum;
  const gewinn = gesamtErsparnis - input.kosten;
  const roi = input.kosten > 0 ? (gewinn / input.kosten) * 100 : 0;

  return {
    jahresErtrag,
    eigenverbrauchKwh,
    ersparnisJahr1,
    gesamtErsparnis,
    gewinn,
    amortisation,
    roi,
    gesparterStromKwh: eigenverbrauchKwh * input.jahre,
    co2Kg: eigenverbrauchKwh * input.jahre * CO2_KG_PRO_KWH,
    jahre,
  };
}

// ---------------------------------------------------------------------------
// UI-Komponenten
// ---------------------------------------------------------------------------

function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-shadow focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SliderField({
  label,
  unit,
  hint,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  unit: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm tabular-nums text-muted-foreground">
          <span className="font-semibold text-foreground">
            {format ? format(value) : formatNumber(value, value % 1 === 0 ? 0 : 1)}
          </span>{" "}
          {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? 0)}
        aria-label={label}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function KumulativChart({
  jahre,
  kosten,
  amortisation,
}: {
  jahre: JahresZeile[];
  kosten: number;
  amortisation: number | null;
}) {
  const width = 640;
  const height = 260;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 32;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const maxY = Math.max(kosten, jahre[jahre.length - 1]?.kumErsparnis ?? kosten) * 1.1;
  const maxX = jahre.length;

  const x = (j: number) => padL + (j / maxX) * innerW;
  const y = (v: number) => padT + innerH - (v / maxY) * innerH;

  const points = [
    `${x(0)},${y(0)}`,
    ...jahre.map((r) => `${x(r.jahr)},${y(r.kumErsparnis)}`),
  ].join(" ");

  const areaPoints = `${x(0)},${y(0)} ${jahre
    .map((r) => `${x(r.jahr)},${y(r.kumErsparnis)}`)
    .join(" ")} ${x(maxX)},${y(0)}`;

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => (maxY / yTicks) * i);
  const xTickStep = maxX <= 10 ? 1 : maxX <= 20 ? 5 : 5;
  const xTicks = Array.from({ length: Math.floor(maxX / xTickStep) + 1 }, (_, i) => i * xTickStep);

  const gradId = useId();
  const kostenY = y(kosten);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Kumulierte Ersparnis über die Zeit"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={padL}
            x2={width - padR}
            y1={y(t)}
            y2={y(t)}
            className="stroke-border"
            strokeDasharray="2 3"
          />
          <text
            x={padL - 6}
            y={y(t) + 4}
            textAnchor="end"
            className="fill-muted-foreground text-[10px] tabular-nums"
          >
            {formatInt(t)} €
          </text>
        </g>
      ))}

      {xTicks.map((t) => (
        <text
          key={t}
          x={x(t)}
          y={height - padB + 16}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] tabular-nums"
        >
          {t} J
        </text>
      ))}

      {/* Anschaffungskosten-Linie */}
      <line
        x1={padL}
        x2={width - padR}
        y1={kostenY}
        y2={kostenY}
        className="stroke-destructive/70"
        strokeDasharray="4 4"
      />
      <text
        x={width - padR}
        y={kostenY - 6}
        textAnchor="end"
        className="fill-destructive text-[10px] font-medium"
      >
        Anschaffung {formatCurrency(kosten)}
      </text>

      {/* Fläche */}
      <polygon points={areaPoints} fill={`url(#${gradId})`} />

      {/* Linie */}
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-chart-1)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Amortisationspunkt */}
      {amortisation !== null && amortisation <= maxX && (
        <g>
          <line
            x1={x(amortisation)}
            x2={x(amortisation)}
            y1={padT}
            y2={height - padB}
            className="stroke-emerald-500"
            strokeDasharray="3 3"
          />
          <circle
            cx={x(amortisation)}
            cy={kostenY}
            r={6}
            className="fill-emerald-500"
            stroke="var(--color-background)"
            strokeWidth={2}
          />
          <text
            x={x(amortisation) + 8}
            y={padT + 14}
            className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-semibold"
          >
            Amortisation nach {formatNumber(amortisation, 1)} Jahren
          </text>
        </g>
      )}
    </svg>
  );
}

function VerteilungChart({
  eigenverbrauchAnteil,
  einspeiseAnteil,
  kosten,
  gesamtErsparnis,
}: {
  eigenverbrauchAnteil: number;
  einspeiseAnteil: number;
  kosten: number;
  gesamtErsparnis: number;
}) {
  const total = eigenverbrauchAnteil + einspeiseAnteil;
  const evPct = total > 0 ? (eigenverbrauchAnteil / total) * 100 : 0;
  const einPct = 100 - evPct;
  const totalEuro = kosten + gesamtErsparnis;
  const kostenPct = totalEuro > 0 ? (kosten / totalEuro) * 100 : 0;
  const ersparnisPct = 100 - kostenPct;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Stromproduktion</span>
          <span className="tabular-nums">100 %</span>
        </div>
        <div className="flex h-4 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full bg-[var(--color-chart-1)] transition-all"
            style={{ width: `${evPct}%` }}
            title={`Eigenverbrauch ${formatNumber(evPct, 0)} %`}
          />
          <div
            className="h-full bg-[var(--color-chart-3)] transition-all"
            style={{ width: `${einPct}%` }}
            title={`Einspeisung / ungenutzt ${formatNumber(einPct, 0)} %`}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <LegendDot color="var(--color-chart-1)">
            Eigenverbrauch {formatNumber(evPct, 0)} %
          </LegendDot>
          <LegendDot color="var(--color-chart-3)">
            Ungenutzt / Einspeisung {formatNumber(einPct, 0)} %
          </LegendDot>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Kosten vs. Ersparnis</span>
          <span className="tabular-nums">{formatCurrency(totalEuro)}</span>
        </div>
        <div className="flex h-4 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full bg-destructive/70 transition-all"
            style={{ width: `${kostenPct}%` }}
          />
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${ersparnisPct}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <LegendDot color="var(--color-destructive)">
            Anschaffung {formatCurrency(kosten)}
          </LegendDot>
          <LegendDot color="rgb(16 185 129)">
            Ersparnis {formatCurrency(gesamtErsparnis)}
          </LegendDot>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span
        aria-hidden
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
      <span>{children}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Hauptkomponente
// ---------------------------------------------------------------------------

export default function BalkonkraftwerkCalculator() {
  const [kostenStr, setKostenStr] = useState("800");
  const [leistung, setLeistung] = useState<Leistung>("800");
  const [customWatt, setCustomWatt] = useState("800");
  const [ausrichtung, setAusrichtung] = useState<Ausrichtung>("sued");
  const [neigung, setNeigung] = useState<Neigung>("30");
  const [ort, setOrt] = useState("");
  const [strompreisStr, setStrompreisStr] = useState("0,32");
  const [eigenverbrauch, setEigenverbrauch] = useState(0.7);
  const [preissteigerung, setPreissteigerung] = useState(0.02);
  const [jahre, setJahre] = useState<number>(20);

  const wattPeak = useMemo(() => {
    if (leistung === "custom") return Math.max(0, parseNumber(customWatt) || 0);
    return Number(leistung);
  }, [leistung, customWatt]);

  const input: CalcInput = useMemo(
    () => ({
      kosten: Math.max(0, parseNumber(kostenStr) || 0),
      wattPeak,
      ausrichtung,
      neigung,
      strompreis: Math.max(0, parseNumber(strompreisStr) || 0),
      eigenverbrauch,
      preissteigerung,
      jahre,
    }),
    [kostenStr, wattPeak, ausrichtung, neigung, strompreisStr, eigenverbrauch, preissteigerung, jahre],
  );

  const realistisch = useMemo(() => berechne(input, { ertragsFaktor: 1.0 }), [input]);

  const amortisationsBadge = realistisch.amortisation
    ? realistisch.amortisation <= jahre / 2
      ? { label: "Wirtschaftlich", tone: "positive" as const }
      : realistisch.amortisation <= jahre
        ? { label: "Solide", tone: "info" as const }
        : { label: "Grenzwertig", tone: "warning" as const }
    : { label: "Nicht amortisiert", tone: "critical" as const };

  const bewertung = buildBewertung(realistisch, input);

  return (
    <CalculatorShell
      layout="input-heavy"
      inputs={
        <>
          <NumberField
            label="Anschaffungskosten"
            unit="€"
            value={kostenStr}
            onChange={setKostenStr}
            min={0}
            step={50}
            hint="Komplettpaket inkl. Wechselrichter, Kabel und Montage."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Leistung"
              value={leistung}
              onChange={(v) => setLeistung(v as Leistung)}
              options={Object.entries(LEISTUNG_LABEL).map(([value, label]) => ({ value, label }))}
            />
            {leistung === "custom" && (
              <NumberField
                label="Individuelle Leistung"
                unit="W"
                value={customWatt}
                onChange={setCustomWatt}
                min={0}
                max={5000}
                step={50}
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Ausrichtung"
              value={ausrichtung}
              onChange={(v) => setAusrichtung(v as Ausrichtung)}
              options={Object.entries(AUSRICHTUNG_LABEL).map(([value, label]) => ({ value, label }))}
            />
            <SelectField
              label="Neigungswinkel"
              value={neigung}
              onChange={(v) => setNeigung(v as Neigung)}
              options={Object.entries(NEIGUNG_LABEL).map(([value, label]) => ({ value, label }))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="ort">
              Wohnort <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="ort"
              type="text"
              value={ort}
              onChange={(e) => setOrt(e.target.value)}
              placeholder="z. B. Berlin"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Aktuell rechnet der Rechner mit bundesweiten Durchschnittswerten
              (~950 kWh/kWp bei optimaler Ausrichtung). Regionale Einstrahlungsdaten
              werden in einer späteren Version berücksichtigt.
            </p>
          </div>

          <NumberField
            label="Strompreis"
            unit="€/kWh"
            value={strompreisStr}
            onChange={setStrompreisStr}
            min={0}
            step={0.01}
            hint="Bruttopreis laut Stromvertrag. Deutscher Haushaltsdurchschnitt liegt aktuell bei rund 0,32 €/kWh."
          />

          <SliderField
            label="Eigenverbrauch"
            unit=""
            min={0.2}
            max={1}
            step={0.05}
            value={eigenverbrauch}
            onChange={setEigenverbrauch}
            format={(v) => `${Math.round(v * 100)} %`}
            hint="Anteil der erzeugten Energie, den du direkt selbst verbrauchst. Nicht genutzter Strom wird ins Netz eingespeist – für Balkonkraftwerke meist ohne Vergütung."
          />

          <SliderField
            label="Erwartete Strompreissteigerung"
            unit="p. a."
            min={0}
            max={0.08}
            step={0.005}
            value={preissteigerung}
            onChange={setPreissteigerung}
            format={(v) => `${formatNumber(v * 100, 1)} %`}
            hint="Langfristiger Anstieg des Strompreises pro Jahr. Historischer Durchschnitt in Deutschland: 2 – 4 %."
          />

          <SelectField
            label="Betrachtungszeitraum"
            value={String(jahre)}
            onChange={(v) => setJahre(Number(v))}
            options={[5, 10, 15, 20, 25, 30].map((j) => ({
              value: String(j),
              label: `${j} Jahre`,
            }))}
          />
        </>
      }
      result={
        <div className="space-y-6">
          <ResultCard
            label="Amortisation"
            value={
              realistisch.amortisation !== null
                ? formatNumber(realistisch.amortisation, 1)
                : "–"
            }
            unit={realistisch.amortisation !== null ? "Jahre" : undefined}
            badge={amortisationsBadge}
            description={
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Jahresertrag</dt>
                <dd className="text-right tabular-nums">
                  {formatInt(realistisch.jahresErtrag)} kWh
                </dd>
                <dt>Eigenverbrauch</dt>
                <dd className="text-right tabular-nums">
                  {formatInt(realistisch.eigenverbrauchKwh)} kWh
                </dd>
                <dt>Ersparnis Jahr 1</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(realistisch.ersparnisJahr1)}
                </dd>
                <dt>Gesamtersparnis ({jahre} J)</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(realistisch.gesamtErsparnis)}
                </dd>
                <dt>Gewinn nach {jahre} J</dt>
                <dd className="text-right tabular-nums text-foreground">
                  <strong>{formatCurrency(realistisch.gewinn)}</strong>
                </dd>
                <dt>Return on Investment</dt>
                <dd className="text-right tabular-nums">
                  {formatNumber(realistisch.roi, 0)} %
                </dd>
                <dt>Gesparter Strom</dt>
                <dd className="text-right tabular-nums">
                  {formatInt(realistisch.gesparterStromKwh)} kWh
                </dd>
                <dt>CO₂-Einsparung</dt>
                <dd className="text-right tabular-nums">
                  {formatInt(realistisch.co2Kg)} kg
                </dd>
              </dl>
            }
            footer={<span>{bewertung}</span>}
          />

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Kumulierte Ersparnis
            </div>
            <div className="mt-3">
              <KumulativChart
                jahre={realistisch.jahre}
                kosten={input.kosten}
                amortisation={realistisch.amortisation}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Aufteilung
            </div>
            <div className="mt-4">
              <VerteilungChart
                eigenverbrauchAnteil={eigenverbrauch}
                einspeiseAnteil={1 - eigenverbrauch}
                kosten={input.kosten}
                gesamtErsparnis={realistisch.gesamtErsparnis}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Spartipps für höheren Eigenverbrauch
            </div>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              <TipItem>Waschmaschine und Trockner mittags laufen lassen</TipItem>
              <TipItem>Geschirrspüler bei Sonnenschein starten (Zeitvorwahl)</TipItem>
              <TipItem>Grundlast prüfen: Router, Kühlschrank, Standby dauerhaft aktiv</TipItem>
              <TipItem>Warmwasserboiler oder E-Bike tagsüber laden</TipItem>
              <TipItem>Verschattung durch Pflanzen oder Wäsche vermeiden</TipItem>
              <TipItem>Module regelmäßig sauber halten (2× jährlich reicht)</TipItem>
            </ul>
          </div>
        </div>
      }
    />
  );
}

function TipItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand"
      />
      <span>{children}</span>
    </li>
  );
}

function buildBewertung(r: CalcResult, i: CalcInput): string {
  if (i.wattPeak === 0 || i.kosten === 0) {
    return "Trage Leistung und Anschaffungskosten ein, um deine persönliche Bewertung zu sehen.";
  }
  if (r.amortisation === null) {
    return `Bei deinen Annahmen amortisiert sich das Balkonkraftwerk innerhalb von ${i.jahre} Jahren nicht vollständig. Ein höherer Eigenverbrauch oder ein günstigerer Anschaffungspreis würden die Wirtschaftlichkeit deutlich verbessern.`;
  }
  if (r.amortisation <= 6) {
    return `Sehr wirtschaftlich: Dein Balkonkraftwerk amortisiert sich voraussichtlich in rund ${formatNumber(r.amortisation, 1)} Jahren. Danach senkt es deine Stromkosten dauerhaft und schützt vor weiteren Preissteigerungen.`;
  }
  if (r.amortisation <= 10) {
    return `Solide Investition: Nach ca. ${formatNumber(r.amortisation, 1)} Jahren sind die Anschaffungskosten wieder eingespielt. Über die restliche Nutzungsdauer profitierst du von einem Gewinn von rund ${formatCurrency(r.gewinn)}.`;
  }
  return `Grenzwertig: Die Amortisationszeit von rund ${formatNumber(r.amortisation, 1)} Jahren ist lang. Prüfe, ob du den Eigenverbrauch erhöhen oder ein günstigeres Set finden kannst – das verbessert die Wirtschaftlichkeit deutlich.`;
}