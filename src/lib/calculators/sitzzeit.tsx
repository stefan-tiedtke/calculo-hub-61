import { useId, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { Slider } from "@/components/ui/slider";
import { formatInt, formatNumber, parseNumber } from "@/lib/format";

type Beruf =
  | "buero"
  | "homeoffice"
  | "handwerk"
  | "aussendienst"
  | "pflege"
  | "gastronomie"
  | "schueler"
  | "rentner"
  | "sonstiges";

type Commute = "fuss" | "rad" | "oepnv" | "auto" | "motorrad";
type Strength = "nie" | "1x" | "2x" | "3plus" | "fast";
type StandUp = "30" | "60" | "120" | "selten";

const BERUF_LABEL: Record<Beruf, string> = {
  buero: "Büro",
  homeoffice: "Homeoffice",
  handwerk: "Handwerk",
  aussendienst: "Außendienst",
  pflege: "Pflege",
  gastronomie: "Gastronomie",
  schueler: "Schüler / Student",
  rentner: "Rentner",
  sonstiges: "Sonstiges",
};

/** Beruf beeinflusst die Voreinstellung der Arbeitssitzzeit. */
const BERUF_DEFAULT_SIT: Record<Beruf, number> = {
  buero: 8,
  homeoffice: 8.5,
  handwerk: 2,
  aussendienst: 4,
  pflege: 2,
  gastronomie: 1.5,
  schueler: 6,
  rentner: 5,
  sonstiges: 6,
};

const COMMUTE_LABEL: Record<Commute, string> = {
  fuss: "Zu Fuß",
  rad: "Fahrrad",
  oepnv: "Öffentliche Verkehrsmittel",
  auto: "Auto",
  motorrad: "Motorrad",
};

/** Ist der Arbeitsweg aktiv (zählt als Bewegung) oder passiv (zählt zur Sitzzeit)? */
const COMMUTE_ACTIVE: Record<Commute, boolean> = {
  fuss: true,
  rad: true,
  oepnv: false,
  auto: false,
  motorrad: false,
};

const STRENGTH_LABEL: Record<Strength, string> = {
  nie: "Nie",
  "1x": "1× pro Woche",
  "2x": "2× pro Woche",
  "3plus": "3× oder mehr",
  fast: "Fast täglich",
};

const STRENGTH_POINTS: Record<Strength, number> = {
  nie: 0,
  "1x": 6,
  "2x": 11,
  "3plus": 14,
  fast: 15,
};

const STANDUP_LABEL: Record<StandUp, string> = {
  "30": "Alle 30 Minuten",
  "60": "Jede Stunde",
  "120": "Alle 2 Stunden",
  selten: "Selten",
};

const STANDUP_POINTS: Record<StandUp, number> = {
  "30": 15,
  "60": 10,
  "120": 5,
  selten: 0,
};

interface ScoreInput {
  totalSit: number; // Stunden pro Tag
  exerciseHoursWeek: number;
  strength: Strength;
  standUp: StandUp;
  commute: Commute;
  commuteMinutes: number;
}

interface ScoreResult {
  score: number;
  parts: {
    sit: number;
    exercise: number;
    strength: number;
    breaks: number;
    commute: number;
  };
}

/**
 * Aktivitäts-Score 0–100. Bewusst additiv aus fünf Bausteinen aufgebaut,
 * damit die Logik später leicht um Fitness-Tracker-Daten (Schritte, HR-Zonen)
 * erweitert werden kann.
 */
function computeScore(i: ScoreInput): ScoreResult {
  // Sitzen: 35 Punkte bei ≤4 h/Tag, 0 Punkte ab 12 h.
  const sit = 35 * clamp(1 - Math.max(0, i.totalSit - 4) / 8, 0, 1);
  // Bewegung: 25 Punkte ab 5 h Sport pro Woche (WHO: 2,5–5 h moderat).
  const exercise = 25 * clamp(i.exerciseHoursWeek / 5, 0, 1);
  const strength = STRENGTH_POINTS[i.strength];
  const breaks = STANDUP_POINTS[i.standUp];
  const commuteBase = COMMUTE_ACTIVE[i.commute] ? 10 : i.commute === "oepnv" ? 5 : 0;
  const commute = commuteBase * clamp(i.commuteMinutes / 20, 0, 1);
  const score = Math.round(sit + exercise + strength + breaks + commute);
  return { score, parts: { sit, exercise, strength, breaks, commute } };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function scoreBadge(score: number): { label: string; tone: "positive" | "info" | "warning" | "critical"; emoji: string } {
  if (score >= 80) return { label: "Sehr gut", tone: "positive", emoji: "🟢" };
  if (score >= 60) return { label: "Verbesserungsfähig", tone: "info", emoji: "🟡" };
  if (score >= 40) return { label: "Erhöht", tone: "warning", emoji: "🟠" };
  return { label: "Kritisch", tone: "critical", emoji: "🔴" };
}

function sitRisk(totalSit: number): { label: string; tone: "positive" | "info" | "warning" | "critical" } {
  if (totalSit < 6) return { label: "Niedriges Sitzrisiko", tone: "positive" };
  if (totalSit < 8) return { label: "Mittleres Sitzrisiko", tone: "info" };
  if (totalSit < 10) return { label: "Erhöhtes Sitzrisiko", tone: "warning" };
  return { label: "Kritisches Sitzrisiko", tone: "critical" };
}

function formatHours(h: number): string {
  if (!Number.isFinite(h) || h < 0) return "–";
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours) * 60);
  if (minutes === 0) return `${hours} Std`;
  if (hours === 0) return `${minutes} Min`;
  return `${hours} Std ${minutes} Min`;
}

