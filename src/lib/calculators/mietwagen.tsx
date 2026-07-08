import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, parseNumber } from "@/lib/format";

export default function MietwagenCalculator() {
  const [tage, setTage] = useState("7");
  const [mietProTag, setMietProTag] = useState("45");
  const [versicherung, setVersicherung] = useState("12"); // €/Tag (Vollkasko-Zusatz)
  const [kmProTag, setKmProTag] = useState("150");
  const [verbrauch, setVerbrauch] = useState("6.5"); // l/100km
  const [spritpreis, setSpritpreis] = useState("1.75"); // €/l
  const [maut, setMaut] = useState("30"); // gesamt
  const [parken, setParken] = useState("15"); // €/Tag
  const [zusatz, setZusatz] = useState("0"); // Zusatzfahrer, Kindersitz etc.

  const r = useMemo(() => {
    const d = Math.max(1, parseNumber(tage) || 1);
    const kMiete = (parseNumber(mietProTag) || 0) * d;
    const kVers = (parseNumber(versicherung) || 0) * d;
    const km = (parseNumber(kmProTag) || 0) * d;
    const liter = (km * (parseNumber(verbrauch) || 0)) / 100;
    const kSprit = liter * (parseNumber(spritpreis) || 0);
    const kMaut = parseNumber(maut) || 0;
    const kPark = (parseNumber(parken) || 0) * d;
    const kZusatz = parseNumber(zusatz) || 0;
    const gesamt = kMiete + kVers + kSprit + kMaut + kPark + kZusatz;

    return {
      d,
      km,
      liter,
      kMiete,
      kVers,
      kSprit,
      kMaut,
      kPark,
      kZusatz,
      gesamt,
      proTag: gesamt / d,
      proKm: km > 0 ? gesamt / km : 0,
    };
  }, [tage, mietProTag, versicherung, kmProTag, verbrauch, spritpreis, maut, parken, zusatz]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Mietdauer"
            unit="Tage"
            value={tage}
            onChange={setTage}
            min={1}
            step={1}
          />
          <NumberField
            label="Mietpreis"
            unit="€/Tag"
            value={mietProTag}
            onChange={setMietProTag}
            min={0}
            step={5}
            hint="Grundpreis laut Buchung, ohne Zusatzversicherung."
          />
          <NumberField
            label="Versicherung (Zusatz)"
            unit="€/Tag"
            value={versicherung}
            onChange={setVersicherung}
            min={0}
            step={1}
            hint="Vollkasko ohne Selbstbeteiligung, Diebstahlschutz o. Ä."
          />
          <NumberField
            label="Fahrleistung"
            unit="km/Tag"
            value={kmProTag}
            onChange={setKmProTag}
            min={0}
            step={10}
          />
          <NumberField
            label="Verbrauch"
            unit="l/100 km"
            value={verbrauch}
            onChange={setVerbrauch}
            min={0}
            step={0.1}
          />
          <NumberField
            label="Kraftstoffpreis"
            unit="€/Liter"
            value={spritpreis}
            onChange={setSpritpreis}
            min={0}
            step={0.01}
          />
          <NumberField
            label="Maut"
            unit="€ gesamt"
            value={maut}
            onChange={setMaut}
            min={0}
            step={5}
            hint="Autobahnvignetten, Streckenmaut, Stadtmaut."
          />
          <NumberField
            label="Parkgebühren"
            unit="€/Tag"
            value={parken}
            onChange={setParken}
            min={0}
            step={1}
          />
          <NumberField
            label="Zusatzkosten"
            unit="€ gesamt"
            value={zusatz}
            onChange={setZusatz}
            min={0}
            step={10}
            hint="Zusatzfahrer, Kindersitz, Navi, Flughafengebühr."
          />
        </>
      }
      result={
        <ResultCard
          label="Mietwagen gesamt"
          value={formatCurrency(r.gesamt)}
          badge={{
            label: `${formatCurrency(r.proTag)} / Tag`,
            tone: "info",
          }}
          description={
            <>
              <p className="text-sm">
                Der Mietwagen kostet dich insgesamt{" "}
                <strong className="text-foreground">{formatCurrency(r.gesamt)}</strong>.
              </p>
              <div className="mt-4 border-t pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Aufschlüsselung
                </p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt>Mietpreis ({r.d} Tage)</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kMiete)}</dd>
                  <dt>Versicherung</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kVers)}</dd>
                  <dt>
                    Kraftstoff (
                    {r.liter.toLocaleString("de-DE", { maximumFractionDigits: 0 })} l)
                  </dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kSprit)}</dd>
                  <dt>Maut</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kMaut)}</dd>
                  <dt>Parken</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(r.kPark)}</dd>
                  {r.kZusatz > 0 && (
                    <>
                      <dt>Zusatzkosten</dt>
                      <dd className="text-right tabular-nums">
                        {formatCurrency(r.kZusatz)}
                      </dd>
                    </>
                  )}
                  <dt className="pt-2">Kosten pro km</dt>
                  <dd className="pt-2 text-right tabular-nums">
                    {formatCurrency(r.proKm)}
                  </dd>
                </dl>
              </div>
            </>
          }
          footer={
            <span>
              Richtwerte in € brutto. Endgültige Kosten hängen von Mietstation,
              Selbstbeteiligung, Rückgabezustand und Tankregelung ab.
            </span>
          }
        />
      }
    />
  );
}