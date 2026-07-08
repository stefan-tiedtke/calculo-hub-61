import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { formatCurrency, parseNumber } from "@/lib/format";

export default function EvVsVerbrennerCalculator() {
  const [kmProJahr, setKmProJahr] = useState("15000");
  const [jahre, setJahre] = useState("8");

  // Elektro
  const [evPreis, setEvPreis] = useState("42000");
  const [evVerbrauch, setEvVerbrauch] = useState("18"); // kWh/100km
  const [strompreis, setStrompreis] = useState("35"); // ct/kWh
  const [evVersicherung, setEvVersicherung] = useState("600"); // €/Jahr
  const [evWartung, setEvWartung] = useState("400"); // €/Jahr
  const [evSteuer, setEvSteuer] = useState("0"); // €/Jahr
  const [evRestwert, setEvRestwert] = useState("35"); // % nach N Jahren

  // Verbrenner
  const [vPreis, setVPreis] = useState("32000");
  const [vVerbrauch, setVVerbrauch] = useState("6.5"); // l/100km
  const [kraftstoffPreis, setKraftstoffPreis] = useState("1.75"); // €/L
  const [vVersicherung, setVVersicherung] = useState("700");
  const [vWartung, setVWartung] = useState("800");
  const [vSteuer, setVSteuer] = useState("120");
  const [vRestwert, setVRestwert] = useState("40");

  const result = useMemo(() => {
    const km = parseNumber(kmProJahr) || 0;
    const N = Math.max(1, Math.round(parseNumber(jahre) || 0));

    const evEnergie =
      (km * (parseNumber(evVerbrauch) || 0) * ((parseNumber(strompreis) || 0) / 100)) / 100;
    const vEnergie =
      (km * (parseNumber(vVerbrauch) || 0) * (parseNumber(kraftstoffPreis) || 0)) / 100;

    const evLaufend =
      evEnergie +
      (parseNumber(evVersicherung) || 0) +
      (parseNumber(evWartung) || 0) +
      (parseNumber(evSteuer) || 0);
    const vLaufend =
      vEnergie +
      (parseNumber(vVersicherung) || 0) +
      (parseNumber(vWartung) || 0) +
      (parseNumber(vSteuer) || 0);

    const evP = parseNumber(evPreis) || 0;
    const vP = parseNumber(vPreis) || 0;
    const evRest = evP * ((parseNumber(evRestwert) || 0) / 100);
    const vRest = vP * ((parseNumber(vRestwert) || 0) / 100);

    const evWertverlust = evP - evRest;
    const vWertverlust = vP - vRest;

    const evGesamt = evWertverlust + evLaufend * N;
    const vGesamt = vWertverlust + vLaufend * N;

    const evProKm = (evGesamt / (km * N)) * 100; // ct? nein €/100km
    const vProKm = (vGesamt / (km * N)) * 100;

    return {
      evEnergie,
      vEnergie,
      evLaufend,
      vLaufend,
      evWertverlust,
      vWertverlust,
      evGesamt,
      vGesamt,
      evProKm,
      vProKm,
      differenz: vGesamt - evGesamt,
      N,
      kmGesamt: km * N,
    };
  }, [
    kmProJahr,
    jahre,
    evPreis,
    evVerbrauch,
    strompreis,
    evVersicherung,
    evWartung,
    evSteuer,
    evRestwert,
    vPreis,
    vVerbrauch,
    kraftstoffPreis,
    vVersicherung,
    vWartung,
    vSteuer,
    vRestwert,
  ]);

  const evGuenstiger = result.differenz > 0;

  return (
    <CalculatorShell
      inputs={
        <>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Nutzung
          </div>
          <NumberField
            label="Fahrleistung"
            unit="km/Jahr"
            value={kmProJahr}
            onChange={setKmProJahr}
            min={0}
            step={1000}
          />
          <NumberField
            label="Haltedauer"
            unit="Jahre"
            value={jahre}
            onChange={setJahre}
            min={1}
            max={20}
            step={1}
          />

          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Elektroauto
          </div>
          <NumberField
            label="Kaufpreis"
            unit="€"
            value={evPreis}
            onChange={setEvPreis}
            min={0}
            step={1000}
          />
          <NumberField
            label="Verbrauch"
            unit="kWh/100 km"
            value={evVerbrauch}
            onChange={setEvVerbrauch}
            min={0}
            step={0.5}
          />
          <NumberField
            label="Strompreis"
            unit="ct/kWh"
            value={strompreis}
            onChange={setStrompreis}
            min={0}
            step={0.5}
            hint="Mischpreis Haushalt/Öffentlich, oft 30 – 55 ct/kWh."
          />
          <NumberField
            label="Versicherung"
            unit="€/Jahr"
            value={evVersicherung}
            onChange={setEvVersicherung}
            min={0}
            step={50}
          />
          <NumberField
            label="Wartung / Reparatur"
            unit="€/Jahr"
            value={evWartung}
            onChange={setEvWartung}
            min={0}
            step={50}
          />
          <NumberField
            label="Kfz-Steuer"
            unit="€/Jahr"
            value={evSteuer}
            onChange={setEvSteuer}
            min={0}
            step={10}
            hint="Reine E-Autos sind bis 2030 von der Kfz-Steuer befreit."
          />
          <NumberField
            label="Restwert"
            unit="% vom Kaufpreis"
            value={evRestwert}
            onChange={setEvRestwert}
            min={0}
            max={100}
            step={1}
          />

          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Verbrenner
          </div>
          <NumberField
            label="Kaufpreis"
            unit="€"
            value={vPreis}
            onChange={setVPreis}
            min={0}
            step={1000}
          />
          <NumberField
            label="Verbrauch"
            unit="l/100 km"
            value={vVerbrauch}
            onChange={setVVerbrauch}
            min={0}
            step={0.1}
          />
          <NumberField
            label="Kraftstoffpreis"
            unit="€/L"
            value={kraftstoffPreis}
            onChange={setKraftstoffPreis}
            min={0}
            step={0.05}
          />
          <NumberField
            label="Versicherung"
            unit="€/Jahr"
            value={vVersicherung}
            onChange={setVVersicherung}
            min={0}
            step={50}
          />
          <NumberField
            label="Wartung / Reparatur"
            unit="€/Jahr"
            value={vWartung}
            onChange={setVWartung}
            min={0}
            step={50}
          />
          <NumberField
            label="Kfz-Steuer"
            unit="€/Jahr"
            value={vSteuer}
            onChange={setVSteuer}
            min={0}
            step={10}
          />
          <NumberField
            label="Restwert"
            unit="% vom Kaufpreis"
            value={vRestwert}
            onChange={setVRestwert}
            min={0}
            max={100}
            step={1}
          />
        </>
      }
      result={
        <ResultCard
          label={evGuenstiger ? "Elektroauto günstiger" : "Verbrenner günstiger"}
          value={`${evGuenstiger ? "−" : "+"}${formatCurrency(Math.abs(result.differenz))}`}
          badge={{
            label: `Über ${result.N} Jahre / ${result.kmGesamt.toLocaleString("de-DE")} km`,
            tone: "info",
          }}
          description={
            <>
              <dl className="mt-2 grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
                <dt />
                <dd className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Elektro
                </dd>
                <dd className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Verbrenner
                </dd>

                <dt>Energie / Jahr</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.evEnergie)}</dd>
                <dd className="text-right tabular-nums">{formatCurrency(result.vEnergie)}</dd>

                <dt>Laufende Kosten / Jahr</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.evLaufend)}</dd>
                <dd className="text-right tabular-nums">{formatCurrency(result.vLaufend)}</dd>

                <dt>Wertverlust gesamt</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.evWertverlust)}</dd>
                <dd className="text-right tabular-nums">{formatCurrency(result.vWertverlust)}</dd>

                <dt className="font-medium">Gesamtkosten</dt>
                <dd className="text-right font-medium tabular-nums">
                  {formatCurrency(result.evGesamt)}
                </dd>
                <dd className="text-right font-medium tabular-nums">
                  {formatCurrency(result.vGesamt)}
                </dd>

                <dt>Kosten je 100 km</dt>
                <dd className="text-right tabular-nums">{formatCurrency(result.evProKm)}</dd>
                <dd className="text-right tabular-nums">{formatCurrency(result.vProKm)}</dd>
              </dl>
            </>
          }
          footer={
            <span>
              Total Cost of Ownership (TCO) vor Steuervorteilen als Dienstwagen, Förderprämien und
              Finanzierungskosten. Werte anpassen, um dein individuelles Nutzungsprofil abzubilden.
            </span>
          }
        />
      }
    />
  );
}