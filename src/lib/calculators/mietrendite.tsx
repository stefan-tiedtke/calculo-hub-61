import { useId, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

// ---------------------------------------------------------------------------
// Mietrendite-Rechner (Immobilien Deutschland)
// ---------------------------------------------------------------------------

interface CalcInput {
  kaufpreis: number;
  kaltmieteMonat: number;
  nebenkostenPct: number;
  verwaltungPct: number;
  instandhaltungPct: number;
  mietausfallPct: number;
  zinsTilgungMonat: number;
}

interface CalcResult {
  kaufpreis: number;
  kaltmieteJahr: number;
  nebenkosten: number;
  verwaltung: number;
  instandhaltung: number;
  mietausfall: number;
  gesamtkosten: number;
  bruttomietrendite: number;
  nettomieteJahr: number;
  nettomietrendite: number;
  cashflowVorFinanzierung: number;
  cashflowNachFinanzierung: number;
  amortisationJahre: number;
}

function berechne(input: CalcInput): CalcResult {
  const kaufpreis = Math.max(0, input.kaufpreis);
  const kaltmieteJahr = Math.max(0, input.kaltmieteMonat) * 12;
  const nebenkosten = (kaufpreis * Math.max(0, input.nebenkostenPct)) / 100;
  const verwaltung = (kaltmieteJahr * Math.max(0, input.verwaltungPct)) / 100;
  const instandhaltung = (kaufpreis * Math.max(0, input.instandhaltungPct)) / 100;
  const mietausfall = (kaltmieteJahr * Math.max(0, input.mietausfallPct)) / 100;

  const gesamtkosten = kaufpreis + nebenkosten;
  const gesamtkostenJahr = verwaltung + instandhaltung + mietausfall;
  const nettomieteJahr = Math.max(0, kaltmieteJahr - gesamtkostenJahr);
  const cashflowVorFinanzierung = nettomieteJahr;
  const cashflowNachFinanzierung = nettomieteJahr - Math.max(0, input.zinsTilgungMonat) * 12;

  return {
    kaufpreis,
    kaltmieteJahr,
    nebenkosten,
    verwaltung,
    instandhaltung,
    mietausfall,
    gesamtkosten,
    bruttomietrendite: kaufpreis > 0 ? (kaltmieteJahr / kaufpreis) * 100 : 0,
    nettomieteJahr,
    nettomietrendite: gesamtkosten > 0 ? (nettomieteJahr / gesamtkosten) * 100 : 0,
    cashflowVorFinanzierung,
    cashflowNachFinanzierung,
    amortisationJahre: cashflowVorFinanzierung > 0 ? gesamtkosten / cashflowVorFinanzierung : 0,
  };
}

// ---------------------------------------------------------------------------
// UI-Bausteine
// ---------------------------------------------------------------------------

function BreakdownRow({
  label,
  value,
  sub,
  negative,
}: {
  label: string;
  value: number;
  sub?: string;
  negative?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
      <div
        className={`text-base tabular-nums font-semibold ${
          negative ? "text-destructive" : "text-foreground"
        }`}
      >
        {negative ? "− " : ""}
        {formatCurrency(Math.abs(value))}
      </div>
    </div>
  );
}

function ResultMini({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "positive" | "negative" }) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "negative"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-semibold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hauptkomponente
// ---------------------------------------------------------------------------

export default function MietrenditeCalculator() {
  const [kaufpreisStr, setKaufpreisStr] = useState("400000");
  const [kaltmieteStr, setKaltmieteStr] = useState("1600");
  const [nebenkostenStr, setNebenkostenStr] = useState("10");
  const [verwaltungStr, setVerwaltungStr] = useState("3");
  const [instandhaltungStr, setInstandhaltungStr] = useState("1");
  const [mietausfallStr, setMietausfallStr] = useState("3");
  const [zinsTilgungStr, setZinsTilgungStr] = useState("0");
  const [showFinanzierung, setShowFinanzierung] = useState<"ja" | "nein">("nein");

  const input: CalcInput = useMemo(() => {
    return {
      kaufpreis: Math.max(0, parseNumber(kaufpreisStr) || 0),
      kaltmieteMonat: Math.max(0, parseNumber(kaltmieteStr) || 0),
      nebenkostenPct: Math.max(0, parseNumber(nebenkostenStr) || 0),
      verwaltungPct: Math.max(0, parseNumber(verwaltungStr) || 0),
      instandhaltungPct: Math.max(0, parseNumber(instandhaltungStr) || 0),
      mietausfallPct: Math.max(0, parseNumber(mietausfallStr) || 0),
      zinsTilgungMonat: showFinanzierung === "ja" ? Math.max(0, parseNumber(zinsTilgungStr) || 0) : 0,
    };
  }, [
    kaufpreisStr,
    kaltmieteStr,
    nebenkostenStr,
    verwaltungStr,
    instandhaltungStr,
    mietausfallStr,
    zinsTilgungStr,
    showFinanzierung,
  ]);

  const result = useMemo(() => berechne(input), [input]);

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

      <NumberField
        label="Kaltmiete pro Monat"
        value={kaltmieteStr}
        onChange={setKaltmieteStr}
        unit="€"
        min={0}
        step={50}
        placeholder="1600"
      />

      <NumberField
        label="Kaufnebenkosten"
        value={nebenkostenStr}
        onChange={setNebenkostenStr}
        unit="%"
        min={0}
        step={0.5}
        hint="Notar, Makler, Grunderwerbsteuer (ca. 8 – 12 %)"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField
          label="Verwaltung"
          value={verwaltungStr}
          onChange={setVerwaltungStr}
          unit="%"
          min={0}
          step={0.5}
          hint="vom Jahresmiete"
        />
        <NumberField
          label="Instandhaltung"
          value={instandhaltungStr}
          onChange={setInstandhaltungStr}
          unit="%"
          min={0}
          step={0.1}
          hint="vom Kaufpreis/Jahr"
        />
        <NumberField
          label="Mietausfallrisiko"
          value={mietausfallStr}
          onChange={setMietausfallStr}
          unit="%"
          min={0}
          step={0.5}
          hint="vom Jahresmiete"
        />
      </div>

      <SegmentedControl
        label="Finanzierungskosten berücksichtigen?"
        value={showFinanzierung}
        onChange={(v) => setShowFinanzierung(v)}
        options={[
          { value: "ja", label: "Ja" },
          { value: "nein", label: "Nein" },
        ]}
      />

      {showFinanzierung === "ja" && (
        <NumberField
          label="Zins + Tilgung pro Monat"
          value={zinsTilgungStr}
          onChange={setZinsTilgungStr}
          unit="€"
          min={0}
          step={100}
          hint="Annuität aus Darlehen (Zins + Tilgung)"
        />
      )}
    </>
  );

  const badgeTone: "positive" | "warning" | "critical" | "neutral" =
    result.nettomietrendite >= 4
      ? "positive"
      : result.nettomietrendite >= 2.5
        ? "warning"
        : "critical";

  const badgeLabel =
    result.nettomietrendite >= 4
      ? "Attraktive Rendite"
      : result.nettomietrendite >= 2.5
        ? "Solide Rendite"
        : "Rendite eher schwach";

  const resultView = (
    <div className="space-y-5">
      <ResultCard
        label="Nettomietrendite"
        value={formatPercent(result.nettomietrendite, 2)}
        badge={{
          label: `${badgeLabel}`,
          tone: badgeTone,
        }}
        description={
          <>
            Bruttomietrendite:{" "}
            <span className="font-semibold text-foreground">
              {formatPercent(result.bruttomietrendite, 2)}
            </span>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <ResultMini
          label="Jahreskaltmiete"
          value={formatCurrency(result.kaltmieteJahr)}
        />
        <ResultMini
          label="Gesamtkaufpreis inkl. NK"
          value={formatCurrency(result.gesamtkosten)}
        />
        <ResultMini
          label="Jährlicher Überschuss"
          value={formatCurrency(result.cashflowVorFinanzierung)}
          tone={result.cashflowVorFinanzierung >= 0 ? "positive" : "negative"}
        />
        <ResultMini
          label="Amortisation"
          value={
            result.amortisationJahre > 0 && result.amortisationJahre < 100
              ? `${formatNumber(result.amortisationJahre, 1)} Jahre`
              : "—"
          }
        />
        {showFinanzierung === "ja" && (
          <ResultMini
            label="Cashflow nach Finanzierung"
            value={formatCurrency(result.cashflowNachFinanzierung)}
            tone={result.cashflowNachFinanzierung >= 0 ? "positive" : "negative"}
          />
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-2 text-sm font-medium text-foreground">Jährliche Aufwendungen</div>
        <BreakdownRow
          label="Verwaltung"
          value={result.verwaltung}
          sub={`${verwaltungStr.replace(".", ",")} % der Jahresmiete`}
        />
        <BreakdownRow
          label="Instandhaltung / Rücklage"
          value={result.instandhaltung}
          sub={`${instandhaltungStr.replace(".", ",")} % des Kaufpreises`}
        />
        <BreakdownRow
          label="Mietausfallrisiko"
          value={result.mietausfall}
          sub={`${mietausfallStr.replace(".", ",")} % der Jahresmiete`}
        />
        {showFinanzierung === "ja" && (
          <BreakdownRow
            label="Zins + Tilgung"
            value={input.zinsTilgungMonat * 12}
            sub="pro Jahr"
            negative
          />
        )}
        <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
          <div className="text-sm font-medium text-foreground">Nettomiete pro Jahr</div>
          <div className="text-lg tabular-nums font-semibold text-foreground">
            {formatCurrency(result.nettomieteJahr)}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Hinweis: Die Nettomietrendite bezieht alle Eingaben auf den gesamten Kaufpreis inkl.
        Nebenkosten. Steuern (z. B. Abgeltungssteuer auf den Veräußerungsgewinn), Grundsteuer und
        individuelle Abschreibungen sind nicht enthalten. Sie dient als erste Einschätzung, keine
        Anlageberatung.
      </p>
    </div>
  );

  return (
    <>
      <CalculatorShell inputs={inputs} result={resultView} layout="input-heavy" />

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Explain
          title="Bruttomietrendite"
          body="Zeigt die Jahreskaltmiete als Prozentsatz des Kaufpreises. Sie ist der einfachste Rendite-Indikator, ignoriert aber alle Kosten wie Verwaltung, Instandhaltung, Mietausfall und Nebenkosten."
        />
        <Explain
          title="Nettomietrendite"
          body="Betrachtet die Jahreskaltmiete abzüglich laufender Kosten und bezieht sie auf den Gesamtkaufpreis inklusive Nebenkosten. Sie ist die aussagekräftigere Kennzahl für den tatsächlichen Ertrag."
        />
        <Explain
          title="Cashflow"
          body="Der Cashflow ist die Nettomiete minus Finanzierungskosten (Zins + Tilgung). Ein positiver Cashflow bedeutet, dass die Mieteinnahmen die laufenden Kosten und die Annuität decken."
        />
        <Explain
          title="Amortisation"
          body="Gibt an, nach wie vielen Jahren sich die Investition (Kaufpreis + Nebenkosten) durch den jährlichen Überschuss vor Finanzierung amortisiert hat. Kürzere Zeiträume deuten auf eine höhere Sicherheitsmarge hin."
        />
      </section>
    </>
  );
}

function Explain({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <div className="font-display text-base font-semibold text-foreground">{title}</div>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
