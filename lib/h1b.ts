// Snapshot from the US Department of Labor's H-1B wage filings (Labor
// Condition Applications), FY2026 Q3 disclosure file, pulled 2026-11-01.
// dol.gov blocks scripted downloads, so this is a hand-run snapshot, not a
// live fetch. Method and full tables: H1B_LCA_PULL_2026-11-01.md.
//
// Only certified filings with an annual wage count. "Floor" is the
// legally binding minimum wage the employer filed (WAGE_RATE_OF_PAY_FROM).
// Levels are the government's prevailing-wage levels I to IV.

export type H1bLevel = {
  level: "I" | "II" | "III" | "IV";
  filings: number;
  medianFloorUsd: number;
  softwareFilings: number;
  softwareMedianFloorUsd: number;
};

export const H1B_SNAPSHOT = {
  source: "US Department of Labor, LCA disclosure data FY2026 Q3",
  sourceUrl: "https://www.dol.gov/agencies/eta/foreign-labor/performance",
  window: "Oct 2025 to Jun 2026",
  pulledOn: "2026-11-01",
  filings: 430,
  filingsAtPrevailingWage: 202,
  companies: ["Anthropic", "Cursor", "Ramp", "Perplexity", "Mercor", "Base Power", "Apptronik"],
  companiesWithoutFilings: ["Linear", "Saronic"],
  levels: [
    { level: "I", filings: 33, medianFloorUsd: 135_699, softwareFilings: 6, softwareMedianFloorUsd: 135_699 },
    { level: "II", filings: 132, medianFloorUsd: 161_637, softwareFilings: 62, softwareMedianFloorUsd: 168_000 },
    { level: "III", filings: 134, medianFloorUsd: 187_574, softwareFilings: 71, softwareMedianFloorUsd: 187_574 },
    { level: "IV", filings: 131, medianFloorUsd: 213_512, softwareFilings: 64, softwareMedianFloorUsd: 213_512 },
  ] satisfies H1bLevel[],
};