function analysisText(totalSit: number, exerciseHoursWeek: number, breaks: StandUp): string {
  const moves = exerciseHoursWeek >= 2.5;
  const longSit = totalSit >= 9;
  const goodBreaks = breaks === "30" || breaks === "60";
  if (moves && longSit) {
    return "Du bewegst dich regelmäßig, sitzt jedoch an Arbeitstagen sehr lange. Bereits kurze Bewegungspausen könnten deine tägliche Belastung deutlich reduzieren.";
  }
  if (!moves && longSit) {
    return "Du sitzt viel und bewegst dich wenig – hier steckt das größte Potenzial. Beginne mit einem täglichen Spaziergang und einer wöchentlichen Sporteinheit.";
  }
  if (moves && !longSit && goodBreaks) {
    return "Sehr ausgewogener Alltag: aktive Bewegung, moderates Sitzen und regelmäßige Unterbrechungen. Halte diese Routine bei.";
  }
  if (moves && !longSit) {
    return "Guter Bewegungsanteil bei moderatem Sitzen. Regelmäßigere Pausen alle 30–60 Minuten würden den Effekt noch verstärken.";
  }
  return "Solide Basis – kleine Anpassungen wie ein aktiver Arbeitsweg oder eine kurze Trainingseinheit pro Woche bringen dich schnell voran.";
}

function motivation(score: number): string {
  if (score >= 80) return "Weiter so – dein aktiver Lebensstil ist ein starker Schutzfaktor für Herz, Rücken und Stoffwechsel.";
  if (score >= 60) return "Du bist auf einem guten Weg – versuche zusätzlich regelmäßige Bewegungspausen einzubauen.";
  if (score >= 40) return "Schon zwei kurze Spaziergänge am Tag können einen echten Unterschied machen.";
  return "Der erste Schritt ist der wichtigste: Starte diese Woche mit einer 10-Minuten-Runde nach dem Mittagessen.";
}

function ScoreRing({ score, size = 176 }: { score: number; size?: number }) {
  const gradId = useId();
  const radius = size / 2 - 12;
  const circ = 2 * Math.PI * radius;
  const clamped = clamp(score, 0, 100);
  const dash = (clamped / 100) * circ;
  const tone = scoreBadge(clamped).tone;
  const stops: Record<typeof tone, [string, string]> = {
    positive: ["oklch(0.72 0.17 155)", "oklch(0.62 0.19 160)"],
    info: ["oklch(0.75 0.14 85)", "oklch(0.62 0.16 60)"],
    warning: ["oklch(0.75 0.15 55)", "oklch(0.62 0.17 40)"],
    critical: ["oklch(0.68 0.19 25)", "oklch(0.55 0.21 20)"],
  };
  const [from, to] = stops[tone];
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label={`Aktivitäts-Score ${clamped} von 100`}
      role="img"
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-surface-muted"
          strokeWidth={12}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-4xl font-semibold tabular-nums text-foreground">
          {clamped}
        </div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          von 100
        </div>
      </div>
    </div>
  );
}

interface DayEvent {
  time: string;
  label: string;
  kind: "sit" | "move" | "break";
}

