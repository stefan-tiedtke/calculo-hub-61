import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/calculator/result-card";
import { NumberField } from "@/components/calculator/number-field";
import { formatInt, formatNumber } from "@/lib/format";

type BL =
  | "BW" | "BY" | "BE" | "BB" | "HB" | "HH" | "HE" | "MV"
  | "NI" | "NW" | "RP" | "SL" | "SN" | "ST" | "SH" | "TH";

const BUNDESLAENDER: { code: BL; name: string }[] = [
  { code: "BW", name: "Baden-Württemberg" },
  { code: "BY", name: "Bayern" },
  { code: "BE", name: "Berlin" },
  { code: "BB", name: "Brandenburg" },
  { code: "HB", name: "Bremen" },
  { code: "HH", name: "Hamburg" },
  { code: "HE", name: "Hessen" },
  { code: "MV", name: "Mecklenburg-Vorpommern" },
  { code: "NI", name: "Niedersachsen" },
  { code: "NW", name: "Nordrhein-Westfalen" },
  { code: "RP", name: "Rheinland-Pfalz" },
  { code: "SL", name: "Saarland" },
  { code: "SN", name: "Sachsen" },
  { code: "ST", name: "Sachsen-Anhalt" },
  { code: "SH", name: "Schleswig-Holstein" },
  { code: "TH", name: "Thüringen" },
];

const MONATE = [
  "Ganzes Jahr", "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function bussUndBettag(year: number): Date {
  const d = new Date(year, 10, 23);
  const day = d.getDay();
  const diff = (day + 4) % 7 || 7;
  return addDays(d, -diff);
}

function holidaysForYear(year: number, bl: BL): { date: string; name: string }[] {
  const list: { date: string; name: string }[] = [];
  const easter = easterSunday(year);
  list.push({ date: `${year}-01-01`, name: "Neujahr" });
  list.push({ date: toISO(addDays(easter, -2)), name: "Karfreitag" });
  list.push({ date: toISO(addDays(easter, 1)), name: "Ostermontag" });
  list.push({ date: `${year}-05-01`, name: "Tag der Arbeit" });
  list.push({ date: toISO(addDays(easter, 39)), name: "Christi Himmelfahrt" });
  list.push({ date: toISO(addDays(easter, 50)), name: "Pfingstmontag" });
  list.push({ date: `${year}-10-03`, name: "Tag der Deutschen Einheit" });
  list.push({ date: `${year}-12-25`, name: "1. Weihnachtstag" });
  list.push({ date: `${year}-12-26`, name: "2. Weihnachtstag" });
  if (bl === "BW" || bl === "BY" || bl === "ST") list.push({ date: `${year}-01-06`, name: "Heilige Drei Könige" });
  if (bl === "BE" || bl === "MV") list.push({ date: `${year}-03-08`, name: "Internationaler Frauentag" });
  if (["BW", "BY", "HE", "NW", "RP", "SL"].includes(bl)) list.push({ date: toISO(addDays(easter, 60)), name: "Fronleichnam" });
  if (bl === "SL") list.push({ date: `${year}-08-15`, name: "Mariä Himmelfahrt" });
  if (bl === "TH") list.push({ date: `${year}-09-20`, name: "Weltkindertag" });
  if (["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"].includes(bl)) list.push({ date: `${year}-10-31`, name: "Reformationstag" });
  if (["BW", "BY", "NW", "RP", "SL"].includes(bl)) list.push({ date: `${year}-11-01`, name: "Allerheiligen" });
  if (bl === "SN") list.push({ date: toISO(bussUndBettag(year)), name: "Buß- und Bettag" });
  return list;
}

interface DayInfo {
  date: Date;
  iso: string;
  isFree: boolean;
  holidayName?: string;
}

interface Proposal {
  startIdx: number;
  endIdx: number;
  vacation: number;
  total: number;
  ratio: number;
  vacationDates: string[]; // ISO dates of the vacation days
  holidays: { date: string; name: string }[];
}

