import { ArrowRight, ArrowUpRight, CircleHelp } from "lucide-react";
import { fetchSkillMarket } from "@/lib/skills";
import { learningForSkill } from "@/lib/learning";
import { SiteFooter, SiteHeader } from "./_components/site-chrome";

export default async function HomePage() {
  const market = await fetchSkillMarket();
  const coverage =
    market.rolesScanned === 0 ? 0 : Math.round((market.rolesClassified / market.rolesScanned) * 100);
  const refreshed = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(market.asOf));

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 sm:px-8">
      <SiteHeader />

      <main className="flex-1 pb-16">
        <section className="pt-12 pb-8 sm:pt-16">
          <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Public job data, checked hourly
          </div>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            See what the market is asking for
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
            A demand snapshot built from the actual roles published by high-potential companies on
            their public job boards. Explore relevant courses, then build work that proves the skill.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="#rankings-title"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Start with the live ranking
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
          <Metric label="Roles scanned" value={market.rolesScanned.toLocaleString()} />
          <Metric label="Companies live" value={market.companiesScanned.toLocaleString()} />
          <Metric label="Skill markets" value={market.signals.length.toLocaleString()} />
          <Metric label="Roles classified" value={`${coverage}%`} />
        </section>

        <section className="mt-8" aria-labelledby="rankings-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                Live rankings
              </div>
              <h2 id="rankings-title" className="mt-1 text-xl font-semibold tracking-tight">
                Skills mentioned in hiring
              </h2>
            </div>
            <div className="font-mono text-xs text-muted-foreground">Last complete sample: {refreshed} UTC</div>
          </div>

          {market.signals.length > 0 ? (
            <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {market.signals.map((skill, index) => (
                <li key={skill.slug} className="grid gap-4 p-4 sm:grid-cols-[2rem_1fr_9rem] sm:p-5">
                  <div className="font-mono text-xs tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="font-semibold tracking-tight">{skill.name}</h3>
                      <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                        {skill.category}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {skill.matchingRoles.toLocaleString()} matching roles across{" "}
                      {skill.companiesHiring} {skill.companiesHiring === 1 ? "company" : "companies"}
                    </div>
                    {skill.medianDisclosedUsd !== null ? (
                      <div className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {formatCompUsd(skill.medianDisclosedUsd)} median advertised annual USD
                        </span>{" "}
                        <span className="font-mono text-xs">
                          ({skill.disclosedCount} of {skill.matchingRoles} postings disclose)
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 font-mono text-xs tracking-wide text-muted-foreground uppercase">
                        no disclosed comp
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
                            <ArrowUpRight className="size-3 shrink-0" aria-hidden />
                          </a>
                        ))}
                      </div>
                    )}
                    {learningForSkill(skill.slug) && <a href={`/learn#${skill.slug}`} className="mt-1 inline-flex min-h-11 items-center rounded text-sm font-medium text-brand underline underline-offset-4">Explore courses and credentials</a>}
                  </div>
                  <div className="sm:text-right">
                    <div className="font-mono text-xl font-semibold tabular-nums text-brand">
                      {skill.demandScore}
                    </div>
                    <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                      Demand score
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${skill.demandScore}%` }}
                      />
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">
                      {skill.shareOfRoles}% of roles
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-xl border border-border bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
              {market.sourceFailures.length > 0
                ? `Rankings are paused because ${market.sourceFailures.join(", ")} did not return usable data. Successful sources are counted above, but an incomplete sample is not ranked. Retry by reloading after the next hourly refresh.`
                : "No matching roles were found in this refresh. All configured sources responded; no demand or salary has been inferred."}
            </p>
          )}
        </section>

        <section id="methodology" className="mt-6 scroll-mt-6 rounded-xl border border-border bg-muted/40 p-5">
          <div className="flex gap-3">
            <CircleHelp className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <div>
              <h2 className="text-sm font-semibold">How the score works</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Skill Market Cap classifies functional demand from public job titles and teams. For
                named technical stacks such as Python and TypeScript, it also scans requirements, but only on
                technical job titles. Team context alone does not establish technical work.
                Keyword matches can include preferred or alternative skills and are not verified requirements.
                A role can count toward more than one skill, so shares can overlap.
                The most-mentioned skill scores 100 and the rest are indexed against it. This is a
                directional sample, not the whole labor market.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Pay values are medians of employer-disclosed salary-band midpoints from public ATS
                APIs, mostly US postings under pay-transparency laws. Skills with no disclosed bands
                show no number: invented precision would be worse than no number.
                These figures describe roles mentioning a skill, not the standalone value of that skill.
                Locations and seniority levels are pooled; they are not personalized salary estimates.
                Ambiguous currencies, incomplete ranges and conflicting location tiers are excluded.
                If a source refresh fails, the previous complete sample stays visible with its capture time.
              </p>
              <a href="/data" className="mt-2 inline-flex min-h-11 items-center rounded text-sm font-medium text-brand underline underline-offset-4">Inspect data sources and capture history</a>
            </div>
          </div>
        </section>

        <section className="mt-10 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Your market cap
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
            href="https://skill.supply"
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

function formatCompUsd(value: number): string {
  return `$${Math.round(value / 1000)}K`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-4">
      <div className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-brand">{value}</div>
    </div>
  );
}
