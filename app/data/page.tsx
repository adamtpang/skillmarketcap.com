import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage } from '../_components/info-page';
import { fetchSkillMarket } from '@/lib/skills';

export const metadata: Metadata = {
  title: 'Sources and data history',
  description: 'Inspect employer API coverage, collection timestamps, compensation methodology and retained source captures.',
  alternates: { canonical: 'https://skillmarketcap.com/data' },
};
const linkStyle = 'inline-flex min-h-11 items-center rounded py-2 text-sm font-medium text-brand underline underline-offset-4';
export default async function DataPage() {
  const market = await fetchSkillMarket();
  return <InfoPage eyebrow="Trace every signal" title="The evidence behind the ranking"
    intro="We measure postings and advertised compensation from public employer APIs. We do not estimate a standalone price for a skill, predict your earnings or treat a course as proof of job readiness.">
    <section>
      <h2 className="text-xl font-semibold">Current source coverage</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Captured {market.asOf} (UTC). The ranking reads this completed sample. It does not refetch every board on each page view. A failed board is omitted from the sample and is never counted as zero demand. The capture is kept only when at least 1,000 employer boards return roles.</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Candidate addresses were taken from the <a className={linkStyle} href={market.sample.directoryUrl}>public job-board directory</a> on {market.sample.directoryRetrievedAt}. {market.sample.attempted.toLocaleString()} Greenhouse, Ashby, Lever, Workable, Recruitee, Personio, and Rippling boards listed with roles were called again. {market.companiesScanned.toLocaleString()} returned at least one role, {market.sample.empty.toLocaleString()} were empty, and {market.sample.failed.toLocaleString()} failed. {market.sample.workdayNotCalled.toLocaleString()} Workday addresses were not called.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-xs tracking-wide text-muted-foreground uppercase">
              <th className="p-3 font-medium">API</th>
              <th className="p-3 text-right font-medium">Employers</th>
              <th className="p-3 text-right font-medium">Roles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {market.providers.map((row) => (
              <tr key={row.label}>
                <td className="p-3 font-semibold">{row.label}</td>
                <td className="p-3 text-right font-mono tabular-nums">{row.companies.toLocaleString()}</td>
                <td className="p-3 text-right font-mono tabular-nums">{row.roles.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The board list, with each public API URL, is in {market.sample.boardsFile}. Normalized postings are in {market.sample.postingsFile}. {market.sample.slugNamedCompanies.toLocaleString()} names are title-cased board slugs because the API did not return a company name.</p>
      <a className={linkStyle} href="https://github.com/adamtpang/skillmarketcap.com/blob/cursor/expand-global-skill-demand-3c23/data/expanded-boards.json">Inspect the employer board list</a>
    </section>
    <section className="text-sm leading-relaxed text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">What was not added</h2>
      <p className="mt-2">SmartRecruiters has a public postings API, and it was not in the directory used for addresses, so no SmartRecruiters slug was guessed. Workday&apos;s career-site endpoint was not called. levels.fyi was not collected. US BLS OES, JOLTS, and Employment Projections, O*NET, OECD, ILO, Eurostat, and UK ONS are public labor statistics, not company job boards. O*NET&apos;s web service and some of those statistical APIs need a free key. None of them are inputs to this ranking.</p>
      <p className="mt-2">The daily evidence workflow still archives the original nine Greenhouse and Ashby boards, plus a separate OpenAI board, and keeps MOM occupational wages as monthly SGD outside the USD medians. That archive is not a substitute for this sample and it is not a published trend.</p>
      <a className={linkStyle} href="https://github.com/adamtpang/skillmarketcap.com/actions/workflows/capture-market.yml">View the original-cohort capture runs</a>
    </section>
    <section className="text-sm leading-relaxed text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">What the money means</h2>
      <p className="mt-2">Each pay observation is the midpoint of a disclosed annual USD role band from an Ashby structured component or a Lever year range in USD. Greenhouse list responses have no salary field, and description HTML was not downloaded. Missing bounds, ambiguous currencies, conflicting tiers and implausible annual bands are excluded. The parser accepts annual bands from $30,000 to $2,000,000 with a maximum-to-minimum ratio no greater than five. Those are validation limits, not observed salaries.</p>
      <p className="mt-2">The employer sample is whoever publishes on these seven applicant-tracking systems. It still over-represents organizations that recruit that way. Location and seniority are pooled. Keyword mentions can be preferred or alternative skills. Posting counts are not unique vacancies or hires, and salary differences do not measure the causal return to learning a skill.</p>
      <Link className={linkStyle} href="/#methodology">Read the ranking methodology</Link>
    </section>
  </InfoPage>;
}