function buildPlan(totalSit: number, exerciseHoursWeek: number): DayEvent[] {
  const plan: DayEvent[] = [
    { time: "07:30", label: "5 Min Mobility & Wasser trinken", kind: "move" },
    { time: "08:00", label: "Arbeitsblock", kind: "sit" },
    { time: "09:30", label: "Aufstehen & 2 Min gehen", kind: "break" },
    { time: "10:30", label: "Treppe statt Aufzug", kind: "break" },
    { time: "12:30", label: "15 Min Spaziergang nach dem Essen", kind: "move" },
    { time: "14:00", label: "Arbeitsblock", kind: "sit" },
    { time: "15:30", label: "Dehnübungen am Platz", kind: "break" },
  ];
  if (exerciseHoursWeek < 3) {
    plan.push({ time: "18:00", label: "20 Min zügiger Spaziergang", kind: "move" });
  } else {
    plan.push({ time: "18:00", label: "30–45 Min Sport / Training", kind: "move" });
  }
  if (totalSit >= 9) {
    plan.push({ time: "20:30", label: "10 Min Abendrunde statt TV-Sofa", kind: "move" });
  }
  return plan;
}

const KIND_STYLE: Record<DayEvent["kind"], { dot: string; label: string }> = {
  sit: { dot: "bg-amber-500", label: "Sitzen" },
  move: { dot: "bg-emerald-500", label: "Bewegung" },
  break: { dot: "bg-brand", label: "Pause" },
};

