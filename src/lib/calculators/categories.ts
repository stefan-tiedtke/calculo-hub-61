import type { CategoryDef } from "./types";

export const categories: CategoryDef[] = [
  { slug: "finanzen", name: "Finanzen", description: "Kredite, Zinsen, Sparen und mehr.", icon: "💶" },
  { slug: "steuern", name: "Steuern", description: "Einkommen, Mehrwertsteuer, Abgaben.", icon: "🧾" },
  { slug: "arbeit", name: "Arbeit", description: "Gehalt, Stundenlohn, Urlaub.", icon: "💼" },
  { slug: "immobilien", name: "Immobilien", description: "Miete, Kauf, Nebenkosten.", icon: "🏠" },
  
  { slug: "energie", name: "Energie", description: "Strom, Gas, Verbrauch.", icon: "⚡" },
  { slug: "gesundheit", name: "Gesundheit", description: "BMI, Kalorien, Werte.", icon: "❤️" },
  { slug: "sport", name: "Sport", description: "Training, Pace, Leistung.", icon: "🏃" },
  { slug: "reisen", name: "Reisen", description: "Distanzen, Kosten, Währungen.", icon: "✈️" },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return categories.find((c) => c.slug === slug);
}