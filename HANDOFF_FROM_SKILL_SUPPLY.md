# Handoff: Skill Market Cap, extracted from skill.supply

Written 2026-08-15 by the skill.supply session that performed the split.
Read this before changing anything here.

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

## Domain note, and a lesson in checking twice

First finding during the split: the Vercel purchase API reported
`skillmarketcap.com` "not available for purchase", which read as
taken-by-a-stranger. Second finding, minutes later: it is not available
because **Adam already owns it**, registered at NameCheap (RDAP checked
2026-08-15, expires **2026-11-10**), DNS pointed at Vercel, and at split
time it served a host-based redirect to skill.supply/skills (the rule
lived in skill.supply's next.config.ts and was removed as part of this
split).

Standing reminders that fall out of that:
- **Renewal is 2026-11-10 at NameCheap**, under three months from the
  split. If it lapses, this whole repo's identity goes with it.
- The Vercel buy API cannot see third-party-registered domains you
  already own. Check RDAP and `vercel domains ls` (it may be attached to
  a project without being Vercel-registered) before concluding anything
  about a .com.

## What came across

| File | Origin | Changed? |
|---|---|---|
| `lib/skills.ts` | skill.supply, verbatim | no |
| `lib/companies.ts` | skill.supply, verbatim | no |
| `lib/jobs.ts` | skill.supply, verbatim | no |
| `lib/utils.ts` | skill.supply, verbatim | no |
| `app/globals.css` | skill.supply design tokens | no |
| `app/page.tsx` | was `app/skills/page.tsx` | yes: standalone branding, outbound links to skill.supply instead of internal routes |
| `app/layout.tsx` | adapted | yes: own metadata, dropped BetaBar and FleetFooter (skill.supply components) |
| configs | skill.supply, verbatim | no |

## What was deliberately left behind

- **The whole agent stack** (`lib/agent.ts`, `lib/prompts.ts`, Anthropic
  SDK, zod, the report/share machinery). This site does no LLM work at
  all, which is why `package.json` here is a third the size.
- **The Neon database dependency.** Nothing here persists.
- **The fleet footer, beta bar, and shadcn UI components.** Not needed
  for a single-page ranking.

## What changed on the skill.supply side

- `app/skills/page.tsx` and `lib/skills.ts` deleted.
- `/skills` now permanently redirects to `https://skillmarketcap.fun`
  via `next.config.ts`, so old inbound links and bookmarks do not 404.
- The four internal `/skills` links (home, companies page, agent flow,
  sitemap) now point at the new domain.

## The known duplication, stated honestly

`lib/companies.ts` and `lib/jobs.ts` now exist in BOTH repos. That is a
deliberate copy, not a mistake: skill.supply still needs them for its
company directory and momentum index, and this repo needs them for the
scan. They will drift.

If that drift ever matters, the fix is a shared package, not a manual
sync. Until then, the rule is: **a company or board slug added in one
repo is not automatically in the other.** Check both when adding.

## First things a fresh session should do

1. `npm install && npm run build` to confirm the extraction still builds.
2. Check whether the domain got bought yet (see the domain note above);
   if not, do not write copy that claims the site is live at a URL that
   does not resolve.
3. If adding companies, verify the ATS slug against the live API first
   (`https://api.ashbyhq.com/posting-api/job-board/{slug}` or
   `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs`). A guessed
   slug silently returns zero roles and quietly corrupts the ranking.