function buildYear(year: number, bl: BL): DayInfo[] {
  const holidays = new Map<string, string>();
  for (const h of holidaysForYear(year, bl)) holidays.set(h.date, h.name);
  const days: DayInfo[] = [];
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const iso = toISO(d);
    const dow = d.getDay();
    const isWE = dow === 0 || dow === 6;
    const holiday = holidays.get(iso);
    days.push({
      date: new Date(d),
      iso,
      isFree: isWE || !!holiday,
      holidayName: holiday,
    });
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function findProposals(days: DayInfo[], budget: number, maxSide = 5): Proposal[] {
  const n = days.length;
  const proposals: Proposal[] = [];
  const seen = new Set<number>();

  for (let i = 0; i < n; i++) {
    if (!days[i].isFree) continue;
    // Only process the start of a free block
    if (i > 0 && days[i - 1].isFree) continue;
    // Find end of initial free block
    let end0 = i;
    while (end0 < n - 1 && days[end0 + 1].isFree) end0++;
    if (seen.has(i)) continue;
    seen.add(i);

    const maxL = Math.min(budget, maxSide);
    for (let vl = 0; vl <= maxL; vl++) {
      const maxR = Math.min(budget - vl, maxSide);
      for (let vr = 0; vr <= maxR; vr++) {
        if (vl + vr === 0) continue;

        // Extend left, consuming vl workdays and absorbing adjacent free days
        let L = i;
        let takenL = 0;
        const vacL: number[] = [];
        while (takenL < vl && L > 0) {
          L--;
          if (!days[L].isFree) {
            takenL++;
            vacL.push(L);
          }
        }
        if (takenL < vl) continue;
        while (L > 0 && days[L - 1].isFree) L--;

        // Extend right
        let R = end0;
        let takenR = 0;
        const vacR: number[] = [];
        while (takenR < vr && R < n - 1) {
          R++;
          if (!days[R].isFree) {
            takenR++;
            vacR.push(R);
          }
        }
        if (takenR < vr) continue;
        while (R < n - 1 && days[R + 1].isFree) R++;

        const total = R - L + 1;
        const vac = vl + vr;
        const vacationDates = [...vacL, ...vacR].sort((a, b) => a - b).map((idx) => days[idx].iso);
        const holidays: { date: string; name: string }[] = [];
        for (let k = L; k <= R; k++) {
          if (days[k].holidayName) holidays.push({ date: days[k].iso, name: days[k].holidayName! });
        }
        proposals.push({
          startIdx: L,
          endIdx: R,
          vacation: vac,
          total,
          ratio: total / vac,
          vacationDates,
          holidays,
        });
      }
    }
  }

  // Dedupe by span: keep the one with the fewest vacation days for the same (L,R)
  const map = new Map<string, Proposal>();
  for (const p of proposals) {
    const key = `${p.startIdx}-${p.endIdx}`;
    const prev = map.get(key);
    if (!prev || p.vacation < prev.vacation || (p.vacation === prev.vacation && p.total > prev.total)) {
      map.set(key, p);
    }
  }
  return [...map.values()];
}

function formatRange(a: Date, b: Date): string {
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const optShort: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit" };
  const optFull: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  if (sameMonth) {
    return `${a.toLocaleDateString("de-DE", optShort)} – ${b.toLocaleDateString("de-DE", optFull)}`;
  }
  return `${a.toLocaleDateString("de-DE", optShort)} – ${b.toLocaleDateString("de-DE", optFull)}`;
}

function formatDateDe(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function UrlaubsoptimiererCalculator() {
  const currentYear = new Date().getFullYear();
  const [bl, setBl] = useState<BL>("BY");
  const [jahr, setJahr] = useState(String(currentYear + (new Date().getMonth() >= 9 ? 1 : 0)));
  const [budget, setBudget] = useState("30");
  const [monat, setMonat] = useState("0"); // 0 = Ganzes Jahr

  const result = useMemo(() => {
    const yearNum = Math.floor(Number(jahr));
    const budgetNum = Math.max(1, Math.floor(Number(budget) || 0));
    if (!yearNum || yearNum < 2000 || yearNum > 2100) return null;

    const days = buildYear(yearNum, bl);
    const monatNum = Math.floor(Number(monat));

    let proposals = findProposals(days, budgetNum, 5);

    if (monatNum >= 1 && monatNum <= 12) {
      proposals = proposals.filter((p) => {
        // Proposal must overlap the selected month
        for (let k = p.startIdx; k <= p.endIdx; k++) {
          if (days[k].date.getMonth() === monatNum - 1) return true;
        }
        return false;
      });
    }

    // Sort: best ratio first, then longest, then earliest
    proposals.sort((a, b) => {
      if (b.ratio !== a.ratio) return b.ratio - a.ratio;
      if (b.total !== a.total) return b.total - a.total;
      return a.startIdx - b.startIdx;
    });

    // Top 8 non-duplicate spans
    const top = proposals.slice(0, 8).map((p) => ({
      ...p,
      start: days[p.startIdx].date,
      end: days[p.endIdx].date,
    }));

    const totalHolidaysWorkday = days.filter(
      (d) => d.holidayName && d.date.getDay() !== 0 && d.date.getDay() !== 6,
    ).length;

    return { top, totalHolidaysWorkday };
  }, [bl, jahr, budget, monat]);

  const best = result?.top[0];

  return (
    <CalculatorShell
      layout="input-heavy"
      inputs={
        <>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Bundesland</label>
            <select
              value={bl}
              onChange={(e) => setBl(e.target.value as BL)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
            >
              {BUNDESLAENDER.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              label="Jahr"
              value={jahr}
              onChange={setJahr}
              min={2000}
              max={2100}
              step={1}
            />
            <NumberField
              label="Verfügbare Urlaubstage"
              value={budget}
              onChange={setBudget}
              unit="Tage"
              min={1}
              max={60}
              step={1}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Reisezeitraum / Monat
            </label>
            <select
              value={monat}
              onChange={(e) => setMonat(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
            >
              {MONATE.map((m, i) => (
                <option key={m} value={String(i)}>
                  {m}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              „Ganzes Jahr" zeigt die effizientesten Vorschläge über das gesamte Jahr. Bei einer Monatsauswahl werden nur Zeiträume angezeigt, die den Monat berühren.
            </p>
          </div>

          {result && result.top.length > 0 && (
            <div className="mt-2 space-y-3 border-t border-border pt-4">
              <div className="text-sm font-medium text-foreground">
                Vorschläge ({result.top.length})
              </div>
              <ul className="space-y-3">
                {result.top.map((p) => (
                  <li
                    key={`${p.startIdx}-${p.endIdx}-${p.vacation}`}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="font-display text-base font-semibold text-foreground">
                        {formatRange(p.start, p.end)}
                      </div>
                      <div className="text-sm font-medium text-brand">
                        {p.vacation} → {p.total} Tage
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatInt(p.vacation)} Urlaubstag(e) · {formatInt(p.total)} freie Tage am Stück · Verhältnis 1 : {formatNumber(p.ratio, 2)}
                    </div>
                    {p.holidays.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.holidays.map((h) => (
                          <span
                            key={h.date + h.name}
                            className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {h.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.vacationDates.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Urlaub nehmen:{" "}
                        <span className="text-foreground">
                          {p.vacationDates.map(formatDateDe).join(", ")}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result && result.top.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              Für den gewählten Zeitraum wurden keine Brückentag-Kombinationen gefunden. Wähle einen anderen Monat oder ein anderes Jahr.
            </div>
          )}
        </>
      }
      result={
        best ? (
          <ResultCard
            label="Bester Vorschlag"
            value={`${best.total}`}
            unit={`freie Tage`}
            badge={{
              label: `${best.vacation} Urlaubstag${best.vacation === 1 ? "" : "e"} einsetzen`,
              tone: "positive",
            }}
            description={
              <>
                <div className="text-base font-medium text-foreground">
                  {formatRange(best.start, best.end)}
                </div>
                <div className="mt-1">
                  Verhältnis eingesetzte Urlaubstage zu freien Tagen:{" "}
                  <span className="font-medium text-foreground">
                    1 : {formatNumber(best.ratio, 2)}
                  </span>
                </div>
                {best.holidays.length > 0 && (
                  <div className="mt-2 text-xs">
                    Enthält: {best.holidays.map((h) => h.name).join(", ")}
                  </div>
                )}
              </>
            }
            footer={
              result
                ? `${result.totalHolidaysWorkday} gesetzliche Feiertage fallen ${jahr} in ${BUNDESLAENDER.find((b) => b.code === bl)?.name} auf einen Werktag.`
                : undefined
            }
          />
        ) : (
          <ResultCard
            label="Bester Vorschlag"
            value="–"
            description="Bitte gültiges Jahr und Urlaubskontingent angeben."
          />
        )
      }
    />
  );
}
