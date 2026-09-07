const LLMS_TEXT = `# Skill Market Cap

> Skill Market Cap is a live, directional ranking of explicit skill demand in a verified sample of public company job boards.

## When to use this site

Use Skill Market Cap to compare which named skills appear in the current sample, inspect matching public job postings, and understand the employer-disclosed compensation coverage attached to each skill. Treat the ranking as a demand signal, not as the whole labor market, a personal recommendation, or a historical trend.

## Canonical pages

- [Live ranking](https://skillmarketcap.com/): current demand scores, role counts, compensation medians, and example postings
- [Learning pathways](https://skillmarketcap.com/learn): official courses, credential conditions and practical evidence suggestions
- [Data sources](https://skillmarketcap.com/data): source status, retrieval times and daily capture history
- [Methodology](https://skillmarketcap.com/#methodology): classification, indexing, overlap, and compensation rules
- [About](https://skillmarketcap.com/about): scope, limits, operator, and public source
- [Contact](https://skillmarketcap.com/contact): correction and site-issue channels
- [Privacy](https://skillmarketcap.com/privacy): hosting, analytics, storage, and external-link behavior
- [Source code](https://github.com/adamtpang/skillmarketcap.com): board configuration, classifier, compensation rules, and history

## Data and methodology

- The server reads live postings from verified public Greenhouse and Ashby job-board APIs and caches the computed snapshot for one hour.
- Functional skills are classified from public titles and teams. Named technical stacks can also use requirements text, but only for technical roles.
- A role can match more than one skill. The largest matching role count scores 100 and the other scores are indexed against it.
- Pay values are medians of employer-disclosed annual USD salary-band midpoints. The disclosure count is shown, and missing or ambiguous bands produce no figure.

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
