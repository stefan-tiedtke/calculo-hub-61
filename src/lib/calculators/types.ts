import type { ComponentType } from "react";

export interface CategoryDef {
  slug: string;
  name: string;
  description: string;
  icon: string; // emoji or short label — kept simple, no icon lib dependency
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
}