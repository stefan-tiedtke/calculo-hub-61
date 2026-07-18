import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/calculator/result-card";
import { formatInt } from "@/lib/format";

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

/** Easter Sunday via Gauss / Meeus algorithm. */
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

/** Buß- und Bettag: Mittwoch vor dem 23. November. */
function bussUndBettag(year: number): Date {
  const d = new Date(year, 10, 23); // 23. November
  // Wochentag: 0=So .. 3=Mi
  const day = d.getDay();
  const diff = (day + 4) % 7 || 7; // Tage rückwärts bis zum vorherigen Mittwoch
  return addDays(d, -diff);
}

function holidaysForYear(year: number, bl: BL): { date: string; name: string }[] {
  const list: { date: string; name: string }[] = [];
  const easter = easterSunday(year);

  // Bundesweit
  list.push({ date: `${year}-01-01`, name: "Neujahr" });
  list.push({ date: toISO(addDays(easter, -2)), name: "Karfreitag" });
  list.push({ date: toISO(addDays(easter, 1)), name: "Ostermontag" });
  list.push({ date: `${year}-05-01`, name: "Tag der Arbeit" });
  list.push({ date: toISO(addDays(easter, 39)), name: "Christi Himmelfahrt" });
  list.push({ date: toISO(addDays(easter, 50)), name: "Pfingstmontag" });
  list.push({ date: `${year}-10-03`, name: "Tag der Deutschen Einheit" });
  list.push({ date: `${year}-12-25`, name: "1. Weihnachtstag" });
  list.push({ date: `${year}-12-26`, name: "2. Weihnachtstag" });

  // Heilige Drei Könige
  if (bl === "BW" || bl === "BY" || bl === "ST") {
    list.push({ date: `${year}-01-06`, name: "Heilige Drei Könige" });
  }
  // Internationaler Frauentag
  if (bl === "BE" || bl === "MV") {
    list.push({ date: `${year}-03-08`, name: "Internationaler Frauentag" });
  }
  // Fronleichnam (60 Tage nach Ostern)
  if (["BW", "BY", "HE", "NW", "RP", "SL"].includes(bl)) {
    list.push({ date: toISO(addDays(easter, 60)), name: "Fronleichnam" });
  }
  // Mariä Himmelfahrt (Saarland; in Bayern nur teilweise – hier bewusst nur SL)
  if (bl === "SL") {
    list.push({ date: `${year}-08-15`, name: "Mariä Himmelfahrt" });
  }
  // Weltkindertag
  if (bl === "TH") {
    list.push({ date: `${year}-09-20`, name: "Weltkindertag" });
  }
  // Reformationstag
  if (["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"].includes(bl)) {
    list.push({ date: `${year}-10-31`, name: "Reformationstag" });
  }
  // Allerheiligen
  if (["BW", "BY", "NW", "RP", "SL"].includes(bl)) {
    list.push({ date: `${year}-11-01`, name: "Allerheiligen" });
  }
  // Buß- und Bettag
  if (bl === "SN") {
    list.push({ date: toISO(bussUndBettag(year)), name: "Buß- und Bettag" });
  }

  return list;
}

