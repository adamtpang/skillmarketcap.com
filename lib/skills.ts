import { readFileSync } from "node:fs";
import path from "node:path";
import type { AggregatedMarket, SkillSignal } from "./aggregate-market.ts";

export type { SkillSignal };

export type MarketSample = {
  directoryUrl: string;
  directoryRetrievedAt: string;
  attempted: number;
  ok: number;
  empty: number;
  failed: number;
  skippedUrl: number;
  workdayNotCalled: number;
  slugNamedCompanies: number;
  weighting: "equal-company";
  textUsed: string;
  postingsFile: string;
  boardsFile: string;
};

/** The published ranking. It is a completed capture, not a live refresh of every board. */
export type SkillMarketSnapshot = AggregatedMarket & {
  asOf: string;
  sourceFailures: string[];
  sourcesExpected: number;
  sources: Array<{ company: string; url: string | null; status: "ok" | "failed"; fetchedAt: string; postings: number }>;
  sample: MarketSample;
};

export function loadPublicMarket(): SkillMarketSnapshot {
  const file = path.join(process.cwd(), "data/market-public.json");
  const snapshot = JSON.parse(readFileSync(file, "utf8")) as SkillMarketSnapshot;
  if (snapshot.companiesScanned < 1000) {
    throw new Error(`Expanded sample has ${snapshot.companiesScanned} employer boards; at least 1000 are required`);
  }
  if (snapshot.sourceFailures.length > 0) {
    throw new Error(`Expanded sample is marked incomplete: ${snapshot.sourceFailures.join(", ")}`);
  }
  return snapshot;
}

export async function buildSkillMarket(): Promise<SkillMarketSnapshot> {
  return loadPublicMarket();
}

export const fetchSkillMarket = buildSkillMarket;
