/**
 * Print the committed expanded sample. This does not call employer APIs.
 * Refresh that sample with scripts/capture-expanded-market.mjs.
 */

import { buildSkillMarket } from "../lib/skills";

async function main() {
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
