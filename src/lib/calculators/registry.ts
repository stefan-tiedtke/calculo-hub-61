import type { CalculatorDef } from "./types";
import BmiCalculator from "./bmi";
import BruttoNettoCalculator from "./brutto-netto";

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