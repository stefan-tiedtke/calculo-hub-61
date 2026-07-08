/**
 * Vereinfachte Lohnsteuer- und Sozialversicherungsberechnung 2025 (West).
 * Basis: Grundtabelle §32a EStG, Splittingtarif für Klasse III,
 * grobe Näherung für V/VI (× 1,15).
 */

export type TaxClass = "1" | "2" | "3" | "4" | "5" | "6";
export type Bundesland = "by-bw" | "rest";

export interface LohnsteuerOptions {
  klasse: TaxClass;
  kirche: boolean;
  bundesland: Bundesland;
  kinder: boolean;
  /** KV-Zusatzbeitrag in Prozent (z. B. 1.7) */
  zusatzbeitragProzent: number;
}

export interface LohnsteuerErgebnis {
  brutto: number;
  netto: number;
  lst: number;
  soli: number;
  kist: number;
  rv: number;
  av: number;
  kv: number;
  pv: number;
  sozial: number;
  steuern: number;
  abgaben: number;
}

// Einkommensteuer 2025 (Grundtabelle §32a EStG)
export function einkommensteuer(zvE: number): number {
  if (zvE <= 12096) return 0;
  if (zvE <= 17443) {
    const y = (zvE - 12096) / 10000;
    return (932.3 * y + 1400) * y;
  }
  if (zvE <= 68480) {
    const z = (zvE - 17443) / 10000;
    return (176.64 * z + 2397) * z + 1015.13;
  }
  if (zvE <= 277825) return 0.42 * zvE - 10911.92;
  return 0.45 * zvE - 19246.67;
}

export function lohnsteuer(zvE: number, klasse: TaxClass): number {
  if (klasse === "3") return 2 * einkommensteuer(zvE / 2);
  if (klasse === "5" || klasse === "6") return einkommensteuer(zvE) * 1.15;
  return einkommensteuer(zvE);
}

/**
 * Berechnet Netto pro Jahr aus Brutto pro Jahr.
 * Alle Werte sind Jahreswerte.
 */
export function computeNettoJahr(
  bruttoJahr: number,
  opts: LohnsteuerOptions,
): LohnsteuerErgebnis {
  const brutto = Math.max(0, bruttoJahr);

  // Beitragsbemessungsgrenzen 2025 (jährlich, West vereinfacht)
  const bbgRV = 96600;
  const bbgKV = 66150;
  const rvBase = Math.min(brutto, bbgRV);
  const kvBase = Math.min(brutto, bbgKV);

  const zusatzPct = opts.zusatzbeitragProzent || 0;
  const rv = rvBase * 0.093; // 18,6 % / 2
  const av = rvBase * 0.013; // 2,6 % / 2
  const kv = kvBase * (0.073 + zusatzPct / 200);
  const pvSatz = 0.017 + (!opts.kinder ? 0.006 : 0);
  const pv = kvBase * pvSatz;
  const sozial = rv + av + kv + pv;

  const zvE = Math.max(0, brutto - 1230 - 36 - sozial);
  const lst = lohnsteuer(zvE, opts.klasse);

  const soliFrei = opts.klasse === "3" ? 36260 : 18130;
  const soli = lst > soliFrei ? lst * 0.055 : 0;

  const kist = opts.kirche ? lst * (opts.bundesland === "by-bw" ? 0.08 : 0.09) : 0;

  const steuern = lst + soli + kist;
  const abgaben = steuern + sozial;
  const netto = brutto - abgaben;

  return { brutto, netto, lst, soli, kist, rv, av, kv, pv, sozial, steuern, abgaben };
}