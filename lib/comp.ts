/**
 * The honest dollar layer: one number per posting, the midpoint of the
 * employer-disclosed salary band in USD. No disclosure means no number.
 * Ashby publishes structured tiers on its public posting API; Greenhouse
 * sometimes states a range as text inside the description. Anything
 * ambiguous, hourly, equity-only, or non-USD is skipped, never estimated.
 */

type AshbyComponent = {
  compensationType?: unknown;
  interval?: unknown;
  currencyCode?: unknown;
  minValue?: unknown;
  maxValue?: unknown;
};

type AshbyCompensation = {
  summaryComponents?: AshbyComponent[];
  compensationTiers?: Array<{ components?: AshbyComponent[] }>;
};

export type DisclosedBand = {
  min: number;
  max: number;
  currency: 'USD';
  period: 'year';
  source: 'ashby-structured' | 'greenhouse-text';
};

/** Sanity rails for an annual US base band. Outside these, skip the posting. */
const MIN_ANNUAL_USD = 30_000;
const MAX_ANNUAL_USD = 2_000_000;

function bandMidpointUsd(min: number, max: number): number | null {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min > max || min < MIN_ANNUAL_USD || max > MAX_ANNUAL_USD) return null;
  if (max / min > 5) return null; // a "range" that wide is two different jobs
  return Math.round((min + max) / 2);
}

/** Structured comp from Ashby's `?includeCompensation=true` payload. */
export function ashbyCompBandUsd(j: Record<string, unknown>): DisclosedBand | null {
  const comp = j.compensation as AshbyCompensation | undefined | null;
  if (!comp) return null;

  const tierSalaries = (comp.compensationTiers ?? []).flatMap(t => t.components ?? [])
    .filter(c => c.compensationType === 'Salary');
  // Do not create a synthetic band spanning different location/level tiers.
  const tierBands = new Set(tierSalaries.map(c => JSON.stringify([c.currencyCode,c.interval,c.minValue,c.maxValue])));
  if (tierBands.size > 1) return null;
  // A summary cannot override a contradictory tier, currency or pay period.
  const allSalaries = [...tierSalaries, ...(comp.summaryComponents ?? []).filter(c=>c.compensationType==='Salary')];
  if (new Set(allSalaries.map(c=>JSON.stringify([c.currencyCode,c.interval,c.minValue,c.maxValue]))).size > 1) return null;
  const components =
    comp.summaryComponents && comp.summaryComponents.length > 0
      ? comp.summaryComponents
      : (comp.compensationTiers ?? []).flatMap((tier) => tier.components ?? []);

  const annualUsdSalaries = components.filter(
    (c) =>
      c.compensationType === "Salary" &&
      c.currencyCode === "USD" &&
      c.interval === "1 YEAR" &&
      typeof c.minValue === "number" && typeof c.maxValue === "number"
  );
  if (annualUsdSalaries.length === 0) return null;
  if (new Set(annualUsdSalaries.map(c => `${c.minValue}:${c.maxValue}`)).size > 1) return null;

  const mins = annualUsdSalaries.map((c) => c.minValue as number);
  const maxes = annualUsdSalaries.map((c) =>
    typeof c.maxValue === "number" ? c.maxValue : (c.minValue as number)
  );
  const min = Math.min(...mins);
  const max = Math.max(...maxes);
  return bandMidpointUsd(min,max) === null ? null : {min,max,currency:'USD',period:'year',source:'ashby-structured'};
}

export function ashbyCompMidpointUsd(j: Record<string, unknown>): number | null {
  const band = ashbyCompBandUsd(j);
  return band ? bandMidpointUsd(band.min,band.max) : null;
}

/**
 * A disclosed range in description text, e.g. "$150,000 - $220,000" or
 * "$150K to $220K" with any dash. Dash variants written as escapes on purpose.
 */
const SALARY_RANGE =
  /\$\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*([kK])?\s*(?:[-\u2013\u2014]|to)\s*\$?\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*([kK])?/g;

/** A named non-USD currency near the match disqualifies it. USD is fine. */
const NON_USD_NEARBY = /\b(CAD|AUD|NZD|SGD|HKD|CHF|EUR|GBP|MXN|INR)\b/i;

function parseAmount(raw: string, kSuffix: string | undefined): number {
  const value = Number.parseFloat(raw.replace(/,/g, ""));
  return kSuffix ? value * 1000 : value;
}

/**
 * Greenhouse `content=true` descriptions arrive as entity-escaped HTML
 * (tags themselves encoded, dashes double-encoded as `&amp;mdash;`), so:
 * decode once, strip the reconstructed tags, decode the inner entities.
 */
function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&mdash;/gi, "\u2014")
    .replace(/&ndash;/gi, "\u2013")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

function compText(html: string): string {
  return decodeEntities(decodeEntities(html).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
}

/** Salary-band midpoint parsed from posting HTML, or null when not disclosed. */
export function textCompBandUsd(html: string | null | undefined): DisclosedBand | null {
  if (!html || !html.includes("$")) return null;
  const text = compText(html);
  const bands: DisclosedBand[] = [];

  for (const match of text.matchAll(SALARY_RANGE)) {
    const index = match.index ?? 0;

    // A letter right before "$" means a non-USD sigil like CA$ or A$.
    if (/[A-Za-z]/.test(text[index - 1] ?? "")) continue;
    const before = text.slice(Math.max(0, index - 6), index);
    const after = text.slice(index + match[0].length, index + match[0].length + 16);
    if (NON_USD_NEARBY.test(before) || NON_USD_NEARBY.test(after)) continue;

    // A dollar range alone could be a signing bonus or an operating budget.
    // Require nearby annual salary evidence; decline ambiguous disclosures.
    const context = text.slice(Math.max(0, index - 100), index + match[0].length + 100);
    if (!/\b(USD|US dollars|U\.S\. dollars)\b/i.test(context) || NON_USD_NEARBY.test(context)) continue;
    if (!/\b(annual|annually|per year|yearly|\/year)\b/i.test(context) ||
        !/\b(salary|base pay|base compensation)\b/i.test(context) ||
        /\b(hourly|per hour|per month|monthly|signing bonus|sign-on bonus|equity grant)\b/i.test(context)) continue;

    const min = parseAmount(match[1] ?? "", match[2]);
    const max = parseAmount(match[3] ?? "", match[4]);
    if (!Number.isFinite(min) || !Number.isFinite(max)) continue;

    // The rails skip hourly rates, equity percentages, and mismatched-K
    // ambiguity ("$150 - $220K") on their own: too small or too lopsided.
    const midpoint = bandMidpointUsd(min, max);
    if (midpoint !== null) bands.push({min,max,currency:'USD',period:'year',source:'greenhouse-text'});
  }
  const unique = new Map(bands.map(b => [`${b.min}:${b.max}`,b]));
  return unique.size === 1 ? [...unique.values()][0] : null;
}

export function textCompMidpointUsd(html: string | null | undefined): number | null {
  const band = textCompBandUsd(html);
  return band ? bandMidpointUsd(band.min,band.max) : null;
}
