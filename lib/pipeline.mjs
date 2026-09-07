import { SKILLS, matchesSkill, median } from './classification.ts';
import { normalize } from './job-normalization.ts';

export function normalizeBoard(data, source) {
  if (!data || !Array.isArray(data.jobs)) throw new Error('Invalid jobs payload');
  const ids = new Set();
  const urls = new Set();
  let duplicates = 0;
  let skipped = 0;
  const jobs = [];
  for (const raw of data.jobs) {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid posting');
    const job = normalize(raw, source.provider, true);
    if (!job) {
      if (source.provider !== 'ashby' || raw.isListed !== false) throw new Error('Invalid listed posting');
      skipped++; continue;
    }
    const key = `${source.company}:${job.id}`;
    const url = new URL(job.url);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid posting URL');
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|ref$|source$)/i.test(key)) url.searchParams.delete(key);
    }
    url.hash = '';
    const urlKey = `${source.company}:${url.href}`;
    if (ids.has(key) || urls.has(urlKey)) { duplicates++; continue; }
    ids.add(key); urls.add(urlKey);
    jobs.push({...job, company:source.company, provider:source.provider,
      // Retain source geography and all compensation fields in raw responses.
      // No country, remote eligibility or seniority is guessed from titles.
      salaryCurrency:job.compUsd === null ? null : 'USD',
      salaryPeriod:job.compUsd === null ? null : 'year', seniority:null});
  }
  return {jobs, duplicates, skipped};
}

export function summarize(jobs) {
  return SKILLS.map(skill => {
    const matches = jobs.filter(job => matchesSkill(skill,job));
    const pay = matches.map(j=>j.compUsd).filter(Number.isFinite).sort((a,b)=>a-b);
    return {skill:skill.slug, matchingPostings:matches.length,
      employers:new Set(matches.map(j=>j.company)).size,
      disclosedCount:pay.length, medianAdvertisedAnnualUsd:median(pay),
      postingIds:matches.map(j=>`${j.company}:${j.id}`)};
  }).sort((a,b)=>b.matchingPostings-a.matchingPostings || a.skill.localeCompare(b.skill));
}

export function summarizeByLocation(jobs) {
  const groups = new Map();
  for (const job of jobs) {
    const key = job.location || 'Unspecified';
    groups.set(key,[...(groups.get(key)||[]),job]);
  }
  return [...groups].map(([sourceLocation,rows])=>({sourceLocation, seniority:'Unclassified', signals:summarize(rows)}));
}

export function validateMomPage(data) {
  if (data?.success !== true || !Array.isArray(data.result?.records) || !Number.isInteger(data.result.total) || data.result.total < 0) throw new Error('Invalid MOM payload');
  for (const row of data.result.records) {
    if (typeof row.year !== 'string' || !/^\d{4}$/.test(row.year) || typeof row.occ_desc !== 'string') throw new Error('Invalid MOM wage record');
    for (const key of ['mthly_gross_wage_50_pctile','mthly_basic_wage_50_pctile']) {
      if (row[key] === undefined) throw new Error('Missing MOM wage column');
    }
  }
  return data.result;
}
