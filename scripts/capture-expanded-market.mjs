/**
 * Re-fetch public ATS job-board APIs and write the committed market sample.
 *
 * Candidate addresses come from the public job-board directory
 * (https://kalebconfer-sys.github.io/job-board-directory/). Each board is
 * called again here. Counts in the ranking are from those responses.
 * Workday is not called. No API key is used.
 *
 *   node --no-warnings --experimental-strip-types scripts/capture-expanded-market.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { aggregateCompanies } from '../lib/aggregate-market.ts';
import { modeSector, sectorForRole } from '../lib/sectors.ts';
import {
  allowedBoardUrl,
  displayName,
  parseAshby,
  parseGreenhouse,
  parseLever,
  parsePersonio,
  parseRecruitee,
  parseRippling,
  parseWorkable,
} from '../lib/parse-boards.mjs';

const DIRECTORY_URL = 'https://kalebconfer-sys.github.io/job-board-directory/job-board-directory.json';
const DIRECTORY_PAGE = 'https://kalebconfer-sys.github.io/job-board-directory/';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DATA = path.join(ROOT, 'data');
const JSONL = path.join(DATA, 'expanded-postings.jsonl');
const OUTCOMES = path.join(DATA, 'expanded-outcomes.jsonl');
const PUBLIC = path.join(DATA, 'market-public.json');
const BOARDS = path.join(DATA, 'expanded-boards.json');
const GZIP = path.join(DATA, 'expanded-postings.jsonl.gz');
const PLATFORMS = new Set(['greenhouse', 'ashby', 'lever', 'workable', 'recruitee', 'personio', 'rippling']);
const CONCURRENCY = 12;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function endpointFor(row) {
  const url = new URL(row.api_url);
  if (row.platform === 'ashby' && !url.searchParams.has('includeCompensation')) {
    url.searchParams.set('includeCompensation', 'true');
  }
  return url.href;
}

async function fetchBody(url) {
  let last = new Error('Request failed');
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': 'skillmarketcap.com',
          accept: 'application/json, application/xml, text/xml, */*',
        },
        signal: AbortSignal.timeout(40000),
      });
      if (response.status === 429 || response.status >= 500) {
        last = new Error(`HTTP ${response.status}`);
        const retryAfter = Number(response.headers.get('retry-after'));
        await sleep((Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : attempt + 1) * 1000);
        continue;
      }
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        if (response.status < 500) error.permanent = true;
        throw error;
      }
      return await response.text();
    } catch (error) {
      if (error && error.permanent) throw error;
      last = error instanceof Error ? error : new Error('Request failed');
      if (attempt < 2) {
        await sleep((attempt + 1) * 1000);
        continue;
      }
    }
  }
  throw last;
}

function parseBody(platform, body, boardUrl) {
  if (platform === 'personio') return parsePersonio(body, boardUrl);
  const data = JSON.parse(body);
  if (platform === 'greenhouse') return parseGreenhouse(data);
  if (platform === 'ashby') return parseAshby(data);
  if (platform === 'lever') return parseLever(data);
  if (platform === 'workable') return parseWorkable(data);
  if (platform === 'recruitee') return parseRecruitee(data);
  if (platform === 'rippling') return parseRippling(data);
  throw new Error(`Unsupported platform ${platform}`);
}

let writeChain = Promise.resolve();
function append(file, line) {
  writeChain = writeChain.then(() => fs.promises.appendFile(file, `${line}\n`));
  return writeChain;
}

function loadDone() {
  if (!fs.existsSync(OUTCOMES)) return new Set();
  const done = new Set();
  for (const line of fs.readFileSync(OUTCOMES, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { done.add(JSON.parse(line).key); } catch { /* skip a torn line */ }
  }
  return done;
}

async function pool(items, worker) {
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index;
      index += 1;
      await worker(items[current], current);
      await sleep(25);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => run()));
}

function readCompanies(jsonlPath) {
  const byKey = new Map();
  if (!fs.existsSync(jsonlPath)) return [];
  const text = fs.readFileSync(jsonlPath, 'utf8');
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const row = JSON.parse(line);
    const company = byKey.get(row.key) ?? {
      key: row.key,
      name: row.name,
      provider: row.provider,
      token: row.token,
      apiUrl: row.apiUrl,
      boardUrl: row.boardUrl,
      nameSource: row.nameSource,
      jobs: [],
      seen: new Set(),
    };
    if (company.seen.has(row.id)) continue;
    company.seen.add(row.id);
    company.jobs.push({
      id: row.id,
      title: row.title,
      url: row.url,
      location: row.location,
      team: row.team,
      country: row.country,
      compUsd: row.compUsd,
    });
    byKey.set(row.key, company);
  }
  return [...byKey.values()];
}

