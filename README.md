# skillmarketcap.com

A live demand ranking of skills, computed hourly from the real roles
published on public job boards. Directional, sourced, and honest about
what it does not measure.

Live: https://skillmarketcap.com

## What it does

Scans the public applicant-tracking boards (Greenhouse and Ashby posting
APIs, no scraping) of the companies in `lib/companies.ts`, classifies
every live role against 15 skill definitions, and ranks them by how often
they appear. The most-mentioned skill scores 100; the rest are indexed
against it. Each skill also shows the median midpoint of usable
employer-disclosed annual USD salary bands and the disclosure count behind
it.

## What it deliberately does not do

- **No estimated salary numbers.** Missing, ambiguous, hourly, and non-USD
  bands are left out rather than inferred.
- **No 7-day trends.** The local capture command now saves dated snapshots,
  with daily scheduled capture and 90-day artifact retention. No trend
  series is published until comparable observations exist.
- Invented precision would be worse than no number, so neither pay nor
  trends are faked.

## Stack

Next.js 16 (App Router), React 19, Tailwind v4. No database, no auth, no
API keys. The whole thing is a cached server component over public APIs.

```bash
npm install
npm run dev
```

## Where the data comes from

`lib/boards.ts` holds the verified board slugs, re-exported by `lib/jobs.ts`.
`lib/companies.ts` is the company directory. `lib/classification.ts` holds
the classifier and `lib/skills.ts` builds the ranking. Adding a company means adding a verified
ATS slug to `BOARDS`, not guessing one.

## Local source pipeline

Run `npm run data:capture` with Node 24. It creates a unique, git-ignored
directory under `data/snapshots/`. Each run captures the nine site boards
plus the verified OpenAI Ashby board as a separate expansion cohort.
The site continues to use its nine-company directory; the expansion is
available for inspection before any public coverage change.

The manifest contains source URLs, retrieval timestamps, SHA-256 hashes,
code hashes, posting counts, duplicate counts and explicit failure states.
`jobs.json` contains normalized postings; raw board responses preserve
salary ranges, currencies, periods and location tiers. Duplicate IDs and
canonical URLs within an employer are excluded. Different posting IDs
may still represent one underlying vacancy, so counts are postings.

MOM's June 2024 occupational wage dataset is paginated and saved separately
in `mom-benchmark.json`, labelled monthly SGD survey wages. It never enters
the annual USD job-ad medians. Source:
[MOM occupational wages](https://data.gov.sg/datasets/d_670c3c6cecbcd24e48034a3428bd306e/view).

Failed sources make the run exit nonzero. No comparable skill aggregates
are emitted for an incomplete ATS cohort. An interrupted capture without
a manifest is incomplete and must not be consumed.

The `Capture market evidence` GitHub Actions workflow runs daily at 02:23
UTC and supports manual dispatch. It uses Node 24 and public endpoints,
without API keys or paid data services. It uploads raw and normalized
evidence even on failure, retaining artifacts for 90 days. Download from
the Actions run while signed in to GitHub. Runs can be delayed; inspect
success status before consumption. Export artifacts for longer retention.

`npm run data:verify -- <snapshot-directory>` verifies receipt hashes,
re-normalizes the raw postings and recomputes every saved aggregate. It
also verifies the occupational benchmark against its raw pages. A failed
integrity check fails the workflow; retained evidence is not automatically
declared valid merely because an artifact exists.

The manifest includes exact source-location groupings. Multi-city strings
remain multi-city strings; seniority is explicitly unclassified. Pooled
medians are descriptive, not personalized estimates or the price of a
standalone skill. Conflicting Ashby location or level tiers are excluded.
Text parsing requires explicit USD and annual salary context, preserves
the disclosed endpoints, and declines multiple distinct bands. Missing
bounds are never filled in. Heuristic text extraction still needs source
review for ambiguity.

The public ranking also distinguishes source failures from successful
empty boards. If any expected board fails or contains malformed listed
postings, the refresh rejects instead of replacing a complete cached sample.
Next.js retains the last successful snapshot, labelled with its capture
time, and retries revalidation on subsequent requests. A first build with
incomplete sources fails rather than deploying an incomplete ranking.
Partial coverage is never presented as a comparable ranking.

`npm test`, `npm run lint`, and `npm run build` validate the application.

## Demand to learning

`/learn` connects seven technical skill categories to official course and
credential pages, maintained in `lib/learning.ts`. Provider sources were
reviewed on 2026-09-07. Mappings are editorial and cover only part of each
role; they are not employer endorsements or evidence of salary uplift.
Free course certificates and optional paid vendor exams are distinguished.
Practical portfolio suggestions are not issued assessments or credentials.
`/data` exposes current source status, timestamps and the capture archive.

## History

Extracted from [skill.supply](https://skill.supply) on 2026-08-15, where
it lived at `/skills`. See `HANDOFF_FROM_SKILL_SUPPLY.md` for the full
context of that split.
