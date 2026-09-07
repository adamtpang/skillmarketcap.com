# Skill Market Cap status

As of 2026-09-07. This file describes the implementation, not a deployment receipt.

Classification: live demand index, pre-company proof. A public site and
real job data exist. No verified priced offer, stranger decision outcome
or revenue is established by this work.

The site classifies a curated set of nine public ATS boards. Compensation
is implemented: medians of usable employer-disclosed annual USD salary-band
midpoints with disclosure counts. Claims that compensation is absent are
stale. The figures describe role bundles, not independent skill prices.

Released changes tighten technical title classification, decode Greenhouse
markup before matching, and require annual salary context for text ranges.
Keyword classification remains a heuristic
and does not distinguish required from preferred skills.

The local source pipeline adds a separately labelled OpenAI cohort and
captures MOM monthly SGD occupational survey wages separately. It stores
dated source responses, hashes, failure states and normalized posting data.
Salary observations preserve their original bounds, currency and period.
Ambiguous currencies, missing bounds and conflicting tiers are excluded.
Source failures reject cache refreshes, preserving the last complete
snapshot with its capture time. A failed request cannot masquerade as zero
demand. Functional job query parameters survive deduplication.
Daily GitHub Actions capture is configured at 02:23 UTC with 90-day artifact
retention and integrity verification by reprocessing raw source responses.
There is no published trend series or automatic public consumption of
these snapshots. No new paid API is required. The /data page explains
source status, retrieval timestamps and archive access.

Seven technical skill categories link to official courses and credential
requirements on /learn, with provider review dates, prerequisites and
practical evidence suggestions. These mappings do not demonstrate wage
uplift, employer acceptance or completed learning. Course certificates
are distinguished from optional vendor certification exams.

Quality verification on 2026-09-06: Lightmark's live audit scored 100/100.
Shapeable's public homepage audit scored 81/100; the revised local homepage
scored 100/100 twice under public-page-surface-v1 version 1.3.0, with all
21 checks measured. This is a surface audit, not certification of complete
product quality. Public Shapeable improvement remains deployment-dependent.
Local fixes include readable small text, larger link targets, visible
keyboard focus, reduced-motion support and complete job titles.
Detailed historical local evidence is in sales/quality-2026-09-06/RECEIPT.md.
Adam approved commit, push and deployment on 2026-09-07. Release 4a7b5d6
deployed successfully through the production Git integration. Fresh public
Lightmark and Shapeable homepage audits both scored 100/100 on that date.
All 20 tests, lint and the production build passed. The initial hosted
capture succeeded and verified 2,329 postings against 11 source receipts:
https://github.com/adamtpang/skillmarketcap.com/actions/runs/34090389614.
The daily workflow is active; its first run's evidence artifact expires
on 2026-12-06. Retention is rolling, not an indefinite historical database.

Binding constraint: verify that sourced requirements and assessments change
a useful matching or learning decision. Data volume alone does not prove
that outcome.

Next evidence: a narrowly scoped requirement map and practical assessment,
followed by a real decision or supervised work outcome. Human and agent
performance must identify assessment conditions and accountable operators.
No credential, buyer acceptance or placement has been demonstrated yet.

Sources: README.md, HANDOFF_FROM_SKILL_SUPPLY.md, lib/boards.ts,
lib/classification.ts, lib/comp.ts, scripts/capture-market.mjs and the
shared ECOSYSTEM.md in skill.supply. This reconciles the stale compensation
statement in the canonical checkout's status without changing that checkout.
