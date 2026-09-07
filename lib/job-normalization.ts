import { ashbyCompBandUsd, textCompBandUsd, type DisclosedBand } from "./comp.ts";
export type Job = {
  id: string;
  title: string;
  url: string;
  location: string | null;
  team: string | null;
  /** Plain-text requirements when the public board exposes them. Server-side only today. */
  description?: string | null;
  /** Midpoint of the employer-disclosed USD base salary band, null when none is disclosed. */
  compUsd?: number | null;
  compBandUsd?: DisclosedBand | null;
};

export function normalize(
  j: Record<string, unknown>,
  provider: "greenhouse" | "ashby",
  includeDescriptions: boolean
): Job | null {
  if (provider === "greenhouse") {
    const title = str(j.title);
    const url = str(j.absolute_url);
    if (!title || !url) return null;
    const loc = j.location as { name?: string } | undefined;
    const band = includeDescriptions ? textCompBandUsd(str(j.content)) : null;
    return {
      id: String(j.id ?? url),
      title,
      url,
      location: loc?.name ?? null,
      team: null,
      description: includeDescriptions ? plainText(j.content) : null,
      compUsd: band ? Math.round((band.min + band.max) / 2) : null,
      compBandUsd: band,
    };
  }

  // Ashby
  if (j.isListed === false) return null;
  const title = str(j.title);
  const url = str(j.jobUrl) ?? str(j.applyUrl);
  if (!title || !url) return null;
  const band = ashbyCompBandUsd(j);
  return {
    id: String(j.id ?? url),
    title,
    url,
    location: str(j.location),
    team: str(j.department) ?? str(j.team),
    description: includeDescriptions
      ? plainText(j.descriptionPlain) ?? plainText(j.descriptionHtml)
      : null,
    compUsd: band ? Math.round((band.min + band.max) / 2) : null,
    compBandUsd: band,
  };
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function plainText(v: unknown): string | null {
  const value = str(v);
  if (!value) return null;
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
