import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { parseNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type Klima = "warm" | "gemaessigt" | "kalt";

const AKTIVITAETEN = [
  { id: "strand", label: "Strand & Baden" },
  { id: "wandern", label: "Wandern & Natur" },
  { id: "staedte", label: "Städtetrip" },
  { id: "business", label: "Business" },
  { id: "ausgehen", label: "Ausgehen / Restaurants" },
  { id: "sport", label: "Sport & Fitness" },
  { id: "ski", label: "Ski & Winter" },
  { id: "camping", label: "Camping" },
  { id: "foto", label: "Fotografie" },
] as const;

type ActId = (typeof AKTIVITAETEN)[number]["id"];

interface Item {
  name: string;
  qty?: number;
}

interface Group {
  title: string;
  items: Item[];
}

function buildList(
  ziel: string,
  klima: Klima,
  tage: number,
  acts: Set<ActId>,
): Group[] {
  const d = Math.max(1, tage);
  const flug = /flug|usa|asien|afrika|amerika|australien|thailand|japan|bali|mexi|kanad/i.test(
    ziel,
  );
  const ausland = flug || /ausland|europa|italien|spanien|frankreich|griech|türk|kroatien|portugal|england|uk/i.test(ziel);

  const groups: Group[] = [];

  // Dokumente
  const dokumente: Item[] = [
    { name: "Personalausweis" },
    { name: "Bargeld & Kreditkarte" },
    { name: "Krankenversicherungskarte" },
  ];
  if (ausland) dokumente.push({ name: "Reisepass (Gültigkeit prüfen)" });
  if (flug) {
    dokumente.push({ name: "Flugtickets / Boarding-Pass" });
    dokumente.push({ name: "Auslandskrankenversicherung" });
  }
  dokumente.push({ name: "Buchungsbestätigung Unterkunft" });
  if (acts.has("business")) dokumente.push({ name: "Visitenkarten" });
  groups.push({ title: "Dokumente & Geld", items: dokumente });

  // Kleidung — skaliert mit Dauer
  const shirts = Math.min(d, 7);
  const unterwaesche = Math.min(d + 1, 10);
  const socken = Math.min(d + 1, 10);
  const hosen = Math.max(2, Math.min(Math.ceil(d / 3), 5));

  const kleidung: Item[] = [
    { name: "T-Shirts / Oberteile", qty: shirts },
    { name: "Unterwäsche", qty: unterwaesche },
    { name: "Socken", qty: socken },
    { name: "Hosen", qty: hosen },
    { name: "Pyjama / Schlafshirt", qty: 1 },
  ];
  if (klima === "warm") {
    kleidung.push({ name: "Shorts", qty: 2 });
    kleidung.push({ name: "Leichte Jacke / Cardigan", qty: 1 });
    kleidung.push({ name: "Sonnenhut / Cap" });
    kleidung.push({ name: "Sonnenbrille" });
  }
  if (klima === "gemaessigt") {
    kleidung.push({ name: "Pullover / Sweatshirt", qty: 2 });
    kleidung.push({ name: "Übergangsjacke", qty: 1 });
    kleidung.push({ name: "Regenjacke oder Regenschirm" });
  }
  if (klima === "kalt") {
    kleidung.push({ name: "Warme Pullover", qty: 3 });
    kleidung.push({ name: "Winterjacke", qty: 1 });
    kleidung.push({ name: "Mütze, Schal, Handschuhe" });
    kleidung.push({ name: "Thermounterwäsche", qty: 2 });
    kleidung.push({ name: "Warme Wintersocken", qty: 4 });
  }
  kleidung.push({ name: "Bequeme Schuhe (Sneaker)" });
  if (acts.has("business")) {
    kleidung.push({ name: "Business-Outfit", qty: Math.max(1, Math.ceil(d / 3)) });
    kleidung.push({ name: "Elegante Schuhe" });
  }
  if (acts.has("ausgehen")) kleidung.push({ name: "Ausgeh-Outfit", qty: 1 });
  groups.push({ title: "Kleidung", items: kleidung });

  // Aktivitäten
  const aktItems: Item[] = [];
  if (acts.has("strand")) {
    aktItems.push({ name: "Badebekleidung", qty: 2 });
    aktItems.push({ name: "Strandhandtuch" });
    aktItems.push({ name: "Flip-Flops / Badeschuhe" });
    aktItems.push({ name: "Schnorchel (optional)" });
  }
  if (acts.has("wandern")) {
    aktItems.push({ name: "Wanderschuhe" });
    aktItems.push({ name: "Wanderrucksack (Daypack)" });
    aktItems.push({ name: "Funktionsshirts", qty: 2 });
    aktItems.push({ name: "Trinkflasche" });
    aktItems.push({ name: "Blasenpflaster" });
  }
  if (acts.has("sport")) {
    aktItems.push({ name: "Sportkleidung", qty: 2 });
    aktItems.push({ name: "Sportschuhe" });
  }
  if (acts.has("ski")) {
    aktItems.push({ name: "Skianzug / Skihose & Jacke" });
    aktItems.push({ name: "Skibrille" });
    aktItems.push({ name: "Skihelm (falls nicht Leihe)" });
    aktItems.push({ name: "Skisocken", qty: 3 });
  }
  if (acts.has("camping")) {
    aktItems.push({ name: "Zelt" });
    aktItems.push({ name: "Schlafsack & Isomatte" });
    aktItems.push({ name: "Stirnlampe" });
    aktItems.push({ name: "Taschenmesser" });
    aktItems.push({ name: "Campingkocher & Geschirr" });
  }
  if (acts.has("foto")) {
    aktItems.push({ name: "Kamera & Objektive" });
    aktItems.push({ name: "Ersatzakku & Speicherkarten" });
    aktItems.push({ name: "Stativ (optional)" });
  }
  if (acts.has("staedte")) {
    aktItems.push({ name: "Kleiner Tagesrucksack" });
    aktItems.push({ name: "Reiseführer / Offline-Karten" });
  }
  if (aktItems.length) groups.push({ title: "Aktivitäten", items: aktItems });

  // Hygiene
  const hygiene: Item[] = [
    { name: "Zahnbürste & Zahnpasta" },
    { name: "Deo" },
    { name: "Duschgel & Shampoo" },
    { name: "Bürste / Kamm" },
    { name: "Handtuch (falls Unterkunft keins stellt)" },
    { name: "Rasierer" },
    { name: "Nagelschere / Pinzette" },
  ];
  if (klima === "warm" || acts.has("strand")) {
    hygiene.push({ name: "Sonnencreme (hoher LSF)" });
    hygiene.push({ name: "After-Sun-Lotion" });
    hygiene.push({ name: "Insektenschutz" });
  }
  if (klima === "kalt") hygiene.push({ name: "Lippenpflege & Handcreme" });
  hygiene.push({ name: "Reiseapotheke (Pflaster, Schmerzmittel)" });
  hygiene.push({ name: "Persönliche Medikamente" });
  groups.push({ title: "Hygiene & Gesundheit", items: hygiene });

  // Elektronik
  const elektronik: Item[] = [
    { name: "Handy & Ladekabel" },
    { name: "Kopfhörer" },
    { name: "Powerbank" },
  ];
  if (ausland) elektronik.push({ name: "Reiseadapter / Steckdosenadapter" });
  if (acts.has("business")) elektronik.push({ name: "Laptop & Ladegerät" });
  if (d >= 5) elektronik.push({ name: "E-Reader / Buch" });
  groups.push({ title: "Elektronik", items: elektronik });

  // Sonstiges
  const sonst: Item[] = [
    { name: "Kleiner Kulturbeutel / Beutel für Schmutzwäsche" },
    { name: "Wiederverwendbare Einkaufstasche" },
    { name: "Snacks für unterwegs" },
  ];
  if (flug) {
    sonst.push({ name: "Handgepäck-Flüssigkeiten in 100-ml-Beutel" });
    sonst.push({ name: "Nackenkissen für den Flug" });
  }
  groups.push({ title: "Sonstiges", items: sonst });

  return groups;
}

export default function PacklisteCalculator() {
  const [ziel, setZiel] = useState("");
  const [klima, setKlima] = useState<Klima>("gemaessigt");
  const [tage, setTage] = useState("7");
  const [acts, setActs] = useState<Set<ActId>>(new Set(["staedte"]));
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const groups = useMemo(
    () => buildList(ziel, klima, parseNumber(tage) || 0, acts),
    [ziel, klima, tage, acts],
  );

  const total = useMemo(
    () => groups.reduce((sum, g) => sum + g.items.length, 0),
    [groups],
  );

  const toggleAct = (id: ActId) => {
    setActs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleItem = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <CalculatorShell
      layout="input-heavy"
      inputs={
        <>
          <div className="space-y-1.5">
            <label
              htmlFor="reiseziel"
              className="text-sm font-medium text-foreground"
            >
              Reiseziel
            </label>
            <input
              id="reiseziel"
              type="text"
              value={ziel}
              onChange={(e) => setZiel(e.target.value)}
              placeholder="z. B. Thailand, Berlin, Norwegen …"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="text-xs text-muted-foreground">
              Wird für Hinweise zu Reisepass, Adapter & Flug ausgewertet.
            </p>
          </div>

          <SegmentedControl
            label="Klima am Reiseziel"
            value={klima}
            onChange={setKlima}
            options={[
              { value: "warm", label: "Warm" },
              { value: "gemaessigt", label: "Gemäßigt" },
              { value: "kalt", label: "Kalt" },
            ]}
          />

          <NumberField
            label="Reisedauer"
            unit="Tage"
            value={tage}
            onChange={setTage}
            min={1}
            max={90}
            step={1}
          />

          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Aktivitäten</div>
            <div className="flex flex-wrap gap-2">
              {AKTIVITAETEN.map((a) => {
                const active = acts.has(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAct(a.id)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-input bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Mehrfachauswahl möglich – die Liste passt sich automatisch an.
            </p>
          </div>
        </>
      }
      result={
        <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Deine Packliste
              </div>
              <div className="font-display text-3xl font-semibold tracking-tight text-foreground">
                {total} Punkte
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {checked.size} / {total} erledigt
            </div>
          </div>

          <div className="space-y-5">
            {groups.map((g) => (
              <div key={g.title}>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {g.title}
                </h3>
                <ul className="space-y-1.5">
                  {g.items.map((item) => {
                    const key = `${g.title}::${item.name}`;
                    const isChecked = checked.has(key);
                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem(key)}
                            className="h-4 w-4 accent-brand"
                          />
                          <span
                            className={cn(
                              isChecked && "text-muted-foreground line-through",
                            )}
                          >
                            {item.name}
                            {item.qty ? (
                              <span className="ml-1 text-muted-foreground">
                                × {item.qty}
                              </span>
                            ) : null}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Die Liste ist ein Vorschlag auf Basis von Klima, Dauer und Aktivitäten. Prüfe
            zusätzlich Visum, Impfungen und Zoll­bestimmungen für dein Reiseziel.
          </p>
        </div>
      }
    />
  );
}