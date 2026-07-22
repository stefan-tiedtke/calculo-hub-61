import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { calculators } from "@/lib/calculators/registry";

export default defineTool({
  name: "get_calculator",
  title: "Rechner-Details",
  description:
    "Liefert Details zu einem Rechner auf Rechnerio (Beschreibung, Formel, Beispiele, FAQ, Quellen) anhand seines Slugs.",
  inputSchema: {
    slug: z.string().min(1).describe("Rechner-Slug, z. B. 'bmi-rechner' oder 'kredit-rechner'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const c = calculators.find((x) => x.slug === slug);
    if (!c) {
      return {
        content: [{ type: "text", text: `Kein Rechner mit slug '${slug}' gefunden.` }],
        isError: true,
      };
    }
    const details = {
      slug: c.slug,
      name: c.name,
      category: c.category,
      shortDescription: c.shortDescription,
      description: c.description,
      keywords: c.keywords,
      url: `https://rechnerio.com/rechner/${c.slug}`,
      formula: c.formula,
      examples: c.examples,
      faq: c.faq,
      sources: c.sources,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(details, null, 2) }],
      structuredContent: details,
    };
  },
});