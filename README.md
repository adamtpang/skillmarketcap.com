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
against it.

## What it deliberately does not do

- **No salary numbers.** That needs source-backed compensation data.
- **No 7-day trends.** That needs stored daily snapshots, which means a
  database this does not have yet.
- Invented precision would be worse than no number, so neither is faked.

## Stack

Next.js 16 (App Router), React 19, Tailwind v4. No database, no auth, no
API keys. The whole thing is a cached server component over public APIs.

```bash
npm install
npm run dev
```

## Where the data comes from

`lib/jobs.ts` holds the verified board slugs (provider plus board id per
company). `lib/companies.ts` is the company directory. `lib/skills.ts` is
the classifier and the ranking. Adding a company means adding a verified
ATS slug to `BOARDS`, not guessing one.

## History

Extracted from [skill.supply](https://skill.supply) on 2026-08-15, where
it lived at `/skills`. See `HANDOFF_FROM_SKILL_SUPPLY.md` for the full
context of that split.
