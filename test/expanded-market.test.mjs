import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import zlib from 'node:zlib';
import { aggregateCompanies } from '../lib/aggregate-market.ts';
import { SKILLS, matchesSkill } from '../lib/classification.ts';
import { countryFromLocation, postingCountry } from '../lib/geo.ts';
import { parseGreenhouse, parsePersonio, allowedBoardUrl } from '../lib/parse-boards.mjs';
import { sectorForRole } from '../lib/sectors.ts';

const skill = (slug) => SKILLS.find((item) => item.slug === slug);

test('occupational titles stay in their own skill families', () => {
  const match = (slug, title, team = null) => matchesSkill(skill(slug), { title, team, description: '' });
  assert.equal(match('nursing-clinical', 'Registered Nurse, ICU'), true);
  assert.equal(match('software-engineering', 'Registered Nurse, ICU'), false);
  assert.equal(match('nursing-clinical', 'Nursery School Teacher'), false);
  assert.equal(match('education', 'Nursery School Teacher'), true);
  assert.equal(match('skilled-trades', 'Journeyman Electrician'), true);
  assert.equal(match('software-engineering', 'Journeyman Electrician'), false);
  assert.equal(match('sales-gtm', 'Sales Engineer'), true);
  assert.equal(match('software-engineering', 'Sales Engineer'), false);
  assert.equal(match('software-engineering', 'Python Engineer'), true);
  assert.equal(match('logistics', 'Warehouse Associate'), true);
  assert.equal(match('finance', 'Staff Accountant'), true);
  assert.equal(match('data-analytics', 'Financial Analyst'), false);
  assert.equal(match('hospitality', 'Line Cook'), true);
  assert.equal(match('nursing-clinical', 'Pflegefachkraft (m/w/d)'), true);
  assert.equal(match('skilled-trades', 'Elektroniker / Elektriker'), true);
  assert.equal(match('software-engineering', 'Softwareentwickler'), true);
});

test('country comes from the posting text and stays blank when the place is only a city', () => {
  assert.equal(countryFromLocation('Austin, TX'), 'United States');
  assert.equal(countryFromLocation('Berlin, Germany'), 'Germany');
  assert.equal(countryFromLocation('Berlin'), 'Unspecified');
  assert.equal(countryFromLocation('Remote'), 'Unspecified');
  assert.equal(countryFromLocation('Remote, United States'), 'United States');
  assert.equal(countryFromLocation('London, UK | New York, NY'), 'Multiple');
  assert.equal(countryFromLocation('London | New York, NY'), 'Unspecified');
  assert.equal(postingCountry('SG', 'Singapore'), 'Singapore');
  assert.equal(postingCountry('Hong Kong', null), 'Hong Kong');
});

test('sector prefers the title over the team', () => {
  assert.equal(sectorForRole('Software Engineer', 'Finance'), 'Software');
  assert.equal(sectorForRole('Registered Nurse', 'Operations'), 'Healthcare');
  assert.equal(sectorForRole('Coordinator', null), 'Unspecified');
});

test('each employer board has equal weight', () => {
  const nurse = (id) => ({ id, title: 'Registered Nurse', url: `https://example.com/${id}`, location: 'Austin, TX', team: null, country: 'United States', compUsd: null });
  const engineer = (id) => ({ id, title: 'Software Engineer', url: `https://example.com/${id}`, location: 'Berlin', team: null, country: 'Unspecified', compUsd: 120000 });
  const market = aggregateCompanies([
    { key: 'a', name: 'Hospital', provider: 'greenhouse', token: 'a', apiUrl: 'https://example.com/a', boardUrl: 'https://example.com/a', jobs: [nurse('1'), nurse('2'), nurse('3'), nurse('4')] },
    { key: 'b', name: 'Clinic', provider: 'ashby', token: 'b', apiUrl: 'https://example.com/b', boardUrl: 'https://example.com/b', jobs: [nurse('5'), engineer('6')] },
  ]);
  const nursing = market.signals.find((item) => item.slug === 'nursing-clinical');
  const software = market.signals.find((item) => item.slug === 'software-engineering');
  assert.equal(nursing.demandScore, 100);
  assert.equal(software.demandScore, 33);
  assert.equal(nursing.matchingRoles, 5);
  assert.equal(nursing.companiesHiring, 2);
  assert.equal(software.companiesHiring, 1);
  assert.equal(market.largestEmployer.name, 'Hospital');
  assert.equal(market.largestEmployer.shareOfRoles, 67);
  assert.equal(market.rolesScanned, 6);
});

