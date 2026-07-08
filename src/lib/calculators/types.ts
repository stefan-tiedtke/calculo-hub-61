import type { ComponentType } from "react";

export interface CategoryDef {
  slug: string;
  name: string;
  description: string;
  icon: string; // emoji or short label — kept simple, no icon lib dependency
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ExampleItem {
  title: string;
  inputs: string; // human-readable input summary
  result: string; // human-readable result
  note?: string;
}

export interface FormulaBlock {
  expression: string; // e.g. "BMI = Gewicht (kg) / Größe (m)²"
  explanation?: string;
  variables?: { symbol: string; description: string }[];
}

export interface CalculatorDef {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string; // category slug
  keywords: string[];
  popular?: boolean;
  updatedAt?: string;
  component: ComponentType;
  // Optional structured content — rendered by the shared shell.
  formula?: FormulaBlock;
  examples?: ExampleItem[];
  faq?: FaqItem[];
  relatedSlugs?: string[]; // overrides category-based related list
  sources?: { label: string; url: string }[];
}