function parseISO(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

function today(): string {
  return toISO(new Date());
}

function yearEnd(): string {
  const d = new Date();
  return `${d.getFullYear()}-12-31`;
}

export default function ArbeitstageCalculator() {
  const [von, setVon] = useState(today());
  const [bis, setBis] = useState(yearEnd());
  const [bl, setBl] = useState<BL>("BY");
  const [saSo, setSaSo] = useState(true);
  const [feiertage, setFeiertage] = useState(true);
  const [urlaub, setUrlaub] = useState("0");

  const r = useMemo(() => {
    const start = parseISO(von);
    const end = parseISO(bis);
    if (!start || !end || end < start) {
      return null;
    }

    // Feiertage über alle betroffenen Jahre sammeln
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    const feiertagsSet = new Set<string>();
    const feiertagsListe: { date: string; name: string }[] = [];
    for (let y = startYear; y <= endYear; y++) {
      for (const f of holidaysForYear(y, bl)) {
        feiertagsSet.add(f.date);
        feiertagsListe.push(f);
      }
    }

    let kalender = 0;
    let wochenende = 0;
    let feiertagAnWerktag = 0;
    let arbeitstage = 0;
    const feiertageImZeitraum: { date: string; name: string }[] = [];

    const cur = new Date(start);
    while (cur <= end) {
      kalender++;
      const iso = toISO(cur);
      const dow = cur.getDay(); // 0 So .. 6 Sa
      const istWE = dow === 0 || dow === 6;
      const istFeiertag = feiertagsSet.has(iso);

      if (istWE) wochenende++;
      if (istFeiertag && !istWE) feiertagAnWerktag++;
      if (istFeiertag) {
        const f = feiertagsListe.find((x) => x.date === iso);
        if (f) feiertageImZeitraum.push(f);
      }

      const zaehltNicht = (saSo && istWE) || (feiertage && istFeiertag);
      if (!zaehltNicht) arbeitstage++;

      cur.setDate(cur.getDate() + 1);
    }

    const urlaubsTage = Math.max(0, Math.floor(Number(urlaub) || 0));
    const nachUrlaub = Math.max(0, arbeitstage - urlaubsTage);

    return {
      kalender,
      wochenende,
      feiertagAnWerktag,
      arbeitstage,
      nachUrlaub,
      urlaubsTage,
      feiertageImZeitraum: feiertageImZeitraum.sort((a, b) => a.date.localeCompare(b.date)),
    };
  }, [von, bis, bl, saSo, feiertage, urlaub]);

  return (
    <CalculatorShell
      inputs={
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Von</label>
              <input
                type="date"
                value={von}
                onChange={(e) => setVon(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Bis</label>
              <input
                type="date"
                value={bis}
                onChange={(e) => setBis(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

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
            <p className="text-xs text-muted-foreground">
              Bestimmt die zusätzlichen gesetzlichen Feiertage (z. B. Fronleichnam, Allerheiligen, Reformationstag).
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={saSo}
                onChange={(e) => setSaSo(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              Samstag und Sonntag ausschließen
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={feiertage}
                onChange={(e) => setFeiertage(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              Gesetzliche Feiertage ausschließen
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Urlaubs-/Abwesenheitstage
            </label>
            <input
              type="number"
              min={0}
              value={urlaub}
              onChange={(e) => setUrlaub(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg tabular-nums outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Optional – werden von den Arbeitstagen abgezogen.
            </p>
          </div>
        </>
      }
      result={
        r ? (
          <ResultCard
            label="Arbeitstage im Zeitraum"
            value={formatInt(r.nachUrlaub)}
            unit="Tage"
            badge={
              r.urlaubsTage > 0
                ? { label: `${formatInt(r.arbeitstage)} vor Urlaubsabzug`, tone: "info" }
                : undefined
            }
            description={
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Kalendertage</dt>
                <dd className="text-right tabular-nums">{formatInt(r.kalender)}</dd>
                <dt>Wochenendtage</dt>
                <dd className="text-right tabular-nums">− {formatInt(r.wochenende)}</dd>
                <dt>Feiertage (Mo–Fr)</dt>
                <dd className="text-right tabular-nums">− {formatInt(r.feiertagAnWerktag)}</dd>
                {r.urlaubsTage > 0 && (
                  <>
                    <dt>Urlaub / Abwesenheit</dt>
                    <dd className="text-right tabular-nums">− {formatInt(r.urlaubsTage)}</dd>
                  </>
                )}
              </dl>
            }
            footer={
              r.feiertageImZeitraum.length > 0 ? (
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-foreground">
                    Feiertage im Zeitraum ({r.feiertageImZeitraum.length})
                  </summary>
                  <ul className="mt-2 space-y-1 text-xs">
                    {r.feiertageImZeitraum.map((f) => {
                      const d = parseISO(f.date)!;
                      return (
                        <li key={f.date + f.name} className="flex justify-between gap-3">
                          <span>{f.name}</span>
                          <span className="tabular-nums text-muted-foreground">
                            {d.toLocaleDateString("de-DE", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ) : null
            }
          />
        ) : (
          <ResultCard
            label="Arbeitstage im Zeitraum"
            value="–"
            description="Bitte gültiges Von- und Bis-Datum wählen (Bis nicht vor Von)."
          />
        )
      }
    />
  );
}
