import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, parseNumber } from "@/lib/format";

export default function KaufMieteCalculator() {
  // Kauf
  const [preis, setPreis] = useState("400000");
  const [nebenkosten, setNebenkosten] = useState("10"); // %
  const [eigenkapital, setEigenkapital] = useState("80000");
  const [zins, setZins] = useState("3.8");
  const [tilgung, setTilgung] = useState("2");
  const [instand, setInstand] = useState("1"); // % vom Kaufpreis p.a.
  const [wertsteigerung, setWertsteigerung] = useState("2"); // % p.a.
  // Miete
  const [miete, setMiete] = useState("1400");
  const [nebenMiete, setNebenMiete] = useState("250"); // warm/neben, nicht vergleichsrelevant, aber gelistet
  const [mietsteigerung, setMietsteigerung] = useState("2");
  const [renditeAnlage, setRenditeAnlage] = useState("5"); // Anlage EK
  // Rahmen
  const [jahre, setJahre] = useState("15");

  const result = useMemo(() => {
    const P = parseNumber(preis) || 0;
    const nk = (parseNumber(nebenkosten) || 0) / 100;
    const EK = parseNumber(eigenkapital) || 0;
    const iP = (parseNumber(zins) || 0) / 100;
    const tP = (parseNumber(tilgung) || 0) / 100;
    const instP = (parseNumber(instand) || 0) / 100;
    const wP = (parseNumber(wertsteigerung) || 0) / 100;
    const M0 = parseNumber(miete) || 0;
    const mP = (parseNumber(mietsteigerung) || 0) / 100;
    const rP = (parseNumber(renditeAnlage) || 0) / 100;
    const N = Math.max(1, Math.round(parseNumber(jahre) || 0));

    if (P <= 0) return null;

    const kaufNebenkosten = P * nk;
    const darlehen = Math.max(0, P + kaufNebenkosten - EK);
    const annuitaetJahr = darlehen * (iP + tP);
    const kaufrateMonat = annuitaetJahr / 12;
    const instandMonat0 = (P * instP) / 12;

    // Simulation Jahr für Jahr
    let restschuld = darlehen;
    let immobilienwert = P;
    let mieteAktuell = M0;
    // Mieter investiert EK und die monatliche Differenz zur Kaufbelastung
    let depot = EK;
    let zinsenGesamt = 0;
    let tilgungGesamt = 0;
    let mieteGesamt = 0;

    const iMonat = iP / 12;
    const rMonat = Math.pow(1 + rP, 1 / 12) - 1;

    for (let jahr = 1; jahr <= N; jahr++) {
      const instandMonat = (P * instP * Math.pow(1 + wP, jahr - 1)) / 12;
      for (let m = 0; m < 12; m++) {
        // Tilgung
        const zinsMonat = restschuld * iMonat;
        let tilgungMonat = Math.min(restschuld, kaufrateMonat - zinsMonat);
        if (tilgungMonat < 0) tilgungMonat = 0;
        const zahlungKauf = zinsMonat + tilgungMonat + instandMonat;
        restschuld -= tilgungMonat;
        zinsenGesamt += zinsMonat;
        tilgungGesamt += tilgungMonat;

        // Mieter: zahlt Miete, investiert Differenz
        const zahlungMiete = mieteAktuell;
        mieteGesamt += mieteAktuell;
        const diff = zahlungKauf - zahlungMiete;
        // Depot wächst monatlich, dann Zufluss/Abfluss
        depot = depot * (1 + rMonat);
        depot += diff; // positiv: Mieter spart die Differenz; negativ: Mieter zahlt drauf
      }
      immobilienwert *= 1 + wP;
      mieteAktuell *= 1 + mP;
    }

    const nettoVermoegenKauf = immobilienwert - restschuld;
    const nettoVermoegenMiete = depot;
    const differenz = nettoVermoegenKauf - nettoVermoegenMiete;

    return {
      kaufNebenkosten,
      darlehen,
      kaufrateMonat,
      instandMonat0,
      zinsenGesamt,
      tilgungGesamt,
      restschuld,
      immobilienwert,
      nettoVermoegenKauf,
      nettoVermoegenMiete,
      differenz,
      mieteGesamt,
      depot,
      M0,
      nebenMiete: parseNumber(nebenMiete) || 0,
      N,
    };
  }, [
    preis,
    nebenkosten,
    eigenkapital,
    zins,
    tilgung,
    instand,
    wertsteigerung,
    miete,
    nebenMiete,
    mietsteigerung,
    renditeAnlage,
    jahre,
  ]);

  const kaufBesser = result ? result.differenz > 0 : false;

  return (
    <CalculatorShell
      inputs={
        <>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kauf
          </div>
          <NumberField
            label="Kaufpreis"
            unit="€"
            value={preis}
            onChange={setPreis}
            min={0}
            step={10000}
          />
          <NumberField
            label="Kaufnebenkosten"
            unit="%"
            value={nebenkosten}
            onChange={setNebenkosten}
            min={0}
            max={20}
            step={0.5}
            hint="Grunderwerb-, Notar-, Makler-, Grundbuchkosten (ca. 8 – 12 %)."
          />
          <NumberField
            label="Eigenkapital"
            unit="€"
            value={eigenkapital}
            onChange={setEigenkapital}
            min={0}
            step={5000}
          />
          <NumberField
            label="Sollzins"
            unit="% p. a."
            value={zins}
            onChange={setZins}
            min={0}
            max={15}
            step={0.1}
          />
          <NumberField
            label="Anfangstilgung"
            unit="% p. a."
            value={tilgung}
            onChange={setTilgung}
            min={0.5}
            max={10}
            step={0.5}
          />
          <NumberField
            label="Instandhaltung"
            unit="% p. a."
            value={instand}
            onChange={setInstand}
            min={0}
            max={5}
            step={0.1}
            hint="Rücklage für Reparaturen, oft ~1 % vom Kaufpreis."
          />
          <NumberField
            label="Wertsteigerung Immobilie"
            unit="% p. a."
            value={wertsteigerung}
            onChange={setWertsteigerung}
            min={-5}
            max={10}
            step={0.1}
          />

          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Miete
          </div>
          <NumberField
            label="Kaltmiete"
            unit="€/Monat"
            value={miete}
            onChange={setMiete}
            min={0}
            step={50}
          />
          <NumberField
            label="Mietsteigerung"
            unit="% p. a."
            value={mietsteigerung}
            onChange={setMietsteigerung}
            min={0}
            max={10}
            step={0.1}
          />
          <NumberField
            label="Rendite Geldanlage"
            unit="% p. a."
            value={renditeAnlage}
            onChange={setRenditeAnlage}
            min={0}
            max={15}
            step={0.1}
            hint="Rendite auf Eigenkapital und monatliche Ersparnis, z. B. ETF."
          />
          <NumberField
            label="Nebenkosten (nur Info)"
            unit="€/Monat"
            value={nebenMiete}
            onChange={setNebenMiete}
            min={0}
            step={10}
            hint="Fallen bei Kauf und Miete ähnlich an, sind daher nicht Teil des Vergleichs."
          />

          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Vergleichszeitraum
          </div>
          <NumberField
            label="Zeitraum"
            unit="Jahre"
            value={jahre}
            onChange={setJahre}
            min={1}
            max={50}
            step={1}
          />
        </>
      }
      result={
        <ResultCard
          label={result ? (kaufBesser ? "Kaufen lohnt sich" : "Mieten lohnt sich") : "–"}
          value={
            result
              ? `${kaufBesser ? "+" : "−"}${formatCurrency(Math.abs(result.differenz))}`
              : "–"
          }
          badge={
            result
              ? {
                  label: `Nach ${result.N} Jahren`,
                  tone: kaufBesser ? "success" : "info",
                }
              : undefined
          }
          description={
            result && (
              <>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt className="font-medium text-foreground">Kauf</dt>
                  <dd />
                  <dt>Darlehen</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(result.darlehen)}</dd>
                  <dt>Kaufnebenkosten</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.kaufNebenkosten)}
                  </dd>
                  <dt>Monatsrate (Kredit)</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.kaufrateMonat)}
                  </dd>
                  <dt>Instandhaltung / Monat</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.instandMonat0)}
                  </dd>
                  <dt>Immobilienwert nach {result.N} J.</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.immobilienwert)}
                  </dd>
                  <dt>Restschuld</dt>
                  <dd className="text-right tabular-nums">−{formatCurrency(result.restschuld)}</dd>
                  <dt className="font-medium">Nettovermögen Kauf</dt>
                  <dd className="text-right font-medium tabular-nums">
                    {formatCurrency(result.nettoVermoegenKauf)}
                  </dd>

                  <dt className="mt-3 font-medium text-foreground">Miete</dt>
                  <dd />
                  <dt>Startmiete / Monat</dt>
                  <dd className="text-right tabular-nums">{formatCurrency(result.M0)}</dd>
                  <dt>Miete gesamt gezahlt</dt>
                  <dd className="text-right tabular-nums">
                    {formatCurrency(result.mieteGesamt)}
                  </dd>
                  <dt className="font-medium">Depotwert (EK + Ersparnis)</dt>
                  <dd className="text-right font-medium tabular-nums">
                    {formatCurrency(result.depot)}
                  </dd>
                </dl>
              </>
            )
          }
          footer={
            <span>
              Vereinfachter Vergleich ohne Steuern, Sonderabschreibungen oder individuelle
              Förderungen. Die tatsächliche Entscheidung hängt stark von Lage, persönlicher Situation
              und Marktbedingungen ab.
            </span>
          }
        />
      }
    />
  );
}