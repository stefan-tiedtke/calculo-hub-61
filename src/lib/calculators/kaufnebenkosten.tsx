import { useId, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

// ---------------------------------------------------------------------------
// Kaufnebenkosten-Rechner (Immobilien Deutschland)
// ---------------------------------------------------------------------------

type BundeslandKey =
  | "BW" | "BY" | "BE" | "BB" | "HB" | "HH" | "HE" | "MV"
  | "NI" | "NW" | "RP" | "SL" | "SN" | "ST" | "SH" | "TH";

interface BundeslandInfo {
  name: string;
  grest: number; // Grunderwerbsteuer in %
  makler: number; // übliche Käuferprovision inkl. USt in %
}

const BUNDESLAENDER: Record<BundeslandKey, BundeslandInfo> = {
  BW: { name: "Baden-Württemberg", grest: 5.0, makler: 3.57 },
  BY: { name: "Bayern", grest: 3.5, makler: 3.57 },
  BE: { name: "Berlin", grest: 6.0, makler: 3.57 },
  BB: { name: "Brandenburg", grest: 6.5, makler: 3.57 },
  HB: { name: "Bremen", grest: 5.0, makler: 3.57 },
  HH: { name: "Hamburg", grest: 5.5, makler: 3.57 },
  HE: { name: "Hessen", grest: 6.0, makler: 3.57 },
  MV: { name: "Mecklenburg-Vorpommern", grest: 6.0, makler: 3.57 },
  NI: { name: "Niedersachsen", grest: 5.0, makler: 3.57 },
  NW: { name: "Nordrhein-Westfalen", grest: 6.5, makler: 3.57 },
  RP: { name: "Rheinland-Pfalz", grest: 5.0, makler: 3.57 },
  SL: { name: "Saarland", grest: 6.5, makler: 3.57 },
  SN: { name: "Sachsen", grest: 5.5, makler: 3.57 },
  ST: { name: "Sachsen-Anhalt", grest: 5.0, makler: 3.57 },
  SH: { name: "Schleswig-Holstein", grest: 6.5, makler: 3.57 },
  TH: { name: "Thüringen", grest: 5.0, makler: 3.57 },
};

const NOTAR_PCT = 1.5;
const GRUNDBUCH_PCT = 0.5;

interface CalcInput {
  kaufpreis: number;
  grestPct: number;
  notarPct: number;
  grundbuchPct: number;
  maklerPct: number;
}

interface CalcResult {
  grest: number;
  notar: number;
  grundbuch: number;
  makler: number;
  nebenkosten: number;
  nebenkostenPct: number;
  gesamt: number;
}

function berechne(input: CalcInput): CalcResult {
  const p = input.kaufpreis;
  const grest = (p * input.grestPct) / 100;
  const notar = (p * input.notarPct) / 100;
  const grundbuch = (p * input.grundbuchPct) / 100;
  const makler = (p * input.maklerPct) / 100;
  const nebenkosten = grest + notar + grundbuch + makler;
  return {
    grest,
    notar,
    grundbuch,
    makler,
    nebenkosten,
    nebenkostenPct: p > 0 ? (nebenkosten / p) * 100 : 0,
    gesamt: p + nebenkosten,
  };
}

// ---------------------------------------------------------------------------
// UI-Bausteine
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

const DONUT_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

function DonutChart({
  segments,
  total,
}: {
  segments: { label: string; value: number }[];
  total: number;
}) {
  const size = 220;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const active = segments.filter((s) => s.value > 0);
  const sum = active.reduce((a, b) => a + b.value, 0) || 1;

  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label="Verteilung der Kaufnebenkosten"
        className="shrink-0 -rotate-90"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-surface-muted)"
          strokeWidth={stroke}
        />
        {active.map((seg, i) => {
          const frac = seg.value / sum;
          const len = frac * circumference;
          const dash = `${len} ${circumference - len}`;
          const el = (
            <circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
        <g transform={`rotate(90 ${cx} ${cy})`}>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[11px]"
          >
            Nebenkosten
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            className="fill-foreground text-[15px] font-semibold tabular-nums"
          >
            {formatCurrency(total)}
          </text>
        </g>
      </svg>
      <ul className="w-full space-y-2 text-sm">
        {segments.map((s, i) => {
          const pct = total > 0 ? (s.value / total) * 100 : 0;
          return (
            <li key={s.label} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              <span className="flex-1 text-muted-foreground">{s.label}</span>
              <span className="tabular-nums font-medium text-foreground">
                {formatCurrency(s.value)}
              </span>
              <span className="w-12 text-right tabular-nums text-xs text-muted-foreground">
                {formatNumber(pct, 1)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  pct,
  sub,
}: {
  label: string;
  value: number;
  pct: number;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
      <div className="text-right">
        <div className="text-base tabular-nums font-semibold text-foreground">
          {formatCurrency(value)}
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {formatNumber(pct, 2)}%
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hauptkomponente
// ---------------------------------------------------------------------------

export default function KaufnebenkostenCalculator() {
  const [kaufpreisStr, setKaufpreisStr] = useState("400000");
  const [bundesland, setBundesland] = useState<BundeslandKey>("NW");
  const [maklerAn, setMaklerAn] = useState<"ja" | "nein">("ja");
  const [maklerStr, setMaklerStr] = useState<string>("3,57");
  const [notarStr, setNotarStr] = useState<string>("1,5");
  const [grundbuchStr, setGrundbuchStr] = useState<string>("0,5");
  const [grestStr, setGrestStr] = useState<string>(
    BUNDESLAENDER["NW"].grest.toString().replace(".", ","),
  );

  // Bundesland-Wechsel setzt Standardwerte für Grunderwerbsteuer und Makler.
  const changeBundesland = (key: BundeslandKey) => {
    setBundesland(key);
    const info = BUNDESLAENDER[key];
    setGrestStr(info.grest.toString().replace(".", ","));
    setMaklerStr(info.makler.toString().replace(".", ","));
  };

  const input: CalcInput = useMemo(() => {
    const kaufpreis = Math.max(0, parseNumber(kaufpreisStr) || 0);
    const grestPct = Math.max(0, parseNumber(grestStr) || 0);
    const notarPct = Math.max(0, parseNumber(notarStr) || 0);
    const grundbuchPct = Math.max(0, parseNumber(grundbuchStr) || 0);
    const maklerPct =
      maklerAn === "ja" ? Math.max(0, parseNumber(maklerStr) || 0) : 0;
    return { kaufpreis, grestPct, notarPct, grundbuchPct, maklerPct };
  }, [kaufpreisStr, grestStr, notarStr, grundbuchStr, maklerAn, maklerStr]);

  const result = useMemo(() => berechne(input), [input]);

  const segments = [
    { label: "Grunderwerbsteuer", value: result.grest },
    { label: "Notarkosten", value: result.notar },
    { label: "Grundbuchkosten", value: result.grundbuch },
    { label: "Maklerkosten", value: result.makler },
  ];

  const inputs = (
    <>
      <NumberField
        label="Kaufpreis"
        value={kaufpreisStr}
        onChange={setKaufpreisStr}
        unit="€"
        min={0}
        step={1000}
        placeholder="400000"
      />

      <SelectField
        label="Bundesland"
        value={bundesland}
        onChange={(v) => changeBundesland(v as BundeslandKey)}
        options={(Object.keys(BUNDESLAENDER) as BundeslandKey[]).map((k) => ({
          value: k,
          label: `${BUNDESLAENDER[k].name} (${formatNumber(
            BUNDESLAENDER[k].grest,
            BUNDESLAENDER[k].grest % 1 === 0 ? 0 : 1,
          )} %)`,
        }))}
        hint="Steuersatz wird automatisch vorbelegt und kann unten angepasst werden."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField
          label="Grunderwerbsteuer"
          value={grestStr}
          onChange={setGrestStr}
          unit="%"
          min={0}
          step={0.1}
        />
        <NumberField
          label="Notarkosten"
          value={notarStr}
          onChange={setNotarStr}
          unit="%"
          min={0}
          step={0.1}
          hint="ca. 1,5 %"
        />
        <NumberField
          label="Grundbuchkosten"
          value={grundbuchStr}
          onChange={setGrundbuchStr}
          unit="%"
          min={0}
          step={0.1}
          hint="ca. 0,5 %"
        />
      </div>

      <SegmentedControl
        label="Makler beauftragt?"
        value={maklerAn}
        onChange={(v) => setMaklerAn(v)}
        options={[
          { value: "ja", label: "Ja" },
          { value: "nein", label: "Nein" },
        ]}
      />

      {maklerAn === "ja" && (
        <NumberField
          label="Maklerprovision (Käuferanteil)"
          value={maklerStr}
          onChange={setMaklerStr}
          unit="%"
          min={0}
          step={0.01}
          hint="Üblich: 3,57 % inkl. USt. (Käuferanteil bei geteilter Provision)"
        />
      )}
    </>
  );

  const badgeTone: "positive" | "warning" | "critical" =
    result.nebenkostenPct < 8
      ? "positive"
      : result.nebenkostenPct < 12
        ? "warning"
        : "critical";
  const badgeLabel =
    result.nebenkostenPct < 8
      ? "Niedrige Nebenkosten"
      : result.nebenkostenPct < 12
        ? "Typischer Bereich"
        : "Hohe Nebenkosten";

  const resultView = (
    <div className="space-y-5">
      <ResultCard
        label="Kaufnebenkosten gesamt"
        value={formatCurrency(result.nebenkosten)}
        badge={{
          label: `${badgeLabel} · ${formatNumber(result.nebenkostenPct, 1)} % des Kaufpreises`,
          tone: badgeTone,
        }}
        description={
          <>
            Gesamtkosten inkl. Kaufpreis:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(result.gesamt)}
            </span>
          </>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 text-sm font-medium text-foreground">
          Aufteilung der Nebenkosten
        </div>
        <DonutChart segments={segments} total={result.nebenkosten} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-2 text-sm font-medium text-foreground">Detail</div>
        <BreakdownRow
          label="Grunderwerbsteuer"
          sub={BUNDESLAENDER[bundesland].name}
          value={result.grest}
          pct={input.grestPct}
        />
        <BreakdownRow
          label="Notarkosten"
          value={result.notar}
          pct={input.notarPct}
        />
        <BreakdownRow
          label="Grundbuchkosten"
          value={result.grundbuch}
          pct={input.grundbuchPct}
        />
        <BreakdownRow
          label="Maklerkosten"
          sub={maklerAn === "nein" ? "kein Makler" : undefined}
          value={result.makler}
          pct={input.maklerPct}
        />
        <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
          <div className="text-sm font-medium text-foreground">
            Gesamtkosten inkl. Kaufpreis
          </div>
          <div className="text-lg tabular-nums font-semibold text-foreground">
            {formatCurrency(result.gesamt)}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Hinweis: Notar- und Grundbuchkosten sind Durchschnittswerte. Je nach
        Vertragsgestaltung, Grundschuldhöhe und Region können sie leicht abweichen.
      </p>
    </div>
  );

  return (
    <>
      <CalculatorShell inputs={inputs} result={resultView} layout="input-heavy" />

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Explain
          title="Grunderwerbsteuer"
          body="Einmalige Steuer beim Kauf eines Grundstücks oder einer Immobilie. Der Steuersatz wird vom jeweiligen Bundesland festgelegt und liegt zwischen 3,5 % (Bayern) und 6,5 % (u. a. NRW, Brandenburg, SH). Die Steuer wird auf den Kaufpreis fällig."
        />
        <Explain
          title="Notarkosten"
          body="Der Notar beurkundet den Kaufvertrag und wickelt die Grundschuldbestellung ab. Die Gebühren sind bundesweit im GNotKG geregelt und liegen typischerweise bei rund 1,5 % des Kaufpreises."
        />
        <Explain
          title="Grundbuchkosten"
          body="Die Eintragung des neuen Eigentümers und der Grundschuld ins Grundbuch verursacht Gerichtsgebühren. Sie belaufen sich zusammen mit weiteren Grundbuchleistungen auf ca. 0,5 % des Kaufpreises."
        />
        <Explain
          title="Maklerprovision"
          body="Seit Dezember 2020 wird die Maklerprovision beim Kauf einer selbstgenutzten Immobilie i. d. R. hälftig zwischen Käufer und Verkäufer geteilt. Üblich sind 7,14 % gesamt inkl. USt., also 3,57 % für den Käufer."
        />
      </section>
    </>
  );
}

function Explain({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <div className="font-display text-base font-semibold text-foreground">
        {title}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}