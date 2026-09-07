import { SKILLS, matchesSkill, median, roleText, type SkillDefinition } from "./classification";
import { unstable_cache } from "next/cache";
import { COMPANIES } from "./companies";
import { loadBoard, type Job } from "./jobs";

export type SkillSignal = {
  slug: string;
  name: string;
  category: SkillDefinition["category"];
  demandScore: number;
  matchingRoles: number;
  shareOfRoles: number;
  companiesHiring: number;
  /** Median of employer-disclosed salary-band midpoints in USD, null when no matching posting discloses. */
  medianDisclosedUsd: number | null;
  /** How many matching postings disclose a band. The denominator is matchingRoles. */
  disclosedCount: number;
  examples: Array<Pick<Job, "title" | "url"> & { company: string }>;
};

export type SkillMarketSnapshot = {
  asOf: string;
  companiesScanned: number;
  rolesScanned: number;
  rolesClassified: number;
  signals: SkillSignal[];
  sourceFailures: string[];
  sourcesExpected: number;
  sources: Array<{ company: string; url: string | null; status: 'ok' | 'failed'; fetchedAt: string; postings: number }>;
};

type IndexedJob = Job & { company: string };

/** Exported for the offline aggregation script; the site reads fetchSkillMarket. */
export async function buildSkillMarket(): Promise<SkillMarketSnapshot> {
  const boards = await Promise.all(
    COMPANIES.map(async (company) => ({
      ...await loadBoard(company.slug),
      company: company.name,
    }))
  );
  const sourceFailures = boards.filter(b => b.status === 'failed').map(b => b.company);
  const jobs: IndexedJob[] = boards.flatMap(({ company, jobs: companyJobs }) =>
    companyJobs.map((job) => ({ ...job, company }))
  );

  const rawSignals = SKILLS.map((skill) => {
    const matches = jobs.filter((job) => matchesSkill(skill, job));
    const companiesHiring = new Set(matches.map((job) => job.company)).size;
    const examples = matches
      .toSorted((a, b) => {
        const aTitle = skill.pattern.test(roleText(a)) ? 1 : 0;
        const bTitle = skill.pattern.test(roleText(b)) ? 1 : 0;
        return bTitle - aTitle;
      })
      .slice(0, 2)
      .map(({ title, url, company }) => ({ title, url, company }));

    return { skill, matches, companiesHiring, examples };
  });
  const maximum = Math.max(0, ...rawSignals.map(({ matches }) => matches.length));
  const classifiedRoleIds = new Set(
    rawSignals.flatMap(({ matches }) => matches.map((job) => `${job.company}:${job.id}`))
  );

  const signals = rawSignals
    .map(({ skill, matches, companiesHiring, examples }): SkillSignal => {
      const disclosedMidpoints = matches
        .map((job) => job.compUsd)
        .filter((value): value is number => typeof value === "number")
        .toSorted((a, b) => a - b);

      return {
        slug: skill.slug,
        name: skill.name,
        category: skill.category,
        demandScore: maximum === 0 ? 0 : Math.round((matches.length / maximum) * 100),
        matchingRoles: matches.length,
        shareOfRoles: jobs.length === 0 ? 0 : Math.round((matches.length / jobs.length) * 100),
        companiesHiring,
        medianDisclosedUsd: median(disclosedMidpoints),
        disclosedCount: disclosedMidpoints.length,
        examples,
      };
    })
    .filter((signal) => signal.matchingRoles > 0)
    .toSorted((a, b) => b.matchingRoles - a.matchingRoles || a.name.localeCompare(b.name));

  return {
    asOf: new Date().toISOString(),
    companiesScanned: boards.filter(({ jobs }) => jobs.length > 0).length,
    rolesScanned: jobs.length,
    rolesClassified: classifiedRoleIds.size,
    signals: sourceFailures.length ? [] : signals,
    sourceFailures,
    sourcesExpected: boards.length,
    sources: boards.map(b=>({company:b.company,url:b.url,status:b.status,fetchedAt:b.fetchedAt,postings:b.jobs.length})),
  };
}

/** Cache the compact computed snapshot, never the large source-board payloads. */
export const fetchSkillMarket = unstable_cache(buildSkillMarket, ["skill-market-v8"], {
  revalidate: 3600,
  tags: ["skill-market"],
});
