import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { calculators } from "@/lib/calculators/registry";

export default defineTool({
  name: "search_calculators",
  title: "Rechner suchen",
  description:
    "Sucht Rechner auf Rechnerio anhand eines Stichworts (Name, Beschreibung oder Keywords). Gibt die besten Treffer mit Slug und URL zurück.",
  inputSchema: {
    query: z.string().min(1).describe("Suchbegriff, z. B. 'Kredit', 'BMI', 'Steuer'."),
    limit: z.number().int().min(1).max(20).optional().describe("Maximale Trefferzahl (Default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase().trim();
    const max = limit ?? 10;
    const scored = calculators
      .map((c) => {
        const hay = [c.name, c.shortDescription, c.description, ...(c.keywords ?? [])]
          .join(" ")
          .toLowerCase();
        let score = 0;
        if (c.name.toLowerCase().includes(q)) score += 10;
        if ((c.keywords ?? []).some((k) => k.toLowerCase().includes(q))) score += 5;
        if (hay.includes(q)) score += 1;
        return { c, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, max)
      .map(({ c }) => ({
        slug: c.slug,
        name: c.name,
        category: c.category,
        shortDescription: c.shortDescription,
        url: `https://rechnerio.com/rechner/${c.slug}`,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(scored, null, 2) }],
      structuredContent: { count: scored.length, matches: scored },
    };
  },
});