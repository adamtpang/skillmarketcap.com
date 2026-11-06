/** Display helpers. They format figures already in the capture. They do not estimate new ones. */

/** A row with fewer disclosed bands than this is marked in the UI. The mark is a label, not a confidence interval. */
export const SMALL_DISCLOSURE_COUNT = 30;

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

/** Share of a whole, rounded to 0.1 percentage point. A positive share that would print as 0.0% is shown as under 0.1%. */
export function formatPercentOf(part: number, whole: number): string {
  if (whole <= 0 || part <= 0) return "0%";
  const pct = (part / whole) * 100;
  if (pct < 0.05) return "<0.1%";
  return `${pct.toFixed(1)}%`;
}

export function formatTenthsPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCapturedAt(iso: string): string {
  return `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(iso))} UTC`;
}

export function formatUtcDay(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
