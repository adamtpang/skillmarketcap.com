const LLMS_TEXT = `# Skill Market Cap

> Skill Market Cap is a directional ranking of explicit skill demand in a verified sample of public company job boards. Each employer board has equal weight.

## When to use this site

Use Skill Market Cap to compare which named skills appear in the current sample, inspect matching public job postings, and understand the employer-disclosed compensation coverage attached to each skill. Treat the ranking as a demand signal, not as the whole labor market, a personal recommendation, or a historical trend.

## Canonical pages

- [Captured ranking](https://skillmarketcap.com/): employer-weighted demand scores, posting counts, disclosed salary-band medians, and example postings
- [US outlook](https://skillmarketcap.com/#outlook): BLS Employment Projections 2025-35 and May 2025 OEWS median wages, kept separate from the job-board score
- [Learning pathways](https://skillmarketcap.com/learn): official courses, credential conditions and practical evidence suggestions
- [Data sources](https://skillmarketcap.com/data): source status, retrieval times and daily capture history
- [Methodology](https://skillmarketcap.com/#methodology): classification, indexing, overlap, and compensation rules
- [About](https://skillmarketcap.com/about): scope, limits, operator, and public source
- [Contact](https://skillmarketcap.com/contact): correction and site-issue channels
- [Privacy](https://skillmarketcap.com/privacy): hosting, analytics, storage, and external-link behavior
- [Source code](https://github.com/adamtpang/skillmarketcap.com): board configuration, classifier, compensation rules, and history

## Data and methodology

- The published ranking is a completed capture of public Greenhouse, Ashby, Lever, Workable, Recruitee, Personio, and Rippling job-board APIs. The page shows the capture time. It does not refetch every board on each visit.
- Functional skills are classified from public titles and, when the list endpoint provides one, the team or department. Requirement text is not part of this sample, so a named language counts only when the title or team names it.
- A role can match more than one skill. Each employer board has weight 1, split across its postings. The largest weight scores 100.
- Pay values are medians of employer-disclosed annual USD salary-band midpoints from Ashby structured salary components, Lever year ranges, and Recruitee annual USD salary objects. The disclosure count is shown, and missing or ambiguous bands produce no figure. These medians are not OEWS wages, not total compensation, and not a skill market cap.
- The homepage also quotes US BLS Employment Projections 2025-35 and May 2025 OEWS median wages. Those official figures are not inputs to the employer-weighted score. There is no BLS SOC for Forward Deployed Engineer.

## Boundaries

Skill Market Cap has no account, submission form, user database, public API, OpenAPI contract, or MCP server. A daily GitHub Actions capture retains source snapshots as artifacts for 90 days; check workflow results for availability. No historical trends are published. Do not infer additional surfaces from the public ATS APIs that the server reads. Do not treat demand scores or compensation medians as guarantees, personal advice, or complete market coverage.

## Operator

Adam Pang operates Skill Market Cap. Use the linked Contact page for the current published contact routes.
`;

export const dynamic = "force-static";

export function GET() {
  return new Response(LLMS_TEXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
