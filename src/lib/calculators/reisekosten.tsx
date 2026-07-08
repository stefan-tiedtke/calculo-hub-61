import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, parseNumber } from "@/lib/format";

export default function ReisekostenCalculator() {
  const [personen, setPersonen] = useState("2");
  const [tage, setTage] = useState("10");
  const [unterkunft, setUnterkunft] = useState("100"); // €/Nacht gesamt
  const [verpflegung, setVerpflegung] = useState("35"); // €/Person/Tag
  const [fluege, setFluege] = useState("250"); // €/Person hin+zurück
  const [mietwagen, setMietwagen] = useState("45"); // €/Tag
  const [aktivitaeten, setAktivitaeten] = useState("300"); // € gesamt
  const [sonstiges, setSonstiges] = useState("100"); // Puffer

  const r = useMemo(() => {
    const p = Math.max(1, parseNumber(personen) || 1);
    const d = Math.max(1, parseNumber(tage) || 1);
    const kUnterkunft = (parseNumber(unterkunft) || 0) * d;
    const kVerpflegung = (parseNumber(verpflegung) || 0) * p * d;
    const kFluege = (parseNumber(fluege) || 0) * p;
    const kMietwagen = (parseNumber(mietwagen) || 0) * d;
    const kAktivitaeten = parseNumber(aktivitaeten) || 0;
    const kSonstiges = parseNumber(sonstiges) || 0;
    const gesamt =
      kUnterkunft + kVerpflegung + kFluege + kMietwagen + kAktivitaeten + kSonstiges;
    return {
      p,
      d,
      kUnterkunft,
      kVerpflegung,
      kFluege,
      kMietwagen,
      kAktivitaeten,
      kSonstiges,
      gesamt,
      proPerson: gesamt / p,
      proTag: gesamt / d,
      proPersonProTag: gesamt / p / d,
    };
  }, [personen, tage, unterkunft, verpflegung, fluege, mietwagen, aktivitaeten, sonstiges]);

  return (
    <CalculatorShell
      inputs={
        <>
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Personen"
              value={personen}
              onChange={setPersonen}
              min={1}
              step={1}
            />
            <NumberField
              label="Reisedauer"
              unit="Tage"
              value={tage}
              onChange={setTage}
              min={1}
              step={1}
            />
          </div>
          <NumberField
            label="Unterkunft"
            unit="€/Nacht"
            value={unterkunft}
            onChange={setUnterkunft}
            min={0}
            step={10}
            hint="Gesamter Preis pro Nacht (z. B. Hotelzimmer, Ferienwohnung)."
          />
          <NumberField
            label="Verpflegung"
            unit="€/Person/Tag"
            value={verpflegung}
            onChange={setVerpflegung}
            min={0}
            step={5}
            hint="Frühstück, Mittag, Abend inkl. Getränke."
          />
          <NumberField
            label="Flüge / Anreise"
            unit="€/Person"
            value={fluege}
            onChange={setFluege}
            min={0}
            step={10}
            hint="Hin- und Rückreise pro Person."
          />
          <NumberField
            label="Mietwagen"
            unit="€/Tag"
            value={mietwagen}
            onChange={setMietwagen}
            min={0}
            step={5}
            hint="Inklusive Versicherung; 0 wenn kein Mietwagen."
          />
          <NumberField
            label="Aktivitäten"
            unit="€ gesamt"
            value={aktivitaeten}
            onChange={setAktivitaeten}
            min={0}
            step={50}
            hint="Ausflüge, Eintritte, Touren für die gesamte Reise."
          />
          <NumberField
            label="Sonstiges / Puffer"
            unit="€ gesamt"
            value={sonstiges}
            onChange={setSonstiges}
            min={0}
            step={50}
            hint="Souvenirs, Trinkgelder, unerwartete Ausgaben."
          />
        </>
      }
      result={
        <ResultCard
          label="Gesamtkosten der Reise"
          value={formatCurrency(r.gesamt)}
          badge={{
            label: `${formatCurrency(r.proPerson)} / Person`,
            tone: "info",
          }}
          description={
            <>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Tagesbudget (gesamt)</dt>
                <dd className="text-right tabular-nums">{formatCurrency(r.proTag)}</dd>
                <dt>Tagesbudget pro Person</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(r.proPersonProTag)}
                </dd>
              </dl>
              <div className="mt-4 border-t pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Aufschlüsselung
                </p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt>Unterkunft ({r.d} Nächte)</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kUnterkunft)}</dd>
                  <dt>Verpflegung</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kVerpflegung)}</dd>
                  <dt>Flüge / Anreise</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kFluege)}</dd>
                  <dt>Mietwagen</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kMietwagen)}</dd>
                  <dt>Aktivitäten</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(r.kAktivitaeten)}
                  </dd>
                  <dt>Sonstiges / Puffer</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kSonstiges)}</dd>
                </dl>
              </div>
            </>
          }
          footer={
            <span>
              Richtwerte in € brutto. Wechselkurse, Saisonpreise und lokale Aufschläge
              können abweichen – am besten mit einem Puffer von 10–15 % rechnen.
            </span>
          }
        />
      }
    />
  );
}