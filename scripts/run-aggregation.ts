/**
 * Offline check of the live aggregation, no server needed:
 *   npx tsx scripts/run-aggregation.ts
 * Calls buildSkillMarket directly (bypassing the Next cache wrapper) and
 * prints per-board disclosure coverage plus the ranked skills with their
 * median disclosed comp. Read-only against the public ATS APIs.
 */

import { COMPANIES } from "../lib/companies";
import { fetchJobsWithDescriptions } from "../lib/jobs";
import { buildSkillMarket } from "../lib/skills";

async function main() {
  for (const company of COMPANIES) {
    const jobs = await fetchJobsWithDescriptions(company.slug);
    const disclosed = jobs.filter((job) => typeof job.compUsd === "number").length;
    console.log(
      `${company.slug.padEnd(12)} jobs=${String(jobs.length).padStart(3)} disclosed=${disclosed}`
    );
  }

  const market = await buildSkillMarket();
  console.log(
    `\nasOf=${market.asOf} companies=${market.companiesScanned} roles=${market.rolesScanned} classified=${market.rolesClassified}`
  );
  for (const [i, s] of market.signals.entries()) {
    const pay =
      s.medianDisclosedUsd === null
        ? "no disclosed comp"
        : `$${Math.round(s.medianDisclosedUsd / 1000)}K median (${s.disclosedCount} of ${s.matchingRoles} disclose)`;
    console.log(
      `${String(i + 1).padStart(2)}. ${s.name.padEnd(30)} roles=${String(s.matchingRoles).padStart(3)} ${pay}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
