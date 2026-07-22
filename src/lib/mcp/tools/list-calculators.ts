import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { calculators } from "@/lib/calculators/registry";

function serialize(list: typeof calculators) {
  return list.map((c) => ({
    slug: c.slug,
    name: c.name,
    category: c.category,
    shortDescription: c.shortDescription,
    url: `https://rechnerio.com/rechner/${c.slug}`,
    popular: Boolean(c.popular),
  }));
}

export default defineTool({
  name: "list_calculators",
  title: "Rechner auflisten",
  description:
    "Listet alle Rechner auf Rechnerio auf, optional gefiltert nach Kategorie-Slug (z. B. 'finanzen', 'gesundheit', 'reisen').",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe("Optionaler Kategorie-Slug, z. B. 'finanzen'. Leer lassen für alle Rechner."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const filtered = category
      ? calculators.filter((c) => c.category === category)
      : calculators;
    const items = serialize(filtered);
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, items },
    };
  },
});