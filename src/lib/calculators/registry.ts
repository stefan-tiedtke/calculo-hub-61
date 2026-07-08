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
import BitcoinDcaCalculator from "./bitcoin-dca";
import ReisekostenCalculator from "./reisekosten";
import PacklisteCalculator from "./packliste";
import MietwagenCalculator from "./mietwagen";
import PaceCalculator from "./pace";
import SpritkostenCalculator from "./spritkosten";

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
    slug: "bitcoin-dca-rechner",
    name: "Bitcoin-DCA-Rechner",
    shortDescription: "Backtest: Wie hätte sich ein Bitcoin-Sparplan entwickelt?",
    description:
      "Simuliere einen monatlichen Bitcoin-Sparplan (Dollar-Cost-Averaging) gegen historische BTC/EUR-Kurse. Zeigt investiertes Kapital, angesparte Bitcoin, durchschnittlichen Einstiegskurs, aktuellen Depotwert und Rendite über den gewählten Zeitraum.",
    category: "krypto",
    keywords: [
      "bitcoin dca",
      "bitcoin sparplan",
      "btc dca rechner",
      "dollar cost averaging",
      "bitcoin backtest",
      "durchschnittskosteneffekt",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: BitcoinDcaCalculator,
    formula: {
      expression: "BTC = Σ (Rate / Kurs_i)   ·   Wert = BTC × Kurs_aktuell",
      explanation:
        "Beim Dollar-Cost-Averaging (DCA) wird zu jedem Zeitpunkt derselbe Eurobetrag investiert. Bei niedrigen Kursen bekommst du mehr Bitcoin, bei hohen weniger – der durchschnittliche Einstiegskurs glättet sich. Der Backtest rechnet Monat für Monat mit dem historischen Schlusskurs und bewertet den Bestand zum Endkurs des gewählten Zeitraums.",
      variables: [
        { symbol: "Rate", description: "Monatlich investierter Eurobetrag" },
        { symbol: "Kurs_i", description: "BTC/EUR-Kurs im Monat i" },
        { symbol: "BTC", description: "Insgesamt angesparte Bitcoin" },
        { symbol: "Kurs_aktuell", description: "Kurs am Ende des Zeitraums" },
      ],
    },
    examples: [
      {
        title: "100 €/Monat seit 2020",
        inputs: "100 € · Jan 2020 – heute",
        result: "Deutliche Gewinne trotz zwischenzeitlicher Bärenmärkte",
      },
      {
        title: "50 €/Monat seit 2017-Peak",
        inputs: "50 € · Dez 2017 – heute",
        result: "Auch beim „schlechtesten“ Einstieg langfristig positiv",
      },
      {
        title: "200 €/Monat, 3 Jahre",
        inputs: "200 € · letzte 36 Monate",
        result: "Rendite abhängig vom aktuellen Marktzyklus",
      },
    ],
    faq: [
      {
        question: "Was ist Dollar-Cost-Averaging (DCA)?",
        answer:
          "Eine Anlagestrategie, bei der du regelmäßig denselben Betrag investierst, unabhängig vom Kurs. Vorteile: du musst nicht den perfekten Einstiegszeitpunkt treffen, glättest Schwankungen und baust automatisch antizyklisch auf – bei niedrigen Kursen kaufst du mehr Coins.",
      },
      {
        question: "Woher stammen die Kurse?",
        answer:
          "Der Rechner nutzt aggregierte monatliche BTC/EUR-Schlusskurse großer Marktplätze (z. B. CoinGecko, Kraken). Werte sind gerundet und dienen als realitätsnahe Näherung, ersetzen aber keine offiziellen Handelsdaten deiner Börse.",
      },
      {
        question: "Sind Gebühren und Steuern berücksichtigt?",
        answer:
          "Nein. Kauf- und Netzwerkgebühren, Spreads sowie mögliche Steuern (in Deutschland aktuell steuerfrei nach 1 Jahr Haltefrist) fallen weg. Der Rechner zeigt die Bruttoperformance des Sparplans.",
      },
      {
        question: "Ist ein Bitcoin-Sparplan besser als eine Einmalanlage?",
        answer:
          "Rein statistisch schneidet Einmalanlage bei steigenden Märkten meist besser ab. DCA punktet vor allem in volatilen und seitwärts laufenden Phasen und reduziert das Risiko, im falschen Moment „all in“ zu gehen – ein psychologisch großer Vorteil.",
      },
      {
        question: "Ist Bitcoin eine sichere Geldanlage?",
        answer:
          "Nein. Bitcoin ist hochvolatil und kann kurz- bis mittelfristig deutlich an Wert verlieren. Ein Sparplan reduziert das Timing-Risiko, aber nicht das Preisrisiko. Investiere nur Beträge, deren Verlust dich nicht in finanzielle Schwierigkeiten bringt.",
      },
    ],
    relatedSlugs: ["zinseszins-rechner", "etf-sparplan-rechner", "inflationsrechner"],
    sources: [
      {
        label: "CoinGecko – Bitcoin (EUR)",
        url: "https://www.coingecko.com/de/munzen/bitcoin",
      },
      {
        label: "Kraken – BTC/EUR",
        url: "https://www.kraken.com/prices/bitcoin",
      },
    ],
  },
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