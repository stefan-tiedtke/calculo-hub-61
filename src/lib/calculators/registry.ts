import type { CalculatorDef } from "./types";
import BmiCalculator from "./bmi";
import BruttoNettoCalculator from "./brutto-netto";
import ZinseszinsCalculator from "./zinseszins";
import InflationCalculator from "./inflation";
import EntnahmeCalculator from "./entnahme";
import RenteCalculator from "./rente";
import StundenlohnCalculator from "./stundenlohn";
import UeberstundenCalculator from "./ueberstunden";
import KreditCalculator from "./kredit";
import StromkostenCalculator from "./stromkosten";
import KaufMieteCalculator from "./kauf-miete";
import EvVsVerbrennerCalculator from "./ev-vs-verbrenner";
import EtfSparplanCalculator from "./etf-sparplan";

import ReisekostenCalculator from "./reisekosten";
import PacklisteCalculator from "./packliste";
import MietwagenCalculator from "./mietwagen";
import PaceCalculator from "./pace";
import SpritkostenCalculator from "./spritkosten";
import PendlerpauschaleCalculator from "./pendlerpauschale";
import WerbungskostenCalculator from "./werbungskosten";
import KapitalertragsteuerCalculator from "./kapitalertragsteuer";
import GehaltserhoehungNettoCalculator from "./gehaltserhoehung-netto";
import TdeeCalculator from "./tdee";
import SitzzeitCalculator from "./sitzzeit";
import BalkonkraftwerkCalculator from "./balkonkraftwerk";
import KaufnebenkostenCalculator from "./kaufnebenkosten";
import KatzenalterCalculator from "./katzenalter";
import HundealterCalculator from "./hundealter";
import FuttermengeCalculator from "./futtermenge";
import ArbeitsmittelAfaCalculator from "./arbeitsmittel-afa";
import StandbyKostenCalculator from "./standby-kosten";
import ArbeitstageCalculator from "./arbeitstage";


/**
 * Central registry for all calculators on the platform.
 *
 * To add a new calculator:
 * 1. Create a component in src/lib/calculators/<slug>.tsx (default export).
 * 2. Add an entry below with slug, name, category, keywords and metadata.
 * 3. That's it — it appears in category pages, search, and sitemap.
 */