export default function SitzzeitCalculator() {
  const [beruf, setBeruf] = useState<Beruf>("buero");
  const [workSit, setWorkSit] = useState<number>(BERUF_DEFAULT_SIT.buero);
  const [leisureSit, setLeisureSit] = useState<number>(3);
  const [commute, setCommute] = useState<Commute>("auto");
  const [commuteMin, setCommuteMin] = useState("30");
  const [exercise, setExercise] = useState<number>(2);
  const [strength, setStrength] = useState<Strength>("1x");
  const [standUp, setStandUp] = useState<StandUp>("120");
  const [age, setAge] = useState("35");

  function onBerufChange(b: Beruf) {
    setBeruf(b);
    setWorkSit(BERUF_DEFAULT_SIT[b]);
  }

  const result = useMemo(() => {
    const cMin = Math.max(0, parseNumber(commuteMin) || 0);
    const commuteHours = cMin / 60;
    const passiveCommute = COMMUTE_ACTIVE[commute] ? 0 : commuteHours;
    const totalSit = workSit + leisureSit + passiveCommute;
    const activeCommuteHoursWeek = COMMUTE_ACTIVE[commute] ? commuteHours * 5 : 0;
    const effectiveExercise = exercise + activeCommuteHoursWeek;
    const s = computeScore({
      totalSit,
      exerciseHoursWeek: effectiveExercise,
      strength,
      standUp,
      commute,
      commuteMinutes: cMin,
    });
    const improved = computeScore({
      totalSit: Math.max(4, totalSit - 1), // 1 h weniger durch Stehpausen & Mikrobewegung
      exerciseHoursWeek: effectiveExercise + 20 * 7 / 60, // +20 Min Spaziergang täglich
      strength: strength === "nie" || strength === "1x" ? "2x" : strength,
      standUp: standUp === "selten" || standUp === "120" ? "60" : standUp,
      commute,
      commuteMinutes: cMin,
    });
    return {
      totalSit,
      dailyExerciseMin: (effectiveExercise * 60) / 7,
      score: s.score,
      parts: s.parts,
      improvedScore: Math.min(100, improved.score),
      badge: scoreBadge(s.score),
      risk: sitRisk(totalSit),
    };
  }, [workSit, leisureSit, commute, commuteMin, exercise, strength, standUp]);

  const plan = useMemo(
    () => buildPlan(result.totalSit, exercise + (COMMUTE_ACTIVE[commute] ? (parseNumber(commuteMin) || 0) / 60 * 5 : 0)),
    [result.totalSit, exercise, commute, commuteMin],
  );

  return (
    <CalculatorShell
      layout="input-heavy"
      inputs={
        <>
          <SelectField
            label="Beruf"
            value={beruf}
            onChange={(v) => onBerufChange(v as Beruf)}
            options={Object.entries(BERUF_LABEL).map(([value, label]) => ({ value, label }))}
          />

          <SliderField
            label="Sitzzeit bei der Arbeit"
            unit="Std / Tag"
            min={0}
            max={12}
            step={0.5}
            value={workSit}
            onChange={setWorkSit}
          />

          <SliderField
            label="Sitzzeit in der Freizeit"
            unit="Std / Tag"
            min={0}
            max={10}
            step={0.5}
            value={leisureSit}
            onChange={setLeisureSit}
            hint="Fernsehen, Computer, Gaming, Lesen."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Arbeitsweg"
              value={commute}
              onChange={(v) => setCommute(v as Commute)}
              options={Object.entries(COMMUTE_LABEL).map(([value, label]) => ({ value, label }))}
            />
            <NumberField
              label="Dauer Arbeitsweg"
              unit="Min"
              value={commuteMin}
              onChange={setCommuteMin}
              min={0}
              max={240}
              step={5}
            />
          </div>

          <SliderField
            label="Bewegung pro Woche"
            unit="Std"
            min={0}
            max={20}
            step={0.5}
            value={exercise}
            onChange={setExercise}
            hint="Sport, Spaziergänge, Radfahren – alles zusammen."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Krafttraining"
              value={strength}
              onChange={(v) => setStrength(v as Strength)}
              options={Object.entries(STRENGTH_LABEL).map(([value, label]) => ({ value, label }))}
            />
            <SelectField
              label="Stehst du regelmäßig auf?"
              value={standUp}
              onChange={(v) => setStandUp(v as StandUp)}
              options={Object.entries(STANDUP_LABEL).map(([value, label]) => ({ value, label }))}
            />
          </div>

          <NumberField
            label="Alter"
            unit="Jahre"
            value={age}
            onChange={setAge}
            min={10}
            max={100}
            step={1}
            hint="Wird für die Einordnung berücksichtigt – ersetzt keine medizinische Beratung."
          />
        </>
      }
      result={
        <div className="space-y-6">
          <ResultCard
            label="Tägliche Sitzzeit"
            value={formatHours(result.totalSit)}
            badge={{ label: `${result.badge.emoji} ${result.badge.label}`, tone: result.badge.tone }}
            description={
              <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
                <ScoreRing score={result.score} />
                <div className="flex-1 space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {result.risk.label}
                    </span>
                    {" · "}
                    <span>Bewegung heute ≈ {formatInt(Math.round(result.dailyExerciseMin))} Min</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {analysisText(result.totalSit, exercise, standUp)}
                  </p>
                </div>
              </div>
            }
            footer={<span>{motivation(result.score)}</span>}
          />

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Verbesserungspotenzial
            </div>
            <div className="mt-2 text-sm text-foreground">
              Mit <strong>+20 Min Spaziergang</strong>, <strong>2× Krafttraining</strong> und
              Aufstehen <strong>jede Stunde</strong> steigt dein Score von{" "}
              <span className="tabular-nums font-semibold">{result.score}</span>{" "}auf{" "}
              <span className="tabular-nums font-semibold text-brand">
                {result.improvedScore}
              </span>{" "}Punkte.
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-700"
                style={{ width: `${clamp(result.improvedScore, 0, 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tagesplan
            </div>
            <ol className="mt-4 space-y-3">
              {plan.map((e, i) => {
                const style = KIND_STYLE[e.kind];
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 flex flex-col items-center">
                      <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                      {i < plan.length - 1 && (
                        <span className="mt-1 h-6 w-px bg-border" aria-hidden />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm tabular-nums text-muted-foreground">
                          {e.time}
                        </span>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {style.label}
                        </span>
                      </div>
                      <div className="text-sm text-foreground">{e.label}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">
              Der Rechner ersetzt keine medizinische Beratung.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Score-Aufteilung
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <ScoreRow label="Sitzzeit" value={result.parts.sit} max={35} />
              <ScoreRow label="Bewegung" value={result.parts.exercise} max={25} />
              <ScoreRow label="Krafttraining" value={result.parts.strength} max={15} />
              <ScoreRow label="Pausen" value={result.parts.breaks} max={15} />
              <ScoreRow label="Arbeitsweg" value={result.parts.commute} max={10} />
            </dl>
          </div>
        </div>
      }
    />
  );
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right tabular-nums text-foreground">
        {formatNumber(value, 1)} <span className="text-muted-foreground">/ {max}</span>
      </dd>
    </>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
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
}: {
  label: string;
  unit: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm tabular-nums text-muted-foreground">
          <span className="font-semibold text-foreground">
            {formatNumber(value, value % 1 === 0 ? 0 : 1)}
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