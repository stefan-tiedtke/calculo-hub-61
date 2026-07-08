import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

// Rechengrößen 2025 (gesetzliche Rentenversicherung)
const DURCHSCHNITTSENTGELT_2025 = 50493; // € brutto/Jahr (vorläufig 2025)
const RENTENWERT_2025 = 39.32; // € pro Entgeltpunkt (aktueller Rentenwert West = Ost)
const REGELALTERSGRENZE = 67;
const ABSCHLAG_PRO_MONAT = 0.003; // 0,3 % pro Monat Vorziehen
const ZUSCHLAG_PRO_MONAT = 0.005; // 0,5 % pro Monat Aufschub

export default function RenteCalculator() {
  const [brutto, setBrutto] = useState("4000"); // Monatsbrutto
  const [alter, setAlter] = useState("35");
  const [renteneintritt, setRenteneintritt] = useState("67");
  const [beitragsjahre, setBeitragsjahre] = useState("10"); // bereits geleistet
  const [rentenSteigerung, setRentenSteigerung] = useState("1.5"); // % p. a.
  const [inflation, setInflation] = useState("2");

  const result = useMemo(() => {
    const bMonat = parseNumber(brutto);
    const bJahr = bMonat * 12;
    const alt = parseNumber(alter);
    const rEintritt = parseNumber(renteneintritt);
    const bereits = parseNumber(beitragsjahre);
    const steig = parseNumber(rentenSteigerung) / 100;
    const infl = parseNumber(inflation) / 100;

    if (
      !Number.isFinite(bMonat) ||
      !Number.isFinite(alt) ||
      !Number.isFinite(rEintritt) ||
      !Number.isFinite(bereits) ||
      bMonat <= 0 ||
      rEintritt <= alt
    )
      return null;

    const jahreBisRente = rEintritt - alt;
    const zukuenftigeJahre = Math.max(0, jahreBisRente);
    const gesamteBeitragsjahre = bereits + zukuenftigeJahre;

    // Entgeltpunkte pro Jahr (vereinfachtes Modell, konstantes Gehalt in EP-Berechnung)
    const epProJahr = Math.min(bJahr / DURCHSCHNITTSENTGELT_2025, 2.1);
    const entgeltpunkte = epProJahr * gesamteBeitragsjahre;

    // Zugangsfaktor (Abschläge/Zuschläge)
    const monateAbweichung = (rEintritt - REGELALTERSGRENZE) * 12;
    let zugangsfaktor = 1;
    if (monateAbweichung < 0) zugangsfaktor = 1 + monateAbweichung * ABSCHLAG_PRO_MONAT;
    else if (monateAbweichung > 0) zugangsfaktor = 1 + monateAbweichung * ZUSCHLAG_PRO_MONAT;

    // Zukünftiger Rentenwert (mit angenommener Anpassung)
    const rentenwertZukunft = RENTENWERT_2025 * Math.pow(1 + steig, zukuenftigeJahre);

    // Nominale Bruttorente pro Monat zum Zeitpunkt Renteneintritt
    const bruttoRenteNominal = entgeltpunkte * zugangsfaktor * rentenwertZukunft;

    // In heutiger Kaufkraft (real)
    const bruttoRenteReal = bruttoRenteNominal / Math.pow(1 + infl, zukuenftigeJahre);

    // Netto ~ 88 % (KV/PV der Rentner ≈ 11–12 %, Steuer je nach Höhe individuell → grobe Schätzung)
    const nettoRenteReal = bruttoRenteReal * 0.88;

    // Rentenlücke ggü. heutigem Netto (grob: 65 % vom Brutto als Referenz-Netto)
    const heutigesNettoRef = bMonat * 0.65;
    const luecke = Math.max(0, heutigesNettoRef - nettoRenteReal);
    const rentenniveau = (bruttoRenteReal / bMonat) * 100;

    return {
      bruttoRenteNominal,
      bruttoRenteReal,
      nettoRenteReal,
      entgeltpunkte,
      zugangsfaktor,
      rentenwertZukunft,
      gesamteBeitragsjahre,
      luecke,
      rentenniveau,
      jahreBisRente,
    };
  }, [brutto, alter, renteneintritt, beitragsjahre, rentenSteigerung, inflation]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Aktuelles Bruttogehalt"
            value={brutto}
            onChange={setBrutto}
            unit="€ / Monat"
            min={0}
            step={100}
            hint="Wird zur Ermittlung der jährlichen Entgeltpunkte genutzt."
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Aktuelles Alter"
              value={alter}
              onChange={setAlter}
              unit="J."
              min={16}
              max={80}
              step={1}
            />
            <NumberField
              label="Renteneintritt"
              value={renteneintritt}
              onChange={setRenteneintritt}
              unit="J."
              min={63}
              max={75}
              step={1}
              hint="Regelalter 67. Früher = Abschläge, später = Zuschläge."
            />
          </div>
          <NumberField
            label="Bereits geleistete Beitragsjahre"
            value={beitragsjahre}
            onChange={setBeitragsjahre}
            unit="J."
            min={0}
            step={1}
            hint="Jahre, in denen du bereits in die gesetzliche Rentenversicherung eingezahlt hast."
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Rentenanpassung"
              value={rentenSteigerung}
              onChange={setRentenSteigerung}
              unit="% p. a."
              min={0}
              step={0.1}
            />
            <NumberField
              label="Inflation"
              value={inflation}
              onChange={setInflation}
              unit="% p. a."
              min={0}
              step={0.1}
            />
          </div>
        </>
      }
      result={
        result ? (
          <div className="space-y-4">
            <ResultCard
              label={`Voraussichtliche Bruttorente (heutige Kaufkraft)`}
              value={formatCurrency(result.bruttoRenteReal)}
              unit="/ Monat"
              badge={{
                label: `Rentenniveau ~${formatNumber(result.rentenniveau, 0)} %`,
                tone: result.rentenniveau >= 48 ? "positive" : "warning",
              }}
              description={
                <>
                  Bei Renteneintritt mit {renteneintritt} Jahren in{" "}
                  {result.jahreBisRente} Jahren. Netto ca.{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(result.nettoRenteReal)}/Monat
                  </span>{" "}
                  nach Abzug von Kranken- und Pflegeversicherung.
                </>
              }
              footer={
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Nominale Bruttorente
                    </div>
                    <div className="mt-1 font-medium tabular-nums text-foreground">
                      {formatCurrency(result.bruttoRenteNominal)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Rentenlücke (real)
                    </div>
                    <div className="mt-1 font-medium tabular-nums text-foreground">
                      {formatCurrency(result.luecke)}
                    </div>
                  </div>
                </div>
              }
            />
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-sm font-medium text-foreground">
                Berechnungsdetails
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Entgeltpunkte gesamt</dt>
                <dd className="text-right font-medium tabular-nums">
                  {formatNumber(result.entgeltpunkte, 2)}
                </dd>
                <dt className="text-muted-foreground">Beitragsjahre gesamt</dt>
                <dd className="text-right font-medium tabular-nums">
                  {formatNumber(result.gesamteBeitragsjahre, 0)}
                </dd>
                <dt className="text-muted-foreground">Zugangsfaktor</dt>
                <dd className="text-right font-medium tabular-nums">
                  {formatNumber(result.zugangsfaktor, 3)}
                </dd>
                <dt className="text-muted-foreground">Rentenwert bei Eintritt</dt>
                <dd className="text-right font-medium tabular-nums">
                  {formatCurrency(result.rentenwertZukunft)}
                </dd>
              </dl>
            </div>
          </div>
        ) : (
          <ResultCard
            label="Rente"
            value="–"
            description="Bitte gültige Werte eingeben. Renteneintritt muss über dem aktuellen Alter liegen."
          />
        )
      }
    />
  );
}