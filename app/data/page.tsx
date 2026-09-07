import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage } from '../_components/info-page';
import { fetchSkillMarket } from '@/lib/skills';

export const metadata: Metadata = {
  title: 'Sources and data history',
  description: 'Inspect live employer API coverage, collection timestamps, compensation methodology and retained daily source captures.',
  alternates: { canonical: 'https://skillmarketcap.com/data' },
};
const linkStyle = 'inline-flex min-h-11 items-center rounded py-2 text-sm font-medium text-brand underline underline-offset-4';
export default async function DataPage() {
  const market=await fetchSkillMarket();
  return <InfoPage eyebrow="Trace every signal" title="The evidence behind the ranking"
    intro="We measure postings and advertised compensation from public employer APIs. We do not estimate a standalone price for a skill, predict your earnings or treat a course as proof of job readiness.">
    <section>
      <h2 className="text-xl font-semibold">Current source coverage</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Last complete snapshot computed {market.asOf} (UTC). The site cache refreshes on demand after one hour. If a refresh fails, the previous complete snapshot remains visible with its original time. The source statuses below belong to that snapshot, not a continuous health check. A failed request is never counted as zero demand.</p>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border px-4">
        {market.sources.map(source=><li key={source.company} className="py-3">
          <h3 className="font-semibold">{source.company}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{source.status==='ok' ? `${source.postings} listed postings` : 'Source unavailable; ranking paused'} · Retrieved {source.fetchedAt}</p>
          {source.url && <a className={linkStyle} href={source.url} target="_blank" rel="noopener noreferrer">Inspect employer API response</a>}
        </li>)}
      </ul>
    </section>
    <section className="text-sm leading-relaxed text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">Daily evidence archive</h2>
      <p className="mt-2">The capture workflow is configured daily at 02:23 UTC and can be run manually. Each run retains raw responses, retrieval times, source URLs, SHA-256 hashes, normalized jobs and computed summaries as a downloadable artifact for 90 days. GitHub sign-in is required to download artifacts. Check the run result before using a capture; a schedule is not proof that a run succeeded.</p>
      <p className="mt-2">The archive contains the site cohort plus a separately labelled OpenAI expansion. It also stores MOM occupational survey wages separately as monthly SGD with their reference year. These are never mixed with advertised annual USD bands. The homepage reads employer APIs directly; it does not substitute the archive when live sources fail.</p>
      <a className={linkStyle} href="https://github.com/adamtpang/skillmarketcap.com/actions/workflows/capture-market.yml">View capture runs and download evidence</a>
      <p className="mt-2">This starts a retained history, not a measured trend. Compare captures only when source coverage and parser versions are compatible. Runs may be delayed, fail or expire; older history must be exported before retention ends.</p>
    </section>
    <section className="text-sm leading-relaxed text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">What the money means</h2>
      <p className="mt-2">Each pay observation is the midpoint of a disclosed annual USD role band. We show the median of those observations with the disclosure count. Missing bounds, ambiguous currencies, conflicting tiers and implausible annual bands are excluded. The parser currently accepts annual bands from $30,000 to $2,000,000 with a maximum-to-minimum ratio no greater than five; these are validation limits, not observed salaries.</p>
      <p className="mt-2">The employer sample is curated and heavily weighted toward technology companies. Location and seniority are pooled. Keyword mentions can be preferred or alternative skills. Posting counts are not unique vacancies or hires, and salary differences do not measure the causal return to learning a skill.</p>
      <Link className={linkStyle} href="/#methodology">Read the ranking methodology</Link>
    </section>
  </InfoPage>;
}