export const calculators: CalculatorDef[] = [
  {
    slug: "etf-sparplan-rechner",
    name: "ETF-Sparplan-Rechner",
    shortDescription: "ETF-Sparplan mit Rendite, TER, Dynamik, Steuern und Inflation berechnen.",
    description:
      "Berechne, wie sich dein ETF-Sparplan langfristig entwickelt – mit monatlicher Sparrate, Dynamik, laufenden Kosten (TER), Abgeltungssteuer inkl. Teilfreistellung und realer Kaufkraft nach Inflation.",
    category: "finanzen",
    keywords: [
      "etf sparplan",
      "etf sparplan rechner",
      "sparplan rechner",
      "msci world sparplan",
      "vermögensaufbau",
      "teilfreistellung",
      "abgeltungssteuer",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: EtfSparplanCalculator,
    formula: {
      expression:
        "K_n = K_0 · (1+i)^n + Σ Rate_j · (1+i)^(n−j)   ·   i = Rendite − TER",
      explanation:
        "Das Endkapital ergibt sich aus verzinstem Startkapital plus allen aufgezinsten Sparraten. Die effektive Rendite ist die Bruttorendite abzüglich der laufenden ETF-Kosten (TER). Beim Verkauf fällt Abgeltungssteuer + Soli auf den Gewinn an, wobei Aktien-ETFs 30 % teilfreigestellt sind. Die reale Kaufkraft ergibt sich durch Abzinsung mit der Inflation.",
      variables: [
        { symbol: "K_0", description: "Startkapital (Einmalanlage)" },
        { symbol: "Rate", description: "Monatliche Sparrate" },
        { symbol: "i", description: "Rendite pro Periode (Brutto − TER)" },
        { symbol: "TER", description: "Laufende Fondskosten in % p. a." },
        { symbol: "Teilfreistellung", description: "Steuerfreier Anteil der Erträge" },
      ],
    },
    examples: [
      {
        title: "Klassischer MSCI-World-Sparplan",
        inputs: "200 €/Monat · 7 % Rendite · 0,2 % TER · 25 Jahre",
        result: "≈ 152.000 € brutto · ~ 137.000 € netto",
      },
      {
        title: "Mit Dynamik",
        inputs: "300 €/Monat · +3 % p. a. Dynamik · 30 Jahre · 7 %",
        result: "≈ 445.000 € brutto",
      },
      {
        title: "Kurzfristig",
        inputs: "500 €/Monat · 10 Jahre · 6 %",
        result: "≈ 81.000 € brutto",
      },
    ],
    faq: [
      {
        question: "Was ist die TER?",
        answer:
          "Total Expense Ratio – die jährlichen laufenden Kosten eines ETFs in Prozent des Fondsvermögens. Sie werden direkt aus dem Fondsvermögen entnommen und reduzieren die Rendite. Bei Aktien-ETFs auf breite Indizes liegt die TER meist zwischen 0,05 % und 0,3 %.",
      },
      {
        question: "Thesaurierend oder ausschüttend?",
        answer:
          "Thesaurierende ETFs reinvestieren Ausschüttungen automatisch – ideal für den Vermögensaufbau. Ausschüttende ETFs zahlen Dividenden aus, was den Sparerpauschbetrag (1.000 € pro Jahr) besser ausnutzen kann, aber weniger Zinseszinseffekt bringt.",
      },
      {
        question: "Was ist die Teilfreistellung?",
        answer:
          "Für Fonds mit hohem Aktienanteil (>50 %) sind 30 % der Erträge steuerfrei. Bei Mischfonds mit >25 % Aktien sind es 15 %, bei reinen Anleihen-ETFs 0 %. Der Rechner setzt standardmäßig 30 % für einen Aktien-ETF an.",
      },
      {
        question: "Warum ist die Vorabpauschale nicht berücksichtigt?",
        answer:
          "Die Vorabpauschale ist eine kleine jährliche Vorauszahlung auf zukünftige Kursgewinne bei thesaurierenden Fonds. Sie hängt vom Basiszins ab und ist meist gering. Für eine überschlägige Rechnung ist der Effekt vernachlässigbar; sie wird beim späteren Verkauf angerechnet.",
      },
      {
        question: "Welche Rendite ist realistisch?",
        answer:
          "Der MSCI World hat historisch rund 7 – 8 % pro Jahr in EUR erzielt – ohne Garantie für die Zukunft. Konservative Annahmen liegen bei 5 – 6 %, optimistische bei 8 – 9 %. Rechne mehrere Szenarien, um die Bandbreite zu sehen.",
      },
    ],
    relatedSlugs: ["zinseszins-rechner", "inflationsrechner", "entnahmerechner"],
    sources: [
      {
        label: "BaFin – ETFs",
        url: "https://www.bafin.de/",
      },
      {
        label: "MSCI World Index",
        url: "https://www.msci.com/",
      },
    ],
  },
  {
    slug: "elektroauto-vs-verbrenner",
    name: "Elektroauto vs. Verbrenner",
    shortDescription: "TCO-Vergleich: Was kostet ein E-Auto wirklich im Vergleich zum Verbrenner?",
    description:
      "Vergleiche die Gesamtkosten (Total Cost of Ownership) von Elektroauto und Verbrenner über die geplante Haltedauer – inklusive Kaufpreis, Wertverlust, Energiekosten, Wartung, Versicherung und Kfz-Steuer.",
    category: "finanzen",
    keywords: [
      "elektroauto vs verbrenner",
      "e-auto vergleich",
      "tco elektroauto",
      "gesamtkosten elektroauto",
      "kosten e-auto benziner",
      "vergleich stromer diesel",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: EvVsVerbrennerCalculator,
    formula: {
      expression: "TCO = (Kaufpreis − Restwert) + (Energie + Wartung + Versicherung + Steuer) × N",
      explanation:
        "Die Total Cost of Ownership summiert den Wertverlust über die Haltedauer und alle jährlichen Betriebskosten. Bei der Energie rechnet der Rechner: E-Auto = km × kWh/100 × Strompreis / 100, Verbrenner = km × l/100 × Preis/L / 100.",
      variables: [
        { symbol: "N", description: "Haltedauer in Jahren" },
        { symbol: "Restwert", description: "Verkaufserlös nach N Jahren (in % vom Kaufpreis)" },
        { symbol: "Energie", description: "Strom- bzw. Kraftstoffkosten pro Jahr" },
        { symbol: "Wartung", description: "Reparaturen, Inspektionen, Verschleiß" },
      ],
    },
    examples: [
      {
        title: "Vielfahrer",
        inputs: "30.000 km/Jahr · 8 Jahre · 42.000 € E · 32.000 € Benzin",
        result: "Elektroauto meist deutlich günstiger (~5.000 – 10.000 €)",
      },
      {
        title: "Wenigfahrer",
        inputs: "8.000 km/Jahr · 5 Jahre",
        result: "Verbrenner oft günstiger – hoher Aufpreis amortisiert sich nicht",
      },
      {
        title: "Durchschnitt",
        inputs: "15.000 km/Jahr · 8 Jahre · 35 ct/kWh · 1,75 €/L",
        result: "≈ Gleichstand, sensibel auf Strom- und Spritpreis",
      },
    ],
    faq: [
      {
        question: "Was ist TCO?",
        answer:
          "Total Cost of Ownership – die Gesamtkosten über die Nutzungsdauer, nicht nur der Kaufpreis. Neben Anschaffung fließen Wertverlust, Energie, Wartung, Versicherung und Steuer ein. Für einen fairen Vergleich zwischen E-Auto und Verbrenner ist TCO der entscheidende Wert.",
      },
      {
        question: "Wie hoch ist der Verbrauch typischer E-Autos?",
        answer:
          "Kompaktklasse: 15 – 18 kWh/100 km, Mittelklasse: 18 – 22 kWh/100 km, SUV: 20 – 25 kWh/100 km. Im Winter oder bei viel Autobahn kann der Verbrauch 20 – 30 % höher liegen. Der WLTP-Wert liegt oft niedriger als der Praxisverbrauch.",
      },
      {
        question: "Welchen Strompreis sollte ich ansetzen?",
        answer:
          "Wer überwiegend zu Hause lädt, zahlt aktuell etwa 30 – 40 ct/kWh, mit PV-Anlage teils deutlich weniger. Öffentliches AC-Laden liegt bei 40 – 60 ct/kWh, Schnellladen (HPC) oft bei 55 – 80 ct/kWh. Setze einen realistischen Mischpreis an.",
      },
      {
        question: "Sind Kaufprämien berücksichtigt?",
        answer:
          "Nein. Prämien und Zuschüsse ändern sich häufig. Zieh eine gewährte Prämie einfach vom E-Auto-Kaufpreis ab. Auch Steuervorteile bei Dienstwagen (0,25-%-Regel) sind nicht enthalten – sie machen E-Autos für Firmenwagenfahrer oft noch günstiger.",
      },
      {
        question: "Warum ist der Restwert so wichtig?",
        answer:
          "Der Restwert ist neben der Energie der größte Kostenblock. E-Autos gelten aktuell als volatiler im Wiederverkauf, junge Elektroautos verlieren teils schneller an Wert. Konservativ 30 – 40 % nach 8 Jahren sind ein guter Startwert.",
      },
    ],
    relatedSlugs: ["stromkostenrechner", "kreditrechner"],
    sources: [
      {
        label: "ADAC – Autokosten",
        url: "https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/autokosten/",
      },
    ],
  },
  {
    slug: "kaufen-oder-mieten",
    name: "Kauf vs. Miete",
    shortDescription: "Vergleich: Immobilie kaufen oder weiter mieten?",
    description:
      "Vergleiche die langfristigen Kosten von Kauf und Miete – mit Kaufpreis, Kaufnebenkosten, Finanzierung, Instandhaltung, Wertsteigerung, Kaltmiete, Mietsteigerung und der Rendite einer alternativen Geldanlage.",
    category: "immobilien",
    keywords: [
      "kaufen oder mieten",
      "kauf vs miete",
      "mieten vs kaufen",
      "immobilienrechner",
      "vergleichsrechner immobilie",
      "opportunitätskosten",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: KaufMieteCalculator,
    formula: {
      expression:
        "Vermögen_Kauf = Immobilienwert − Restschuld   ·   Vermögen_Miete = EK + Ersparnis, verzinst",
      explanation:
        "Der Rechner simuliert Monat für Monat: Der Käufer zahlt Annuität + Instandhaltung, die Immobilie steigt im Wert und die Restschuld sinkt. Der Mieter zahlt eine mit der Zeit steigende Miete und legt Eigenkapital sowie die monatliche Differenz zur Kaufbelastung mit der angenommenen Rendite an. Verglichen wird das Nettovermögen nach dem gewählten Zeitraum.",
      variables: [
        { symbol: "Kaufpreis", description: "Preis der Immobilie" },
        { symbol: "Nebenkosten", description: "Notar, Makler, Grunderwerbsteuer (8 – 12 %)" },
        { symbol: "Annuität", description: "Zins + Tilgung pro Jahr" },
        { symbol: "Instandhaltung", description: "Rücklage für Reparaturen (~1 %/Jahr)" },
        { symbol: "Wertsteigerung", description: "Erwartete Immobilienpreis-Entwicklung" },
        { symbol: "Rendite", description: "Rendite der alternativen Geldanlage" },
      ],
    },
    examples: [
      {
        title: "Klassisches Szenario",
        inputs: "400.000 € · 80.000 € EK · 3,8 % Zins · 1.400 € Kaltmiete · 15 Jahre",
        result: "Kauf oft leicht im Vorteil bei 2 % Wertsteigerung und 5 % Anlagerendite",
      },
      {
        title: "Hohe Anlagerendite",
        inputs: "gleich, aber 7 % Rendite auf Depot",
        result: "Mieten kann finanziell besser abschneiden",
      },
    ],
    faq: [
      {
        question: "Ist Kaufen immer die bessere Wahl?",
        answer:
          "Nein. Ob Kaufen oder Mieten günstiger ist, hängt von vielen Faktoren ab: Kaufpreis-Miet-Verhältnis, Zinsniveau, Wertsteigerung, Anlagerendite und Zeitraum. In teuren Lagen mit hohen Kaufpreisen ist Mieten häufig günstiger, in günstigen Lagen oft der Kauf.",
      },
      {
        question: "Was sind Opportunitätskosten?",
        answer:
          "Das Eigenkapital, das in die Immobilie fließt, kann nicht anderweitig angelegt werden. Der Rechner berücksichtigt das, indem er für den Mieter das gleiche Eigenkapital plus die monatliche Ersparnis mit einer definierten Rendite anlegt.",
      },
      {
        question: "Warum ist die Wertsteigerung so wichtig?",
        answer:
          "Ein Prozentpunkt mehr oder weniger Wertsteigerung pro Jahr macht über 20 – 30 Jahre einen sehr großen Unterschied. Realistische Annahmen liegen im deutschen Durchschnitt bei etwa 2 – 3 % pro Jahr, in guten Lagen deutlich mehr.",
      },
      {
        question: "Sind Steuern berücksichtigt?",
        answer:
          "Nein. Weder Grundsteuer, Abgeltungssteuer auf Kapitalerträge noch mögliche Vorteile durch selbstgenutztes Wohneigentum werden simuliert. Für einen exakten Vergleich mit deiner Situation solltest du eine steuerliche Beratung hinzuziehen.",
      },
      {
        question: "Warum sind die Nebenkosten der Miete nur zur Info?",
        answer:
          "Umlagefähige Nebenkosten (Heizung, Wasser, Müll) fallen auch beim Eigentümer an. Sie sind für den Vergleich Kauf vs. Miete daher nicht relevant und werden nicht mitgerechnet.",
      },
    ],
    relatedSlugs: ["kreditrechner", "inflationsrechner", "zinseszins-rechner"],
    sources: [
      {
        label: "Deutsche Bundesbank – Wohnimmobilienpreise",
        url: "https://www.bundesbank.de/de/statistiken/geld-und-kapitalmaerkte/wohnimmobilienpreisindikatoren",
      },
    ],
  },
  {
    slug: "stromkostenrechner",
    name: "Stromkostenrechner",
    shortDescription: "Stromkosten pro Jahr, Monat und Gerät berechnen.",
    description:
      "Berechne deine Stromkosten aus Jahresverbrauch, Haushaltsgröße oder Leistung eines einzelnen Geräts – inklusive Arbeitspreis, Grundpreis, monatlicher Kosten und CO₂-Ausstoß.",
    category: "energie",
    keywords: [
      "stromkosten",
      "stromkostenrechner",
      "stromverbrauch",
      "stromrechnung",
      "kwh preis",
      "stromkosten gerät",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: StromkostenCalculator,
    formula: {
      expression: "Kosten = Verbrauch × Arbeitspreis + Grundpreis · 12",
      explanation:
        "Die Jahresstromkosten setzen sich aus dem verbrauchsabhängigen Arbeitspreis (kWh × ct/kWh) und dem festen Grundpreis pro Monat zusammen. Bei Einzelgeräten wird der Verbrauch aus Leistung (Watt) × Nutzungsdauer berechnet: kWh = W × h / 1.000.",
      variables: [
        { symbol: "Verbrauch", description: "Jährlicher Stromverbrauch in kWh" },
        { symbol: "Arbeitspreis", description: "Preis pro Kilowattstunde in ct/kWh" },
        { symbol: "Grundpreis", description: "Feste monatliche Grundgebühr" },
        { symbol: "Watt", description: "Elektrische Leistung eines Geräts" },
      ],
    },
    examples: [
      {
        title: "2-Personen-Haushalt",
        inputs: "2.500 kWh · 35 ct/kWh · 12 €/Monat",
        result: "≈ 1.019 €/Jahr (≈ 84,88 €/Monat)",
      },
      {
        title: "Kühlschrank",
        inputs: "100 W · 24 Std./Tag · 365 Tage · 35 ct/kWh",
        result: "≈ 306,60 €/Jahr",
      },
      {
        title: "Gaming-PC",
        inputs: "400 W · 4 Std./Tag · 300 Tage · 35 ct/kWh",
        result: "≈ 168 €/Jahr",
      },
    ],
    faq: [
      {
        question: "Wie hoch ist der Strompreis aktuell?",
        answer:
          "2025 zahlen Haushalte in Deutschland im Durchschnitt etwa 35 ct/kWh. Der genaue Preis hängt vom Tarif ab – Neukundenangebote liegen oft deutlich darunter, Grundversorgungstarife oft darüber. Den exakten Wert findest du auf deiner Stromrechnung.",
      },
      {
        question: "Wie viel Strom verbraucht ein Haushalt?",
        answer:
          "Grobe Richtwerte pro Jahr: 1 Person ~1.500 kWh, 2 Personen ~2.500 kWh, 3 Personen ~3.500 kWh, 4 Personen ~4.250 kWh. Ein Elektroherd und elektrische Warmwasseraufbereitung erhöhen den Verbrauch deutlich.",
      },
      {
        question: "Was ist der Unterschied zwischen Arbeits- und Grundpreis?",
        answer:
          "Der Arbeitspreis ist der verbrauchsabhängige Preis pro kWh. Der Grundpreis ist eine feste monatliche Gebühr, unabhängig vom Verbrauch. Beide zusammen ergeben die Gesamtkosten.",
      },
      {
        question: "Wie berechne ich den Verbrauch eines Geräts?",
        answer:
          "Verbrauch in kWh = Leistung (Watt) × Nutzungsdauer (Stunden) / 1.000. Beispiel: 2.000-W-Wasserkocher, 5 Minuten am Tag = 2.000 × (5/60) / 1.000 ≈ 0,17 kWh pro Tag.",
      },
      {
        question: "Sind Steuern und Abgaben enthalten?",
        answer:
          "Ja, wenn du den Bruttopreis von deiner Stromrechnung einträgst. Die Preise in Verträgen enthalten üblicherweise Umsatzsteuer, Netzentgelte, Konzessionsabgabe und weitere Umlagen.",
      },
    ],
    relatedSlugs: ["inflationsrechner"],
    sources: [
      {
        label: "Bundesnetzagentur – Strompreise",
        url: "https://www.bundesnetzagentur.de/",
      },
      {
        label: "Umweltbundesamt – CO₂-Emissionen Strommix",
        url: "https://www.umweltbundesamt.de/",
      },
    ],
  },
  {
    slug: "kreditrechner",
    name: "Kreditrechner",
    shortDescription: "Monatsrate, Laufzeit und Zinskosten eines Kredits berechnen.",
    description:
      "Berechne die monatliche Rate eines Annuitätendarlehens aus Kreditbetrag, Sollzins und Laufzeit – oder die Laufzeit aus einer festen Rate. Inklusive Zinskosten, Gesamtrückzahlung und jährlichem Tilgungsplan.",
    category: "finanzen",
    keywords: [
      "kredit",
      "kreditrechner",
      "ratenkredit",
      "annuität",
      "tilgungsplan",
      "monatsrate",
      "darlehensrechner",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: KreditCalculator,
    formula: {
      expression: "Rate = K · i / (1 − (1 + i)^−n)",
      explanation:
        "Beim Annuitätendarlehen bleibt die Monatsrate konstant. i ist der monatliche Zinssatz (Jahreszins / 12), n die Anzahl der Monate. Zu Beginn sind die Zinsen hoch und die Tilgung niedrig – mit sinkender Restschuld dreht sich das Verhältnis.",
      variables: [
        { symbol: "K", description: "Kreditbetrag (Anfangsschuld)" },
        { symbol: "i", description: "Monatlicher Zinssatz (Jahreszins / 12)" },
        { symbol: "n", description: "Anzahl der Monatsraten" },
        { symbol: "Rate", description: "Konstante monatliche Zahlung" },
      ],
    },
    examples: [
      {
        title: "Kleiner Ratenkredit",
        inputs: "10.000 € · 6 % · 4 Jahre",
        result: "≈ 234,85 €/Monat · ≈ 1.273 € Zinsen",
      },
      {
        title: "Autokredit",
        inputs: "25.000 € · 5 % · 6 Jahre",
        result: "≈ 402,62 €/Monat · ≈ 3.989 € Zinsen",
      },
      {
        title: "Feste Rate",
        inputs: "20.000 € · 5 % · 400 €/Monat",
        result: "≈ 4,7 Jahre Laufzeit",
      },
    ],
    faq: [
      {
        question: "Was ist ein Annuitätendarlehen?",
        answer:
          "Ein Kredit mit gleichbleibender Rate. In der Rate stecken Zinsen und Tilgung – ihr Verhältnis verschiebt sich über die Laufzeit: Anfangs zahlst du viel Zinsen, später überwiegt die Tilgung.",
      },
      {
        question: "Ist der Sollzins dasselbe wie der Effektivzins?",
        answer:
          "Nein. Der Sollzins ist der reine Zins auf die Restschuld. Der Effektivzins enthält zusätzlich Gebühren und die Zinsverrechnungsweise. Für einen echten Angebotsvergleich immer den Effektivzins nutzen.",
      },
      {
        question: "Wie senke ich die Zinskosten?",
        answer:
          "Kürzere Laufzeit, höhere Monatsrate oder Sondertilgungen reduzieren die Zinslast deutlich. Auch ein besserer Zinssatz durch Bonität, Vergleich mehrerer Anbieter oder eine zweite kreditnehmende Person hilft.",
      },
      {
        question: "Sind Sondertilgungen berücksichtigt?",
        answer:
          "Nein. Der Rechner geht von einer klassischen Annuität ohne Sondertilgungen aus. Sondertilgungen verkürzen die Laufzeit oder senken die Restschuld zusätzlich – frag deinen Anbieter nach den Konditionen.",
      },
      {
        question: "Warum ist bei fester Rate manchmal keine Berechnung möglich?",
        answer:
          "Wenn die Monatsrate niedriger ist als die im ersten Monat anfallenden Zinsen, wächst die Restschuld statt zu sinken – der Kredit wird nie zurückgezahlt. Erhöhe die Rate oder senke den Zinssatz.",
      },
    ],
    relatedSlugs: ["zinseszins-rechner", "inflationsrechner"],
    sources: [
      {
        label: "BaFin – Verbraucherkredite",
        url: "https://www.bafin.de/",
      },
    ],
  },
  {
    slug: "ueberstundenrechner",
    name: "Überstundenrechner",
    shortDescription: "Vergütung von Überstunden inkl. Zuschlag berechnen.",
    description:
      "Berechne die Bruttovergütung deiner Überstunden – aus Monats- oder Stundenlohn, mit individuellem Zuschlag (25 %, 50 %, 100 %) und Auswertung pro Monat oder Jahr.",
    category: "arbeit",
    keywords: [
      "überstunden",
      "überstundenrechner",
      "überstundenzuschlag",
      "mehrarbeit",
      "überstunden auszahlen",
    ],
    popular: false,
    updatedAt: "2026-07-08",
    component: UeberstundenCalculator,
    formula: {
      expression: "Vergütung = Stundenlohn × (1 + Zuschlag) × Anzahl",
      explanation:
        "Der Grundstundenlohn ergibt sich aus Monatslohn × 12 / (Wochenstunden × 52). Für jede Überstunde wird der Stundenlohn um den Zuschlag erhöht und mit der Anzahl der Überstunden multipliziert.",
      variables: [
        { symbol: "Stundenlohn", description: "Bruttolohn pro vertraglicher Arbeitsstunde" },
        { symbol: "Zuschlag", description: "Prozentualer Aufschlag (z. B. 25 %)" },
        { symbol: "Anzahl", description: "Anzahl der Überstunden im Zeitraum" },
      ],
    },
    examples: [
      {
        title: "10 Überstunden mit 25 %",
        inputs: "3.000 €/Monat · 40 Std./Woche · 10 Überstunden · 25 %",
        result: "≈ 216,35 € brutto",
      },
      {
        title: "Sonntagsarbeit",
        inputs: "20 €/Std. · 8 Überstunden · 50 %",
        result: "= 240 € brutto",
      },
      {
        title: "Jährliche Auswertung",
        inputs: "3.500 €/Monat · 40 Std. · 5 Ü-Std./Monat · 25 %",
        result: "≈ 1.514 € brutto pro Jahr",
      },
    ],
    faq: [
      {
        question: "Muss der Arbeitgeber Überstunden bezahlen?",
        answer:
          "Nur wenn Arbeits- oder Tarifvertrag das vorsehen. Häufig sind Überstunden mit dem Gehalt abgegolten – hier gibt es enge gesetzliche Grenzen. Alternativ ist ein Ausgleich in Freizeit üblich.",
      },
      {
        question: "Wie hoch ist ein üblicher Zuschlag?",
        answer:
          "Typisch sind 25 % an Werktagen, 50 % an Sonntagen und 100 % an gesetzlichen Feiertagen. Verbindlich ist immer die Regelung im Arbeits- oder Tarifvertrag.",
      },
      {
        question: "Wie berechnet sich der Stundenlohn?",
        answer:
          "Aus dem Monatslohn × 12 geteilt durch die vertraglichen Jahresstunden (Wochenstunden × 52). Bei 40 Std./Woche entspricht ein Monatslohn von 3.000 € etwa 17,31 €/Stunde.",
      },
      {
        question: "Sind Steuern berücksichtigt?",
        answer:
          "Nein. Der Rechner zeigt Bruttowerte. Auf ausgezahlte Überstunden fallen die üblichen Lohnsteuer- und Sozialversicherungsabzüge an – Sonntags-, Feiertags- und Nachtzuschläge sind unter bestimmten Grenzen steuerfrei.",
      },
      {
        question: "Was gilt bei Teilzeit?",
        answer:
          "Mehrarbeit von Teilzeitkräften bis zur Vollzeit-Grenze wird meist ohne Zuschlag vergütet. Der Rechner funktioniert für Teilzeit genauso – trage die vertraglichen Wochenstunden ein.",
      },
    ],
    relatedSlugs: ["stundenlohnrechner", "brutto-netto-rechner"],
    sources: [
      {
        label: "Arbeitszeitgesetz (ArbZG)",
        url: "https://www.gesetze-im-internet.de/arbzg/",
      },
    ],
  },
  {
    slug: "stundenlohnrechner",
    name: "Stundenlohnrechner",
    shortDescription: "Stundenlohn aus Monats- oder Jahresgehalt berechnen.",
    description:
      "Berechne deinen Bruttostundenlohn aus Monats- oder Jahresgehalt – oder umgekehrt. Der Rechner berücksichtigt Wochenarbeitszeit, Urlaub, Feiertage und Krankheitstage und zeigt zusätzlich den effektiven Stundenlohn pro tatsächlich gearbeiteter Stunde.",
    category: "arbeit",
    keywords: [
      "stundenlohn",
      "stundenlohnrechner",
      "stundensatz",
      "gehalt umrechnen",
      "stundenlohn berechnen",
      "monatslohn",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: StundenlohnCalculator,
    formula: {
      expression:
        "Stundenlohn = Monatslohn × 12 / (Wochenstunden × 52)",
      explanation:
        "Der vertragliche Stundenlohn ergibt sich aus dem Jahreslohn geteilt durch die vertraglichen Jahresstunden (Wochenstunden × 52). Der effektive Stundenlohn teilt den Jahreslohn stattdessen durch die tatsächlich gearbeiteten Stunden – also ohne Urlaub, Feiertage und Krankheitstage.",
      variables: [
        { symbol: "Monatslohn", description: "Bruttolohn pro Monat" },
        { symbol: "Wochenstunden", description: "Vertragliche Arbeitszeit pro Woche" },
        { symbol: "52", description: "Wochen pro Jahr" },
        { symbol: "Effektivstunden", description: "Jahresstunden abzüglich Urlaub, Feiertage, Krankheit" },
      ],
    },
    examples: [
      {
        title: "Vollzeit 40 Std.",
        inputs: "3.000 €/Monat · 40 Std./Woche",
        result: "≈ 17,31 €/Std. brutto",
      },
      {
        title: "Effektiver Stundenlohn",
        inputs: "42.000 €/Jahr · 40 Std./Woche · 30 Urlaub · 10 Feiertage",
        result: "≈ 20,19 €/Std. vertraglich · ≈ 23,33 €/Std. effektiv",
      },
      {
        title: "Teilzeit",
        inputs: "20 €/Std. · 30 Std./Woche",
        result: "≈ 2.600 €/Monat brutto",
      },
    ],
    faq: [
      {
        question: "Was ist der Unterschied zwischen Stundenlohn und effektivem Stundenlohn?",
        answer:
          "Der vertragliche Stundenlohn teilt dein Gehalt durch alle bezahlten Stunden im Jahr, inklusive Urlaub und Feiertage. Der effektive Stundenlohn zeigt, was du pro tatsächlich gearbeiteter Stunde verdienst – er ist immer höher, weil bezahlte Ausfalltage auf weniger Arbeitsstunden verteilt werden.",
      },
      {
        question: "Wie viele Arbeitsstunden hat ein Monat?",
        answer:
          "Bei 40 Wochenstunden sind es im Durchschnitt rund 173,3 Stunden pro Monat (40 × 52 / 12). In der Lohnabrechnung wird oft mit dieser Zahl gerechnet, unabhängig von der tatsächlichen Länge des Monats.",
      },
      {
        question: "Ist der Wert brutto oder netto?",
        answer:
          "Der Rechner zeigt Bruttowerte vor Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Sozialversicherung. Für die Netto-Berechnung nutze zusätzlich den Brutto-Netto-Rechner.",
      },
      {
        question: "Wie viele Feiertage sollte ich ansetzen?",
        answer:
          "In Deutschland fallen je nach Bundesland etwa 9 – 13 gesetzliche Feiertage auf Werktage. 10 ist ein üblicher Durchschnittswert. Wer viel am Wochenende arbeitet, kann den Wert anpassen.",
      },
      {
        question: "Sind Überstunden berücksichtigt?",
        answer:
          "Nein. Der Rechner geht von der vertraglichen Arbeitszeit aus. Für einen realistischen Effektivstundenlohn kannst du die tatsächlichen Wochenstunden inkl. Überstunden eintragen.",
      },
    ],
    relatedSlugs: ["brutto-netto-rechner"],
    sources: [
      {
        label: "Bundesministerium für Arbeit und Soziales – Arbeitszeit",
        url: "https://www.bmas.de/",
      },
    ],
  },
  {
    slug: "rentenrechner",
    name: "Rentenrechner",
    shortDescription: "Voraussichtliche gesetzliche Rente und Rentenlücke berechnen.",
    description:
      "Schätze deine voraussichtliche gesetzliche Rente auf Basis deines aktuellen Bruttogehalts, deiner Beitragsjahre und deines geplanten Renteneintritts – inklusive Abschlägen, Rentenanpassung und Kaufkraft in heutigem Geld.",
    category: "finanzen",
    keywords: [
      "rentenrechner",
      "gesetzliche rente",
      "entgeltpunkte",
      "rentenlücke",
      "rente berechnen",
      "altersvorsorge",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: RenteCalculator,
    formula: {
      expression:
        "Monatsrente = Entgeltpunkte × Zugangsfaktor × Rentenwert",
      explanation:
        "Pro Jahr erhältst du Entgeltpunkte im Verhältnis deines Bruttolohns zum Durchschnittsentgelt aller Versicherten (2025: ~50.493 €). Der Zugangsfaktor liegt bei 1,0 bei Regelaltersgrenze (67), sinkt bei früherem Rentenbeginn um 0,3 % pro Monat und steigt bei späterem um 0,5 % pro Monat. Multipliziert mit dem aktuellen Rentenwert (2025: 39,32 €) ergibt sich die monatliche Bruttorente.",
      variables: [
        { symbol: "Entgeltpunkte", description: "Summe aller Beitragsjahre × EP/Jahr" },
        { symbol: "Zugangsfaktor", description: "Ab-/Zuschlag je nach Renteneintrittsalter" },
        { symbol: "Rentenwert", description: "Wert eines Entgeltpunkts, jährlich angepasst" },
      ],
    },
    examples: [
      {
        title: "Durchschnittsverdiener, 40 Jahre",
        inputs: "4.200 €/Monat brutto · 40 Beitragsjahre · Rente mit 67",
        result: "≈ 1.630 € Bruttorente/Monat (in heutiger Kaufkraft)",
      },
      {
        title: "Frührente mit 63",
        inputs: "4.000 €/Monat · 45 Beitragsjahre · Rente mit 63",
        result: "≈ 14,4 % Abschlag auf die Rente",
      },
    ],
    faq: [
      {
        question: "Wie genau ist die Berechnung?",
        answer:
          "Der Rechner ist eine gute Orientierung, ersetzt aber keine offizielle Renteninformation der Deutschen Rentenversicherung. Er nimmt an, dass dein aktuelles Gehalt konstant bleibt (in Relation zum Durchschnittsentgelt) und berücksichtigt keine Kindererziehungszeiten, Zurechnungszeiten bei Erwerbsminderung oder Ost/West-Sonderregeln.",
      },
      {
        question: "Was sind Entgeltpunkte?",
        answer:
          "Ein Entgeltpunkt entspricht einem Jahr, in dem du genau das Durchschnittsentgelt aller Versicherten verdient hast (2025: 50.493 € brutto). Verdienst du mehr, bekommst du mehr Punkte pro Jahr; die Bemessungsgrenze deckelt bei rund 2,1 Punkten pro Jahr.",
      },
      {
        question: "Wie hoch sind die Abschläge bei früherer Rente?",
        answer:
          "Pro Monat, den du vor der Regelaltersgrenze in Rente gehst, wird die Rente um 0,3 % gekürzt – dauerhaft. Zwei Jahre früher bedeuten also 7,2 % weniger, drei Jahre 10,8 %. Bei besonders langjährig Versicherten (45 Jahre) gelten Sonderregeln.",
      },
      {
        question: "Warum wird die Rente in „heutiger Kaufkraft“ angezeigt?",
        answer:
          "Die nominale Rente in 30 Jahren klingt hoch, ist aber weniger wert, weil die Preise gestiegen sind. Der Rechner zeigt zusätzlich, was die Rente in heutigen Euro entspricht – so kannst du sie direkt mit deinen jetzigen Ausgaben vergleichen.",
      },
      {
        question: "Was ist die Rentenlücke?",
        answer:
          "Als Faustregel werden ca. 65 – 80 % des letzten Nettoeinkommens im Ruhestand benötigt. Der Rechner vergleicht deine geschätzte Nettorente mit rund 65 % deines heutigen Bruttos und zeigt die Differenz – ein Anhaltspunkt für zusätzliche private Vorsorge.",
      },
    ],
    relatedSlugs: ["entnahmerechner", "zinseszins-rechner", "inflationsrechner"],
    sources: [
      {
        label: "Deutsche Rentenversicherung – Rechengrößen",
        url: "https://www.deutsche-rentenversicherung.de/",
      },
    ],
  },
  {
    slug: "entnahmerechner",
    name: "Entnahmerechner",
    shortDescription: "FIRE-Zahl, sichere Entnahmerate und monatliche Auszahlung berechnen.",
    description:
      "Berechne dein FIRE-Vermögen nach der 4-%-Regel, die mögliche monatliche Entnahme aus deinem Portfolio und wie lange dein Geld unter Berücksichtigung von Rendite und Inflation reicht.",
    category: "finanzen",
    keywords: [
      "entnahmerechner",
      "fire",
      "4 prozent regel",
      "financial independence",
      "safe withdrawal rate",
      "rente entnahme",
      "kapitalverzehr",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: EntnahmeCalculator,
    formula: {
      expression: "FIRE-Zahl = Jahresausgaben / Entnahmerate   ·   Monatsentnahme = Vermögen × Rate / 12",
      explanation:
        "Nach der 4-%-Regel (Trinity-Studie) gilt eine jährliche Entnahme von 4 % des Startkapitals über 30 Jahre historisch als sicher. Die FIRE-Zahl ist daher rund 25× der jährlichen Ausgaben. Die Reichweite hängt von Rendite und Inflation ab – der Rechner simuliert das Jahr für Jahr mit inflationsangepasster Entnahme.",
      variables: [
        { symbol: "Vermögen", description: "Vorhandenes Anlagekapital" },
        { symbol: "Rate", description: "Entnahmerate pro Jahr (z. B. 4 %)" },
        { symbol: "Jahresausgaben", description: "Benötigte Auszahlung pro Jahr" },
        { symbol: "Rendite", description: "Erwartete jährliche Portfoliorendite" },
        { symbol: "Inflation", description: "Jährliche Steigerung der Entnahme" },
      ],
    },
    examples: [
      {
        title: "Klassisches FIRE",
        inputs: "2.000 €/Monat · 4 % Entnahmerate",
        result: "FIRE-Zahl ≈ 600.000 €",
      },
      {
        title: "500.000 € Portfolio",
        inputs: "500.000 € · 4 % · 6 % Rendite · 2 % Inflation",
        result: "≈ 1.667 €/Monat, nachhaltig über 30+ Jahre",
      },
      {
        title: "Lean FIRE",
        inputs: "1.500 €/Monat · 3,5 % Entnahmerate",
        result: "FIRE-Zahl ≈ 514.000 €",
      },
    ],
    faq: [
      {
        question: "Was ist die 4-%-Regel?",
        answer:
          "Die Trinity-Studie (1998) hat historische US-Marktdaten analysiert und gezeigt: Wer im ersten Jahr 4 % seines Portfolios entnimmt und die Entnahme danach jährlich mit der Inflation erhöht, konnte in der überwiegenden Mehrheit der Fälle 30 Jahre lang leben, ohne das Vermögen aufzubrauchen. Für längere Zeiträume oder mehr Sicherheit werden häufig 3 – 3,5 % empfohlen.",
      },
      {
        question: "Was bedeutet FIRE?",
        answer:
          "FIRE steht für „Financial Independence, Retire Early“. Das Ziel: genug Vermögen aufbauen, damit die Kapitalerträge (bzw. die Entnahme) die Lebenshaltungskosten dauerhaft decken. Die FIRE-Zahl ist das dafür nötige Vermögen – bei 4 % Regel etwa das 25-fache der Jahresausgaben.",
      },
      {
        question: "Warum ist die Inflation so wichtig?",
        answer:
          "Weil deine Ausgaben mit der Zeit steigen. Wer heute 2.000 € braucht, benötigt bei 2 % Inflation in 20 Jahren rund 2.972 €. Der Rechner berücksichtigt das, indem er die Entnahme jedes Jahr an die Inflation anpasst und mit der Rendite verrechnet.",
      },
      {
        question: "Sind Steuern berücksichtigt?",
        answer:
          "Nein. Auf Kapitalerträge fällt in Deutschland Abgeltungssteuer (25 % + Soli + ggf. Kirchensteuer) an. Rechne für eine realistische Netto-Auszahlung mit einer etwas höheren Bruttoentnahme oder ziehe die Steuer von deiner Wunschentnahme wieder hoch.",
      },
      {
        question: "Warum ist die Reichweite manchmal endlich?",
        answer:
          "Wenn die reale Rendite (Rendite − Inflation) niedriger ist als die Entnahmerate, wird das Kapital langsam aufgezehrt. Erhöhe die Rendite-Annahme, senke die Entnahme oder erhöhe das Startkapital, um eine nachhaltige Entnahme zu erreichen.",
      },
    ],
    relatedSlugs: ["zinseszins-rechner", "inflationsrechner"],
    sources: [
      {
        label: "Trinity Study – Sustainable Withdrawal Rates",
        url: "https://en.wikipedia.org/wiki/Trinity_study",
      },
    ],
  },
  {
    slug: "inflationsrechner",
    name: "Inflationsrechner",
    shortDescription: "Was ist mein Geld in einigen Jahren noch wert?",
    description:
      "Berechne, wie viel Kaufkraft ein heutiger Geldbetrag durch Inflation in der Zukunft noch hat – z. B. was 100.000 € in 20 Jahren noch wert sind.",
    category: "finanzen",
    keywords: [
      "inflation",
      "inflationsrechner",
      "kaufkraft",
      "kaufkraftverlust",
      "geldentwertung",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: InflationCalculator,
    formula: {
      expression: "Kaufkraft = Betrag / (1 + i)^n",
      explanation:
        "Die zukünftige Kaufkraft eines heutigen Betrags ergibt sich, indem man ihn durch den Inflationsfaktor (1 + i)^n abzinst. i ist die jährliche Inflationsrate, n die Anzahl der Jahre.",
      variables: [
        { symbol: "Betrag", description: "Heutiger Geldbetrag in Euro" },
        { symbol: "i", description: "Jährliche Inflationsrate (dezimal, z. B. 0,02)" },
        { symbol: "n", description: "Anzahl der Jahre in der Zukunft" },
        { symbol: "Kaufkraft", description: "Wert in heutiger Kaufkraft" },
      ],
    },
    examples: [
      {
        title: "100.000 € in 20 Jahren",
        inputs: "100.000 € · 2,5 % Inflation · 20 Jahre",
        result: "≈ 61.027 € Kaufkraft (~ 39 % Verlust)",
      },
      {
        title: "50.000 € in 10 Jahren",
        inputs: "50.000 € · 3 % Inflation · 10 Jahre",
        result: "≈ 37.204 € Kaufkraft",
      },
    ],
    faq: [
      {
        question: "Welche Inflationsrate sollte ich ansetzen?",
        answer:
          "Die Europäische Zentralbank zielt langfristig auf 2 % pro Jahr. Deutschland lag zwischen 2000 und 2020 im Schnitt bei etwa 1,5 %, in den Jahren 2022–2023 zeitweise über 6 %. Für langfristige Prognosen ist 2 – 3 % ein üblicher Wert.",
      },
      {
        question: "Wie stark entwertet Inflation mein Geld?",
        answer:
          "Bei 2 % Inflation halbiert sich die Kaufkraft eines Betrags in ca. 35 Jahren, bei 3 % in ca. 23 Jahren und bei 5 % bereits in ca. 14 Jahren. Faustformel: 70 / Inflationsrate = Halbierungsdauer in Jahren.",
      },
      {
        question: "Berücksichtigt der Rechner Zinsen oder Rendite?",
        answer:
          "Nein. Er zeigt reine Geldentwertung. Um die reale Rendite einer Anlage zu ermitteln, ziehe die Inflationsrate von deiner Nominalrendite ab – oder nutze zusätzlich den Zinseszins-Rechner.",
      },
      {
        question: "Ist Inflation für alle Menschen gleich hoch?",
        answer:
          "Nein. Der offizielle Verbraucherpreisindex ist ein Durchschnitt. Wer viel Miete, Energie oder Lebensmittel bezahlt, spürt oft eine höhere persönliche Inflation als jemand mit anderer Ausgabenstruktur.",
      },
    ],
    relatedSlugs: ["zinseszins-rechner"],
    sources: [
      {
        label: "Statistisches Bundesamt – Verbraucherpreisindex",
        url: "https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html",
      },
      {
        label: "EZB – Inflationsziel",
        url: "https://www.ecb.europa.eu/mopo/strategy/pricestab/html/index.de.html",
      },
    ],
  },
  {
    slug: "zinseszins-rechner",
    name: "Zinseszins-Rechner",
    shortDescription: "Vermögensaufbau mit Zinseszins und Sparrate berechnen.",
    description:
      "Berechne, wie dein Vermögen durch Zinseszins wächst – mit Startkapital, jährlichem Zinssatz, Anlagedauer und optionaler monatlicher oder jährlicher Sparrate.",
    category: "finanzen",
    keywords: [
      "zinseszins",
      "sparplan",
      "vermögensaufbau",
      "etf sparplan",
      "rendite",
      "zinsen",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: ZinseszinsCalculator,
    formula: {
      expression: "K_n = K_0 · (1 + i)^n + R · ((1 + i)^n − 1) / i",
      explanation:
        "Das Endkapital ergibt sich aus dem verzinsten Startkapital plus dem verzinsten Wert aller regelmäßigen Sparraten. Bei monatlicher Zinsgutschnung wird i durch 12 geteilt und n mit 12 multipliziert.",
      variables: [
        { symbol: "K_0", description: "Startkapital" },
        { symbol: "i", description: "Zinssatz pro Periode (dezimal)" },
        { symbol: "n", description: "Anzahl der Perioden" },
        { symbol: "R", description: "Sparrate pro Periode (nachschüssig)" },
        { symbol: "K_n", description: "Endkapital nach n Perioden" },
      ],
    },
    examples: [
      {
        title: "ETF-Sparplan über 20 Jahre",
        inputs: "0 € Startkapital · 200 €/Monat · 6 % p. a. · 20 Jahre",
        result: "≈ 92.408 € Endkapital (davon ≈ 44.408 € Zinsen)",
        note: "Vor Steuern und Kosten, jährliche Verzinsung.",
      },
      {
        title: "Einmalanlage",
        inputs: "10.000 € · 5 % p. a. · 15 Jahre · keine Sparrate",
        result: "≈ 20.789 € Endkapital",
      },
    ],
    faq: [
      {
        question: "Was ist der Zinseszinseffekt?",
        answer:
          "Beim Zinseszins werden bereits gutgeschriebene Zinsen im nächsten Zeitraum ebenfalls verzinst. Dadurch wächst das Vermögen exponentiell und nicht mehr linear – besonders spürbar bei langen Anlagezeiträumen.",
      },
      {
        question: "Welchen Zinssatz sollte ich ansetzen?",
        answer:
          "Für Tages- oder Festgeld orientierst du dich am aktuellen Marktzins (aktuell meist 2–3 %). Für breit gestreute Aktien-ETFs wird oft mit 5–7 % pro Jahr vor Inflation gerechnet – ohne Garantie, langfristige Durchschnittswerte.",
      },
      {
        question: "Sind Steuern berücksichtigt?",
        answer:
          "Nein. Der Rechner zeigt Bruttowerte vor Abgeltungssteuer, Solidaritätszuschlag und Kirchensteuer. In Deutschland fallen auf Kapitalerträge 25 % Abgeltungssteuer plus Zuschläge an, abzüglich Sparerpauschbetrag.",
      },
      {
        question: "Wie wirkt sich die Zinsgutschnung aus?",
        answer:
          "Eine monatliche statt jährlichen Verzinsung führt zu einem leicht höheren Endkapital, weil Zinsen früher weiterverzinst werden. Der Unterschied ist bei üblichen Zinssätzen jedoch klein.",
      },
    ],
    sources: [
      {
        label: "Bundesbank – Zinsstatistik",
        url: "https://www.bundesbank.de/de/statistiken/geld-und-kapitalmaerkte/zinssaetze-und-renditen",
      },
    ],
  },
  {
    slug: "brutto-netto-rechner",
    name: "Brutto-Netto-Rechner",
    shortDescription: "Nettogehalt aus dem Bruttogehalt berechnen.",
    description:
      "Berechne dein Nettogehalt aus dem Bruttolohn – inklusive Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Sozialversicherungsbeiträgen (Werte 2025).",
    category: "arbeit",
    keywords: [
      "brutto netto",
      "gehaltsrechner",
      "nettogehalt",
      "lohnsteuer",
      "sozialversicherung",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: BruttoNettoCalculator,
    formula: {
      expression:
        "Netto = Brutto − Lohnsteuer − Soli − Kirchensteuer − Sozialversicherung",
      explanation:
        "Vom Bruttolohn werden Lohnsteuer nach Steuerklasse, ggf. Solidaritätszuschlag und Kirchensteuer sowie der Arbeitnehmeranteil zur Sozialversicherung (Kranken-, Pflege-, Renten- und Arbeitslosenversicherung) abgezogen.",
      variables: [
        { symbol: "Brutto", description: "Bruttolohn vor Abzügen" },
        { symbol: "Lohnsteuer", description: "Einkommensteuer je nach Steuerklasse" },
        { symbol: "Soli", description: "5,5 % der Lohnsteuer, oberhalb der Freigrenze" },
        { symbol: "KiSt", description: "8 % (BY, BW) oder 9 % der Lohnsteuer" },
        { symbol: "SV", description: "Kranken-, Pflege-, Renten- und Arbeitslosenversicherung" },
      ],
    },
    examples: [
      {
        title: "Single, Steuerklasse I",
        inputs: "4.000 € brutto/Monat · keine Kirchensteuer · kinderlos",
        result: "≈ 2.560 € netto/Monat",
        note: "Werte gerundet, kassenindividueller Zusatzbeitrag 1,7 %.",
      },
      {
        title: "Verheiratet, Steuerklasse III",
        inputs: "5.500 € brutto/Monat · mit Kindern · 9 % Kirchensteuer",
        result: "≈ 3.900 € netto/Monat",
      },
    ],
    faq: [
      {
        question: "Wie genau ist das Ergebnis?",
        answer:
          "Der Rechner nutzt die offiziellen Rechengrößen 2025 und den Einkommensteuertarif der Grundtabelle. Individuelle Freibeträge (z. B. Kinderfreibetrag, Werbungskosten über Pauschale, geldwerte Vorteile) sind nicht berücksichtigt. Das Ergebnis ist eine gute Orientierung, ersetzt aber keine offizielle Lohnabrechnung.",
      },
      {
        question: "Welche Steuerklasse ist die richtige?",
        answer:
          "Ledige haben Steuerklasse I, Alleinerziehende II. Verheiratete können III/V oder IV/IV wählen, Steuerklasse VI gilt für Nebenjobs. Die Wahl beeinflusst den monatlichen Nettoauszahlungsbetrag, nicht die Jahressteuerlast.",
      },
      {
        question: "Warum wird Solidaritätszuschlag manchmal mit 0 € angezeigt?",
        answer:
          "Seit 2021 gilt eine hohe Freigrenze. Für Alleinstehende fällt Soli erst ab etwa 18.130 € Lohnsteuer pro Jahr an, bei Zusammenveranlagung entsprechend höher.",
      },
      {
        question: "Zählt der Arbeitgeberanteil zur Sozialversicherung mit?",
        answer:
          "Nein. Angezeigt wird nur der Arbeitnehmeranteil, der tatsächlich vom Bruttolohn abgezogen wird. Der Arbeitgeber trägt ungefähr denselben Anteil zusätzlich.",
      },
    ],
    sources: [
      {
        label: "BMF – Rechengrößen der Sozialversicherung 2025",
        url: "https://www.bundesfinanzministerium.de/",
      },
    ],
  },
  {
    slug: "bmi-rechner",
    name: "BMI-Rechner",
    shortDescription: "Body-Mass-Index berechnen und einordnen.",
    description:
      "Berechne deinen Body-Mass-Index (BMI) aus Größe und Gewicht. Mit direkter Einordnung nach WHO-Kategorien.",
    category: "gesundheit",
    keywords: ["bmi", "body mass index", "gewicht", "gesundheit"],
    popular: true,
    updatedAt: "2026-07-08",
    component: BmiCalculator,
    formula: {
      expression: "BMI = Gewicht (kg) / Größe (m)²",
      explanation:
        "Der BMI setzt das Körpergewicht ins Verhältnis zum Quadrat der Körpergröße. Er ist ein grober Richtwert und berücksichtigt weder Muskelmasse noch Körperbau.",
      variables: [
        { symbol: "Gewicht", description: "Körpergewicht in Kilogramm" },
        { symbol: "Größe", description: "Körpergröße in Metern" },
      ],
    },
    examples: [
      {
        title: "Normalgewicht",
        inputs: "175 cm · 70 kg",
        result: "BMI 22,9 – Normalgewicht",
      },
      {
        title: "Übergewicht",
        inputs: "180 cm · 95 kg",
        result: "BMI 29,3 – Übergewicht",
      },
    ],
    faq: [
      {
        question: "Für wen ist der BMI aussagekräftig?",
        answer:
          "Der BMI gilt als Richtwert für Erwachsene zwischen 18 und 65 Jahren. Für Kinder, Schwangere sowie sehr muskulöse Menschen sind andere Werte besser geeignet.",
      },
      {
        question: "Welche BMI-Werte sind normal?",
        answer:
          "Nach WHO-Klassifikation gilt: unter 18,5 Untergewicht, 18,5–24,9 Normalgewicht, 25–29,9 Übergewicht, ab 30 Adipositas.",
      },
      {
        question: "Ist der BMI eine medizinische Diagnose?",
        answer:
          "Nein. Der BMI ersetzt keine ärztliche Untersuchung. Er dient nur als grobe Orientierung.",
      },
    ],
    sources: [
      { label: "WHO – Body Mass Index", url: "https://www.who.int/health-topics/obesity" },
    ],
  },
  {
    slug: "reisekostenrechner",
    name: "Reisekostenrechner",
    shortDescription:
      "Gesamtkosten, Kosten pro Person und Tagesbudget für deine Reise berechnen.",
    description:
      "Plane dein Reisebudget: Der Rechner summiert Unterkunft, Verpflegung, Flüge, Mietwagen, Aktivitäten und Sonstiges und zeigt dir Gesamtkosten, Kosten pro Person sowie ein realistisches Tagesbudget.",
    category: "reisen",
    keywords: [
      "reisekosten",
      "reisekostenrechner",
      "urlaubskosten",
      "reisebudget",
      "urlaubsbudget",
      "tagesbudget urlaub",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: ReisekostenCalculator,
    formula: {
      expression:
        "Gesamt = Unterkunft·Tage + Verpflegung·Personen·Tage + Flüge·Personen + Mietwagen·Tage + Aktivitäten + Sonstiges",
      explanation:
        "Die einzelnen Posten werden je nach Bezugsgröße hochgerechnet (pro Nacht, pro Person, pro Tag) und aufsummiert. Kosten pro Person = Gesamt / Personen; Tagesbudget = Gesamt / Tage.",
      variables: [
        { symbol: "Personen", description: "Anzahl mitreisender Personen" },
        { symbol: "Tage", description: "Reisedauer in Tagen bzw. Nächten" },
        { symbol: "Unterkunft", description: "Preis pro Nacht (gesamt)" },
        { symbol: "Verpflegung", description: "Kosten pro Person und Tag" },
        { symbol: "Flüge", description: "Anreisekosten pro Person" },
        { symbol: "Mietwagen", description: "Tagespreis Mietwagen" },
        { symbol: "Aktivitäten", description: "Ausflüge, Eintritte, Touren gesamt" },
      ],
    },
    examples: [
      {
        title: "Städtereise zu zweit",
        inputs: "2 Personen · 4 Tage · 120 €/Nacht · 40 €/P/Tag · 150 € Flug",
        result: "≈ 1.100 € gesamt · ~550 € pro Person",
      },
      {
        title: "Familienurlaub",
        inputs: "4 Personen · 10 Tage · 150 €/Nacht · 30 €/P/Tag · 250 € Flug",
        result: "≈ 4.700 € gesamt · ~1.175 € pro Person",
      },
      {
        title: "Roadtrip",
        inputs: "2 Personen · 14 Tage · 80 €/Nacht · 35 €/P/Tag · 55 €/Tag Mietwagen",
        result: "≈ 3.100 € gesamt · ~220 € pro Tag",
      },
    ],
    faq: [
      {
        question: "Welche Kosten sollte ich einrechnen?",
        answer:
          "Neben den offensichtlichen Posten (Anreise, Unterkunft, Verpflegung) gerne auch Trinkgelder, Souvenirs, Parkgebühren, Reiseversicherung, Roaming, Visa und einen Puffer von 10–15 % für Unerwartetes.",
      },
      {
        question: "Wie realistisch ist das Tagesbudget?",
        answer:
          "Das Tagesbudget ist ein Durchschnittswert. Ankunfts- und Abreisetage sind oft günstiger, Ausflugstage teurer. Für die konkrete Tagesplanung hilft es, Unterkunft und Anreise vom Tagesbudget zu trennen und nur Verpflegung + Aktivitäten pro Tag zu betrachten.",
      },
      {
        question: "Wie kalkuliere ich Verpflegung realistisch?",
        answer:
          "Grobe Richtwerte: Selbstversorgung 15–25 €/Person/Tag, Restaurantküche in Deutschland 35–50 €, teure Reiseziele (Skandinavien, Schweiz, USA) 60–80 €, günstige Länder in Südostasien 10–20 €.",
      },
      {
        question: "Sind Wechselkurse berücksichtigt?",
        answer:
          "Nein. Gib alle Werte in Euro ein. Für Reisen außerhalb der Eurozone rechnest du am besten mit dem tagesaktuellen Kurs und einem Aufschlag von 1–3 % für Karten- oder Wechselgebühren.",
      },
    ],
    relatedSlugs: ["kreditrechner", "inflationsrechner"],
    sources: [
      {
        label: "Statistisches Bundesamt – Reisen der Deutschen",
        url: "https://www.destatis.de/",
      },
    ],
  },
  {
    slug: "packlisten-generator",
    name: "Packlisten-Generator",
    shortDescription:
      "Individuelle Packliste für deine Reise – nach Ziel, Klima, Dauer und Aktivitäten.",
    description:
      "Generiere eine maßgeschneiderte Packliste: Gib Reiseziel, Klima, Dauer und geplante Aktivitäten an und erhalte eine strukturierte Checkliste mit Dokumenten, Kleidung, Hygiene, Elektronik und aktivitätsspezifischer Ausrüstung. Punkte lassen sich direkt abhaken.",
    category: "reisen",
    keywords: [
      "packliste",
      "packlisten generator",
      "reise checkliste",
      "urlaub packen",
      "was mitnehmen",
      "reise packliste",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: PacklisteCalculator,
    formula: {
      expression: "Liste = Basis + f(Klima) + f(Dauer) + Σ f(Aktivität_i)",
      explanation:
        "Die Packliste kombiniert eine Basisausstattung (Dokumente, Hygiene, Elektronik) mit klimaspezifischer Kleidung und dauerabhängigen Mengen (z. B. Unterwäsche = Dauer + 1, max. 10). Für jede gewählte Aktivität kommen passende Ausrüstungsgegenstände hinzu.",
      variables: [
        { symbol: "Reiseziel", description: "Bestimmt Reisepass, Adapter, Handgepäck-Regeln" },
        { symbol: "Klima", description: "Warm, gemäßigt oder kalt – wählt die Kleidung" },
        { symbol: "Dauer", description: "Skaliert Mengen von Kleidung und Hygieneartikeln" },
        { symbol: "Aktivitäten", description: "Strand, Wandern, Business, Ski usw." },
      ],
    },
    examples: [
      {
        title: "Strandurlaub Thailand",
        inputs: "Thailand · warm · 14 Tage · Strand, Fotografie",
        result: "≈ 50 Punkte inkl. Reisepass, Adapter, Sonnencreme, Schnorchel",
      },
      {
        title: "Städtetrip Berlin",
        inputs: "Berlin · gemäßigt · 3 Tage · Städtetrip, Ausgehen",
        result: "≈ 30 Punkte, kompaktes Handgepäck",
      },
      {
        title: "Skiurlaub Österreich",
        inputs: "Österreich · kalt · 7 Tage · Ski, Fotografie",
        result: "≈ 55 Punkte inkl. Skianzug, Thermokleidung, Skibrille",
      },
    ],
    faq: [
      {
        question: "Woher weiß der Generator, was ich brauche?",
        answer:
          "Er kombiniert eine Basis-Liste (Dokumente, Hygiene, Elektronik) mit Klima-Modulen (warm/gemäßigt/kalt) und aktivitätsspezifischen Ergänzungen. Die Mengen von Kleidung und Verbrauchsgütern skalieren automatisch mit der Reisedauer.",
      },
      {
        question: "Warum wird bei bestimmten Zielen ein Reisepass ergänzt?",
        answer:
          "Wenn du im Reiseziel Länder außerhalb der EU eingibst (z. B. USA, Thailand, Japan), erweitert der Generator die Dokumentenliste um Reisepass, Auslandskrankenversicherung und Steckdosenadapter. Prüfe zusätzlich immer aktuelle Einreisebestimmungen und Visumspflicht.",
      },
      {
        question: "Kann ich die Liste als Checkliste nutzen?",
        answer:
          "Ja – jeder Punkt hat eine Checkbox. Beim Packen kannst du die Einträge direkt abhaken. Der Fortschritt oben zeigt, wie viele Punkte bereits erledigt sind.",
      },
      {
        question: "Ist die Liste vollständig?",
        answer:
          "Die Liste deckt die typischen Reisebedürfnisse ab, ersetzt aber keine persönliche Prüfung. Individuelle Medikamente, spezielle Sportausrüstung, kinder- oder haustierspezifische Dinge musst du ggf. ergänzen.",
      },
    ],
    relatedSlugs: ["reisekostenrechner"],
    sources: [
      {
        label: "Auswärtiges Amt – Reise- und Sicherheitshinweise",
        url: "https://www.auswaertiges-amt.de/de/ReiseUndSicherheit",
      },
    ],
  },
  {
    slug: "mietwagen-kostenrechner",
    name: "Mietwagen-Kostenrechner",
    shortDescription:
      "Gesamtkosten eines Mietwagens inkl. Versicherung, Sprit, Maut und Parkgebühren.",
    description:
      "Berechne die tatsächlichen Kosten deines Mietwagens: Mietpreis, Zusatzversicherung, Kraftstoff (auf Basis von Fahrleistung, Verbrauch und Spritpreis), Maut, Parkgebühren und Zusatzoptionen wie Zweitfahrer oder Kindersitz.",
    category: "reisen",
    keywords: [
      "mietwagen kosten",
      "mietwagen rechner",
      "mietwagenkosten",
      "leihwagen kosten",
      "auto mieten kosten",
      "vollkasko mietwagen",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: MietwagenCalculator,
    formula: {
      expression:
        "Gesamt = (Miete + Versicherung + Parken)·Tage + km·Verbrauch/100·Spritpreis + Maut + Zusatz",
      explanation:
        "Tagesposten (Miete, Zusatzversicherung, Parken) werden mit der Mietdauer multipliziert. Die Spritkosten ergeben sich aus gefahrenen Kilometern, Verbrauch pro 100 km und dem Kraftstoffpreis. Maut und Zusatzkosten (Zusatzfahrer, Kindersitz) werden als Pauschale addiert.",
      variables: [
        { symbol: "Tage", description: "Mietdauer in Tagen" },
        { symbol: "Miete", description: "Grundpreis pro Tag" },
        { symbol: "Versicherung", description: "Zusatzversicherung pro Tag (z. B. Vollkasko ohne SB)" },
        { symbol: "km", description: "Gesamte Fahrleistung" },
        { symbol: "Verbrauch", description: "Liter pro 100 km" },
        { symbol: "Spritpreis", description: "Kraftstoffpreis pro Liter" },
      ],
    },
    examples: [
      {
        title: "Städtereise 3 Tage",
        inputs: "3 Tage · 40 €/Tag · Vollkasko 10 €/Tag · 100 km/Tag · 15 € Parken",
        result: "≈ 240 € gesamt",
      },
      {
        title: "Urlaub 2 Wochen",
        inputs: "14 Tage · 45 €/Tag · 12 €/Tag Vers. · 150 km/Tag · 30 € Maut",
        result: "≈ 1.100 € gesamt",
      },
      {
        title: "Roadtrip mit Vignette",
        inputs: "10 Tage · 55 €/Tag · 200 km/Tag · 6 l/100 km · 60 € Maut",
        result: "≈ 990 € gesamt",
      },
    ],
    faq: [
      {
        question: "Warum ist der angezeigte Buchungspreis oft günstiger?",
        answer:
          "Der Grundpreis der Buchung enthält meist nur eine einfache Haftpflicht und CDW mit hoher Selbstbeteiligung. Zusatzversicherung (Vollkasko ohne SB), Zweitfahrer, Kindersitz, Flughafengebühr, Einwegmiete und Sprit kommen häufig obendrauf.",
      },
      {
        question: "Welche Tankregelung ist am günstigsten?",
        answer:
          "„Voll/Voll“ ist fast immer am günstigsten: Du übernimmst voll und gibst voll zurück. „Voll/Leer“ ist bequem, aber der Anbieter berechnet oft Tankfüllung + Servicegebühr weit über Marktpreis – meist deutlich teurer.",
      },
      {
        question: "Brauche ich Vollkasko ohne Selbstbeteiligung?",
        answer:
          "Im Ausland ist eine SB-Reduzierung fast immer sinnvoll, da Standard-Selbstbeteiligungen 1.000–2.500 € betragen. Alternative: eine unabhängige Mietwagen-Vollkasko (10–70 €/Jahr) bei einem deutschen Versicherer – oft günstiger als die Anbieter-Zusatzversicherung.",
      },
      {
        question: "Sind Maut und Vignette immer nötig?",
        answer:
          "Nur in Ländern mit Maut- oder Vignettenpflicht (z. B. Österreich, Schweiz, Italien, Frankreich, Portugal, Kroatien). Prüfe vorab die Regelung: Vignetten werden oft schon an der Grenze verkauft, Streckenmaut wird an Mautstellen bezahlt oder elektronisch erfasst.",
      },
    ],
    relatedSlugs: ["reisekostenrechner", "elektroauto-vs-verbrenner"],
    sources: [
      {
        label: "ADAC – Mietwagen im Ausland",
        url: "https://www.adac.de/",
      },
      {
        label: "Stiftung Warentest – Mietwagen",
        url: "https://www.test.de/",
      },
    ],
  },
  {
    slug: "pace-rechner",
    name: "Pace-Rechner",
    shortDescription:
      "Pace, Endzeit oder Distanz beim Laufen berechnen – inkl. Zwischenzeiten.",
    description:
      "Berechne die nötige Lauf-Pace für ein Zeitziel (z. B. Marathon unter 4 Stunden), die voraussichtliche Endzeit bei gegebener Pace oder die erreichbare Distanz. Mit Zwischenzeiten für 1 km, 5 km, 10 km, Halbmarathon und Marathon sowie Umrechnung in km/h und min/Meile.",
    category: "sport",
    keywords: [
      "pace rechner",
      "laufpace",
      "marathon pace",
      "halbmarathon pace",
      "min pro km",
      "endzeit laufen",
      "sub 4 marathon",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: PaceCalculator,
    formula: {
      expression:
        "Pace [s/km] = Zeit [s] / Distanz [km]   ·   Zeit = Pace · Distanz   ·   v [km/h] = 3600 / Pace",
      explanation:
        "Die Pace ist die Zeit pro Kilometer. Aus zwei bekannten Werten (Zeit, Distanz oder Pace) lässt sich der dritte direkt ausrechnen. Die Geschwindigkeit in km/h ist der Kehrwert der Pace, umgerechnet auf eine Stunde.",
      variables: [
        { symbol: "Pace", description: "Zeit pro Kilometer (min:ss / km)" },
        { symbol: "Zeit", description: "Gesamte Laufzeit" },
        { symbol: "Distanz", description: "Laufstrecke in km" },
        { symbol: "v", description: "Geschwindigkeit in km/h" },
      ],
    },
    examples: [
      {
        title: "Marathon unter 4:00 h",
        inputs: "42,195 km · Zielzeit 4:00:00",
        result: "Pace 5:41 min/km · 10,55 km/h",
      },
      {
        title: "Halbmarathon unter 2:00 h",
        inputs: "21,0975 km · Zielzeit 2:00:00",
        result: "Pace 5:41 min/km · 10,55 km/h",
      },
      {
        title: "10 km in 50 Minuten",
        inputs: "10 km · Zielzeit 0:50:00",
        result: "Pace 5:00 min/km · 12,0 km/h",
      },
    ],
    faq: [
      {
        question: "Welche Pace brauche ich für einen Sub-4-Marathon?",
        answer:
          "Für einen Marathon (42,195 km) unter 4 Stunden musst du konstant 5:41 min/km laufen – das sind rund 10,55 km/h. Realistisch plant man einen kleinen Puffer ein, also eher 5:35–5:38 min/km, weil Verpflegungsstellen, Steigungen und leichte Tempoverluste in der zweiten Hälfte typisch sind.",
      },
      {
        question: "Wie unterscheiden sich Pace und Geschwindigkeit?",
        answer:
          "Pace ist Zeit pro Strecke (min/km), Geschwindigkeit ist Strecke pro Zeit (km/h). Umrechnung: v [km/h] = 60 / Pace [min/km]. Eine Pace von 6:00 min/km entspricht 10 km/h.",
      },
      {
        question: "Wie ist die Pace in Meilen (min/mi)?",
        answer:
          "Multipliziere die Pace in min/km mit 1,609. Beispiel: 5:00 min/km ≈ 8:03 min/mi. Der Rechner zeigt beides parallel an.",
      },
      {
        question: "Sollte ich die Pace konstant halten?",
        answer:
          "Auf Wettkampfdistanzen ist eine gleichmäßige oder leicht negative Split (zweite Hälfte etwas schneller) am effizientesten. Zu schneller Start ist der häufigste Fehler – die letzten Kilometer werden dann überproportional langsamer.",
      },
    ],
    relatedSlugs: ["bmi-rechner"],
    sources: [
      {
        label: "World Athletics – Distances",
        url: "https://worldathletics.org/",
      },
    ],
  },
  {
    slug: "spritkosten-rechner",
    name: "Spritkosten-Rechner",
    shortDescription:
      "Spritkosten für Hin- und Rückfahrt und pro Mitfahrer berechnen.",
    description:
      "Berechne die Spritkosten einer Fahrt aus Strecke, Verbrauch und Benzinpreis – wahlweise für die einfache Strecke oder für Hin- und Rückfahrt. Inklusive Aufteilung auf mehrere Mitfahrer.",
    category: "reisen",
    keywords: [
      "spritkosten rechner",
      "benzinkosten",
      "spritkosten berechnen",
      "fahrtkosten",
      "kosten pro km",
      "mitfahrer kosten",
    ],
    popular: false,
    updatedAt: "2026-07-08",
    component: SpritkostenCalculator,
    formula: {
      expression:
        "Kosten = (Strecke · Verbrauch / 100) · Spritpreis   ·   pro Person = Kosten / Personen",
      explanation:
        "Aus Strecke und Verbrauch ergibt sich die insgesamt benötigte Kraftstoffmenge in Litern. Multipliziert mit dem Preis pro Liter erhältst du die Spritkosten. Bei Hin- und Rückfahrt wird die Strecke verdoppelt; für die Kosten pro Person werden die Gesamtkosten durch die Anzahl der Insassen geteilt.",
      variables: [
        { symbol: "Strecke", description: "Einfache Distanz in km" },
        { symbol: "Verbrauch", description: "Durchschnittsverbrauch in l/100km" },
        { symbol: "Spritpreis", description: "Preis pro Liter Kraftstoff" },
        { symbol: "Personen", description: "Anzahl Insassen inkl. Fahrer" },
      ],
    },
    examples: [
      {
        title: "Pendelfahrt",
        inputs: "40 km · 6,5 l/100km · 1,75 €/L · hin & zurück",
        result: "≈ 9,10 € pro Arbeitstag",
      },
      {
        title: "Urlaubsfahrt zu viert",
        inputs: "700 km · 7,0 l/100km · 1,80 €/L · 4 Personen · hin & zurück",
        result: "≈ 176 € gesamt · 44 € pro Person",
      },
      {
        title: "Kurze Einfachstrecke",
        inputs: "150 km · 5,5 l/100km · 1,70 €/L · nur Hinfahrt",
        result: "≈ 14,03 €",
      },
    ],
    faq: [
      {
        question: "Welchen Verbrauchswert sollte ich eintragen?",
        answer:
          "Am genauesten ist der Verbrauch laut Bordcomputer über mehrere Tankfüllungen. Alternativ WLTP-Wert aus dem Fahrzeugschein plus 10–20 % Aufschlag für die Realität – Kurzstrecken, Autobahn und Winter erhöhen den Verbrauch spürbar.",
      },
      {
        question: "Ist die Aufteilung auf Mitfahrer rechtlich okay?",
        answer:
          "Ja – solange nur die reinen Selbstkosten (anteilige Spritkosten) geteilt werden und keine Gewinnabsicht besteht. Sonst gilt es als gewerbliche Personenbeförderung und braucht eine Lizenz.",
      },
      {
        question: "Was ist mit Verschleiß, Steuer und Versicherung?",
        answer:
          "Dieser Rechner zeigt nur die reinen Kraftstoffkosten. Der ADAC rechnet für die vollen Betriebskosten je nach Fahrzeug mit 25–70 ct/km inkl. Wertverlust, Wartung, Steuer und Versicherung.",
      },
      {
        question: "Funktioniert das auch für Diesel oder E10?",
        answer:
          "Ja. Trage einfach den aktuellen Preis pro Liter deines Kraftstoffs ein – die Rechnung ist für Benzin, Diesel, E10, LPG und Ethanol identisch.",
      },
    ],
    relatedSlugs: ["mietwagen-kostenrechner", "reisekostenrechner", "elektroauto-vs-verbrenner"],
    sources: [
      {
        label: "ADAC – Kraftstoffpreise",
        url: "https://www.adac.de/verkehr/tanken-kraftstoff-antrieb/deutschland/kraftstoffpreise/",
      },
    ],
  },
  {
    slug: "pendlerpauschale-rechner",
    name: "Pendlerpauschale-Rechner",
    shortDescription:
      "Entfernungspauschale, Homeoffice-Pauschale und Steuervorteil berechnen.",
    description:
      "Berechne die absetzbare Entfernungspauschale für deinen Arbeitsweg 2024/2025 – mit gestaffeltem Kilometersatz (0,30 € / 0,38 €), Verkehrsmittel-Deckelung, Homeoffice-Pauschale, Abzug des Arbeitnehmer-Pauschbetrags und geschätztem Steuervorteil.",
    category: "steuern",
    keywords: [
      "pendlerpauschale rechner",
      "entfernungspauschale",
      "kilometerpauschale",
      "fahrtkosten arbeitsweg",
      "homeoffice pauschale",
      "werbungskosten",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: PendlerpauschaleCalculator,
    formula: {
      expression:
        "Pauschale = (min(km, 20) · 0,30 € + max(km − 20, 0) · 0,38 €) · Pendlertage + Homeoffice-Tage · 6 €",
      explanation:
        "Für die einfache Entfernung zur Arbeit gibt es für die ersten 20 km 0,30 €/km, ab dem 21. Kilometer 0,38 €/km. Dieser Tagessatz wird mit den tatsächlichen Pendlertagen (Arbeitstage − Homeoffice) multipliziert. Zusätzlich sind bis zu 210 Homeoffice-Tage à 6 € (max. 1.260 €) absetzbar. Bei ÖPNV, Rad und zu Fuß gilt ein Deckel von 4.500 € pro Jahr – bei ÖPNV nur, wenn die Ticketkosten nicht höher sind. Der Steuervorteil ergibt sich, indem der über den Arbeitnehmer-Pauschbetrag (1.230 €) hinausgehende Betrag mit dem persönlichen Grenzsteuersatz multipliziert wird.",
      variables: [
        { symbol: "km", description: "Einfache Entfernung zur Arbeit" },
        { symbol: "Pendlertage", description: "Arbeitstage minus Homeoffice-Tage" },
        { symbol: "Grenzsteuersatz", description: "Persönlicher Grenzsteuersatz (25–42 %)" },
        { symbol: "1.230 €", description: "Arbeitnehmer-Pauschbetrag (automatisch)" },
      ],
    },
    examples: [
      {
        title: "Klassischer Pendler",
        inputs: "25 km · 220 Arbeitstage · 0 HO · Pkw · 30 %",
        result: "≈ 1.914 € Pauschale · ~ 205 € Steuervorteil",
      },
      {
        title: "Hybrid-Modell mit Homeoffice",
        inputs: "40 km · 220 Tage · 60 HO · Pkw · 35 %",
        result: "≈ 2.976 € Wegkosten + 360 € HO · ~ 737 € Steuervorteil",
      },
      {
        title: "Kurzer Weg, unter Pauschbetrag",
        inputs: "8 km · 220 Tage · 20 HO · Pkw · 25 %",
        result: "Werbungskosten < 1.230 € – kein zusätzlicher Steuervorteil",
      },
    ],
    faq: [
      {
        question: "Wie hoch ist die Pendlerpauschale 2024/2025?",
        answer:
          "0,30 €/km für die ersten 20 km und 0,38 €/km ab dem 21. Kilometer der einfachen Entfernung zur Arbeit. Der erhöhte Satz gilt befristet bis einschließlich 2026. Berechnet wird nur eine Fahrt pro Arbeitstag (nicht Hin und zurück).",
      },
      {
        question: "Was ist der Arbeitnehmer-Pauschbetrag?",
        answer:
          "1.230 € pro Jahr, die das Finanzamt jedem Arbeitnehmer automatisch als Werbungskosten anerkennt – auch ohne Nachweis. Nur was darüber hinausgeht (z. B. hohe Pendlerpauschale, Arbeitsmittel, Fortbildungen), bringt zusätzlich Steuerersparnis.",
      },
      {
        question: "Wie funktioniert die Homeoffice-Pauschale?",
        answer:
          "Seit 2023 sind 6 € pro Homeoffice-Tag absetzbar, maximal 210 Tage = 1.260 € pro Jahr. Kein separates Arbeitszimmer nötig. An Tagen mit Fahrt zur Arbeit kann in der Regel nicht zusätzlich die HO-Pauschale angesetzt werden.",
      },
      {
        question: "Gilt der 4.500-€-Deckel für alle Verkehrsmittel?",
        answer:
          "Nein. Mit dem eigenen Pkw (oder Firmenwagen) gibt es keine Deckelung. Bei Fahrrad, zu Fuß, Mitfahrgelegenheit sowie ÖPNV gilt der Höchstbetrag von 4.500 €. Bei ÖPNV zählen die tatsächlichen Ticketkosten, wenn sie höher sind.",
      },
      {
        question: "Wie realistisch ist der geschätzte Steuervorteil?",
        answer:
          "Der Vorteil ist eine Näherung: absetzbarer Betrag × persönlicher Grenzsteuersatz. Der reale Effekt hängt vom Gesamteinkommen, Solidaritätszuschlag und Kirchensteuer ab und wird erst im Steuerbescheid genau ausgewiesen.",
      },
    ],
    relatedSlugs: ["brutto-netto-rechner", "stundenlohn-rechner", "ueberstundenrechner"],
    sources: [
      {
        label: "Bundesfinanzministerium – Entfernungspauschale",
        url: "https://www.bundesfinanzministerium.de/",
      },
      {
        label: "§ 9 Abs. 1 Nr. 4 EStG",
        url: "https://www.gesetze-im-internet.de/estg/__9.html",
      },
    ],
  },
  {
    slug: "werbungskosten-rechner",
    name: "Werbungskosten-Rechner",
    shortDescription:
      "Werbungskosten aufsummieren, mit Pauschbetrag vergleichen und Steuerersparnis schätzen.",
    description:
      "Erfasse deine beruflichen Ausgaben (Pendlerpauschale, Homeoffice, Arbeitsmittel, Fortbildung, Bewerbungen u. v. m.), vergleiche die Summe mit dem Arbeitnehmer-Pauschbetrag von 1.230 € und erhalte eine Schätzung deiner zusätzlichen Steuerersparnis.",
    category: "steuern",
    keywords: [
      "werbungskosten rechner",
      "werbungskosten",
      "arbeitnehmer pauschbetrag",
      "steuererklärung werbungskosten",
      "absetzbare kosten arbeitnehmer",
      "1230 euro pauschbetrag",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: WerbungskostenCalculator,
    formula: {
      expression:
        "Angesetzt = max(Σ Werbungskosten, 1.230 €)   ·   Ersparnis = max(Σ − 1.230 €, 0) · Grenzsteuersatz",
      explanation:
        "Das Finanzamt setzt automatisch den Arbeitnehmer-Pauschbetrag von 1.230 € an – unabhängig davon, ob du Werbungskosten nachweist. Nur wenn deine tatsächlichen Kosten höher sind, wirkt sich die Differenz steuerlich aus. Die zusätzliche Ersparnis entspricht der Differenz multipliziert mit deinem persönlichen Grenzsteuersatz.",
      variables: [
        { symbol: "Σ", description: "Summe aller Werbungskosten" },
        { symbol: "1.230 €", description: "Arbeitnehmer-Pauschbetrag (2024/2025)" },
        { symbol: "Grenzsteuersatz", description: "Persönlicher Grenzsteuersatz (25–42 %)" },
      ],
    },
    examples: [
      {
        title: "Klassischer Pendler",
        inputs: "1.900 € Fahrten · 200 € Arbeitsmittel · 30 %",
        result: "2.100 € Werbungskosten · ~ 261 € Ersparnis",
      },
      {
        title: "Homeoffice + Fortbildung",
        inputs: "1.260 € HO · 800 € Fortbildung · 300 € Arbeitsmittel · 35 %",
        result: "2.360 € Werbungskosten · ~ 396 € Ersparnis",
      },
      {
        title: "Unter Pauschbetrag",
        inputs: "400 € Arbeitsmittel · 100 € Bewerbungen · 25 %",
        result: "500 € Werbungskosten · Pauschbetrag greift, keine Zusatzersparnis",
      },
    ],
    faq: [
      {
        question: "Was sind Werbungskosten?",
        answer:
          "Ausgaben, die im Zusammenhang mit deinem Job entstehen: Fahrten zur Arbeit, Arbeitsmittel, Fortbildungen, Bewerbungen, Berufsverbände, Homeoffice, Dienstreisen. Sie mindern das zu versteuernde Einkommen und damit die Steuerlast.",
      },
      {
        question: "Wie hoch ist der Arbeitnehmer-Pauschbetrag?",
        answer:
          "2024 und 2025 beträgt er 1.230 € pro Jahr. Diesen Betrag zieht das Finanzamt automatisch ab – auch ohne Nachweise. Nachweisen lohnt sich also erst, wenn deine tatsächlichen Werbungskosten diese Grenze übersteigen.",
      },
      {
        question: "Welche Belege muss ich aufheben?",
        answer:
          "Rechnungen, Kontoauszüge, Fahrtaufzeichnungen, Fortbildungsnachweise. Belege müssen nicht mehr mit der Steuererklärung eingereicht werden, aber du musst sie im Falle einer Rückfrage vorlegen können – Aufbewahrungsfrist mindestens bis Bestandskraft des Bescheids, sicherheitshalber 4 Jahre.",
      },
      {
        question: "Kann ich Homeoffice und Pendlerpauschale kombinieren?",
        answer:
          "Nicht am selben Tag. An Homeoffice-Tagen zählt die 6-€-Pauschale (max. 1.260 €/Jahr), an Arbeitstagen im Büro die Entfernungspauschale. Beide Beträge fließen als separate Positionen in die Werbungskosten ein.",
      },
      {
        question: "Wie genau ist die geschätzte Ersparnis?",
        answer:
          "Es ist ein Näherungswert (Differenz × Grenzsteuersatz). Der reale Effekt hängt vom Gesamteinkommen, Kirchensteuer und Solidaritätszuschlag ab. Für eine exakte Berechnung: Steuerprogramm oder Steuerberater nutzen.",
      },
    ],
    relatedSlugs: ["pendlerpauschale-rechner", "brutto-netto-rechner", "stundenlohn-rechner"],
    sources: [
      {
        label: "§ 9a EStG – Pauschbeträge für Werbungskosten",
        url: "https://www.gesetze-im-internet.de/estg/__9a.html",
      },
      {
        label: "Bundesfinanzministerium",
        url: "https://www.bundesfinanzministerium.de/",
      },
    ],
  },
  {
    slug: "kapitalertragsteuer-rechner",
    name: "Kapitalertragsteuer-Rechner",
    shortDescription:
      "Abgeltungsteuer, Soli, Kirchensteuer und Sparerpauschbetrag berechnen.",
    description:
      "Berechne die Steuer auf Zinsen, Dividenden und Kursgewinne: 25 % Abgeltungsteuer plus Solidaritätszuschlag und optional Kirchensteuer, unter Berücksichtigung von Sparerpauschbetrag (1.000 € / 2.000 €) und Teilfreistellung für Fonds.",
    category: "finanzen",
    keywords: [
      "kapitalertragsteuer rechner",
      "abgeltungsteuer",
      "kest rechner",
      "sparerpauschbetrag",
      "dividendensteuer",
      "teilfreistellung",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: KapitalertragsteuerCalculator,
    formula: {
      expression:
        "Steuer = max(Ertrag · (1 − TF) − Freibetrag, 0) · 25 %  + Soli 5,5 %  (+ Kirchensteuer 8/9 %)",
      explanation:
        "Auf Kapitalerträge zahlst du pauschal 25 % Abgeltungsteuer plus 5,5 % Solidaritätszuschlag auf diese Steuer. Kirchenmitglieder zahlen zusätzlich 8 % (Bayern, Baden-Württemberg) oder 9 % Kirchensteuer, die die KESt mindert. Vor Steuerberechnung greift der Sparerpauschbetrag (1.000 € einzeln, 2.000 € zusammenveranlagt). Bei Fonds bleibt je nach Typ ein Teil der Erträge steuerfrei (Teilfreistellung).",
      variables: [
        { symbol: "Ertrag", description: "Zinsen, Dividenden, realisierte Kursgewinne" },
        { symbol: "TF", description: "Teilfreistellung (Aktien 30 %, Misch 15 %, Immobilien 60 %)" },
        { symbol: "Freibetrag", description: "Sparerpauschbetrag 1.000 € / 2.000 €" },
        { symbol: "KiSt", description: "Kirchensteuer 8 % oder 9 %" },
      ],
    },
    examples: [
      {
        title: "5.000 € Gewinn, einzel, keine Kirche",
        inputs: "5.000 € · 1.000 € Freibetrag · keine Kirchensteuer",
        result: "≈ 1.054,88 € Steuer · Netto ≈ 3.945 €",
      },
      {
        title: "Aktienfonds mit Teilfreistellung",
        inputs: "5.000 € · Aktienfonds (30 % TF) · einzel",
        result: "≈ 632,50 € Steuer · Netto ≈ 4.368 €",
      },
      {
        title: "Verheiratet mit Kirchensteuer",
        inputs: "8.000 € · zusammen (2.000 €) · 9 % Kirche",
        result: "≈ 1.582 € Steuer · Netto ≈ 6.418 €",
      },
    ],
    faq: [
      {
        question: "Was ist die Abgeltungsteuer?",
        answer:
          "Ein pauschaler Steuersatz von 25 % auf Kapitalerträge – unabhängig vom persönlichen Einkommensteuersatz. Hinzu kommen 5,5 % Solidaritätszuschlag auf die Steuer und ggf. Kirchensteuer. Banken führen die Steuer in Deutschland automatisch ans Finanzamt ab.",
      },
      {
        question: "Wie hoch ist der Sparerpauschbetrag?",
        answer:
          "Seit 2023: 1.000 € pro Person und Jahr, 2.000 € bei zusammenveranlagten Ehepaaren. Bis zu dieser Höhe bleiben Kapitalerträge steuerfrei – vorausgesetzt, du hast der Bank einen Freistellungsauftrag erteilt.",
      },
      {
        question: "Was ist die Teilfreistellung bei Fonds?",
        answer:
          "Um die Doppelbesteuerung zwischen Fondsebene und Anleger auszugleichen, bleibt ein Teil der Fondserträge steuerfrei: 30 % bei Aktienfonds (mind. 51 % Aktienquote), 15 % bei Mischfonds (mind. 25 %), 60 % bzw. 80 % bei Immobilienfonds.",
      },
      {
        question: "Wann lohnt sich die Günstigerprüfung?",
        answer:
          "Wenn dein persönlicher Grenzsteuersatz unter 25 % liegt (typisch bei geringem Einkommen, Rentnern, Studierenden). Über die Steuererklärung wird die Abgeltungsteuer dann durch die günstigere Einkommensteuer ersetzt und du bekommst zu viel gezahlte KESt zurück.",
      },
      {
        question: "Muss ich Kapitalerträge in der Steuererklärung angeben?",
        answer:
          "Nicht zwingend, wenn die Bank die KESt bereits einbehalten hat. Pflicht ist die Angabe bei Erträgen aus dem Ausland ohne Steuerabzug, bei Kirchensteuerpflicht ohne Datenabgleich oder wenn du die Günstigerprüfung willst.",
      },
    ],
    relatedSlugs: ["etf-sparplan-rechner", "zinseszins-rechner"],
    sources: [
      {
        label: "§ 32d EStG – Gesonderter Steuertarif für Einkünfte aus Kapitalvermögen",
        url: "https://www.gesetze-im-internet.de/estg/__32d.html",
      },
      {
        label: "Bundesfinanzministerium – Abgeltungsteuer",
        url: "https://www.bundesfinanzministerium.de/",
      },
    ],
  },
  {
    slug: "was-bleibt-rechner",
    name: "Was bleibt mir wirklich?",
    shortDescription:
      "Wie viel Netto bringt dir eine Gehaltserhöhung wirklich?",
    description:
      "Interaktiver Rechner für den Netto-Effekt einer Gehaltserhöhung. Gib dein aktuelles Brutto und die geplante Erhöhung ein – siehst du live, wie viel davon nach Steuern und Sozialabgaben tatsächlich auf deinem Konto landet.",
    category: "finanzen",
    keywords: [
      "gehaltserhöhung netto",
      "was bleibt netto",
      "was bleibt mir",
      "netto von brutto",
      "grenzsteuersatz gehaltserhöhung",
      "lohnt sich gehaltserhöhung",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: GehaltserhoehungNettoCalculator,
    formula: {
      expression:
        "Δ Netto = Netto(Brutto + Erhöhung) − Netto(Brutto)   ·   Grenz-Nettoquote = Δ Netto / Δ Brutto",
      explanation:
        "Der Rechner berechnet Netto für dein aktuelles Brutto und für Brutto + Erhöhung jeweils mit Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Sozialabgaben (RV, AV, KV, PV). Die Differenz zeigt den tatsächlichen Netto-Zuwachs. Wegen Steuerprogression und Sozialversicherungsbeiträgen bleiben von einer Erhöhung typischerweise nur 45–65 % netto übrig.",
      variables: [
        { symbol: "Δ Brutto", description: "Höhe der Gehaltserhöhung" },
        { symbol: "Δ Netto", description: "Zusätzliches Netto nach allen Abgaben" },
        { symbol: "Grenzsteuersatz", description: "Steuersatz auf den zusätzlichen Euro" },
        { symbol: "BBG", description: "Beitragsbemessungsgrenze KV/PV 66.150 €, RV/AV 96.600 €" },
      ],
    },
    examples: [
      {
        title: "Klassische +500 € Erhöhung",
        inputs: "3.500 € Brutto/Monat · +500 € · Steuerklasse I · keine Kirche",
        result: "≈ +287 € Netto (Steuern −146 €, Sozial −67 €)",
      },
      {
        title: "Kleine Erhöhung, Steuerklasse III",
        inputs: "4.500 € Brutto/Monat · +200 € · Steuerklasse III",
        result: "≈ +130 € Netto – Splittingtarif dämpft die Progression",
      },
      {
        title: "Über Beitragsbemessungsgrenze",
        inputs: "8.000 € Brutto/Monat · +500 € · Steuerklasse I",
        result: "≈ +290 € Netto – SV-Beiträge steigen nicht mehr mit",
      },
    ],
    faq: [
      {
        question: "Warum bleibt so wenig von der Gehaltserhöhung übrig?",
        answer:
          "Weil Lohnsteuer progressiv ist: Auf zusätzliches Einkommen zahlst du deinen Grenzsteuersatz (25–42 %), nicht deinen Durchschnittssatz. Dazu kommen ca. 20 % Sozialabgaben. Realistisch bleiben bei mittleren Einkommen etwa 50–60 % netto.",
      },
      {
        question: "Was ist der Grenzsteuersatz?",
        answer:
          "Der Steuersatz, mit dem der letzte verdiente Euro besteuert wird. Er ist immer höher als der Durchschnittssteuersatz. Für Gehaltserhöhungen, Boni oder Überstunden ist der Grenzsteuersatz entscheidend – nicht der Wert auf der Steuererklärung.",
      },
      {
        question: "Ab wann steigen die Sozialabgaben nicht mehr?",
        answer:
          "Ab der Beitragsbemessungsgrenze. 2025: 66.150 €/Jahr (5.512 €/Monat) für KV und PV, 96.600 €/Jahr (8.050 €/Monat) für RV und AV. Wer darüber liegt, bekommt von Erhöhungen deutlich mehr netto.",
      },
      {
        question: "Lohnt sich eine Gehaltserhöhung überhaupt?",
        answer:
          "Ja – auch wenn netto weniger ankommt als brutto, steigt dein verfügbares Einkommen dauerhaft. Zusätzlich erhöhen sich Rentenansprüche, Arbeitslosengeld, Elterngeld und Urlaubsgeld anteilig. Nur bei Übergängen (z. B. aus Minijob raus) kann es Sondereffekte geben.",
      },
      {
        question: "Sind Kindergeld, Steuerklassenwechsel oder Freibeträge berücksichtigt?",
        answer:
          "Nein. Der Rechner nutzt die Grundtabelle (bzw. Splitting bei Klasse III) ohne individuelle Freibeträge. Für exakte Zahlen inkl. Kinderfreibetrag, Lohnsteuerermäßigung und Werbungskosten hilft nur die Steuererklärung oder ein spezialisiertes Lohnprogramm.",
      },
    ],
    relatedSlugs: ["brutto-netto-rechner", "stundenlohn-rechner", "ueberstundenrechner"],
    sources: [
      {
        label: "§ 32a EStG – Einkommensteuertarif",
        url: "https://www.gesetze-im-internet.de/estg/__32a.html",
      },
      {
        label: "Bundesfinanzministerium – Lohn- und Einkommensteuerrechner",
        url: "https://www.bmf-steuerrechner.de/",
      },
    ],
  },
  {
    slug: "kalorienbedarf-rechner",
    name: "Kalorienbedarf-Rechner (TDEE)",
    shortDescription:
      "Täglicher Kalorienbedarf nach Mifflin-St Jeor mit Aktivitätsfaktor.",
    description:
      "Berechne deinen täglichen Kalorienbedarf (TDEE) aus Grundumsatz und Aktivitätslevel. Mit Empfehlungen für Diät (Defizit), Erhaltung und Muskelaufbau sowie einem einfachen Makro-Vorschlag.",
    category: "sport",
    keywords: [
      "kalorienbedarf",
      "tdee rechner",
      "grundumsatz",
      "bmr rechner",
      "kalorien berechnen",
      "mifflin st jeor",
      "makro rechner",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: TdeeCalculator,
    formula: {
      expression:
        "BMR = 10·kg + 6,25·cm − 5·Alter (+5 m / −161 w)   ·   TDEE = BMR × Aktivitätsfaktor",
      explanation:
        "Der Grundumsatz (BMR) nach Mifflin-St Jeor ist die Energie, die dein Körper in völliger Ruhe braucht. Multipliziert mit dem Aktivitätsfaktor (1,2 sitzend bis 1,9 extrem) ergibt sich der tägliche Gesamtbedarf (TDEE). Für Abnehmen ziehst du 10–25 % ab, für Muskelaufbau addierst du 10–20 %.",
      variables: [
        { symbol: "kg", description: "Körpergewicht in Kilogramm" },
        { symbol: "cm", description: "Körpergröße in Zentimetern" },
        { symbol: "Alter", description: "Alter in Jahren" },
        { symbol: "Faktor", description: "1,2 · 1,375 · 1,55 · 1,725 · 1,9" },
      ],
    },
    examples: [
      {
        title: "Mann, 30 J, 180 cm, 80 kg, aktiv",
        inputs: "männlich · 30 J · 180 cm · 80 kg · aktiv (×1,55)",
        result: "BMR 1.780 kcal · TDEE ≈ 2.760 kcal",
      },
      {
        title: "Frau, 28 J, 165 cm, 60 kg, leicht aktiv",
        inputs: "weiblich · 28 J · 165 cm · 60 kg · leicht (×1,375)",
        result: "BMR 1.343 kcal · TDEE ≈ 1.846 kcal",
      },
      {
        title: "Bulk-Phase Mann",
        inputs: "männlich · 25 J · 185 cm · 85 kg · sehr aktiv (×1,725)",
        result: "TDEE ≈ 3.230 kcal · Aufbau +10 % ≈ 3.550 kcal",
      },
    ],
    faq: [
      {
        question: "Was ist der Unterschied zwischen BMR und TDEE?",
        answer:
          "Der Grundumsatz (BMR) ist der Energiebedarf im völligen Ruhezustand – nur um Organe, Zellstoffwechsel und Körpertemperatur aufrechtzuerhalten. Der TDEE (Total Daily Energy Expenditure) ist der Gesamtbedarf inklusive Alltag, Sport und Verdauung – meist 20–90 % höher als der BMR.",
      },
      {
        question: "Welche Formel ist am genauesten?",
        answer:
          "Mifflin-St Jeor gilt heute als Standard und ist im Mittel genauer als die ältere Harris-Benedict-Formel. Bei sehr niedrigem Körperfett kann Katch-McArdle (nutzt LBM statt Gesamtgewicht) präziser sein. Rechenwert ± 10 % Individualstreuung ist normal.",
      },
      {
        question: "Wie schnell sollte ich abnehmen?",
        answer:
          "Nachhaltig sind 0,5–1 % Körpergewicht pro Woche, also ein moderates Defizit von 300–500 kcal/Tag. Aggressivere Defizite bringen kurzfristig mehr, führen aber häufiger zu Muskelverlust, Heißhunger und Jo-Jo-Effekt.",
      },
      {
        question: "Wie viel Eiweiß brauche ich?",
        answer:
          "Für gesunde Erwachsene mit Sport 1,4–2,2 g pro kg Körpergewicht. Im Defizit eher am oberen Ende, um Muskeln zu erhalten. Fett sollte mindestens 0,6–1,0 g/kg betragen (Hormone), Kohlenhydrate füllen die restlichen Kalorien.",
      },
      {
        question: "Warum passt die Zahl nicht zu meinem Gewichtsverlauf?",
        answer:
          "Wasserretention, Glykogenschwankungen, Zyklus, Salz- und Kohlenhydrataufnahme können das Gewicht ±2 kg tageweise verschieben. Miss über 2–3 Wochen den Durchschnitt und passe die Kalorien um 100–200 kcal an, wenn sich langfristig nichts bewegt.",
      },
    ],
    relatedSlugs: ["bmi-rechner", "pace-rechner"],
    sources: [
      {
        label: "Mifflin MD et al. (1990) – New predictive equations for resting energy",
        url: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
      },
      {
        label: "DGE – Referenzwerte Energiezufuhr",
        url: "https://www.dge.de/wissenschaft/referenzwerte/energie/",
      },
    ],
  },
  {
    slug: "sitzzeit-rechner",
    name: "Sitzzeit-Rechner",
    shortDescription:
      "Berechne deine tägliche Sitzzeit und erhalte einen Aktivitäts-Score inkl. Verbesserungsplan.",
    description:
      "Berechne deine tägliche Sitzzeit und erfahre, wie du mit kleinen Veränderungen mehr Bewegung in deinen Alltag bringst. Der Rechner ermittelt Sitzdauer, Bewegungszeit, Sitzrisiko und einen Aktivitäts-Score (0–100) aus Beruf, Freizeit, Arbeitsweg, Sport, Krafttraining und Pausenverhalten.",
    category: "gesundheit",
    keywords: [
      "sitzzeit rechner",
      "wie lange sitze ich",
      "sitzen gesundheit",
      "aktivitäts score",
      "bewegungsrechner",
      "bewegung im alltag",
      "sitzrisiko",
      "höhenverstellbarer schreibtisch",
    ],
    popular: true,
    updatedAt: "2026-07-10",
    component: SitzzeitCalculator,
    formula: {
      expression:
        "Score = Sitz (35) + Bewegung (25) + Kraft (15) + Pausen (15) + Arbeitsweg (10)",
      explanation:
        "Der Aktivitäts-Score fasst fünf Bausteine additiv zusammen. Sitzzeit ist der größte Hebel: 35 Punkte bei ≤4 Std/Tag, 0 Punkte ab 12 Std. Bewegung erreicht die volle Punktzahl bei ≥5 Std/Woche (WHO-Empfehlung: 2,5–5 Std moderat). Kraft-, Pausen- und Arbeitsweg-Punkte skalieren nach Häufigkeit bzw. Dauer. Ein aktiver Arbeitsweg (Fuß, Rad) fließt zusätzlich als Bewegung in die Wochenbilanz ein.",
      variables: [
        { symbol: "Sitz", description: "Arbeit + Freizeit + passiver Arbeitsweg" },
        { symbol: "Bewegung", description: "Sport pro Woche inkl. aktivem Arbeitsweg" },
        { symbol: "Kraft", description: "Anzahl Krafttrainingseinheiten pro Woche" },
        { symbol: "Pausen", description: "Häufigkeit des Aufstehens am Arbeitsplatz" },
        { symbol: "Arbeitsweg", description: "Länge und Aktivität des täglichen Wegs" },
      ],
    },
    examples: [
      {
        title: "Klassischer Büroalltag",
        inputs: "Büro · 8 Std sitzen · 3 Std Freizeit-Sitzen · Auto 30 Min · 2 Std Sport/Woche",
        result: "Sitzzeit 11 Std 30 Min · Score ≈ 45 · 🟠 Erhöht",
      },
      {
        title: "Aktiver Alltag",
        inputs: "Homeoffice · 7 Std sitzen · Rad 30 Min · 5 Std Sport · 2× Kraft · alle 60 Min aufstehen",
        result: "Sitzzeit 10 Std · Score ≈ 82 · 🟢 Sehr gut",
      },
      {
        title: "Handwerk",
        inputs: "Handwerk · 2 Std sitzen · 2 Std TV · Auto 20 Min · 1 Std Sport",
        result: "Sitzzeit 4 Std 20 Min · Score ≈ 70 · 🟡 Verbesserungsfähig",
      },
    ],
    faq: [
      {
        question: "Wie lange Sitzen ist zu viel?",
        answer:
          "Studien zeigen ab etwa 8 Stunden Sitzen pro Tag steigt das Risiko für Herz-Kreislauf-Erkrankungen, Diabetes Typ 2 und Rückenbeschwerden messbar an. Ab 10 Stunden gilt Sitzen als kritisch – vor allem, wenn es ohne Unterbrechungen erfolgt. Wichtig ist nicht nur die Gesamtdauer, sondern auch, dass das Sitzen regelmäßig unterbrochen wird.",
      },
      {
        question: "Reicht Sport am Abend aus, um viel Sitzen auszugleichen?",
        answer:
          "Regelmäßiger Sport reduziert das Risiko deutlich, kann langes Sitzen aber nur teilweise ausgleichen. Wer täglich 8+ Stunden sitzt, sollte laut aktueller Forschung zusätzlich 60–75 Minuten moderate Bewegung pro Tag einplanen. Kurze Bewegungspausen zwischendurch wirken zusätzlich zum Sport.",
      },
      {
        question: "Warum sind Bewegungspausen so wichtig?",
        answer:
          "Beim Sitzen schaltet der Stoffwechsel in einen Sparmodus: Muskelaktivität sinkt, Blutzucker- und Fettverwertung verlangsamen sich, die Durchblutung nimmt ab. Schon 2–3 Minuten Aufstehen und Gehen pro Stunde reaktivieren die Muskulatur und verbessern nachweislich Blutzuckerregulation und Konzentration.",
      },
      {
        question: "Ist Stehen besser als Sitzen?",
        answer:
          "Stehen verbraucht mehr Energie und aktiviert Rumpf- und Beinmuskulatur, ist aber kein Wundermittel. Dauerhaftes Stehen belastet Venen und Gelenke. Optimal ist ein Wechsel aus Sitzen, Stehen und Bewegung – Faustregel: 60 % sitzen, 30 % stehen, 10 % bewegen.",
      },
      {
        question: "Wie oft sollte ich am Arbeitsplatz aufstehen?",
        answer:
          "Ideal ist ein Wechsel alle 30 Minuten. Wenn das nicht möglich ist, sollten spätestens alle 60 Minuten 2–3 Minuten Bewegung stattfinden: aufstehen, ein Glas Wasser holen, kurz dehnen, telefonieren im Gehen. Erinnerungen auf Smartphone oder Smartwatch helfen beim Etablieren der Routine.",
      },
      {
        question: "Wie viel Bewegung wird empfohlen?",
        answer:
          "Die WHO empfiehlt Erwachsenen 150–300 Minuten moderate oder 75–150 Minuten intensive Bewegung pro Woche, plus 2 Einheiten Krafttraining. Bei viel Sitzen sollte man am oberen Ende der Empfehlung liegen. Alltagsbewegung wie Radfahren zur Arbeit oder Treppensteigen zählt mit.",
      },
      {
        question: "Hilft ein höhenverstellbarer Schreibtisch?",
        answer:
          "Ja, wenn er tatsächlich genutzt wird. Wer 2–4 Stunden pro Tag im Stehen arbeitet, reduziert die Sitzzeit deutlich und verbessert Haltung, Konzentration und Energielevel. Der Effekt entfaltet sich vor allem in Kombination mit Bewegungspausen – der Tisch allein reicht nicht.",
      },
      {
        question: "Wie wirkt sich langes Sitzen auf den Rücken aus?",
        answer:
          "Dauerhaftes Sitzen verkürzt Hüftbeuger und Brustmuskulatur, schwächt Gesäß- und Rumpfmuskeln und erhöht den Druck auf die Bandscheiben – besonders in der Lendenwirbelsäule. Häufige Folgen sind Rückenschmerzen, Nackenverspannungen und Kopfschmerzen. Regelmäßiges Aufstehen, Mobility-Übungen und gezieltes Training gleichen das aus.",
      },
      {
        question: "Kann ich langes Sitzen komplett ausgleichen?",
        answer:
          "Vollständig ausgleichen lässt sich Dauersitzen nicht – aber die negativen Effekte lassen sich stark reduzieren. Studien zeigen: Wer täglich 60–75 Minuten moderat aktiv ist, hebt das erhöhte Sterberisiko durch langes Sitzen weitgehend auf. Kurze Pausen mehrfach am Tag sind dabei genauso wichtig wie eine lange Sporteinheit.",
      },
      {
        question: "Welche Übungen eignen sich im Büro?",
        answer:
          "Effektiv und diskret: 10 Kniebeugen am Platz, Schulterkreisen, Nackendehnen, Wadenheben, kurze Rumpfbeugen. Auch 2 Minuten „Desk-Push-ups“ an der Kante des Tisches oder eine Runde ums Bürogebäude wirken. Alles, was Puls und Muskulatur kurz aktiviert, zählt.",
      },
      {
        question: "Wie ist der Aktivitäts-Score aufgebaut?",
        answer:
          "Der Score summiert fünf Bausteine zu maximal 100 Punkten: Sitzzeit (35), Bewegung pro Woche (25), Krafttraining (15), regelmäßige Pausen (15) und aktiver Arbeitsweg (10). Ein Wert ab 80 gilt als sehr gut, 60–79 als verbesserungsfähig, 40–59 als erhöhtes Risiko, unter 40 als kritisch.",
      },
    ],
    relatedSlugs: ["bmi-rechner", "kalorienbedarf-rechner", "pace-rechner"],
    sources: [
      {
        label: "WHO – Physical activity guidelines",
        url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
      },
      {
        label: "DGUV – Sitzen im Büro",
        url: "https://www.dguv.de/",
      },
    ],
  },
  {
    slug: "balkonkraftwerk-rechner",
    name: "Balkonkraftwerk-Rechner",
    shortDescription:
      "Amortisation, Ersparnis und CO₂-Bilanz deines Balkonkraftwerks über bis zu 30 Jahre.",
    description:
      "Berechne, wann sich dein Balkonkraftwerk amortisiert und wie viel Geld sowie CO₂ du langfristig einsparen kannst. Der Rechner berücksichtigt Leistung, Ausrichtung, Neigung, Eigenverbrauch und die erwartete Strompreissteigerung und zeigt drei Szenarien (konservativ / realistisch / optimistisch).",
    category: "energie",
    keywords: [
      "balkonkraftwerk rechner",
      "balkonkraftwerk amortisation",
      "balkonkraftwerk wirtschaftlichkeit",
      "mini pv rechner",
      "steckersolar",
      "600 watt balkonkraftwerk",
      "800 watt balkonkraftwerk",
      "eigenverbrauch pv",
    ],
    popular: true,
    updatedAt: "2026-07-12",
    component: BalkonkraftwerkCalculator,
    formula: {
      expression:
        "Ertrag = kWp · 950 · f_Ausrichtung · f_Neigung   ·   Ersparnis_j = EV · Ertrag · Preis · (1+p)^(j−1)",
      explanation:
        "Der Jahresertrag ergibt sich aus der installierten Leistung (kWp) multipliziert mit einem bundesweiten Basisertrag von rund 950 kWh/kWp/Jahr, korrigiert um Ausrichtung und Neigung. Vom Ertrag ist nur der selbst verbrauchte Anteil (EV) wirtschaftlich relevant, da Balkonkraftwerke ins Netz eingespeisten Strom meist nicht vergütet bekommen. Steigende Strompreise werden jährlich fortgeschrieben.",
      variables: [
        { symbol: "kWp", description: "Modulleistung / 1000" },
        { symbol: "f_Ausrichtung", description: "0,60 (N) – 1,00 (S)" },
        { symbol: "f_Neigung", description: "0,72 (90°) – 1,00 (30°)" },
        { symbol: "EV", description: "Eigenverbrauchsquote (0–1)" },
        { symbol: "p", description: "Jährliche Strompreissteigerung" },
      ],
    },
    examples: [
      {
        title: "800 W · Süd · 30°",
        inputs: "800 € · 800 W · Süd · 30° · 0,32 €/kWh · 70 % EV · 2 % p. a. · 20 J",
        result: "Amortisation ≈ 6 Jahre · Gewinn ≈ 1.700 € · 4,1 t CO₂",
      },
      {
        title: "600 W · Ost · 45°",
        inputs: "550 € · 600 W · Ost · 45° · 0,32 €/kWh · 65 % EV · 20 J",
        result: "Amortisation ≈ 7 Jahre · Gewinn ≈ 950 €",
      },
      {
        title: "1000 W · Süd · flach",
        inputs: "1.000 € · 1000 W · Süd · flach · 0,35 €/kWh · 80 % EV · 3 % p. a. · 25 J",
        result: "Amortisation ≈ 5 Jahre · Gewinn ≈ 3.400 €",
      },
    ],
    faq: [
      {
        question: "Lohnt sich ein Balkonkraftwerk?",
        answer:
          "In den meisten Fällen ja. Bei einem 600–800-W-Set für 500–900 € liegt die Amortisation typischerweise zwischen 5 und 8 Jahren – die Anlagen halten aber 20–25 Jahre. Danach spart jede erzeugte Kilowattstunde direkt Geld. Wer viel tagsüber zu Hause ist und Verbraucher gezielt einschaltet, verkürzt die Amortisation deutlich.",
      },
      {
        question: "Wie lange hält ein Balkonkraftwerk?",
        answer:
          "Die Solarmodule sind extrem langlebig: Hersteller geben in der Regel 25 Jahre Leistungsgarantie mit mindestens 80 % Restleistung. Der Wechselrichter ist das kürzere Glied – seine Lebensdauer liegt bei 10–15 Jahren, mit Garantie von meist 10 Jahren. Ein Austausch kostet zwischen 100 und 250 €.",
      },
      {
        question: "Was bedeutet Eigenverbrauch?",
        answer:
          "Der Anteil des erzeugten Solarstroms, den du im Haushalt direkt selbst verbrauchst. Nur dieser Teil spart dir bares Geld, da Balkonkraftwerke ins Netz eingespeisten Strom meist nicht vergütet bekommen. Ein realistischer Wert liegt bei 60–80 %. Wer viele Verbraucher tagsüber laufen lässt, erreicht auch 80–90 %.",
      },
      {
        question: "Kann ich als Mieter ein Balkonkraftwerk nutzen?",
        answer:
          "Ja. Seit dem Solarpaket I (Mai 2024) haben Mieter und Wohnungseigentümer einen gesetzlichen Anspruch auf die Installation, sofern keine schwerwiegenden Gründe dagegen sprechen. Der Vermieter bzw. die Eigentümergemeinschaft kann Vorgaben zur Optik oder Befestigung machen, die Installation aber grundsätzlich nicht mehr verbieten.",
      },
      {
        question: "Muss ich mein Balkonkraftwerk anmelden?",
        answer:
          "Ja. Seit April 2024 reicht eine einmalige, vereinfachte Anmeldung im Marktstammdatenregister der Bundesnetzagentur. Die separate Anmeldung beim Netzbetreiber entfällt seitdem. Bei bestehendem Ferraris-Zähler (Drehscheibe) tauscht der Netzbetreiber diesen kostenlos gegen einen digitalen Zähler.",
      },
      {
        question: "Wie wirkt sich Verschattung aus?",
        answer:
          "Verschattung ist bei Balkonkraftwerken kritisch, weil die Module in Reihe geschaltet sind. Schon ein teilweise verschattetes Modul kann den Gesamtertrag um 30–70 % senken. Wichtig sind daher ein möglichst freier Blick nach Süden, Osten oder Westen und keine dauerhaften Schatten durch Wäscheständer, Balkonpflanzen oder Nachbargebäude.",
      },
      {
        question: "Wie hoch ist die typische Stromproduktion?",
        answer:
          "Ein 800-W-Balkonkraftwerk mit Süd-Ausrichtung und 30° Neigung erzeugt in Deutschland etwa 700–800 kWh pro Jahr. Süd-Ost/Süd-West kommt auf ~90 %, Ost/West auf ~85 %, Nord nur auf ~60 % dieses Werts. Flach oder senkrecht (Balkonbrüstung) reduziert den Ertrag zusätzlich um 5–25 %.",
      },
      {
        question: "Wie verändert ein steigender Strompreis die Wirtschaftlichkeit?",
        answer:
          "Erheblich. Der Rechner berücksichtigt eine jährliche Preissteigerung, die die Ersparnis Jahr für Jahr wachsen lässt. Bereits 3 % pro Jahr können die Gesamtersparnis über 20 Jahre um 30–40 % erhöhen. Ein Balkonkraftwerk wirkt damit wie eine kleine Absicherung gegen zukünftige Strompreisschocks.",
      },
      {
        question: "Was passiert im Winter?",
        answer:
          "Im Dezember und Januar liefern Balkonkraftwerke nur etwa 3–5 % des Jahresertrags. Die Produktion konzentriert sich auf März bis Oktober, mit dem Maximum zwischen Mai und Juli. Wichtig ist die Jahresbilanz – nicht einzelne Wintertage. Schnee auf den Modulen sollte man vorsichtig entfernen, wenn er länger liegen bleibt.",
      },
      {
        question: "Kann ich einen Batteriespeicher nachrüsten?",
        answer:
          "Ja, es gibt speziell für Balkonkraftwerke konzipierte Speicher (0,8 – 2 kWh). Sie erhöhen den Eigenverbrauch auf 80–95 %, kosten aber 500–1.500 €. Die Wirtschaftlichkeit ist derzeit grenzwertig – der Speicher amortisiert sich meist knapp innerhalb seiner Lebensdauer. Wer maximalen Eigenverbrauch oder Notstromfunktion will, profitiert trotzdem.",
      },
      {
        question: "Wie hoch darf die Leistung sein?",
        answer:
          "Seit dem Solarpaket I (Mai 2024) sind Balkonkraftwerke mit bis zu 800 W Wechselrichterleistung ohne Elektriker erlaubt. Die Modulleistung darf bis zu 2.000 Wp betragen – die Module dürfen also überdimensioniert werden, um schlechtere Lichtverhältnisse auszugleichen und den Jahresertrag zu erhöhen.",
      },
    ],
    relatedSlugs: ["stromkostenrechner", "ev-vs-verbrenner"],
    sources: [
      {
        label: "Bundesnetzagentur – Marktstammdatenregister",
        url: "https://www.marktstammdatenregister.de/",
      },
      {
        label: "HTW Berlin – Stecker-Solar-Simulator",
        url: "https://solar.htw-berlin.de/rechner/stecker-solar-simulator/",
      },
      {
        label: "Verbraucherzentrale – Steckersolargeräte",
        url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/steckerfertige-solaranlagen-fuer-die-steckdose-44032",
      },
    ],
  },
  {
    slug: "kaufnebenkosten-rechner",
    name: "Kaufnebenkosten-Rechner",
    shortDescription:
      "Alle Nebenkosten beim Immobilienkauf in Deutschland auf einen Blick.",
    description:
      "Berechne die gesamten Kaufnebenkosten einer Immobilie in Deutschland – inklusive Grunderwerbsteuer (nach Bundesland), Notarkosten, Grundbuchkosten und Maklerprovision. Mit übersichtlicher Aufteilung als Kreisdiagramm und Gesamtkosten inklusive Kaufpreis.",
    category: "immobilien",
    keywords: [
      "kaufnebenkosten",
      "kaufnebenkosten rechner",
      "immobilie nebenkosten",
      "grunderwerbsteuer rechner",
      "notarkosten immobilie",
      "maklerprovision rechner",
      "hauskauf nebenkosten",
      "wohnung kaufen nebenkosten",
    ],
    popular: true,
    updatedAt: "2026-07-13",
    component: KaufnebenkostenCalculator,
    formula: {
      expression:
        "Nebenkosten = Kaufpreis × (GrESt% + Notar% + Grundbuch% + Makler%)",
      explanation:
        "Alle vier Positionen werden als prozentualer Anteil des Kaufpreises berechnet. Die Grunderwerbsteuer variiert je Bundesland (3,5 – 6,5 %), Notar (~1,5 %) und Grundbuch (~0,5 %) sind bundesweit ähnlich. Die Maklerprovision wird seit Dezember 2020 bei selbstgenutzten Immobilien üblicherweise hälftig geteilt (Käuferanteil ca. 3,57 % inkl. USt.).",
      variables: [
        { symbol: "GrESt%", description: "Grunderwerbsteuersatz des Bundeslandes" },
        { symbol: "Notar%", description: "Notarkosten (im Schnitt 1,5 %)" },
        { symbol: "Grundbuch%", description: "Grundbuchgebühren (im Schnitt 0,5 %)" },
        { symbol: "Makler%", description: "Käuferanteil der Maklerprovision inkl. USt." },
      ],
    },
    examples: [
      {
        title: "Einfamilienhaus NRW mit Makler",
        inputs: "400.000 € · NRW (6,5 %) · Makler 3,57 %",
        result: "≈ 48.280 € Nebenkosten (12,07 %) · Gesamt 448.280 €",
      },
      {
        title: "Wohnung München ohne Makler",
        inputs: "600.000 € · Bayern (3,5 %) · kein Makler",
        result: "≈ 33.000 € Nebenkosten (5,5 %) · Gesamt 633.000 €",
      },
      {
        title: "Haus Berlin mit Makler",
        inputs: "500.000 € · Berlin (6,0 %) · Makler 3,57 %",
        result: "≈ 57.850 € Nebenkosten (11,57 %) · Gesamt 557.850 €",
      },
    ],
    faq: [
      {
        question: "Wie hoch sind die Kaufnebenkosten in Deutschland üblicherweise?",
        answer:
          "Je nach Bundesland und ob ein Makler beauftragt wird, liegen die Nebenkosten zwischen etwa 5,5 % (Bayern, ohne Makler) und rund 12 % (z. B. NRW oder Brandenburg, mit Makler) des Kaufpreises. Bei einer 400.000-€-Immobilie sind das schnell 20.000 – 48.000 € zusätzlich.",
      },
      {
        question: "Wie hoch ist die Grunderwerbsteuer in meinem Bundesland?",
        answer:
          "Bayern erhebt 3,5 %, Hamburg 5,5 %, Berlin, Hessen und Mecklenburg-Vorpommern 6,0 %, Brandenburg, NRW, Saarland und Schleswig-Holstein 6,5 %. Baden-Württemberg, Bremen, Niedersachsen, Rheinland-Pfalz, Sachsen-Anhalt und Thüringen liegen bei 5,0 %, Sachsen bei 5,5 %. Der Rechner setzt den Satz automatisch nach Auswahl des Bundeslandes.",
      },
      {
        question: "Was kostet der Notar beim Immobilienkauf?",
        answer:
          "Die Notargebühren richten sich nach dem Gerichts- und Notarkostengesetz (GNotKG) und sind bundesweit gleich. Typisch sind rund 1,0 – 1,5 % des Kaufpreises. Zusätzlich fallen Gebühren für die Grundbucheinträge an (~0,5 %). Zusammen werden meist rund 2 % kalkuliert.",
      },
      {
        question: "Sind Notar- und Grundbuchkosten fix?",
        answer:
          "Nein. Die im Rechner verwendeten 1,5 % (Notar) und 0,5 % (Grundbuch) sind Durchschnittswerte. Die tatsächliche Höhe hängt von der Grundschuldhöhe, Vertragskonstellation, Auflassungsvormerkung und weiteren notariellen Leistungen ab. Rechne mit +/– 0,3 Prozentpunkten Abweichung.",
      },
      {
        question: "Wie hoch ist die Maklerprovision?",
        answer:
          "Üblich sind 7,14 % inkl. USt. Gesamtprovision. Seit dem 23.12.2020 muss beim Verkauf einer selbstgenutzten Immobilie (Einfamilienhaus, Eigentumswohnung) an einen Verbraucher die Provision mindestens hälftig geteilt werden – der Käuferanteil beträgt also meist 3,57 %. Bei Kapitalanlagen oder Grundstücken gilt diese Regel nicht.",
      },
      {
        question: "Kann ich die Kaufnebenkosten mitfinanzieren?",
        answer:
          "Grundsätzlich ja, aber viele Banken sehen das kritisch. Als Faustregel gilt: Die Nebenkosten sollten aus Eigenkapital gezahlt werden, damit der Kredit nur den Immobilienwert finanziert (max. 100 % Beleihung). Wer die Nebenkosten mitfinanziert (110-%-Finanzierung), zahlt spürbar höhere Zinsen.",
      },
      {
        question: "Sind die Kaufnebenkosten steuerlich absetzbar?",
        answer:
          "Bei selbstgenutzten Immobilien nein. Bei vermieteten Immobilien werden Grunderwerbsteuer, Notar- und Grundbuchkosten den Anschaffungsnebenkosten zugerechnet und über die Abschreibung (AfA) auf 33 bis 50 Jahre verteilt. Die Maklerprovision zählt ebenfalls dazu.",
      },
      {
        question: "Sind Renovierungs- oder Modernisierungskosten enthalten?",
        answer:
          "Nein. Der Rechner deckt nur die klassischen Erwerbsnebenkosten ab. Für Renovierung, Umzug, Küche, Gutachter oder eine mögliche Vorfälligkeitsentschädigung des Verkäufers solltest du zusätzlich einen Puffer einplanen.",
      },
      {
        question: "Fallen bei einer Erbschaft oder Schenkung Kaufnebenkosten an?",
        answer:
          "Grunderwerbsteuer fällt nicht an, wohl aber Notar- und Grundbuchkosten sowie ggf. Erbschaft- oder Schenkungsteuer. Diese sind mit dem Rechner nicht abgebildet – er ist auf den klassischen entgeltlichen Immobilienkauf ausgelegt.",
      },
    ],
    relatedSlugs: ["kaufen-oder-mieten", "kreditrechner"],
    sources: [
      {
        label: "Bundesministerium der Finanzen – Grunderwerbsteuer",
        url: "https://www.bundesfinanzministerium.de/",
      },
      {
        label: "GNotKG – Gerichts- und Notarkostengesetz",
        url: "https://www.gesetze-im-internet.de/gnotkg/",
      },
      {
        label: "Verbraucherzentrale – Maklerprovision",
        url: "https://www.verbraucherzentrale.de/wissen/geld-versicherungen/kredit-schulden-insolvenz/maklerprovision-neue-regeln-fuer-kaeufer-und-verkaeufer-51110",
      },
    ],
  },
  {
    slug: "katzenalter-rechner",
    name: "Katzenalter-Rechner",
    shortDescription: "Wie alt ist deine Katze in Menschenjahren?",
    description:
      "Rechne das Alter deiner Katze schnell und verständlich in ein vergleichbares Menschenalter um – mit Lebensphase und kurzer Einordnung.",
    category: "haustiere",
    keywords: [
      "katzenalter rechner",
      "katze menschenjahre",
      "katzenalter umrechnen",
      "wie alt ist meine katze",
      "katze jahre menschen",
      "katzen lebensphase",
    ],
    popular: false,
    updatedAt: "2026-07-14",
    component: KatzenalterCalculator,
    formula: {
      expression:
        "Menschenjahre = 15 × 1. Jahr + 9 × 2. Jahr + 4 × jedes weitere Jahr",
      explanation:
        "Katzen altern in den ersten beiden Jahren deutlich schneller als Menschen. Das erste Jahr entspricht etwa 15 Menschenjahren, das zweite zusätzlich 9. Ab dem dritten Jahr rechnet man jedes Katzenjahr mit etwa 4 Menschenjahren.",
      variables: [
        { symbol: "1. Jahr", description: "≈ 15 Menschenjahre" },
        { symbol: "2. Jahr", description: "+ 9 Menschenjahre (also 24 insgesamt)" },
        { symbol: "weitere Jahre", description: "+ 4 Menschenjahre pro Jahr" },
      ],
    },
    examples: [
      {
        title: "6 Monate altes Kitten",
        inputs: "0,5 Jahre",
        result: "≈ 7,5 Menschenjahre",
      },
      {
        title: "2 Jahre alte Katze",
        inputs: "2 Jahre",
        result: "≈ 24 Menschenjahre",
      },
      {
        title: "10 Jahre alte Katze",
        inputs: "10 Jahre",
        result: "≈ 56 Menschenjahre",
      },
    ],
    faq: [
      {
        question: "Wie alt wird eine Katze im Durchschnitt?",
        answer:
          "Freigänger werden oft 10 – 12 Jahre, reine Wohnungskatzen mit guter Versorgung und tierärztlicher Betreuung können 15 – 20 Jahre alt werden. Einzelne Katzen erreichen auch 25 Jahre und mehr.",
      },
      {
        question: "Warum altern Katzen in den ersten Jahren so schnell?",
        answer:
          "Bereits mit einem Jahr gilt eine Katze körperlich als ausgewachsen. Das erste Lebensjahr umfasst daher den größten Reifungsprozess und wird mit etwa 15 Menschenjahren verglichen.",
      },
      {
        question: "Ist die Umrechnung exakt?",
        answer:
          "Nein, sie ist eine verbreitete Faustregel. Rasse, Lebensweise, Ernährung und Gesundheit beeinflussen das biologische Alter. Für medizinische Einschätzungen ist der Tierarzt zuständig.",
      },
      {
        question: "Ab wann gilt eine Katze als Senior?",
        answer:
          "Oft wird ab etwa 7 – 10 Jahren von einer reifen Katze gesprochen und ab etwa 11 – 15 Jahren von einem Senior. Jede Katze altert individuell – regelmäßige Vorsorgeuntersuchungen helfen, den Zustand besser einzuschätzen.",
      },
      {
        question: "Kann ich auch Monate eingeben?",
        answer:
          "Ja. Gib das Alter als Dezimalzahl ein: 6 Monate entsprechen 0,5 Jahren, 18 Monate 1,5 Jahren.",
      },
    ],
    relatedSlugs: ["hundealter-rechner"],
  },
  {
    slug: "futtermengen-rechner",
    name: "Futtermengen-Rechner",
    shortDescription: "Tägliche Futtermenge für Hund, Katze und Kleintiere berechnen.",
    description:
      "Berechne die ungefähre tägliche Futtermenge für dein Haustier – für Hunde und Katzen auf Basis des Energiebedarfs (RER) und für Kleintiere nach arttypischen Richtwerten.",
    category: "haustiere",
    keywords: [
      "futtermenge rechner",
      "hund futtermenge",
      "katze futtermenge",
      "tägliche futtermenge",
      "futterration hund",
      "futterration katze",
      "meerschweinchen futter",
      "kaninchen futter",
    ],
    popular: false,
    updatedAt: "2026-07-15",
    component: FuttermengeCalculator,
    formula: {
      expression: "RER = 70 × kg^0,75   ·   Futtermenge = (RER × Faktor) / kcal/100g × 100",
      explanation:
        "Für Hunde und Katzen wird zunächst der Ruhe-Energiebedarf (RER) aus dem Körpergewicht berechnet. Mit einem Aktivitätsfaktor ergibt sich der tägliche Energiebedarf, der durch die Energiedichte des gewählten Futters in eine Grammangabe umgerechnet wird. Für Kleintiere werden arttypische Richtwerte pro Kilogramm Körpergewicht bzw. fixe Tagesmengen verwendet.",
      variables: [
        { symbol: "RER", description: "Ruhe-Energiebedarf in kcal/Tag" },
        { symbol: "kg", description: "Körpergewicht des Tieres" },
        { symbol: "Faktor", description: "Aktivitätsmultiplikator (z. B. 1,4 – 2,2)" },
        { symbol: "kcal/100g", description: "Energiedichte des Futters" },
      ],
    },
    examples: [
      {
        title: "Normal aktiver Hund",
        inputs: "15 kg · normal aktiv · Trockenfutter",
        result: "≈ 330 g Trockenfutter / Tag",
      },
      {
        title: "Wohnungskatze",
        inputs: "4 kg · wenig aktiv · Nassfutter",
        result: "≈ 170 g Nassfutter / Tag",
      },
      {
        title: "Kaninchen",
        inputs: "2,5 kg",
        result: "≈ 63 g Pellets / Tag (plus unbegrenzt Heu)",
      },
    ],
    faq: [
      {
        question: "Wie genau ist die berechnete Futtermenge?",
        answer:
          "Die Werte sind Orientierungswerte für gesunde, ausgewachsene Tiere. Rasse, Alter, Stoffwechsel, Kastrierungsstatus und spezifisches Futter können den Bedarf deutlich verändern. Beobachte Gewicht und Körperkondition deines Tieres.",
      },
      {
        question: "Warum unterscheidet sich die Menge je nach Futtertyp?",
        answer:
          "Trockenfutter hat eine hohe Energiedichte (ca. 360 kcal/100g), Nassfutter enthält viel Wasser und ist deutlich kalorienärmer (ca. 100 kcal/100g). Deshalb benötigt ein Tier bei Nassfutter eine größere Menge als bei Trockenfutter.",
      },
      {
        question: "Was ist mit Welpen und Kitten?",
        answer:
          "Junge Tiere haben einen erhöhten Energiebedarf. Für Welpen und Kitten solltest du entweder ein spezielles Jungtierfutter füttern oder den Aktivitätsfaktor erhöhen und mehrmals täglich füttern. Bei Unsicherheit den Tierarzt fragen.",
      },
      {
        question: "Wie oft sollte ich meinen Hund oder meine Katze füttern?",
        answer:
          "Erwachsene Hunde und Katzen fühlen sich bei zwei Mahlzeiten am Tag meist wohl. Welpen und Kitten benötigen drei bis vier Mahlzeiten. Kleintiere sollten Heu und Wasser stets zur Verfügung haben.",
      },
      {
        question: "Mein Tier nimmt zu oder ab – was tun?",
        answer:
          "Passe die Tagesmenge schrittlich um etwa 10 % an und wiege dein Tier regelmäßig. Bei anhaltender Gewichtsveränderung oder gesundheitlichen Auffälligkeiten ist ein Tierarztbesuch ratsam.",
      },
    ],
    relatedSlugs: ["hundealter-rechner", "katzenalter-rechner"],
  },
  {
    slug: "hundealter-rechner",
    name: "Hundealter-Rechner",
    shortDescription: "Wie alt ist dein Hund in Menschenjahren?",
    description:
      "Rechne das Alter deines Hundes schnell und verständlich in ein vergleichbares Menschenalter um – mit Lebensphase und kurzer Einordnung.",
    category: "haustiere",
    keywords: [
      "hundealter rechner",
      "hund menschenjahre",
      "hundealter umrechnen",
      "wie alt ist mein hund",
      "hund jahre menschen",
      "hund lebensphase",
    ],
    popular: false,
    updatedAt: "2026-07-15",
    component: HundealterCalculator,
    formula: {
      expression:
        "Menschenjahre = 15 × 1. Jahr + 9 × 2. Jahr + 5 × jedes weitere Jahr",
      explanation:
        "Hunde altern in den ersten beiden Jahren deutlich schneller als Menschen. Das erste Jahr entspricht etwa 15 Menschenjahren, das zweite zusätzlich 9. Ab dem dritten Jahr rechnet man jedes Hundejahr mit etwa 5 Menschenjahren.",
      variables: [
        { symbol: "1. Jahr", description: "≈ 15 Menschenjahre" },
        { symbol: "2. Jahr", description: "+ 9 Menschenjahre (also 24 insgesamt)" },
        { symbol: "weitere Jahre", description: "+ 5 Menschenjahre pro Jahr" },
      ],
    },
    examples: [
      {
        title: "6 Monate alter Welpe",
        inputs: "0,5 Jahre",
        result: "≈ 7,5 Menschenjahre",
      },
      {
        title: "2 Jahre alter Hund",
        inputs: "2 Jahre",
        result: "≈ 24 Menschenjahre",
      },
      {
        title: "10 Jahre alter Hund",
        inputs: "10 Jahre",
        result: "≈ 64 Menschenjahre",
      },
    ],
    faq: [
      {
        question: "Wie alt wird ein Hund im Durchschnitt?",
        answer:
          "Kleine Hunderassen werden oft 12 – 16 Jahre, mittelgroße 10 – 13 Jahre und große Rassen oft nur 8 – 10 Jahre. Die Lebenserwartung hängt stark von Rasse, Größe, Ernährung und Bewegung ab.",
      },
      {
        question: "Warum altern Hunde in den ersten Jahren so schnell?",
        answer:
          "Bereits mit einem bis zwei Jahren gilt ein Hund körperlich als ausgewachsen. Das erste Lebensjahr umfasst daher den größten Reifungsprozess und wird mit etwa 15 Menschenjahren verglichen.",
      },
      {
        question: "Ist die Umrechnung exakt?",
        answer:
          "Nein, sie ist eine verbreitete Faustregel. Rasse, Größe, Lebensweise, Ernährung und Gesundheit beeinflussen das biologische Alter. Für medizinische Einschätzungen ist der Tierarzt zuständig.",
      },
      {
        question: "Ab wann gilt ein Hund als Senior?",
        answer:
          "Oft wird ab etwa 7 – 10 Jahren von einem reifen Hund gesprochen und ab etwa 10 – 13 Jahren von einem Senior. Große Rassen altern tendenziell schneller als kleine.",
      },
      {
        question: "Kann ich auch Monate eingeben?",
        answer:
          "Ja. Gib das Alter als Dezimalzahl ein: 6 Monate entsprechen 0,5 Jahren, 18 Monate 1,5 Jahren.",
      },
    ],
    relatedSlugs: ["katzenalter-rechner"],
  },
  {
    slug: "arbeitsmittel-absetzungsrechner",
    name: "Arbeitsmittel-Absetzungsrechner",
    shortDescription:
      "Arbeitsmittel steuerlich absetzen: Sofortabzug (GWG) oder AfA über mehrere Jahre.",
    description:
      "Berechne, wie du Laptop, Bürostuhl, Werkzeug & Co. als Arbeitnehmer oder Selbstständiger von der Steuer absetzt – mit beruflichem Nutzungsanteil, Prüfung der GWG-Grenze (800 € netto), Sofortabzug für Computerhardware sowie linearer AfA inklusive monatsgenauer Verteilung im Kaufjahr.",
    category: "steuern",
    keywords: [
      "arbeitsmittel absetzen",
      "arbeitsmittel afa",
      "afa rechner",
      "gwg rechner",
      "geringwertige wirtschaftsgüter",
      "laptop absetzen",
      "beruflicher anteil",
      "abschreibung arbeitsmittel",
    ],
    popular: false,
    updatedAt: "2026-07-16",
    component: ArbeitsmittelAfaCalculator,
    formula: {
      expression:
        "Basis = Kaufpreis · beruflicher Anteil   ·   AfA/Jahr = Basis / Nutzungsdauer (pro rata temporis)",
      explanation:
        "Arbeitsmittel mit einem Nettopreis bis 800 € (952 € brutto) sind geringwertige Wirtschaftsgüter (GWG) und können im Kaufjahr sofort komplett abgesetzt werden. Computerhardware und Software werden seit 2021 (BMF-Schreiben) ebenfalls mit einer Nutzungsdauer von 1 Jahr sofort abgeschrieben. Alle anderen Arbeitsmittel werden über die betriebsgewöhnliche Nutzungsdauer linear abgeschrieben (§ 7 EStG). Im Kaufjahr erfolgt die AfA monatsgenau ab dem Kaufmonat; die restlichen Monate fallen ins letzte Abschreibungsjahr. Wird das Arbeitsmittel nicht ausschließlich beruflich genutzt, ist nur der berufliche Anteil absetzbar.",
      variables: [
        { symbol: "Kaufpreis", description: "Brutto-Anschaffungskosten inkl. USt" },
        { symbol: "beruflicher Anteil", description: "Berufliche Nutzung in % (≥ 90 % gilt meist als voll beruflich)" },
        { symbol: "GWG-Grenze", description: "800 € netto / 952 € brutto (2024/2025)" },
        { symbol: "Nutzungsdauer", description: "Betriebsgewöhnliche Nutzungsdauer laut amtlicher AfA-Tabelle" },
        { symbol: "Grenzsteuersatz", description: "Persönlicher Grenzsteuersatz (typisch 25 – 42 %)" },
      ],
    },
    examples: [
      {
        title: "Laptop – Sofortabzug",
        inputs: "1.200 € brutto · 100 % beruflich · 1 Jahr Nutzungsdauer",
        result: "1.200 € sofort absetzbar · ≈ 360 € Ersparnis (30 %)",
      },
      {
        title: "Bürostuhl – GWG",
        inputs: "800 € brutto · 100 % beruflich",
        result: "≙ 672 € netto → GWG, sofort komplett absetzbar",
      },
      {
        title: "Schreibtisch – AfA 13 Jahre",
        inputs: "1.800 € brutto · 90 % beruflich · Kauf Juli",
        result: "≈ 62 € AfA in Jahr 1 · ≈ 124 €/Jahr in Folgejahren",
      },
    ],
    faq: [
      {
        question: "Was sind geringwertige Wirtschaftsgüter (GWG)?",
        answer:
          "Arbeitsmittel mit Anschaffungskosten bis 800 € netto (952 € brutto). Sie dürfen im Kaufjahr in voller Höhe abgesetzt werden – ohne Verteilung über die Nutzungsdauer. Für Arbeitnehmer zählt in der Regel der Bruttopreis, weil sie keinen Vorsteuerabzug haben.",
      },
      {
        question: "Warum werden Computer und Software auf 1 Jahr abgeschrieben?",
        answer:
          "Mit dem BMF-Schreiben vom 22.02.2022 wurde die Nutzungsdauer für Computerhardware (Laptop, PC, Bildschirm, Peripherie) und Software steuerlich auf 1 Jahr festgesetzt. In der Praxis wirkt das wie ein Sofortabzug – unabhängig vom Kaufpreis.",
      },
      {
        question: "Was bedeutet der berufliche Anteil?",
        answer:
          "Nutzt du das Arbeitsmittel auch privat, ist nur der berufliche Anteil absetzbar. Bei einem beruflichen Anteil ≥ 90 % erkennt das Finanzamt in der Regel die vollen Kosten an, darunter wird anteilig gekürzt. Der Anteil sollte plausibel geschätzt und dokumentiert werden.",
      },
      {
        question: "Wie funktioniert die AfA bei unterjährigem Kauf?",
        answer:
          "Im Kaufjahr wird monatsgenau abgeschrieben (pro rata temporis). Beispiel: Ein Möbelstück mit 13 Jahren Nutzungsdauer, gekauft im Juli, wird im ersten Jahr nur für 6 Monate abgeschrieben, im letzten Jahr entsprechend für die fehlenden 6 Monate.",
      },
      {
        question: "Welche Nutzungsdauern gelten typisch?",
        answer:
          "Computer & Software: 1 Jahr · Smartphone: 5 Jahre · Drucker/Peripherie: 3 Jahre · Werkzeug: 5 Jahre · Bürostuhl und Schreibtisch: 13 Jahre. Verbindliche Werte stehen in den amtlichen AfA-Tabellen des BMF.",
      },
    ],
    relatedSlugs: [
      "werbungskosten-rechner",
      "pendlerpauschale-rechner",
      "brutto-netto-rechner",
    ],
    sources: [
      {
        label: "§ 6 Abs. 2 EStG – GWG-Regelung",
        url: "https://www.gesetze-im-internet.de/estg/__6.html",
      },
      {
        label: "§ 7 EStG – Absetzung für Abnutzung",
        url: "https://www.gesetze-im-internet.de/estg/__7.html",
      },
      {
        label: "BMF-Schreiben zur Nutzungsdauer Computerhardware",
        url: "https://www.bundesfinanzministerium.de/",
      },
    ],
  },
  {
    slug: "standby-kosten-rechner",
    name: "Standby-Kosten-Rechner",
    shortDescription:
      "Wie viel Strom kosten deine Geräte im Standby pro Jahr wirklich?",
    description:
      "Berechne die Standby-Kosten deiner Haushaltsgeräte: TV, Konsole, Router, Ladegeräte & Co. Trage Leistung (Watt), Standby-Stunden pro Tag und Anzahl ein – der Rechner ermittelt jährlichen Stromverbrauch, Kosten und CO₂-Ausstoß pro Gerät.",
    category: "energie",
    keywords: [
      "standby kosten",
      "standby stromverbrauch",
      "standby rechner",
      "leerlaufverluste",
      "stromfresser",
      "steckerleiste sparen",
      "phantomstrom",
    ],
    popular: false,
    updatedAt: "2026-07-17",
    component: StandbyKostenCalculator,
    formula: {
      expression: "kWh/Jahr = Watt · Std/Tag · 365 · Anzahl / 1.000   ·   Kosten = kWh · Preis",
      explanation:
        "Für jedes Gerät wird der jährliche Stromverbrauch aus Standby-Leistung, täglicher Standby-Zeit und Stückzahl berechnet. Multipliziert mit dem Arbeitspreis pro kWh ergeben sich die jährlichen Kosten. Der CO₂-Ausstoß basiert auf dem deutschen Strommix (~380 g/kWh).",
      variables: [
        { symbol: "Watt", description: "Leistungsaufnahme im Standby-Modus" },
        { symbol: "Std/Tag", description: "Stunden pro Tag, in denen das Gerät im Standby ist" },
        { symbol: "Anzahl", description: "Anzahl gleichartiger Geräte im Haushalt" },
        { symbol: "Preis", description: "Arbeitspreis in ct/kWh" },
      ],
    },
    examples: [
      {
        title: "TV + Sat-Receiver",
        inputs: "TV 1,5 W · Receiver 8 W · je 22 Std./Tag · 35 ct/kWh",
        result: "≈ 27 €/Jahr nur für Standby",
      },
      {
        title: "WLAN-Router 24/7",
        inputs: "8 W · 24 Std./Tag · 35 ct/kWh",
        result: "≈ 25 €/Jahr",
      },
      {
        title: "Typischer Haushalt",
        inputs: "TV, Receiver, Konsole, Router, 3× Ladegeräte",
        result: "≈ 80 – 150 €/Jahr an vermeidbaren Kosten",
      },
    ],
    faq: [
      {
        question: "Was zählt zu Standby-Verbrauch?",
        answer:
          "Alles, was Strom zieht, ohne aktiv genutzt zu werden: TVs und Receiver im Bereitschaftsmodus, Konsolen im Ruhezustand, WLAN-Router im Dauerbetrieb, Ladegeräte ohne Endgerät, Kaffeemaschinen und Mikrowellen mit Uhr sowie PCs im Ruhemodus.",
      },
      {
        question: "Wie hoch ist die Standby-Leistung typischer Geräte?",
        answer:
          "Grobe Richtwerte: Fernseher 0,5 – 3 W, Sat-/TV-Receiver 5 – 15 W, Spielkonsole im Ruhemodus 5 – 15 W, WLAN-Router 5 – 12 W, PC-Monitor 0,3 – 1 W, Ladegerät ohne Last 0,1 – 0,5 W. Der genaue Wert steht meist im Datenblatt.",
      },
      {
        question: "Wie viel kann man realistisch sparen?",
        answer:
          "In einem durchschnittlichen deutschen Haushalt verursachen Standby-Verbraucher rund 100 € pro Jahr, laut Umweltbundesamt sogar bis zu 115 €. Der Großteil lässt sich durch abschaltbare Steckerleisten und Zeitschaltuhren vermeiden.",
      },
      {
        question: "Sollte ich alle Geräte komplett vom Netz nehmen?",
        answer:
          "Bei den meisten Geräten (TV, HiFi, Ladegeräte, Kaffeemaschine) ist das unproblematisch. Ausnahmen: Router, Festplattenrekorder und Kühlgeräte sollten nicht ständig getrennt werden. Set-Top-Boxen können nach dem Neustart mehrere Minuten für Software-Updates brauchen.",
      },
      {
        question: "Woher kommt der CO₂-Wert?",
        answer:
          "Der deutsche Strommix verursacht laut Umweltbundesamt rund 380 g CO₂ pro kWh (Wert für 2023). Bei reinem Ökostrom liegt der Wert deutlich niedriger; der Rechner nutzt den Durchschnittswert als konservative Näherung.",
      },
    ],
    relatedSlugs: ["stromkostenrechner", "balkonkraftwerk-rechner"],
    sources: [
      {
        label: "Umweltbundesamt – Standby-Verluste",
        url: "https://www.umweltbundesamt.de/",
      },
      {
        label: "Bundesnetzagentur – Strompreise",
        url: "https://www.bundesnetzagentur.de/",
      },
    ],
  },
  {
    slug: "arbeitstage-rechner",
    name: "Arbeitstage-Rechner",
    shortDescription:
      "Arbeitstage zwischen zwei Daten berechnen – inkl. Bundesland-Feiertage.",
    description:
      "Berechne die Anzahl der Arbeitstage zwischen zwei beliebigen Daten. Wochenenden und die gesetzlichen Feiertage deines Bundeslandes werden automatisch abgezogen. Urlaubstage lassen sich optional berücksichtigen.",
    category: "arbeit",
    keywords: [
      "arbeitstage",
      "arbeitstage rechner",
      "werktage berechnen",
      "arbeitstage zwischen zwei daten",
      "feiertage bundesland",
      "arbeitstage 2026",
    ],
    popular: false,
    updatedAt: "2026-07-17",
    component: ArbeitstageCalculator,
    formula: {
      expression:
        "Arbeitstage = Kalendertage − Wochenendtage − Feiertage (Mo–Fr) − Urlaubstage",
      explanation:
        "Der Rechner zählt jeden Tag im gewählten Zeitraum, entfernt Samstage und Sonntage sowie alle im gewählten Bundesland gesetzlichen Feiertage, die auf einen Werktag fallen. Bewegliche Feiertage (Karfreitag, Ostermontag, Christi Himmelfahrt, Pfingstmontag, Fronleichnam, Buß- und Bettag) werden über den Ostersonntag nach der Gauß-Formel berechnet.",
      variables: [
        { symbol: "Kalendertage", description: "Alle Tage inklusive Start- und Enddatum" },
        { symbol: "Wochenendtage", description: "Alle Samstage und Sonntage im Zeitraum" },
        { symbol: "Feiertage", description: "Gesetzliche Feiertage des Bundeslandes, die auf einen Mo–Fr fallen" },
      ],
    },
    examples: [
      {
        title: "Ganzes Jahr Bayern 2026",
        inputs: "01.01.2026 – 31.12.2026 · Bayern",
        result: "≈ 250 Arbeitstage (13 gesetzliche Feiertage in BY)",
      },
      {
        title: "Projektzeitraum",
        inputs: "01.03.2026 – 31.05.2026 · NRW",
        result: "≈ 62 Arbeitstage",
      },
      {
        title: "Mit Urlaub",
        inputs: "Jahr 2026 · Berlin · 30 Urlaubstage",
        result: "≈ 220 tatsächliche Arbeitstage",
      },
    ],
    faq: [
      {
        question: "Welche Feiertage werden berücksichtigt?",
        answer:
          "Alle bundeseinheitlichen Feiertage (Neujahr, Karfreitag, Ostermontag, 1. Mai, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit, 1. und 2. Weihnachtstag) sowie die im jeweiligen Bundesland zusätzlich gesetzlich freien Tage – z. B. Fronleichnam (BW, BY, HE, NW, RP, SL), Allerheiligen, Reformationstag, Heilige Drei Könige, Frauentag (BE, MV), Weltkindertag (TH), Mariä Himmelfahrt (SL) und Buß- und Bettag (SN).",
      },
      {
        question: "Sind Sonderfälle wie Bayern (Mariä Himmelfahrt) berücksichtigt?",
        answer:
          "Mariä Himmelfahrt (15.08.) ist in Bayern nur in überwiegend katholischen Gemeinden gesetzlicher Feiertag. Da das nicht landesweit gilt, wird er hier nur für das Saarland gezählt. Bewohner katholischer Gemeinden in Bayern sollten den Tag ggf. manuell berücksichtigen.",
      },
      {
        question: "Wie wird der Buß- und Bettag berechnet?",
        answer:
          "Der Buß- und Bettag ist gesetzlicher Feiertag nur in Sachsen. Er fällt auf den Mittwoch vor dem 23. November. Der Rechner ermittelt das Datum automatisch für jedes Jahr.",
      },
      {
        question: "Zählen Start- und Endtag mit?",
        answer:
          "Ja, sowohl das Von- als auch das Bis-Datum werden mitgezählt (inklusiver Zeitraum). Beispiel: Mo bis Fr derselben Woche = 5 Arbeitstage.",
      },
      {
        question: "Kann ich Urlaubstage abziehen?",
        answer:
          "Ja, im Feld „Urlaubs-/Abwesenheitstage“ kannst du beliebig viele Tage eintragen. Sie werden pauschal von den ermittelten Arbeitstagen abgezogen, ohne konkretes Datum.",
      },
    ],
    relatedSlugs: ["stundenlohnrechner", "ueberstundenrechner", "pendlerpauschale-rechner"],
    sources: [
      {
        label: "Bundesministerium des Innern – Gesetzliche Feiertage",
        url: "https://www.bmi.bund.de/",
      },
    ],
  },
];


export function getCalculator(slug: string): CalculatorDef | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorDef[] {
  return calculators.filter((c) => c.category === categorySlug);
}

export function getPopularCalculators(limit = 6): CalculatorDef[] {
  return calculators.filter((c) => c.popular).slice(0, limit);
}