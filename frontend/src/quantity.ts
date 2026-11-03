/**
 * Scaling of ingredient quantities, at display time. Ingredients stay free text: only the
 * quantity written with digits or fractions at the start of the line is scaled
 * ("200 g de farine", "½ citron", "2 à 3 c. à soupe"); "une pincée", "Sel, poivre" are left as is,
 * and so is everything after the first quantity ("1 boîte de 400 g" keeps its 400 g).
 */

const UNICODE_FRACTIONS: Record<string, number> = {
  "½": 1 / 2,
  "¼": 1 / 4,
  "¾": 3 / 4,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "⅛": 1 / 8,
};
const FRACTION_CHARS = Object.keys(UNICODE_FRACTIONS).join("");

// One number: "1 1/2", "1/2", "1,5", "1.5", "1½", "½", "200".
const NUMBER = `(?:\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d+(?:[.,]\\d+)?(?:\\s?[${FRACTION_CHARS}])?|[${FRACTION_CHARS}])`;
// Optional range: "2 à 3", "2-3", "2 – 3", "2 ou 3".
const LEADING_QUANTITY = new RegExp(`^(\\s*)(${NUMBER})(?:(\\s*(?:à|-|–|ou)\\s*)(${NUMBER}))?`, "i");

// Units shown with decimals ("2,25 l"); anything else is counted with fractions ("4½ œufs").
const METRIC_UNIT = /^\s?(?:kg|g|gr|mg|ml|cl|dl|l|litres?|grammes?|kilos?|kilogrammes?|millilitres?|centilitres?)(?![\p{L}])/iu;

export function parseNumber(text: string): number {
  const value = text.trim();
  const mixed = /^(\d+)\s+(\d+)\/(\d+)$/.exec(value);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const fraction = /^(\d+)\/(\d+)$/.exec(value);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  const last = value.at(-1)!;
  if (last in UNICODE_FRACTIONS) {
    const whole = value.slice(0, -1).trim();
    return (whole ? Number(whole) : 0) + UNICODE_FRACTIONS[last];
  }
  return Number(value.replace(",", "."));
}

export interface LeadingQuantity {
  /** Leading whitespace kept as is. */
  indent: string;
  values: number[];
  /** Range separator as written (" à ", "-"), when there are two values. */
  separator: string;
  /** Rest of the line, after the quantity. */
  rest: string;
  metric: boolean;
}

export function parseLeadingQuantity(text: string): LeadingQuantity | null {
  const match = LEADING_QUANTITY.exec(text);
  if (!match) return null;
  const [whole, indent, first, separator, second] = match;
  const values = [parseNumber(first)];
  if (second !== undefined) values.push(parseNumber(second));
  if (values.some((v) => !Number.isFinite(v) || v <= 0)) return null;
  const rest = text.slice(whole.length);
  return { indent, values, separator: separator ?? "", rest, metric: METRIC_UNIT.test(rest) };
}

const FRACTION_GLYPHS: [number, string][] = [
  [0, ""],
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [1 / 2, "½"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"],
  [1, ""],
];

/** Counted things: nearest quarter/third ("4½", "¾"); whole numbers from 10. */
export function formatCount(value: number): string {
  if (value >= 10) return String(Math.round(value));
  let whole = Math.floor(value);
  const [fraction, glyph] = FRACTION_GLYPHS.reduce((best, candidate) =>
    Math.abs(value - whole - candidate[0]) < Math.abs(value - whole - best[0]) ? candidate : best,
  );
  if (fraction === 1) whole += 1;
  if (whole === 0 && !glyph) return "¼"; // never round a quantity down to nothing
  return `${whole || ""}${glyph}`;
}

/** Metric amounts: sensible precision, localized decimal separator ("2,25", "12,5", "375"). */
export function formatMetric(value: number, language: string): string {
  let rounded: number;
  let digits = 0;
  if (value >= 100) {
    rounded = Math.round(value / 5) * 5;
  } else if (value >= 10) {
    rounded = Math.round(value * 2) / 2; // 12,5 g
    digits = 1;
  } else {
    // Quarters keep two decimals (2,25 l), otherwise one (1,3 kg).
    const quarter = Math.round(value * 4) / 4;
    digits = Math.abs(quarter - value) < 0.01 ? 2 : 1;
    rounded = digits === 2 ? quarter : Math.round(value * 10) / 10;
  }
  return new Intl.NumberFormat(language, { maximumFractionDigits: digits }).format(rounded);
}

export interface ScaledLine {
  indent: string;
  /** Scaled quantity, e.g. "300" or "3 à 4½". */
  quantity: string;
  rest: string;
}

/** Scales the leading quantity of an ingredient line, or returns null if there is none. */
export function scaleLine(text: string, factor: number, language: string): ScaledLine | null {
  const parsed = parseLeadingQuantity(text);
  if (!parsed) return null;
  const format = (value: number) =>
    parsed.metric ? formatMetric(value * factor, language) : formatCount(value * factor);
  // The rest is kept verbatim, so "200g" becomes "400g" and "200 g" becomes "400 g".
  return {
    indent: parsed.indent,
    quantity: parsed.values.map(format).join(parsed.separator),
    rest: parsed.rest,
  };
}

/** Plain-text version of an ingredient for the given factor (unchanged when factor is 1). */
export function scaledText(text: string, factor: number, language: string): string {
  if (factor === 1) return text;
  const scaled = scaleLine(text, factor, language);
  return scaled ? `${scaled.indent}${scaled.quantity}${scaled.rest}` : text;
}
