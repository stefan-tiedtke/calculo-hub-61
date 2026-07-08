import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatInt, parseNumber } from "@/lib/format";

type Sex = "m" | "w";
type Aktivitaet = "sitzend" | "leicht" | "aktiv" | "sehr" | "extrem";
type ProteinZiel = "allgemein" | "sport" | "aufbau";

const PROTEIN: Record<ProteinZiel, { g: number; label: string; hint: string }> = {
  allgemein: { g: 0.8, label: "Allgemein (0,8 g/kg)", hint: "DGE-Empfehlung für Erwachsene ohne intensiven Sport." },
  sport: { g: 1.6, label: "Sport (1,6 g/kg)", hint: "Kraft- und Ausdauersport, Muskelerhalt – auch im Defizit." },
  aufbau: { g: 2.0, label: "Muskelaufbau (2,0 g/kg)", hint: "Intensiver Kraftsport bzw. gezielter Muskelaufbau." },
};

const FAKTOR: Record<Aktivitaet, number> = {
  sitzend: 1.2,
  leicht: 1.375,
  aktiv: 1.55,
  sehr: 1.725,
  extrem: 1.9,
};

const AKTIVITAET_HINT: Record<Aktivitaet, string> = {
  sitzend: "Bürojob, kaum Bewegung, kein Sport.",
  leicht: "1–3 × leichter Sport pro Woche.",
  aktiv: "3–5 × moderater Sport pro Woche.",
  sehr: "6–7 × intensives Training pro Woche.",
  extrem: "Körperlich schwerer Job oder 2 × Training täglich.",
};

const ZIELE: { key: string; label: string; faktor: number; highlight?: boolean }[] = [
  { key: "cut25", label: "Aggressives Defizit (−25 %)", faktor: 0.75 },
  { key: "cut15", label: "Moderates Defizit (−15 %)", faktor: 0.85 },
  { key: "cut10", label: "Leichtes Defizit (−10 %)", faktor: 0.9 },
  { key: "erhalt", label: "Erhaltung", faktor: 1, highlight: true },
  { key: "bulk10", label: "Leichter Aufbau (+10 %)", faktor: 1.1 },
  { key: "bulk20", label: "Moderater Aufbau (+20 %)", faktor: 1.2 },
];

