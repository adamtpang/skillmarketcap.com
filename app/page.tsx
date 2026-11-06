import { ArrowRight, ArrowUpRight, CircleHelp } from "lucide-react";
import { fetchSkillMarket } from "@/lib/skills";
import { learningForSkill } from "@/lib/learning";
import { SKILLS } from "@/lib/classification";
import { H1B_SNAPSHOT } from "@/lib/h1b";
import { formatCapturedAt, formatCount, formatPercentOf, formatUsd, SMALL_DISCLOSURE_COUNT } from "@/lib/display";
import { OfficialOutlook } from "./_components/official-outlook";
import { SiteFooter, SiteHeader } from "./_components/site-chrome";

export default async function HomePage() {
  const market = await fetchSkillMarket();
  const refreshed = formatCapturedAt(market.asOf);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 sm:px-8">
      <SiteHeader />

      <main id="content" className="flex-1 pb-16">
        <section className="pt-12 pb-8 sm:pt-16">
          <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Public job boards, one employer one vote
          </div>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            See what the market is asking for
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
            A demand snapshot from public employer job boards across software, healthcare, trades,
            sales, finance, logistics, education, and other work. Each employer counts equally, so
            one large board cannot set the ranking. Explore relevant courses, then build work that
            proves the skill.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="#rankings-title"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Start with the captured ranking
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a
              href="#methodology"
              className="inline-flex min-h-11 items-center rounded text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Read the methodology
            </a>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          <Metric label="Postings scanned" value={formatCount(market.rolesScanned)} />
          <Metric label="Employer boards" value={formatCount(market.companiesScanned)} />
          <Metric label="Skill rows" value={formatCount(market.signals.length)} />
          <Metric
            label="Classified share"
            value={formatPercentOf(market.rolesClassified, market.rolesScanned)}
            detail={`${formatCount(market.rolesClassified)} postings`}
          />
        </section>

        <section className="mt-8" aria-labelledby="rankings-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                Captured ranking
              </div>
              <h2 id="rankings-title" className="mt-1 text-xl font-semibold tracking-tight">
                Titles and teams in this job-board sample
              </h2>
            </div>
            <div className="font-mono text-xs text-muted-foreground">Captured sample: {refreshed}</div>
          </div>
          <p className="mb-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The score gives every employer board the same weight, split across the postings it listed.
            Counts are postings, including the same title repeated across cities. They are not unique
            openings, hires, or national job growth. The largest board in this sample is{" "}
            {market.largestEmployer.name} with {formatCount(market.largestEmployer.roles)} postings (
            {formatPercentOf(market.largestEmployer.roles, market.rolesScanned)} of postings).
            Occupational families match broad job titles. Named technologies count only when the title
            or team says the tool, because requirement text was not stored. A posting can match more
            than one row, so shares overlap. Pay is a median of disclosed annual USD salary-band
            midpoints, pooled across locations and seniority. It is not total compensation and not a
            market cap. Example links are short titles from the row. They are not necessarily the
            postings that set the median.
          </p>

          {market.signals.length > 0 ? (
            <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {market.signals.map((skill, index) => (
                <li key={skill.slug} id={skill.slug} className="grid scroll-mt-4 gap-4 p-4 sm:grid-cols-[2rem_1fr_9rem] sm:p-5">
                  <div className="font-mono text-xs tabular-nums text-muted-foreground">
                    <span className="sr-only">Rank </span>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="font-semibold tracking-tight">{skill.name}</h3>
                      <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                        {skill.category}
                        <span className="normal-case tracking-normal"> · {skillKind(skill.slug)}</span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatCount(skill.matchingRoles)} matching postings across{" "}
                      {formatCount(skill.companiesHiring)} {skill.companiesHiring === 1 ? "employer board" : "employer boards"}
                    </div>
                    {skill.medianDisclosedUsd !== null ? (
                      <div className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {formatUsd(skill.medianDisclosedUsd)} median annual USD salary-band midpoint
                        </span>{" "}
                        <span className="font-mono text-xs">
                          ({formatCount(skill.disclosedCount)} of {formatCount(skill.matchingRoles)} postings disclose,{" "}
                          {formatPercentOf(skill.disclosedCount, skill.matchingRoles)})
                        </span>
                        {skill.disclosedCount < SMALL_DISCLOSURE_COUNT && (
                          <span className="mt-1 block font-sans text-xs normal-case tracking-normal">
                            Small disclosure count. This median describes those bands only.
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-muted-foreground">
                        No disclosed annual USD salary band
                      </div>
                    )}
                    {skill.examples.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {skill.examples.map((job) => (
                          <a
                            key={`${job.company}:${job.url}`}
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 max-w-full items-center gap-1 rounded px-1 py-2 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                          >
                            <span className="break-words">
                              {job.title} at {job.company}
                            </span>
                            <span className="sr-only"> (opens in a new tab)</span>
                            <ArrowUpRight className="size-3 shrink-0" aria-hidden />
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="mt-1 flex flex-wrap gap-x-4">
                      {learningForSkill(skill.slug) && <a href={`/learn#${skill.slug}`} className="inline-flex min-h-11 items-center rounded text-sm font-medium text-brand underline underline-offset-4">Explore courses and credentials</a>}
                      <a href={skillSupplyUrl("skill_row", skill.slug)} className="inline-flex min-h-11 items-center rounded text-sm font-medium text-brand underline underline-offset-4">Check your fit for {skill.name.toLowerCase()} roles</a>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="font-mono text-xl font-semibold tabular-nums text-brand" aria-label={`Employer-weighted score ${skill.demandScore} out of 100. Not percent growth and not a dollar market cap.`}>
                      {skill.demandScore}
                    </div>
                    <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                      Score out of 100
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${skill.demandScore}%` }}
                      />
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">
                      {formatPercentOf(skill.matchingRoles, market.rolesScanned)} of postings
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-xl border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
              No matching roles were found in this capture. Boards that failed or listed nothing were omitted.
              No demand or salary has been inferred.
            </p>
          )}
        </section>

        <OfficialOutlook signals={market.signals} />

        <section id="sectors" className="mt-8 scroll-mt-6" aria-labelledby="sectors-title">
          <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Occupational mix
          </div>
          <h2 id="sectors-title" className="mt-1 text-xl font-semibold tracking-tight">
            What kind of work the postings describe
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Each posting gets one sector from its title. The team is used only when the title matches
            none of the sector rules. Unspecified means the title did not match a rule, not that the
            work has no field. Share is that sector&apos;s postings divided by postings scanned, rounded
            to 0.1 percentage point.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  <th scope="col" className="p-3 font-medium sm:px-5">Sector</th>
                  <th scope="col" className="p-3 text-right font-medium sm:px-5">Postings</th>
                  <th scope="col" className="p-3 text-right font-medium sm:px-5">Share</th>
                  <th scope="col" className="p-3 text-right font-medium sm:px-5">Employers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {market.sectors.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="p-3 text-left font-semibold sm:px-5">{row.label}</th>
                    <td className="p-3 text-right font-mono tabular-nums sm:px-5">{formatCount(row.roles)}</td>
                    <td className="p-3 text-right font-mono tabular-nums sm:px-5">{formatPercentOf(row.roles, market.rolesScanned)}</td>
                    <td className="p-3 text-right font-mono tabular-nums sm:px-5">{formatCount(row.companies)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="countries" className="mt-8 scroll-mt-6" aria-labelledby="countries-title">
          <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Where the postings name a place
          </div>
          <h2 id="countries-title" className="mt-1 text-xl font-semibold tracking-tight">
            Countries stated on the roles
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            A country is recorded only when the posting names one, or names a US postal abbreviation
            or Canadian province. A city alone stays Unspecified. Boards in more than one country are
            Multiple. This is not a headquarters map, and the ranking above is not limited to the
            United States. Showing 12 of {formatCount(market.countries.length)} country rows, ordered
            by postings.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  <th scope="col" className="p-3 font-medium sm:px-5">Country</th>
                  <th scope="col" className="p-3 text-right font-medium sm:px-5">Postings</th>
                  <th scope="col" className="p-3 text-right font-medium sm:px-5">Employers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {market.countries.slice(0, 12).map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="p-3 text-left font-semibold sm:px-5">{row.label}</th>
                    <td className="p-3 text-right font-mono tabular-nums sm:px-5">{formatCount(row.roles)}</td>
                    <td className="p-3 text-right font-mono tabular-nums sm:px-5">{formatCount(row.companies)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {market.countries.length > 12 && (
            <details className="mt-3 rounded-xl border border-border bg-card p-4">
              <summary className="cursor-pointer text-sm font-medium">
                Show the other {formatCount(market.countries.length - 12)} country rows
              </summary>
              <ul className="mt-3 space-y-1 text-sm">
                {market.countries.slice(12).map((row) => (
                  <li key={row.label} className="flex items-baseline justify-between gap-3">
                    <span>{row.label}</span>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {formatCount(row.roles)} postings, {formatCount(row.companies)} employers
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>

        <section id="h1b-levels" className="mt-8 scroll-mt-6" aria-labelledby="h1b-title">
          <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Pay floors by level
          </div>
          <h2 id="h1b-title" className="mt-1 text-xl font-semibold tracking-tight">
            H-1B minimum base pay for seven named employers
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Median filed minimum base salary by government wage level, from{" "}
            {formatCount(H1B_SNAPSHOT.filings)} certified H-1B filings by {H1B_SNAPSHOT.companies.join(", ")}{" "}
            ({H1B_SNAPSHOT.window}). This is the original nine-employer cohort, not the{" "}
            {formatCount(market.companiesScanned)} boards in the ranking. Level I is entry, level IV is
            fully competent and senior. The dollars are exact filed floors, not rounded to the nearest thousand.
            A cell with fewer than {SMALL_DISCLOSURE_COUNT} filings is marked a small filing count. That
            mark is a display label, not a confidence interval.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="p-3 font-medium sm:px-5">Level</th>
                  <th className="p-3 text-right font-medium sm:px-5">All roles</th>
                  <th className="p-3 text-right font-medium sm:px-5">Software roles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {H1B_SNAPSHOT.levels.map((row) => (
                  <tr key={row.level}>
                    <td className="p-3 font-semibold whitespace-nowrap sm:px-5">Level {row.level}</td>
                    <td className="p-3 text-right sm:px-5">
                      <div className="font-mono font-semibold tabular-nums text-brand">
                        {formatUsd(row.medianFloorUsd)}
                      </div>
                      <div className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                        {formatCount(row.filings)} filings{row.filings < SMALL_DISCLOSURE_COUNT ? ". Small filing count." : ""}
                      </div>
                    </td>
                    <td className="p-3 text-right sm:px-5">
                      <div className="font-mono font-semibold tabular-nums text-brand">
                        {formatUsd(row.softwareMedianFloorUsd)}
                      </div>
                      <div className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                        {formatCount(row.softwareFilings)} filings{row.softwareFilings < SMALL_DISCLOSURE_COUNT ? ". Small filing count." : ""}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            These are minimums, not typical pay. {H1B_SNAPSHOT.filingsAtPrevailingWage} of{" "}
            {H1B_SNAPSHOT.filings} filings sit exactly at the government&apos;s prevailing wage for the
            role and city, which is why the medians land on that legal minimum. Base salary only, no equity
            or bonus. {H1B_SNAPSHOT.companiesWithoutFilings.join(" and ")} had no filings in this
            window. A fixed snapshot pulled {H1B_SNAPSHOT.pulledOn}, not refreshed hourly.{" "}
            <a
              href={H1B_SNAPSHOT.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline underline-offset-4"
            >
              Source: {H1B_SNAPSHOT.source}
            </a>
          </p>
        </section>

        <section id="methodology" className="mt-6 scroll-mt-6 rounded-xl border border-border bg-muted/40 p-5">
          <div className="flex gap-3">
            <CircleHelp className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <div>
              <h2 className="text-sm font-semibold">How the score works</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                This capture reads public job-board APIs from Greenhouse, Ashby, Lever, Workable,
                Recruitee, Personio, and Rippling. Candidate board addresses come from the{" "}
                <a href={market.sample.directoryUrl} className="font-medium text-brand underline underline-offset-4">public job-board directory</a>
                . Counts were computed from those board responses at capture time. This page serves
                that completed sample. It does not refetch every board on each visit.{" "}
                {market.sample.attempted.toLocaleString()} boards were called.{" "}
                {market.sample.failed.toLocaleString()} failed and {market.sample.empty.toLocaleString()} listed
                no roles. Those boards are omitted. They are not scored as zero demand.{" "}
                {market.sample.workdayNotCalled.toLocaleString()} Workday addresses in that directory were not
                called. The published sample keeps the {market.companiesScanned.toLocaleString()} boards that
                returned at least one role.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Classification uses the title, plus team or department when the list endpoint provides
                one. The rules are English occupational titles plus a short explicit list of common
                German, French, Spanish, Dutch, Italian, and Portuguese job titles. Other languages
                and unlisted titles stay unmatched. Requirement text is not stored, so a language
                such as Python counts only when the title or team names it. Keyword matches can
                include preferred or alternative skills.
                A role can count toward more than one skill, so shares can overlap. Each employer board
                has weight 1, divided across its postings. The highest weight scores 100. Role share is
                the raw posting share and can disagree with the score. This is a sample of employers
                that publish on these applicant-tracking systems, not the whole labor market.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Pay values are medians of employer-disclosed annual USD salary-band midpoints. In this
                capture those bands come from Ashby structured salary components, Lever year ranges in
                USD, and Recruitee salary objects whose period says year or annual. Greenhouse,
                Workable, Rippling, and Personio list rows contributed no kept salary. The Greenhouse
                list endpoint has no salary field, and this capture does not download description HTML
                to recover one. Skills with no usable band show no number. Ambiguous currencies, hourly
                rates, and incomplete ranges are left out. Even counts use the rounded mean of the two
                central midpoints. A row with fewer than {SMALL_DISCLOSURE_COUNT} disclosed bands is
                marked a small disclosure count. That mark is a display label, not a confidence interval.
                These figures describe postings in a title family, pooled across countries and seniority.
                They are not base-versus-total compensation, not a city wage, and not the standalone
                price of a skill. {formatCount(market.sample.slugNamedCompanies)} employer labels are
                title-cased board slugs because that API did not return a company name.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The score does not use SmartRecruiters, levels.fyi, or statistical series from BLS, O*NET,
                OECD, ILO, Eurostat, and the UK ONS. The United States projection section above quotes
                BLS pages directly. Those figures are not inputs to the score, and the score is not
                national job growth. The H-1B table above is a separate fixed snapshot for the original
                nine employers. No trend series is published. Posting share on each row is matching
                postings divided by postings scanned, rounded to 0.1 percentage point. The stored whole
                percent is not what the page prints, because that rounding hid rows under 0.5%.
              </p>
              <a href="/data" className="mt-2 inline-flex min-h-11 items-center rounded text-sm font-medium text-brand underline underline-offset-4">Inspect data sources and capture history</a>
            </div>
          </div>
        </section>

        <section className="mt-10 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              From the ranking to proof
            </div>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              Demand only matters when you can prove the skill.
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              skill.supply reads your background, compares what your work already demonstrates with
              the demand shown here, and turns that overlap into a market-fit analysis, resume, and
              company shortlist.
            </p>
          </div>
          <a
            href={skillSupplyUrl("page")}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Try the market-fit analysis
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="bg-card p-4">
      <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-brand">{value}</div>
      {detail && <div className="mt-1 text-xs text-muted-foreground">{detail}</div>}
    </div>
  );
}

function skillKind(slug: string): string {
  const source = SKILLS.find((skill) => skill.slug === slug)?.source;
  if (source === "technical-requirements") return "Named technology";
  if (source === "role") return "Occupational family";
  return "Unclassified pattern";
}

// Every link into skill.supply carries where it came from, so the shared
// PostHog project can attribute a skill.supply visit to this page and, for
// row links, to the exact skill the visitor was looking at.
function skillSupplyUrl(placement: string, skill?: string): string {
  const params = new URLSearchParams({
    utm_source: "skillmarketcap",
    utm_medium: "referral",
    utm_content: placement,
  });
  if (skill) params.set("skill", skill);
  return `https://skill.supply/?${params.toString()}`;
}
