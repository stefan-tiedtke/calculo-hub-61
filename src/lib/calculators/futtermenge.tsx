import { useId, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatInt, formatNumber, parseNumber } from "@/lib/format";

// ---------------------------------------------------------------------------
// Futtermengen-Rechner für typische Haustiere
// ---------------------------------------------------------------------------

type PetType = "hund" | "katze" | "kaninchen" | "meerschweinchen" | "hamster" | "vogel";
type ActivityLevel = "niedrig" | "normal" | "hoch";
type FoodType = "trocken" | "nass" | "barf";

interface PetInfo {
  label: string;
  emoji: string;
  weightHint: string;
  weightMin: number;
  weightMax: number;
  weightStep: number;
  needsActivity: boolean;
  needsFoodType: boolean;
}

const PETS: Record<PetType, PetInfo> = {
  hund: {
    label: "Hund",
    emoji: "🐕",
    weightHint: "Idealerweise das aktuelle Körpergewicht verwenden.",
    weightMin: 0.5,
    weightMax: 100,
    weightStep: 0.5,
    needsActivity: true,
    needsFoodType: true,
  },
  katze: {
    label: "Katze",
    emoji: "🐈",
    weightHint: "Idealerweise das aktuelle Körpergewicht verwenden.",
    weightMin: 0.5,
    weightMax: 15,
    weightStep: 0.1,
    needsActivity: true,
    needsFoodType: true,
  },
  kaninchen: {
    label: "Kaninchen",
    emoji: "🐇",
    weightHint: "Durchschnittlich wiegt ein Kaninchen 1,5 – 3 kg.",
    weightMin: 0.3,
    weightMax: 8,
    weightStep: 0.1,
    needsActivity: false,
    needsFoodType: false,
  },
  meerschweinchen: {
    label: "Meerschweinchen",
    emoji: "🐹",
    weightHint: "Durchschnittlich wiegt ein Meerschweinchen 0,7 – 1,2 kg.",
    weightMin: 0.2,
    weightMax: 2,
    weightStep: 0.05,
    needsActivity: false,
    needsFoodType: false,
  },
  hamster: {
    label: "Hamster / Nager",
    emoji: "🐹",
    weightHint: "Gewicht dient nur der Orientierung; die Menge ist weitgehend fix.",
    weightMin: 0.01,
    weightMax: 0.3,
    weightStep: 0.01,
    needsActivity: false,
    needsFoodType: false,
  },
  vogel: {
    label: "Vogel (Wellensittich/Kanarienvogel)",
    emoji: "🐦",
    weightHint: "Gewicht dient nur der Orientierung; die Menge ist weitgehend fix.",
    weightMin: 0.02,
    weightMax: 0.15,
    weightStep: 0.01,
    needsActivity: false,
    needsFoodType: false,
  },
};

const FOOD_TYPES: Record<FoodType, { label: string; kcalPer100g: number }> = {
  trocken: { label: "Trockenfutter", kcalPer100g: 360 },
  nass: { label: "Nassfutter", kcalPer100g: 100 },
  barf: { label: "Barf / Frischfutter", kcalPer100g: 140 },
};

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "niedrig", label: "Wenig aktiv" },
  { value: "normal", label: "Normal aktiv" },
  { value: "hoch", label: "Sehr aktiv" },
];

/** Ruhe-Energiebedarf nach der gängigen Formel RER = 70 × kg^0,75. */
function restingEnergyRequirement(weightKg: number): number {
  return 70 * Math.pow(weightKg, 0.75);
}

interface CalculationResult {
  gramsPerDay: number;
  minGrams: number;
  maxGrams: number;
  kcalPerDay: number;
  foodType?: FoodType;
  activity?: ActivityLevel;
  note: string;
}

