import type { Metadata } from "next";
import { InfoPage } from "../_components/info-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who operates Skill Market Cap, what the live skill-demand ranking measures, and the limits of its public job-board data.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About the project"
      title="A demand index with visible limits"
      intro="Skill Market Cap is a public skill-demand ranking built and operated by Adam Pang. Its job is narrow: show what a verified sample of live job boards is asking for, then make the method and its limits easy to inspect."
    >
      <section>
        <h2 className="text-lg font-semibold tracking-tight">What Skill Market Cap measures</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Skill Market Cap reads live postings from verified Greenhouse and Ashby job-board APIs. It
          classifies functional demand from titles and teams, checks requirements for named
          technical stacks, and refreshes the computed snapshot hourly. The highest matching role
          count becomes a demand score of 100, and every other skill is indexed against it.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Where the pay figures come from</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Compensation figures use only employer-disclosed annual USD salary bands in the public
          posting data. The site shows the median band midpoint and the disclosure count beside each
          skill. Postings with no usable disclosure produce no pay figure, and hourly, non-USD, or
          ambiguous ranges are left out rather than estimated.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">What the ranking cannot tell you</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The ranking is a directional sample, not the whole labor market and not a historical
          trend. One role can match more than one skill. Compensation coverage is uneven because
          disclosure depends on the employer and posting. Daily evidence captures are retained
          in the project&apos;s workflow artifacts for a limited period. There is no public API
          and no claim that demand alone determines a person&apos;s fit.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Operator and source</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Adam Pang operates Skill Market Cap and also operates its sibling project, skill.supply.
          The code, board configuration, classifier, compensation rules, and change history are
          publicly viewable in the project&apos;s GitHub repository.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
          <a className="rounded underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="https://github.com/adamtpang/skillmarketcap.com">
            Inspect the source code
          </a>
          <a className="rounded underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="https://adampang.com">
            Visit Adam Pang&apos;s site
          </a>
        </div>
      </section>
    </InfoPage>
  );
}
