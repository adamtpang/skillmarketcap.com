# Handoff: Skill Market Cap, a standalone site

Written 2026-08-15 by the skill.supply session that performed the split.
**Updated 2026-08-22** with everything that shipped since, and
**2026-08-23** with the hosting separation. Read this before changing
anything here.

## Current state, one paragraph

Live at **https://skillmarketcap.com**, on its own Vercel project
(`prj_2yXHllqBI2pcKSIvXoV3v2wM709O`), its own GitHub repo, and both of
its hostnames. It ranks skill demand from live public ATS data and, since
2026-08-22, shows **median employer-disclosed compensation per skill**
next to each rank. It does no LLM work, has no database, and persists
nothing. Last change to the page itself: `d9fae66` (the comp layer);
commits after it are docs and infrastructure. Build is clean under
TypeScript strict; all routes prerender static.

## Why this repo exists

Skill Market Cap was a page inside skill.supply (`/skills`), computing a
live skill-demand ranking from public job boards. It kept growing into
its own product with its own audience (people asking "what should I
learn", not "package me for hiring"), so it was lifted out into its own
repo and domain.

The split is clean by design: skill.supply is the SUPPLY side (package a
person, place them), this is the DEMAND side (what the market is asking
for). Same thesis, opposite ends. They stay connected as kin, not as one
codebase.

## The bidirectional link, verified 2026-08-22

Both directions exist in code today. Do not remove either side without
updating the other repo.

**This repo points at skill.supply** in four places plus structured data:
- `app/page.tsx:23` header link
- `app/page.tsx:175` body copy explaining what skill.supply does
- `app/page.tsx:180` the call to action
- `app/page.tsx:193` footer link
- `app/layout.tsx:54` JSON-LD `Organization.sameAs`

**skill.supply points back** in five places plus a redirect:
- `app/page.tsx:28`
- `app/companies/page.tsx:33` and `:142`
- `components/agent-flow.tsx:284`
- `app/layout.tsx:58` JSON-LD `Organization.sameAs`
- `next.config.ts:13` permanent redirect: `/skills` to this domain, so
  old bookmarks and inbound links never 404

Both `repos.yaml` files declare each other as kin with real reasons.

## What shipped since the split (2026-08-22)

**The dollar-value layer.** Each ranked skill now carries a median of
employer-disclosed salary-band midpoints, with a disclosure counter.

| File | What it does |
|---|---|
| `lib/comp.ts` (new) | Comp extraction. Ashby structured tiers (Salary + USD + "1 YEAR" only) and conservative Greenhouse text parsing, with sanity rails: 30K to 2M USD, max/min <= 5, non-USD rejected. |
| `lib/jobs.ts` | Added `Job.compUsd`; Ashby URL now uses `?includeCompensation=true`; both normalizers fill the field. |
| `lib/skills.ts` | Added `SkillSignal.medianDisclosedUsd` and `disclosedCount`; median-of-midpoints aggregation; `buildSkillMarket` exported; cache key bumped to `skill-market-v3`. |
| `app/page.tsx` | Per-row pay line and a methodology paragraph replacing the old "we do not show salary yet" text. |
| `scripts/run-aggregation.ts` (new) | Offline live run: `npx tsx scripts/run-aggregation.ts` |

**The honesty rules baked into that layer, do not weaken them:**
- Only employer-disclosed bands count. Nothing is estimated, inferred,
  or averaged in from other skills.
- A skill with zero disclosures renders "no disclosed comp" and no
  number, ever.
- The disclosure counter ships next to every figure ("23 of 61 postings
  disclose") because the sample is the caveat.
- The methodology note stays on the page. The numbers skew high because
  the disclosing boards are top-of-market payers under pay-transparency
  laws, and the page says so.

**Live run at ship time** (1,407 roles, 9 boards): Backend systems $363K
(156 of 254 disclose), Cloud and infrastructure $353K, TypeScript and
JavaScript $324K, Python $315K, AI and machine learning $313K.

**A real bug the rails caught:** Base Power publishes hourly electrician
rates ($23 to $39) in annual comp fields. The $30K floor rejected all of
them. Cursor, Linear, and Saronic publish no comp at all, so they
contribute demand signal and no dollars. That is correct behavior, not a
gap to fix.

## Domain note, and a lesson in checking twice

First finding during the split: the Vercel purchase API reported
`skillmarketcap.com` "not available for purchase", which read as
taken-by-a-stranger. Second finding, minutes later: it is not available
because **Adam already owns it**, registered at NameCheap (RDAP checked
2026-08-15, expires **2026-11-10**), DNS pointed at Vercel.

Standing reminders:
- **Renewal is 2026-11-10 at NameCheap.** If it lapses, this repo's
  identity goes with it.
- The Vercel buy API cannot see third-party-registered domains you
  already own. Check RDAP and `vercel domains ls` before concluding
  anything about a .com.

## The hosting separation, finished 2026-08-23

The split was code-complete on 2026-08-15 but not infrastructure
complete. Three things were still wrong or missing, and all three are
now fixed. If any of this ever looks broken again, this is the map.

**1. `www` was still serving skill.supply.** The apex was correctly
pointed at this project, but `www.skillmarketcap.com` was still attached
to the **skill.supply** Vercel project, so anyone hitting the www
hostname got skill.supply's homepage under this domain's name. Moved
with `vercel domains add www.skillmarketcap.com skillmarketcap.com
--force`, which detaches from the old project and reattaches in one
step. Both hostnames now serve this site.

Not yet done: www serves the site directly rather than redirecting to
the apex. It is harmless because `app/layout.tsx` emits an absolute
canonical pointing at the apex, but a 308 on the domain's Vercel
settings would be tidier.

**2. The GitHub repo had been deleted.** `adamtpang/skillmarketcap.com`
(repo id 1093197631, branch `master`) held an older, unrelated
incarnation of this site and was deleted at some point. The Vercel
project's git link still pointed at that dead repo id, so nothing ever
deployed from git. Every production deploy since the split was a dirty
local CLI upload, and the code existed in exactly one place: Adam's
machine.

Fixed by creating a fresh public `adamtpang/skillmarketcap.com` from
this local history, pushing `main`, and reconnecting the project
(`vercel git disconnect` then `vercel git connect`, because a plain
connect saw the matching org/repo name and thought the dead link was
still valid).

**3. `.vercel` was not ignored.** Now is.

**Standing consequence:** `main` on GitHub is production. Push to deploy.
Do not go back to `vercel --prod` uploads from a dirty tree, which is
what produced a live site that no commit could reproduce.

## What came across in the split

| File | Origin | Changed? |
|---|---|---|
| `lib/skills.ts` | skill.supply | since extended, see above |
| `lib/companies.ts` | skill.supply, verbatim | no |
| `lib/jobs.ts` | skill.supply | since extended, see above |
| `lib/utils.ts` | skill.supply, verbatim | no |
| `app/globals.css` | skill.supply design tokens | yes: dropped the `shadcn/tailwind.css` import, which is not a dependency here and broke the build |
| `app/page.tsx` | was `app/skills/page.tsx` | yes: standalone branding, outbound links, and the comp layer |
| `app/layout.tsx` | adapted | yes: own metadata, dropped BetaBar and FleetFooter |
| `next.config.ts` | replaced | yes: the inherited host redirects would have looped this domain into itself |

## What was deliberately left behind

- **The whole agent stack** (`lib/agent.ts`, `lib/prompts.ts`, the
  Anthropic SDK, zod, the report and share machinery). No LLM work
  happens here, which is why `package.json` is a third the size.
- **The Neon database dependency.** Nothing persists.
- **The fleet footer, beta bar, and shadcn components.**

## The known duplication, stated honestly

`lib/companies.ts` and `lib/jobs.ts` exist in BOTH repos. Deliberate
copy, not a mistake: skill.supply needs them for its company directory
and momentum index, this repo needs them for the scan. They have already
drifted (this repo's `lib/jobs.ts` now has comp extraction; skill.supply
has an `axon` board entry this repo does not).

If the drift ever matters, the fix is a shared package, not a manual
sync. Until then: **a company or board slug added in one repo is not
automatically in the other.** Check both when adding.

## First things a fresh session should do

1. `npm install && npm run build`. It should pass clean.
2. `npx tsx scripts/run-aggregation.ts` to see the live ranking and comp
   medians without deploying. This is the fastest way to know whether a
   data change worked.
3. If adding companies, **verify the ATS slug against the live API
   first**: `https://api.ashbyhq.com/posting-api/job-board/{slug}` or
   `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs`. A guessed
   slug silently returns zero roles and quietly corrupts the ranking.
4. If touching the comp layer, re-read the honesty rules above before
   changing a threshold. The rails exist because real employers publish
   hourly rates in annual fields.

## Where this could go next

Ideas that are consistent with the site's thesis, none committed:

- **Per-skill learning resources.** The demand-first upskilling layer:
  for each top skill, verified free-first resources and real
  certification exams. Note the boundary in `ECOSYSTEM.md`: deep course
  content belongs to company.university, and this site should link
  across rather than absorb it.
- **Trend over time.** Right now every ranking is a snapshot. Storing
  daily scans would turn this into a real index with slope, not just
  a level. That needs persistence, which this repo deliberately does
  not have yet, so it is a genuine architecture decision, not a feature.
- **Comp coverage.** Nine boards today. More disclosing boards means
  better medians and honest coverage of more skills.
- **The labor-arbitrage input.** This site's comp data is the price side
  of the agent-labor-arbitrage thesis in
  `summon.company/company/AGENT-LABOR-ARBITRAGE.md`. If that product is
  ever built, this repo is where its market data comes from.
