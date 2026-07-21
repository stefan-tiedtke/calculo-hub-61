import { useId, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { cn } from "@/lib/utils";
import { formatInt, parseNumber } from "@/lib/format";

interface DateDiff {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

function addYears(date: Date, years: number): Date {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

function diffDates(start: Date, end: Date): DateDiff {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
}

function formatDateDE(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DateField({
  label,
  value,
  onChange,
  hint,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg outline-none transition-shadow focus:ring-2 focus:ring-ring"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function RenteneintrittCalculator() {
  const [birthdate, setBirthdate] = useState("");
  const [retirementAge, setRetirementAge] = useState("67");

  const result = useMemo(() => {
    if (!birthdate) return null;

    const age = parseNumber(retirementAge);
    if (!Number.isFinite(age) || age <= 0 || age > 100) return null;

    const birth = new Date(birthdate);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const retirementDate = addYears(birth, age);
    retirementDate.setHours(0, 0, 0, 0);

    const diff = diffDates(today, retirementDate);
    const reached = retirementDate.getTime() <= today.getTime();

    return {
      retirementDate,
      diff,
      reached,
      age,
    };
  }, [birthdate, retirementAge]);

  const countdownText = result
    ? result.reached
      ? "Renteneintritt erreicht"
      : `${formatInt(result.diff.years)} Jahre, ${formatInt(result.diff.months)} Monate, ${formatInt(result.diff.days)} Tage`
    : "–";

  return (
    <CalculatorShell
      inputs={
        <div className="space-y-5">
          <DateField
            label="Geburtsdatum"
            value={birthdate}
            onChange={setBirthdate}
            hint="Wann bist du geboren?"
          />
          <NumberField
            label="Gewünschtes Renteneintrittsalter"
            value={retirementAge}
            onChange={setRetirementAge}
            unit="J."
            min={50}
            max={100}
            step={1}
            hint="Zum Beispiel 67 Jahre (Regelaltersgrenze) oder früher."
          />
        </div>
      }
      result={
        <div className="space-y-4">
          <ResultCard
            label="Countdown bis zur Rente"
            value={countdownText}
            badge={
              result
                ? result.reached
                  ? { label: "Bereits erreicht", tone: "positive" }
                  : { label: `${formatInt(result.diff.totalDays)} Tage insgesamt`, tone: "info" }
                : undefined
            }
            description={
              result && (
                <>
                  {result.reached ? (
                    <p>
                      Dein Renteneintritt mit {result.age} Jahren wäre am{" "}
                      <span className="font-medium text-foreground">
                        {formatDateDE(result.retirementDate)}
                      </span>{" "}
                      gewesen.
                    </p>
                  ) : (
                    <p>
                      Du gehst voraussichtlich mit {result.age} Jahren in Rente am{" "}
                      <span className="font-medium text-foreground">
                        {formatDateDE(result.retirementDate)}
                      </span>
                      .
                    </p>
                  )}
                </>
              )
            }
            footer={
              result ? (
                <span>
                  {result.reached
                    ? "Viel Erfolg im Ruhestand!"
                    : "Noch einige Arbeitstage – der Countdown läuft."}
                </span>
              ) : (
                <span>Gib dein Geburtsdatum und das gewünschte Renteneintrittsalter ein.</span>
              )
            }
          />

          {result && !result.reached && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-sm font-medium text-foreground">Details</div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Jahre</dt>
                <dd className="text-right font-medium tabular-nums text-foreground">
                  {formatInt(result.diff.years)}
                </dd>
                <dt className="text-muted-foreground">Monate</dt>
                <dd className="text-right font-medium tabular-nums text-foreground">
                  {formatInt(result.diff.months)}
                </dd>
                <dt className="text-muted-foreground">Tage</dt>
                <dd className="text-right font-medium tabular-nums text-foreground">
                  {formatInt(result.diff.days)}
                </dd>
                <dt className="text-muted-foreground">Gesamttage</dt>
                <dd className="text-right font-medium tabular-nums text-foreground">
                  {formatInt(result.diff.totalDays)}
                </dd>
              </dl>
            </div>
          )}
        </div>
      }
    />
  );
}