function calculateFoodAmount(
  pet: PetType,
  weightKg: number,
  activity: ActivityLevel,
  foodType: FoodType,
): CalculationResult {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return {
      gramsPerDay: 0,
      minGrams: 0,
      maxGrams: 0,
      kcalPerDay: 0,
      note: "Gib ein gültiges Gewicht ein.",
    };
  }

  switch (pet) {
    case "hund": {
      const rer = restingEnergyRequirement(weightKg);
      const factor =
        activity === "niedrig" ? 1.4 : activity === "normal" ? 1.8 : 2.2;
      const kcal = rer * factor;
      const kcalPer100g = FOOD_TYPES[foodType].kcalPer100g;
      const grams = (kcal / kcalPer100g) * 100;
      // ±15 % als Bandbreite
      return {
        gramsPerDay: grams,
        minGrams: grams * 0.85,
        maxGrams: grams * 1.15,
        kcalPerDay: kcal,
        foodType,
        activity,
        note: "Bei Welpen, trächtigen Hündinnen oder besonderen Krankheiten bitte den Tierarzt fragen.",
      };
    }
    case "katze": {
      const rer = restingEnergyRequirement(weightKg);
      const factor =
        activity === "niedrig" ? 1.1 : activity === "normal" ? 1.3 : 1.5;
      const kcal = rer * factor;
      const kcalPer100g = FOOD_TYPES[foodType].kcalPer100g;
      const grams = (kcal / kcalPer100g) * 100;
      return {
        gramsPerDay: grams,
        minGrams: grams * 0.85,
        maxGrams: grams * 1.15,
        kcalPerDay: kcal,
        foodType,
        activity,
        note: "Kastraten und ältere Katzen haben oft einen geringeren Bedarf. Bei Übergewicht langsam reduzieren.",
      };
    }
    case "kaninchen": {
      const pellets = weightKg * 25;
      return {
        gramsPerDay: pellets,
        minGrams: pellets * 0.8,
        maxGrams: pellets * 1.2,
        kcalPerDay: 0,
        note: "Heu und frisches Grünzeug sollten immer unbegrenzt verfügbar sein. Die berechnete Menge bezieht sich auf Pellets/Körner.",
      };
    }
    case "meerschweinchen": {
      const pellets = weightKg * 40;
      return {
        gramsPerDay: pellets,
        minGrams: pellets * 0.75,
        maxGrams: pellets * 1.25,
        kcalPerDay: 0,
        note: "Heu und frisches Gemüse sind die Basis. Die berechnete Menge bezieht sich auf Pellets.",
      };
    }
    case "hamster": {
      return {
        gramsPerDay: 12,
        minGrams: 10,
        maxGrams: 15,
        kcalPerDay: 0,
        note: "Ergänzend dürfen kleine Mengen frisches Obst oder Gemüse angeboten werden.",
      };
    }
    case "vogel": {
      return {
        gramsPerDay: 12,
        minGrams: 10,
        maxGrams: 15,
        kcalPerDay: 0,
        note: "Saatgutmischung ist das Hauptfutter; frisches Wasser und gelegentlich Grünfutter ergänzen die Ernährung.",
      };
    }
  }
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

