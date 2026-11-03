import { SKILLS, matchesSkill, median, type SkillDefinition } from "./classification.ts";
import { modeSector, sectorForRole } from "./sectors.ts";

export type CapturedJob = {
  id: string;
  title: string;
  url: string;
  location: string | null;
  team: string | null;
  country: string;
  compUsd: number | null;
};

export type CapturedCompany = {
  key: string;
  name: string;
  provider: string;
  token: string;
  apiUrl: string;
  boardUrl: string;
  jobs: CapturedJob[];
};

export type SkillSignal = {
  slug: string;
  name: string;
  category: SkillDefinition["category"];
  demandScore: number;
  matchingRoles: number;
  shareOfRoles: number;
  companiesHiring: number;
  medianDisclosedUsd: number | null;
  disclosedCount: number;
  examples: Array<{ title: string; url: string; company: string }>;
};

export type MarketSlice = { label: string; companies: number; roles: number };

export type AggregatedMarket = {
  companiesScanned: number;
  rolesScanned: number;
  rolesClassified: number;
  signals: SkillSignal[];
  providers: MarketSlice[];
  sectors: MarketSlice[];
  sectorEmployers: MarketSlice[];
  countries: MarketSlice[];
  largestEmployer: { name: string; roles: number; shareOfRoles: number; provider: string };
};

type Example = { title: string; url: string; company: string; titleHit: boolean };

function addSlice(map: Map<string, { companies: Set<string>; roles: number }>, label: string, company: string, roles: number) {
  const row = map.get(label) ?? { companies: new Set<string>(), roles: 0 };
  row.companies.add(company);
  row.roles += roles;
  map.set(label, row);
}

function slices(map: Map<string, { companies: Set<string>; roles: number }>): MarketSlice[] {
  return [...map.entries()]
    .map(([label, row]) => ({ label, companies: row.companies.size, roles: row.roles }))
    .sort((a, b) => b.roles - a.roles || b.companies - a.companies || a.label.localeCompare(b.label));
}

/** Each employer board has total weight 1, split across its postings. One large board cannot set the index. */
export function aggregateCompanies(companies: CapturedCompany[]): AggregatedMarket {
  const included = companies.filter((company) => company.jobs.length > 0);
  const weights = new Map<string, number>();
  const roleCounts = new Map<string, number>();
  const companyCounts = new Map<string, Set<string>>();
  const pay = new Map<string, number[]>();
  const examples = new Map<string, Example[]>();
  const sectorRoles = new Map<string, { companies: Set<string>; roles: number }>();
  const sectorEmployers = new Map<string, { companies: Set<string>; roles: number }>();
  const countries = new Map<string, { companies: Set<string>; roles: number }>();
  const providers = new Map<string, { companies: Set<string>; roles: number }>();
  let rolesScanned = 0;
  let rolesClassified = 0;
  let largest = included[0] ?? null;

  for (const company of included) {
    const jobs = company.jobs;
    rolesScanned += jobs.length;
    if (!largest || jobs.length > largest.jobs.length) largest = company;
    addSlice(providers, company.provider, company.key, jobs.length);
    const employerSector = modeSector(jobs.map((job) => sectorForRole(job.title, job.team)));
    addSlice(sectorEmployers, employerSector, company.key, jobs.length);
    const skillHits = new Map<string, CapturedJob[]>();
    for (const job of jobs) {
      const sector = sectorForRole(job.title, job.team);
      addSlice(sectorRoles, sector, company.key, 1);
      addSlice(countries, job.country || "Unspecified", company.key, 1);
      let matched = false;
      for (const skill of SKILLS) {
        if (!matchesSkill(skill, job)) continue;
        matched = true;
        const list = skillHits.get(skill.slug) ?? [];
        list.push(job);
        skillHits.set(skill.slug, list);
      }
      if (matched) rolesClassified += 1;
    }
    for (const [slug, matches] of skillHits) {
      weights.set(slug, (weights.get(slug) ?? 0) + matches.length / jobs.length);
      roleCounts.set(slug, (roleCounts.get(slug) ?? 0) + matches.length);
      const hirers = companyCounts.get(slug) ?? new Set<string>();
      hirers.add(company.key);
      companyCounts.set(slug, hirers);
      const disclosed = pay.get(slug) ?? [];
      for (const job of matches) {
        if (typeof job.compUsd === "number") disclosed.push(job.compUsd);
      }
      pay.set(slug, disclosed);
      const skill = SKILLS.find((item) => item.slug === slug);
      const current = examples.get(slug) ?? [];
      for (const job of matches) {
        current.push({
          title: job.title,
          url: job.url,
          company: company.name,
          titleHit: skill ? skill.pattern.test(job.title) : false,
        });
        current.sort((a, b) => Number(b.titleHit) - Number(a.titleHit) || a.title.length - b.title.length || a.url.localeCompare(b.url));
        if (current.length > 2) current.length = 2;
      }
      examples.set(slug, current);
    }
  }

  const maximum = Math.max(0, ...weights.values());
  const signals = SKILLS.map((skill): SkillSignal | null => {
    const matchingRoles = roleCounts.get(skill.slug) ?? 0;
    if (matchingRoles === 0) return null;
    const disclosed = (pay.get(skill.slug) ?? []).slice().sort((a, b) => a - b);
    const weight = weights.get(skill.slug) ?? 0;
    return {
      slug: skill.slug,
      name: skill.name,
      category: skill.category,
      demandScore: maximum === 0 ? 0 : Math.round((weight / maximum) * 100),
      matchingRoles,
      shareOfRoles: rolesScanned === 0 ? 0 : Math.round((matchingRoles / rolesScanned) * 100),
      companiesHiring: companyCounts.get(skill.slug)?.size ?? 0,
      medianDisclosedUsd: median(disclosed),
      disclosedCount: disclosed.length,
      examples: (examples.get(skill.slug) ?? []).map(({ title, url, company }) => ({ title, url, company })),
    };
  }).filter((signal): signal is SkillSignal => signal !== null)
    .sort((a, b) => b.demandScore - a.demandScore || b.matchingRoles - a.matchingRoles || a.name.localeCompare(b.name));

  const largestRoles = largest?.jobs.length ?? 0;
  return {
    companiesScanned: included.length,
    rolesScanned,
    rolesClassified,
    signals,
    providers: slices(providers),
    sectors: slices(sectorRoles),
    sectorEmployers: slices(sectorEmployers),
    countries: slices(countries),
    largestEmployer: {
      name: largest?.name ?? "",
      roles: largestRoles,
      shareOfRoles: rolesScanned === 0 ? 0 : Math.round((largestRoles / rolesScanned) * 100),
      provider: largest?.provider ?? "",
    },
  };
}