export default function TdeeCalculator() {
  const [sex, setSex] = useState<Sex>("m");
  const [alter, setAlter] = useState("30");
  const [groesse, setGroesse] = useState("180");
  const [gewicht, setGewicht] = useState("80");
  const [aktivitaet, setAktivitaet] = useState<Aktivitaet>("aktiv");
  const [proteinZiel, setProteinZiel] = useState<ProteinZiel>("sport");

  const r = useMemo(() => {
    const kg = Math.max(0, parseNumber(gewicht) || 0);
    const cm = Math.max(0, parseNumber(groesse) || 0);
    const j = Math.max(0, parseNumber(alter) || 0);
    if (kg <= 0 || cm <= 0 || j <= 0) return null;
    const bmr =
      sex === "m"
        ? 10 * kg + 6.25 * cm - 5 * j + 5
        : 10 * kg + 6.25 * cm - 5 * j - 161;
    const faktor = FAKTOR[aktivitaet];
    const tdee = bmr * faktor;
    const aktivPart = tdee - bmr;
    // Makros für Erhaltung: Eiweiß wählbar, Fett 1,0 g/kg, Rest KH
    const eiweiss = kg * PROTEIN[proteinZiel].g;
    const fett = kg * 1.0;
    const kh = Math.max(0, (tdee - (eiweiss * 4 + fett * 9)) / 4);
    return { bmr, tdee, aktivPart, kg, eiweiss, fett, kh };
  }, [sex, alter, groesse, gewicht, aktivitaet, proteinZiel]);

  return (
    <CalculatorShell
      inputs={
        <>
          <SegmentedControl
            label="Geschlecht"
            value={sex}
            onChange={setSex}
            options={[
              { value: "m", label: "Männlich" },
              { value: "w", label: "Weiblich" },
            ]}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <NumberField
              label="Alter"
              unit="J"
              value={alter}
              onChange={setAlter}
              min={10}
              max={100}
              step={1}
            />
            <NumberField
              label="Größe"
              unit="cm"
              value={groesse}
              onChange={setGroesse}
              min={100}
              max={230}
              step={1}
            />
            <NumberField
              label="Gewicht"
              unit="kg"
              value={gewicht}
              onChange={setGewicht}
              min={30}
              max={250}
              step={1}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Aktivitätslevel</label>
            <SegmentedControl
              value={aktivitaet}
              onChange={(v) => setAktivitaet(v as Aktivitaet)}
              options={[
                { value: "sitzend", label: "Sitzend" },
                { value: "leicht", label: "Leicht" },
                { value: "aktiv", label: "Aktiv" },
                { value: "sehr", label: "Sehr" },
                { value: "extrem", label: "Extrem" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {AKTIVITAET_HINT[aktivitaet]} Faktor × {FAKTOR[aktivitaet]
                .toString()
                .replace(".", ",")}.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Eiweiß-Ziel</label>
            <SegmentedControl
              value={proteinZiel}
              onChange={(v) => setProteinZiel(v as ProteinZiel)}
              options={[
                { value: "allgemein", label: "Allgemein" },
                { value: "sport", label: "Sport" },
                { value: "aufbau", label: "Aufbau" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {PROTEIN[proteinZiel].hint}
            </p>
          </div>
        </>
      }
      result={
        <ResultCard
          label="Kalorienbedarf (TDEE)"
          value={r ? formatInt(Math.round(r.tdee)) : "–"}
          unit="kcal / Tag"
          badge={
            r
              ? {
                  label: `Grundumsatz: ${formatInt(Math.round(r.bmr))} kcal`,
                  tone: "info",
                }
              : undefined
          }
          description={
            r && (
              <>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt>Grundumsatz (BMR)</dt>
                  <dd className="text-right tabular-nums">
                    {formatInt(Math.round(r.bmr))} kcal
                  </dd>
                  <dt>Aktivitätsumsatz</dt>
                  <dd className="text-right tabular-nums">
                    {formatInt(Math.round(r.aktivPart))} kcal
                  </dd>
                  <dt className="font-semibold text-foreground">Erhaltung (TDEE)</dt>
                  <dd className="text-right font-semibold tabular-nums text-foreground">
                    {formatInt(Math.round(r.tdee))} kcal
                  </dd>
                </dl>
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Zielkalorien
                  </p>
                  <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm">
                    {ZIELE.map((z) => (
                      <div
                        key={z.key}
                        className={
                          z.highlight
                            ? "contents font-semibold text-foreground"
                            : "contents"
                        }
                      >
                        <dt>{z.label}</dt>
                        <dd className="text-right tabular-nums">
                          {formatInt(Math.round(r.tdee * z.faktor))} kcal
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Makro-Vorschlag (Erhaltung)
                  </p>
                  <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-lg bg-surface-muted p-2 text-center">
                      <div className="text-xs text-muted-foreground">Eiweiß</div>
                      <div className="font-semibold tabular-nums">
                        {formatInt(Math.round(r.eiweiss))} g
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface-muted p-2 text-center">
                      <div className="text-xs text-muted-foreground">Fett</div>
                      <div className="font-semibold tabular-nums">
                        {formatInt(Math.round(r.fett))} g
                      </div>
                    </div>
                    <div className="rounded-lg bg-surface-muted p-2 text-center">
                      <div className="text-xs text-muted-foreground">Kohlenhydrate</div>
                      <div className="font-semibold tabular-nums">
                        {formatInt(Math.round(r.kh))} g
                      </div>
                    </div>
                  </dl>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Gewählt: {PROTEIN[proteinZiel].g.toString().replace(".", ",")} g
                    Eiweiß / kg · 1,0 g Fett / kg · Rest Kohlenhydrate.
                  </p>
                </div>
              </>
            )
          }
          footer={
            <span>
              Formel: Mifflin-St Jeor × Aktivitätsfaktor. Individueller Bedarf kann um
              ±10 % abweichen – wöchentlich Gewicht tracken und Kalorien anpassen.
            </span>
          }
        />
      }
    />
  );
}