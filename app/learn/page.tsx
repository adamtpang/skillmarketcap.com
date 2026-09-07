import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage } from '../_components/info-page';
import { LEARNING_PATHS, LEARNING_REVIEWED_AT } from '@/lib/learning';
import { SKILLS } from '@/lib/classification';
import { fetchSkillMarket } from '@/lib/skills';

export const metadata: Metadata = {
  title: 'Courses and certificates',
  description: 'Connect observed skill demand to official courses, certificate requirements and practical work evidence.',
  alternates: { canonical: 'https://skillmarketcap.com/learn' },
};
const linkStyle = 'inline-flex min-h-11 items-center rounded py-2 text-sm font-medium text-brand underline underline-offset-4';

export default async function LearnPage() {
  const market = await fetchSkillMarket();
  const paths = [...LEARNING_PATHS].sort((a,b) =>
    (market.signals.find(s=>s.slug===b.skill)?.matchingRoles ?? 0) -
    (market.signals.find(s=>s.slug===a.skill)?.matchingRoles ?? 0));
  return <InfoPage eyebrow="From demand to evidence" title="Learn a skill the market uses"
    intro="Start with a relevant role, identify what your work does not yet demonstrate, then choose a course for that gap. These are editorial learning routes connected to observed demand, not employer endorsements.">
    <p className="text-sm leading-relaxed text-muted-foreground">
      Provider pages reviewed {LEARNING_REVIEWED_AT}. Most routes offer free learning and a course certificate.
      An optional vendor exam is labelled separately. We charge no learning fee and receive no referral fee.
      A certificate alone does not guarantee competence, a job or a salary increase.
    </p>
    <Link className={linkStyle} href="/">Compare all live skill demand</Link>
    {paths.map(path => {
      const signal = market.signals.find(s=>s.slug===path.skill);
      return <section key={path.skill} id={path.skill} className="scroll-mt-6 rounded-xl border border-border p-5">
        <h2 className="text-xl font-semibold tracking-tight">{SKILLS.find(s=>s.slug===path.skill)?.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{signal
          ? `${signal.matchingRoles} matching postings across ${signal.companiesHiring} employers in the latest site sample.`
          : market.sourceFailures.length ? 'Live demand unavailable while a source recovers.' : 'No matching postings in the latest site sample.'}</p>
        <h3 className="mt-5 font-semibold">{path.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{path.provider} · {path.cost}</p>
        <p className="mt-3 text-sm leading-relaxed">{path.focus} {path.prerequisite}</p>
        <a className={linkStyle} href={path.url} target="_blank" rel="noopener noreferrer">View official course</a>
        <h3 className="mt-3 font-semibold">Credential</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{path.credential}</p>
        <a className={linkStyle} href={path.credentialUrl} target="_blank" rel="noopener noreferrer">Read provider credential requirements</a>
        <h3 className="mt-3 font-semibold">Work to demonstrate</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{path.proof} This is a suggested portfolio exercise, not an issued assessment.</p>
        {signal && <div className="mt-3">
          <h3 className="font-semibold">Check the actual requirements</h3>
          {signal.examples.map(job=><a key={job.url} className={`${linkStyle} block break-words`} href={job.url} target="_blank" rel="noopener noreferrer">{job.title} at {job.company}</a>)}
        </div>}
      </section>;
    })}
    <section className="text-sm leading-relaxed text-muted-foreground">
      <h2 className="font-semibold text-foreground">Choose the next gap, not the biggest salary</h2>
      <p className="mt-2">Advertised pay is for a complete role with location, experience and responsibilities. These courses cover only part of a skill category. Review each posting before investing time or paying an exam provider.</p>
      <p className="mt-2">Use your resulting work in a <a className={linkStyle} href="https://skill.supply">skill.supply market-fit analysis</a>. Learning program development belongs with <a className={linkStyle} href="https://company.university">company.university</a>.</p>
      <p className="mt-2">Human course certificates follow each provider&apos;s identity and academic-honesty rules. Agent performance needs a separate practical evaluation with its model, tools and human interventions disclosed. We do not issue agent credentials or submit job applications.</p>
    </section>
  </InfoPage>;
}
