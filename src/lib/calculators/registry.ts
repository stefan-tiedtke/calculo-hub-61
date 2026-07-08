import type { CalculatorDef } from "./types";
import BmiCalculator from "./bmi";
import BruttoNettoCalculator from "./brutto-netto";
import ZinseszinsCalculator from "./zinseszins";
import InflationCalculator from "./inflation";

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