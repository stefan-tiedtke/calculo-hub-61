import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { NumberField } from "@/components/calculator/number-field";
import { ResultCard } from "@/components/calculator/result-card";
import { SegmentedControl } from "@/components/calculator/segmented-control";
import { formatCurrency, formatNumber, parseNumber } from "@/lib/format";

type Verkehr = "auto" | "oepnv" | "rad";

export default function PendlerpauschaleCalculator() {
  const [km, setKm] = useState("25");
  const [tage, setTage] = useState("220");
  const [homeoffice, setHomeoffice] = useState("40");
  const [verkehr, setVerkehr] = useState<Verkehr>("auto");
  const [grenzsteuer, setGrenzsteuer] = useState("30");
  const [oepnvKosten, setOepnvKosten] = useState("0");

  const r = useMemo(() => {
    const entfernung = Math.max(0, parseNumber(km) || 0);
    const arbeitstage = Math.max(0, parseNumber(tage) || 0);
    const hoTage = Math.max(0, parseNumber(homeoffice) || 0);
    const pendlerTage = Math.max(0, arbeitstage - hoTage);
    const satz = (kmVal: number) => (kmVal <= 20 ? kmVal * 0.3 : 20 * 0.3 + (kmVal - 20) * 0.38);
    const proTag = satz(entfernung);
    const pendlerBetrag = proTag * pendlerTage;
    const homeofficePauschale = Math.min(hoTage, 210) * 6; // ab 2023: 6 €/Tag, max. 210 Tage
    const oepnvJahr = Math.max(0, parseNumber(oepnvKosten) || 0);

    // Bei ÖPNV: höherer Wert aus Pendlerpauschale und tatsächlichen Kosten
    const wegkosten =
      verkehr === "oepnv" ? Math.max(pendlerBetrag, oepnvJahr) : pendlerBetrag;
    // Deckelung ÖPNV/Rad: max. 4.500 € (außer nachgewiesene ÖPNV-Kosten oder eigener Pkw)
    const gedeckelt =
      verkehr === "auto"
        ? wegkosten
        : verkehr === "oepnv"
          ? Math.max(Math.min(pendlerBetrag, 4500), oepnvJahr)
          : Math.min(wegkosten, 4500);

    const werbungskosten = gedeckelt + homeofficePauschale;
    const arbeitnehmerPausch = 1230;
    const absetzbar = Math.max(0, werbungskosten - arbeitnehmerPausch);
    const steuersatz = Math.max(0, Math.min(100, parseNumber(grenzsteuer) || 0)) / 100;
    const steuervorteil = absetzbar * steuersatz;

    return {
      entfernung,
      pendlerTage,
      proTag,
      pendlerBetrag,
      homeofficePauschale,
      werbungskosten,
      gedeckelt,
      absetzbar,
      steuervorteil,
      arbeitnehmerPausch,
      ueberPausch: werbungskosten > arbeitnehmerPausch,
    };
  }, [km, tage, homeoffice, verkehr, grenzsteuer, oepnvKosten]);

  return (
    <CalculatorShell
      inputs={
        <>
          <NumberField
            label="Einfacher Arbeitsweg"
            unit="km"
            value={km}
            onChange={setKm}
            min={0}
            step={1}
            hint="Kürzeste Straßenverbindung, nur die Entfernung (nicht Hin + Rück)."
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Arbeitstage / Jahr"
              value={tage}
              onChange={setTage}
              min={0}
              step={1}
              hint="Realistisch: 210–230."
            />
            <NumberField
              label="Homeoffice-Tage"
              value={homeoffice}
              onChange={setHomeoffice}
              min={0}
              step={1}
              hint="Tage ohne Fahrt zur Arbeit."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Verkehrsmittel</label>
            <SegmentedControl
              value={verkehr}
              onChange={(v) => setVerkehr(v as Verkehr)}
              options={[
                { value: "auto", label: "Auto / Motorrad" },
                { value: "oepnv", label: "ÖPNV / Bahn" },
                { value: "rad", label: "Rad / zu Fuß" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {verkehr === "auto"
                ? "Pkw: keine Deckelung – die volle Entfernungspauschale ist absetzbar."
                : verkehr === "oepnv"
                  ? "ÖPNV: Deckel 4.500 €, es sei denn, die tatsächlichen Ticketkosten sind höher."
                  : "Rad / zu Fuß: gedeckelt auf max. 4.500 € pro Jahr."}
            </p>
          </div>
          {verkehr === "oepnv" && (
            <NumberField
              label="Ticketkosten / Jahr"
              unit="€"
              value={oepnvKosten}
              onChange={setOepnvKosten}
              min={0}
              step={10}
              hint="Nur relevant, wenn höher als die Pendlerpauschale (z. B. teures Monatsticket)."
            />
          )}
          <NumberField
            label="Persönlicher Grenzsteuersatz"
            unit="%"
            value={grenzsteuer}
            onChange={setGrenzsteuer}
            min={0}
            max={45}
            step={1}
            hint="Typisch 25–42 %. Grober Richtwert: 30 % bei mittlerem Einkommen."
          />
        </>
      }
      result={
        <ResultCard
          label="Geschätzter Steuervorteil"
          value={formatCurrency(r.steuervorteil)}
          badge={{
            label: `${formatCurrency(r.absetzbar)} zusätzlich absetzbar`,
            tone: "info",
          }}
          description={
            <>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <dt>Pendlertage</dt>
                <dd className="text-right tabular-nums">
                  {formatNumber(r.pendlerTage, 0)}
                </dd>
                <dt>Pauschale pro Tag</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(r.proTag)}
                </dd>
                <dt>Entfernungspauschale</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(r.gedeckelt)}
                </dd>
                <dt>Homeoffice-Pauschale</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(r.homeofficePauschale)}
                </dd>
                <dt>Werbungskosten gesamt</dt>
                <dd className="text-right tabular-nums">
                  {formatCurrency(r.werbungskosten)}
                </dd>
                <dt>abzgl. Arbeitnehmer-Pauschbetrag</dt>
                <dd className="text-right tabular-nums">
                  − {formatCurrency(r.arbeitnehmerPausch)}
                </dd>
              </dl>
              {!r.ueberPausch && (
                <p className="mt-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                  Deine Werbungskosten liegen unter dem Arbeitnehmer-Pauschbetrag von{" "}
                  {formatCurrency(r.arbeitnehmerPausch)}, den das Finanzamt automatisch
                  ansetzt. Nur der darüber hinausgehende Betrag wirkt sich steuerlich aus.
                </p>
              )}
            </>
          }
          footer={
            <span>
              Sätze 2024/2025: 0,30 €/km für die ersten 20 km, 0,38 €/km ab dem 21.
              Kilometer, Homeoffice-Pauschale 6 €/Tag (max. 210 Tage = 1.260 €).
              Arbeitnehmer-Pauschbetrag 1.230 €.
            </span>
          }
        />
      }
    />
  );
}