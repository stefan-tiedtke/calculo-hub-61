import { defineTool } from "@lovable.dev/mcp-js";
import { categories } from "@/lib/calculators/categories";

export default defineTool({
  name: "list_categories",
  title: "Kategorien auflisten",
  description:
    "Listet alle Rechner-Kategorien auf Rechnerio (z. B. Finanzen, Steuern, Gesundheit) inklusive Slug, Name und Beschreibung.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(categories, null, 2) }],
    structuredContent: { categories },
  }),
});