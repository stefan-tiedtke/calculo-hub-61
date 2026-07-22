import { defineMcp } from "@lovable.dev/mcp-js";
import listCategoriesTool from "./tools/list-categories";
import listCalculatorsTool from "./tools/list-calculators";
import searchCalculatorsTool from "./tools/search-calculators";
import getCalculatorTool from "./tools/get-calculator";

export default defineMcp({
  name: "rechnerio-mcp",
  title: "Rechnerio",
  version: "0.1.0",
  instructions:
    "Zugriff auf den Katalog kostenloser Online-Rechner von Rechnerio (rechnerio.com). Mit list_categories und list_calculators kannst du das Angebot durchstöbern, search_calculators findet passende Rechner zu einem Stichwort, get_calculator liefert Details (Beschreibung, Formel, Beispiele, FAQ) zu einem Rechner. Alle Tools sind read-only und arbeiten ausschließlich mit öffentlichen Katalogdaten.",
  tools: [listCategoriesTool, listCalculatorsTool, searchCalculatorsTool, getCalculatorTool],
});