async function publish(meta) {
  await writeChain;
  const companies = readCompanies(JSONL);
  const aggregated = aggregateCompanies(companies);
  const slugNamed = companies.filter((company) => company.nameSource === 'board-slug').length;
  const boards = companies
    .map((company) => ({
      key: company.key,
      name: company.name,
      nameSource: company.nameSource,
      provider: company.provider,
      token: company.token,
      apiUrl: company.apiUrl,
      boardUrl: company.boardUrl,
      roles: company.jobs.length,
      sector: modeSector(company.jobs.map((job) => sectorForRole(job.title, job.team))),
    }))
    .sort((a, b) => b.roles - a.roles || a.name.localeCompare(b.name));
  const snapshot = {
    asOf: new Date().toISOString(),
    sourceFailures: [],
    sourcesExpected: aggregated.companiesScanned,
    sources: [],
    ...aggregated,
    sample: {
      ...meta,
      slugNamedCompanies: slugNamed,
      weighting: 'equal-company',
      textUsed: 'title-team-department',
      directoryUrl: DIRECTORY_PAGE,
      postingsFile: 'data/expanded-postings.jsonl.gz',
      boardsFile: 'data/expanded-boards.json',
    },
  };
  fs.writeFileSync(BOARDS, JSON.stringify(boards));
  fs.writeFileSync(PUBLIC, JSON.stringify(snapshot));
  await new Promise((resolve, reject) => {
    const input = fs.createReadStream(JSONL);
    const output = fs.createWriteStream(GZIP);
    input.pipe(zlib.createGzip({ level: 9 })).pipe(output).on('finish', resolve).on('error', reject);
  });
  console.log(`companies=${aggregated.companiesScanned} roles=${aggregated.rolesScanned} classified=${aggregated.rolesClassified}`);
  for (const [index, signal] of snapshot.signals.slice(0, 15).entries()) {
    console.log(`${String(index + 1).padStart(2)} ${signal.demandScore} ${signal.name} roles=${signal.matchingRoles} employers=${signal.companiesHiring} pay=${signal.medianDisclosedUsd ?? 'none'}`);
  }
  if (aggregated.companiesScanned < 1000) {
    throw new Error(`Only ${aggregated.companiesScanned} companies returned postings`);
  }
}

async function publishOnly() {
  const outcomes = fs.readFileSync(OUTCOMES, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
  const count = (status) => outcomes.filter((row) => row.status === status).length;
  let previous = null;
  if (fs.existsSync(PUBLIC)) {
    try { previous = JSON.parse(fs.readFileSync(PUBLIC, 'utf8')); } catch { previous = null; }
  }
  await publish({
    directoryRetrievedAt: previous?.sample?.directoryRetrievedAt ?? new Date().toISOString(),
    attempted: previous?.sample?.attempted ?? outcomes.length,
    ok: count('ok'),
    empty: count('empty'),
    failed: count('failed'),
    skippedUrl: previous?.sample?.skippedUrl ?? 0,
    workdayNotCalled: previous?.sample?.workdayNotCalled ?? 0,
  });
}

async function main() {
  if (process.argv.includes('--publish-only')) {
    await publishOnly();
    return;
  }
  fs.mkdirSync(DATA, { recursive: true });
  const directoryRetrievedAt = new Date().toISOString();
  const directoryResponse = await fetch(DIRECTORY_URL, {
    headers: { 'user-agent': 'skillmarketcap.com' },
    signal: AbortSignal.timeout(60000),
  });
  if (!directoryResponse.ok) throw new Error(`Directory HTTP ${directoryResponse.status}`);
  const directory = await directoryResponse.json();
  if (!Array.isArray(directory)) throw new Error('Directory was not a list');
  const workdayNotCalled = directory.filter((row) => row.platform === 'workday').length;
  const seen = new Set();
  const candidates = [];
  let skippedUrl = 0;
  for (const row of directory) {
    if (!PLATFORMS.has(row.platform)) continue;
    const roles = Number(row.open_roles);
    if (!Number.isFinite(roles) || roles <= 0) continue;
    if (!allowedBoardUrl(row.platform, row.api_url)) {
      skippedUrl += 1;
      continue;
    }
    const key = `${row.platform}:${row.token}`;
    if (seen.has(key)) continue;
    seen.add(key);
    candidates.push(row);
  }
  const done = loadDone();
  const pending = candidates.filter((row) => !done.has(`${row.platform}:${row.token}`));
  console.log(`directory=${directory.length} candidates=${candidates.length} pending=${pending.length} already=${done.size} workday_not_called=${workdayNotCalled}`);
  let finished = 0;
  await pool(pending, async (row) => {
    const key = `${row.platform}:${row.token}`;
    const apiUrl = endpointFor(row);
    try {
      const body = await fetchBody(apiUrl);
      const parsed = parseBody(row.platform, body, row.board_url);
      const named = displayName(parsed, String(row.token));
      if (parsed.jobs.length === 0) {
        await append(OUTCOMES, JSON.stringify({ key, status: 'empty', provider: row.platform }));
      } else {
        const lines = parsed.jobs.map((item) => JSON.stringify({
          key,
          name: named.name,
          nameSource: named.nameSource,
          provider: row.platform,
          token: row.token,
          apiUrl,
          boardUrl: row.board_url,
          ...item,
        }));
        await append(JSONL, lines.join('\n'));
        await append(OUTCOMES, JSON.stringify({ key, status: 'ok', provider: row.platform, roles: parsed.jobs.length }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      await append(OUTCOMES, JSON.stringify({ key, status: 'failed', provider: row.platform, error: message.slice(0, 180) }));
    }
    finished += 1;
    if (finished % 100 === 0 || finished === pending.length) {
      console.log(`progress ${finished}/${pending.length}`);
    }
  });
  await writeChain;
  const outcomes = fs.readFileSync(OUTCOMES, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
  const count = (status) => outcomes.filter((row) => row.status === status).length;
  await publish({
    directoryRetrievedAt,
    attempted: candidates.length,
    ok: count('ok'),
    empty: count('empty'),
    failed: count('failed'),
    skippedUrl,
    workdayNotCalled,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
