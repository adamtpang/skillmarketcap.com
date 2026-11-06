import type { SkillSignal } from "@/lib/aggregate-market";
import { loadCaptureCensus } from "@/lib/capture-census";
import { formatCount, formatTenthsPercent, formatUsd, formatUtcDay, SMALL_DISCLOSURE_COUNT } from "@/lib/display";
import {
  OFFICIAL_OCCUPATIONS,
  OUTLOOK_CHECKED_ON,
  OUTLOOK_SOURCES,
  PAY_COMPARISONS,
  PROJECTIONS_RELEASED_ON,
  WAGE_REFERENCE,
  jobsFromThousands,
  occupationById,
  rankedOccupations,
} from "@/lib/official-outlook";

const linkClass =
  "font-medium text-brand underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

function ExternalTextLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function OfficialOutlook({ signals }: { signals: SkillSignal[] }) {
  const census = loadCaptureCensus();
  const byGrowth = rankedOccupations("growthPercent", { includeBaseline: false });
  const byChange = rankedOccupations("numericChangeThousands", { includeBaseline: false });
  const byOpenings = rankedOccupations("openingsThousands", { includeBaseline: false });
  const byWage = rankedOccupations("medianAnnualWage", { includeBaseline: false });
  const tableRows = rankedOccupations("growthPercent");
  const total = occupationById("all-occupations");
  const compProviders = Object.entries(census.compByProvider).sort((a, b) => b[1].comp - a[1].comp || a[0].localeCompare(b[0]));

  return (
    <section id="outlook" className="mt-8 scroll-mt-6" aria-labelledby="outlook-title">
      <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        United States official series
      </div>
      <h2 id="outlook-title" className="mt-1 text-xl font-semibold tracking-tight">
        Projected growth and May 2025 median wages
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        This section is not the employer-weighted score above. It quotes the BLS Employment
        Projections for 2025-35, released {formatUtcDay(PROJECTIONS_RELEASED_ON)}, and the{" "}
        {WAGE_REFERENCE} OEWS median annual wage. Figures were read from the linked BLS pages on{" "}
        {formatUtcDay(OUTLOOK_CHECKED_ON)}. Geography is the United States. Nothing here is a dollar
        market cap, a causal wage premium, or a forecast for one person.
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Total employment in the National Employment Matrix is {formatCount(jobsFromThousands(total.employment2025Thousands))} in
        2025 and {formatCount(jobsFromThousands(total.employment2035Thousands))} in 2035. The printed
        numeric change is {formatCount(jobsFromThousands(total.numericChangeThousands))} jobs (
        {formatTenthsPercent(total.growthPercent)}). OOH rounds that average to {total.oohGrowthPercent}%.
        Average annual openings, which add growth to workers who leave the occupation or the labor
        force, are {formatCount(jobsFromThousands(total.openingsThousands))}. Job counts on this page
        equal the published thousands figure times 1,000. That is nearest 100 jobs, not an exact
        headcount. Do not subtract the rounded 2025 and 2035 levels to invent a new change: BLS
        prints the change separately, and the tenths can disagree by 0.1 thousand.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <RankList title="Highest percent growth" metric="Projected percent change, 2025-35" rows={byGrowth} render={(row) => formatTenthsPercent(row.growthPercent)} />
        <RankList title="Largest numeric change" metric="Printed employment change, nearest 100 jobs" rows={byChange} render={(row) => formatCount(jobsFromThousands(row.numericChangeThousands))} />
        <RankList title="Highest median wage" metric={`${WAGE_REFERENCE} OEWS median annual wage`} rows={byWage} render={(row) => formatUsd(row.medianAnnualWage)} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        The three lists leave out the all-occupations total, which would otherwise lead numeric change
        and openings because it is the whole economy. Average annual openings are a fourth measure.
        In this set the largest is {byOpenings[0]?.title} at{" "}
        {formatCount(jobsFromThousands(byOpenings[0]?.openingsThousands ?? 0))} openings a year. Openings
        are not the same number as net new jobs.
      </p>

      <p className="mt-3 text-xs text-muted-foreground sm:hidden">Scroll sideways to read every column.</p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[52rem] text-sm">
          <caption className="sr-only">
            BLS Employment Projections 2025-35 and May 2025 median annual wages for a comparison set. Not the job-board ranking.
          </caption>
          <thead>
            <tr className="border-b border-border text-left font-mono text-xs tracking-wide text-muted-foreground uppercase">
              <th scope="col" className="p-3 font-medium sm:px-5">Occupation</th>
              <th scope="col" className="p-3 font-medium sm:px-5">SOC</th>
              <th scope="col" className="p-3 text-right font-medium sm:px-5">Growth</th>
              <th scope="col" className="p-3 text-right font-medium sm:px-5">Numeric change</th>
              <th scope="col" className="p-3 text-right font-medium sm:px-5">Annual openings</th>
              <th scope="col" className="p-3 text-right font-medium sm:px-5">Median wage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tableRows.map((row) => (
              <tr key={row.soc}>
                <th scope="row" className="p-3 text-left font-semibold sm:px-5">
                  <ExternalTextLink href={row.profileUrl}>{row.title}</ExternalTextLink>
                </th>
                <td className="p-3 font-mono text-xs whitespace-nowrap sm:px-5">{row.soc}</td>
                <td className="p-3 text-right font-mono tabular-nums sm:px-5">
                  <div>{formatTenthsPercent(row.growthPercent)}</div>
                  {row.oohGrowthPercent !== null && (
                    <div className="text-xs text-muted-foreground">OOH prints {row.oohGrowthPercent}%</div>
                  )}
                </td>
                <td className="p-3 text-right font-mono tabular-nums whitespace-nowrap sm:px-5">
                  {formatCount(jobsFromThousands(row.numericChangeThousands))}
                </td>
                <td className="p-3 text-right font-mono tabular-nums whitespace-nowrap sm:px-5">
                  {formatCount(jobsFromThousands(row.openingsThousands))}
                </td>
                <td className="p-3 text-right font-mono tabular-nums whitespace-nowrap sm:px-5">
                  {formatUsd(row.medianAnnualWage)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 text-xs leading-relaxed text-muted-foreground">
        {OFFICIAL_OCCUPATIONS.filter((row) => row.caution).map((row) => (
          <li key={row.soc}>{row.caution}</li>
        ))}
        <li>
          Wages are {WAGE_REFERENCE} medians for nonfarm wage-and-salary workers. They exclude the
          self-employed, owners and partners in unincorporated firms, and household workers. They
          are not total compensation, and they are not the advertised band midpoints in the ranking.
        </li>
      </ul>

      <h3 className="mt-6 text-lg font-semibold tracking-tight">Same names, different pay measures</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The left dollar is the median of employer-disclosed annual USD salary-band midpoints in the
        captured boards. The right dollar is the {WAGE_REFERENCE} OEWS median. Neither column is
        total compensation. The gap is not evidence that learning the site&apos;s skill causes higher pay.
      </p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[40rem] text-sm">
          <caption className="sr-only">
            Advertised salary-band midpoints from this capture beside BLS median wages for neighboring occupations.
          </caption>
          <thead>
            <tr className="border-b border-border text-left font-mono text-xs tracking-wide text-muted-foreground uppercase">
              <th scope="col" className="p-3 font-medium">Site row</th>
              <th scope="col" className="p-3 text-right font-medium">Advertised midpoint</th>
              <th scope="col" className="p-3 font-medium">BLS neighbor</th>
              <th scope="col" className="p-3 text-right font-medium">OEWS median</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PAY_COMPARISONS.map((item) => {
              const signal = signals.find((skill) => skill.slug === item.skillSlug);
              const occupation = occupationById(item.occupationId);
              const thin = signal !== undefined && signal.disclosedCount > 0 && signal.disclosedCount < SMALL_DISCLOSURE_COUNT;
              return (
                <tr key={`${item.skillSlug}:${item.occupationId}`}>
                  <th scope="row" className="p-3 text-left font-semibold">
                    {signal?.name ?? item.skillSlug}
                    <div className="mt-1 font-sans text-xs font-normal text-muted-foreground">{item.relationship}</div>
                  </th>
                  <td className="p-3 text-right font-mono tabular-nums whitespace-nowrap">
                    {signal?.medianDisclosedUsd != null ? (
                      <>
                        <div>{formatUsd(signal.medianDisclosedUsd)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCount(signal.disclosedCount)} of {formatCount(signal.matchingRoles)} disclose
                          {thin ? ". Small disclosure count." : ""}
                        </div>
                      </>
                    ) : (
                      "No disclosed comp"
                    )}
                  </td>
                  <td className="p-3">
                    <ExternalTextLink href={occupation.profileUrl}>{occupation.title}</ExternalTextLink>
                    <div className="font-mono text-xs text-muted-foreground">{occupation.soc}</div>
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums whitespace-nowrap">
                    {formatUsd(occupation.medianAnnualWage)}
                    <div className="text-xs text-muted-foreground">{WAGE_REFERENCE} median</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        AI and machine learning on this site is a title pattern, not a BLS occupation. Data
        scientists and computer and information research scientists are neighboring occupations in
        the table above. Their wages are not the advertised median on the AI row, and this page
        does not average them.
      </p>

      <h3 className="mt-6 text-lg font-semibold tracking-tight">Forward deployed engineer has no BLS code</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        BLS does not publish a SOC for Forward Deployed Engineer. This page does not invent one, and
        it does not assign that title the software-developer wage or growth rate. In the{" "}
        {formatCount(census.postings)} postings of this capture, {formatCount(census.exactForwardDeployedEngineer.postings)} have
        the exact title Forward Deployed Engineer, across {formatCount(census.exactForwardDeployedEngineer.boards)} employer
        boards. {formatCount(census.forwardDeployedPhrase.postings)} titles contain the phrase forward
        deployed, across {formatCount(census.forwardDeployedPhrase.boards)} boards. The phrase includes
        product managers, strategists, and other roles, so it is not one occupation and it is not a
        row in the score.
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Salary bands kept in this capture:{" "}
        {compProviders.map(([provider, row]) => `${provider} ${formatCount(row.comp)} of ${formatCount(row.roles)}`).join("; ")}.
        A zero means that provider&apos;s list response contributed demand and no annual USD band.
      </p>

      <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Sources:{" "}
        <ExternalTextLink href={OUTLOOK_SOURCES.release.url}>{OUTLOOK_SOURCES.release.label}</ExternalTextLink>
        {"; "}
        <ExternalTextLink href={OUTLOOK_SOURCES.table13.url}>{OUTLOOK_SOURCES.table13.label}</ExternalTextLink>
        {"; "}
        <ExternalTextLink href={OUTLOOK_SOURCES.table110.url}>{OUTLOOK_SOURCES.table110.label}</ExternalTextLink>
        {"; "}
        <ExternalTextLink href={OUTLOOK_SOURCES.mostNewJobs.url}>{OUTLOOK_SOURCES.mostNewJobs.label}</ExternalTextLink>
        {"; "}
        <ExternalTextLink href={OUTLOOK_SOURCES.oews.url}>{OUTLOOK_SOURCES.oews.label}</ExternalTextLink>
        . World Economic Forum survey expectations, posting-study AI wage gaps, and self-reported
        total-compensation websites are not shown. They are different measures, and a gap in
        advertised pay is not a causal return to a skill.
      </p>
    </section>
  );
}

function RankList({
  title,
  metric,
  rows,
  render,
}: {
  title: string;
  metric: string;
  rows: ReturnType<typeof rankedOccupations>;
  render: (row: ReturnType<typeof rankedOccupations>[number]) => string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{metric}</p>
      <ol className="mt-3 space-y-1 text-sm">
        {rows.slice(0, 5).map((row, index) => (
          <li key={row.soc} className="flex items-baseline justify-between gap-3">
            <span>
              <span className="font-mono text-xs text-muted-foreground">{index + 1}. </span>
              {row.title}
            </span>
            <span className="font-mono text-xs tabular-nums whitespace-nowrap">{render(row)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
