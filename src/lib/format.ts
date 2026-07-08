/** German-locale number formatting helpers shared across all calculators. */
const nf = (opts: Intl.NumberFormatOptions) => new Intl.NumberFormat("de-DE", opts);

export function formatNumber(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return "–";
  return nf({
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatInt(value: number): string {
  if (!Number.isFinite(value)) return "–";
  return nf({ maximumFractionDigits: 0 }).format(value);
}

export function formatCurrency(value: number, currency = "EUR"): string {
  if (!Number.isFinite(value)) return "–";
  return nf({ style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

/** Parse a user-typed number that may use "," or "." as decimal separator. */
export function parseNumber(input: string): number {
  if (!input) return NaN;
  const normalized = input.replace(/\s/g, "").replace(",", ".");
  return parseFloat(normalized);
}