test('committed capture covers at least 1000 employers and matches the classifier', () => {
  const publicMarket = JSON.parse(fs.readFileSync('data/market-public.json', 'utf8'));
  assert.ok(publicMarket.companiesScanned >= 1000);
  assert.ok(publicMarket.rolesScanned > publicMarket.companiesScanned);
  assert.equal(publicMarket.sourceFailures.length, 0);
  assert.equal(publicMarket.sample.weighting, 'equal-company');
  const required = ['sales-gtm', 'software-engineering', 'finance', 'nursing-clinical', 'skilled-trades', 'logistics', 'education', 'hospitality'];
  for (const slug of required) {
    assert.ok(publicMarket.signals.some((signal) => signal.slug === slug && signal.matchingRoles > 0), slug);
  }
  const lines = zlib.gunzipSync(fs.readFileSync('data/expanded-postings.jsonl.gz')).toString('utf8').split('\n').filter(Boolean);
  const byKey = new Map();
  for (const line of lines) {
    const row = JSON.parse(line);
    const company = byKey.get(row.key) ?? { key: row.key, name: row.name, provider: row.provider, token: row.token, apiUrl: row.apiUrl, boardUrl: row.boardUrl, jobs: [] };
    company.jobs.push({ id: row.id, title: row.title, url: row.url, location: row.location, team: row.team, country: row.country, compUsd: row.compUsd });
    byKey.set(row.key, company);
  }
  const again = aggregateCompanies([...byKey.values()]);
  assert.equal(again.companiesScanned, publicMarket.companiesScanned);
  assert.equal(again.rolesScanned, publicMarket.rolesScanned);
  assert.deepEqual(again.signals.map((signal) => [signal.slug, signal.demandScore, signal.matchingRoles]), publicMarket.signals.map((signal) => [signal.slug, signal.demandScore, signal.matchingRoles]));
});

test('board parsers keep disclosed annual USD and reject other hosts', () => {
  const parsed = parseGreenhouse({
    jobs: [
      { id: 1, title: 'Accountant', absolute_url: 'https://boards.greenhouse.io/acme/jobs/1', company_name: 'Acme', location: { name: 'Toronto, ON' } },
      { id: 1, title: 'Accountant', absolute_url: 'https://boards.greenhouse.io/acme/jobs/1?utm_source=x', company_name: 'Acme', location: { name: 'Toronto, ON' } },
    ],
  });
  assert.equal(parsed.jobs.length, 1);
  assert.equal(parsed.name, 'Acme');
  assert.equal(parsed.jobs[0].country, 'Canada');
  assert.equal(parsed.jobs[0].compUsd, null);
  const personio = parsePersonio(`<workzag-jobs><position><id>9</id><subcompany>Acme GmbH</subcompany><office>Berlin</office><department>Pflege</department><name>Nurse</name></position></workzag-jobs>`, 'https://acme.jobs.personio.de');
  assert.equal(personio.jobs[0].url, 'https://acme.jobs.personio.de/job/9');
  assert.equal(personio.jobs[0].country, 'Unspecified');
  assert.equal(allowedBoardUrl('greenhouse', 'https://boards-api.greenhouse.io/v1/boards/acme/jobs'), true);
  assert.equal(allowedBoardUrl('workday', 'https://acme.wd1.myworkdayjobs.com/wday/cxs/acme/jobs'), false);
  assert.equal(allowedBoardUrl('greenhouse', 'http://boards-api.greenhouse.io/v1/boards/acme/jobs'), false);
});