export default function FuttermengeCalculator() {
  const [pet, setPet] = useState<PetType>("hund");
  const [weightStr, setWeightStr] = useState("15");
  const [activity, setActivity] = useState<ActivityLevel>("normal");
  const [foodType, setFoodType] = useState<FoodType>("trocken");

  const petInfo = PETS[pet];

  const result = useMemo(() => {
    const weight = parseNumber(weightStr);
    return calculateFoodAmount(pet, weight, activity, foodType);
  }, [pet, weightStr, activity, foodType]);

  const hasValidResult = result.gramsPerDay > 0;

  const inputs = (
    <div className="space-y-5">
      <SelectField
        label="Tierart"
        value={pet}
        onChange={(v) => setPet(v as PetType)}
        options={(Object.keys(PETS) as PetType[]).map((k) => ({
          value: k,
          label: `${PETS[k].emoji} ${PETS[k].label}`,
        }))}
        hint="Wähle die Art deines Haustiers aus."
      />

      <NumberField
        label="Gewicht"
        unit="kg"
        value={weightStr}
        onChange={setWeightStr}
        min={petInfo.weightMin}
        max={petInfo.weightMax}
        step={petInfo.weightStep}
        placeholder="z. B. 15"
        hint={petInfo.weightHint}
      />

      {petInfo.needsActivity && (
        <SegmentedControl
          label="Aktivitätslevel"
          value={activity}
          onChange={(v) => setActivity(v)}
          options={ACTIVITY_OPTIONS}
        />
      )}

      {petInfo.needsFoodType && (
        <SelectField
          label="Futtertyp"
          value={foodType}
          onChange={(v) => setFoodType(v as FoodType)}
          options={(Object.keys(FOOD_TYPES) as FoodType[]).map((k) => ({
            value: k,
            label: FOOD_TYPES[k].label,
          }))}
          hint="Die Energiedichte unterscheidet sich je nach Futterart deutlich."
        />
      )}
    </div>
  );

  const resultView = (
    <div className="space-y-5">
      <ResultCard
        label="Empfohlene Tagesmenge"
        value={hasValidResult ? formatInt(result.gramsPerDay) : "–"}
        unit="g / Tag"
        badge={
          hasValidResult
            ? {
                label: `${PETS[pet].emoji} ${PETS[pet].label}`,
                tone: "info",
              }
            : undefined
        }
        description={
          hasValidResult
            ? result.note
            : "Gib ein gültiges Gewicht ein, um die Futtermenge zu berechnen."
        }
        footer={
          hasValidResult ? (
            <span>
              {result.minGrams > 0 && result.maxGrams > 0 && (
                <>Typische Bandbreite: {formatInt(result.minGrams)} – {formatInt(result.maxGrams)} g / Tag</>
              )}
              {result.kcalPerDay > 0 && (
                <>
                  {" "}
                  · Energiebedarf: ~{formatInt(result.kcalPerDay)} kcal / Tag
                </>
              )}
            </span>
          ) : undefined
        }
      />

      {hasValidResult && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 text-sm font-medium text-foreground">
            Fütterungstipp
          </div>
          <p className="text-sm text-muted-foreground">
            {pet === "hund" || pet === "katze"
              ? "Teile die Tagesration auf zwei bis drei Mahlzeiten auf. Achte auf frisches Wasser und passe die Menge an Körperkondition und Gewichtsentwicklung an."
              : pet === "kaninchen" || pet === "meerschweinchen"
                ? "Unbegrenztes Heu ist die wichtigste Mahlzeit. Pellets und Gemüse ergänzen den Bedarf an Vitaminen und Mineralien."
                : "Füttere täglich eine frische Portion und entferne Reste, damit das Futter nicht schimmelt."}
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Hinweis: Die berechneten Werte sind Richtwerte für gesunde, ausgewachsene
        Tiere. Individueller Bedarf, Rasse, Alter, Gesundheit und spezielles Futter
        können die Menge deutlich beeinflussen. Bei Unsicherheit frag deinen
        Tierarzt oder einen Tierfachberater.
      </p>
    </div>
  );

  return (
    <>
      <CalculatorShell inputs={inputs} result={resultView} />

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Explain
          title="Hunde & Katzen"
          body="Der Rechner nutzt den Ruhe-Energiebedarf (RER = 70 × kg^0,75) und einen Aktivitätsfaktor. Je nach Futtertyp (Trocken-, Nass- oder Barf) ergibt sich daraus die tägliche Futtermenge in Gramm."
        />
        <Explain
          title="Kleintiere"
          body="Kaninchen und Meerschweinchen erhalten unbegrenzt Heu. Die berechnete Grammangabe bezieht sich auf Pellets. Bei Hamstern und Vögeln ist die Menge weitgehend unabhängig vom Gewicht."
        />
        <Explain
          title="Aktivität"
          body="Ein sehr aktives Tier oder ein Welpe/Kitten benötigt mehr Energie. Kastrierte, ältere oder wenig bewegte Tiere brauchen oft weniger. Beobachte Gewicht und Körperkondition."
        />
        <Explain
          title="Futterumstellung"
          body="Bei einem Wechsel des Futters solltest du die neue Sorte über mehrere Tage langsam steigern, um Verdauungsprobleme zu vermeiden."
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
