import { ashbyCompBandUsd } from './comp.ts';
import { annualUsdMidpoint } from './comp.ts';
import { postingCountry } from './geo.ts';

function text(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function job(fields) {
  if (!fields.title || !fields.url || !fields.id) return null;
  return {
    id: String(fields.id),
    title: fields.title,
    url: fields.url,
    location: fields.location ?? null,
    team: fields.team ?? null,
    country: fields.country || 'Unspecified',
    compUsd: Number.isFinite(fields.compUsd) ? fields.compUsd : null,
  };
}

function dedupe(jobs) {
  const ids = new Set();
  const urls = new Set();
  const kept = [];
  for (const item of jobs) {
    if (!item) continue;
    let urlKey = item.url;
    try {
      const url = new URL(item.url);
      if (!['https:', 'http:'].includes(url.protocol)) continue;
      for (const key of [...url.searchParams.keys()]) {
        if (/^(utm_|ref$|source$)/i.test(key)) url.searchParams.delete(key);
      }
      url.hash = '';
      urlKey = url.href;
    } catch {
      continue;
    }
    if (ids.has(item.id) || urls.has(urlKey)) continue;
    ids.add(item.id);
    urls.add(urlKey);
    kept.push({ ...item, url: urlKey });
  }
  return kept;
}

function modeName(names) {
  const counts = new Map();
  for (const name of names) {
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null;
}

function slugName(token) {
  return token.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function yearUsd(min, max, currency, period) {
  if (String(currency || '').toUpperCase() !== 'USD') return null;
  const label = String(period || '').toLowerCase();
  if (!/year|annual/.test(label) || /hour|month|week|day/.test(label)) return null;
  return annualUsdMidpoint(Number(min), Number(max));
}

export function parseGreenhouse(data) {
  if (!data || !Array.isArray(data.jobs)) throw new Error('Invalid Greenhouse payload');
  const names = [];
  const jobs = data.jobs.map((raw) => {
    const name = text(raw?.company_name);
    if (name) names.push(name);
    const location = text(raw?.location?.name);
    return job({
      id: raw?.id,
      title: text(raw?.title),
      url: text(raw?.absolute_url),
      location,
      team: null,
      country: postingCountry(null, location),
      compUsd: null,
    });
  });
  return { name: modeName(names), nameSource: modeName(names) ? 'api' : null, jobs: dedupe(jobs) };
}

export function parseAshby(data) {
  if (!data || !Array.isArray(data.jobs)) throw new Error('Invalid Ashby payload');
  const jobs = data.jobs.map((raw) => {
    if (!raw || raw.isListed === false) return null;
    const location = text(raw.location);
    const addressCountry = text(raw.address?.addressCountry) ?? text(raw.address?.postalAddress?.addressCountry);
    const band = ashbyCompBandUsd(raw);
    return job({
      id: raw.id,
      title: text(raw.title),
      url: text(raw.jobUrl) ?? text(raw.applyUrl),
      location,
      team: text(raw.department) ?? text(raw.team),
      country: postingCountry(addressCountry, location),
      compUsd: band ? Math.round((band.min + band.max) / 2) : null,
    });
  });
  return { name: null, nameSource: null, jobs: dedupe(jobs) };
}

export function parseLever(data) {
  if (!Array.isArray(data)) throw new Error('Invalid Lever payload');
  const jobs = data.map((raw) => {
    const location = text(raw?.categories?.location);
    const band = yearUsd(raw?.salaryRange?.min, raw?.salaryRange?.max, raw?.salaryRange?.currency, raw?.salaryRange?.interval);
    return job({
      id: raw?.id,
      title: text(raw?.text),
      url: text(raw?.hostedUrl) ?? text(raw?.applyUrl),
      location,
      team: text(raw?.categories?.team) ?? text(raw?.categories?.department),
      country: postingCountry(text(raw?.country), location),
      compUsd: band,
    });
  });
  return { name: null, nameSource: null, jobs: dedupe(jobs) };
}

export function parseWorkable(data) {
  if (!data || !Array.isArray(data.jobs)) throw new Error('Invalid Workable payload');
  const jobs = data.jobs.map((raw) => {
    const countries = Array.isArray(raw?.locations)
      ? raw.locations.map((item) => text(item?.country)).filter(Boolean)
      : [];
    const structured = countries.length > 1 && new Set(countries).size > 1
      ? null
      : text(raw?.country) ?? countries[0] ?? null;
    const multiple = countries.length > 1 && new Set(countries).size > 1;
    const location = [text(raw?.city), text(raw?.state), text(raw?.country)].filter(Boolean).join(', ') || null;
    return job({
      id: raw?.shortcode ?? raw?.id,
      title: text(raw?.title),
      url: text(raw?.url) ?? text(raw?.application_url),
      location,
      team: text(raw?.department),
      country: multiple ? 'Multiple' : postingCountry(structured, location),
      compUsd: null,
    });
  });
  return { name: text(data.name), nameSource: text(data.name) ? 'api' : null, jobs: dedupe(jobs) };
}

export function parseRecruitee(data) {
  if (!data || !Array.isArray(data.offers)) throw new Error('Invalid Recruitee payload');
  const names = [];
  const jobs = data.offers.map((raw) => {
    const name = text(raw?.company_name);
    if (name) names.push(name);
    const location = text(raw?.location) ?? ([text(raw?.city), text(raw?.country)].filter(Boolean).join(', ') || null);
    const band = yearUsd(raw?.salary?.min, raw?.salary?.max, raw?.salary?.currency, raw?.salary?.period);
    return job({
      id: raw?.id ?? raw?.guid,
      title: text(raw?.title),
      url: text(raw?.careers_url),
      location,
      team: text(raw?.department),
      country: postingCountry(text(raw?.country) ?? text(raw?.country_code), location),
      compUsd: band,
    });
  });
  const company = modeName(names);
  return { name: company, nameSource: company ? 'api' : null, jobs: dedupe(jobs) };
}

export function parsePersonio(xml, boardUrl) {
  if (typeof xml !== 'string' || !xml.includes('<workzag-jobs')) throw new Error('Invalid Personio payload');
  const names = [];
  const jobs = [];
  for (const block of xml.split(/<position>/).slice(1)) {
    const head = block.split(/<jobDescriptions>/)[0] ?? '';
    const grab = (tag) => {
      const match = head.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
      return match ? decodeXml(match[1]) : null;
    };
    const id = grab('id');
    const subcompany = grab('subcompany');
    if (subcompany) names.push(subcompany);
    const office = grab('office');
    jobs.push(job({
      id,
      title: grab('name'),
      url: id && boardUrl ? `${boardUrl.replace(/\/$/, '')}/job/${id}` : null,
      location: office,
      team: grab('department'),
      country: postingCountry(null, office),
      compUsd: null,
    }));
  }
  const company = modeName(names);
  return { name: company, nameSource: company ? 'api' : null, jobs: dedupe(jobs) };
}

export function parseRippling(data) {
  if (!Array.isArray(data)) throw new Error('Invalid Rippling payload');
  const jobs = data.map((raw) => {
    const location = text(raw?.workLocation?.label);
    return job({
      id: raw?.uuid ?? raw?.id,
      title: text(raw?.name),
      url: text(raw?.url),
      location,
      team: text(raw?.department?.label),
      country: postingCountry(null, location),
      compUsd: null,
    });
  });
  return { name: null, nameSource: null, jobs: dedupe(jobs) };
}

export function displayName(parsed, token) {
  if (parsed.name) return { name: parsed.name, nameSource: parsed.nameSource ?? 'api' };
  return { name: slugName(token), nameSource: 'board-slug' };
}

export function allowedBoardUrl(platform, apiUrl) {
  let url;
  try { url = new URL(apiUrl); } catch { return false; }
  if (url.protocol !== 'https:') return false;
  const host = url.hostname;
  if (platform === 'greenhouse') return host === 'boards-api.greenhouse.io';
  if (platform === 'ashby') return host === 'api.ashbyhq.com';
  if (platform === 'lever') return host === 'api.lever.co' || host === 'api.eu.lever.co';
  if (platform === 'workable') return host === 'apply.workable.com';
  if (platform === 'recruitee') return host.endsWith('.recruitee.com') && host.split('.').length >= 3;
  if (platform === 'personio') return host.endsWith('.jobs.personio.de') || host.endsWith('.jobs.personio.com');
  if (platform === 'rippling') return host === 'api.rippling.com';
  return false;
}
