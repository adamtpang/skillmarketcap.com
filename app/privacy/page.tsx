import type { Metadata } from "next";
import { InfoPage } from "../_components/info-page";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Skill Market Cap handles site visits, Vercel Web Analytics, public job-board data, cookies, external links, and contact requests.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy · updated August 29, 2026"
      title="A privacy note for a read-only public tool"
      intro="Skill Market Cap has no accounts, login, contact form, payment flow, or user database. The site is operated by Adam Pang and uses Vercel for hosting and privacy-focused aggregate web analytics."
    >
      <section>
        <h2 className="text-lg font-semibold tracking-tight">Information you provide</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Skill Market Cap does not ask for a name, email address, resume, payment detail, or account.
          The site receives no submission from you because it has no form. If you contact the
          operator through GitHub or Adam Pang&apos;s site, that separate service receives the
          information you choose to provide under its own terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Hosting and access data</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Vercel hosts and delivers the site. Like other web hosts, Vercel processes request and
          network information needed to serve and secure a page, which can include an IP address,
          request time, requested URL, browser or user-agent details, and location derived from the
          IP address. Vercel controls that infrastructure processing under its privacy notice.
        </p>
        <a className="mt-3 inline-block rounded text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="https://vercel.com/legal/privacy-notice">
          Read Vercel&apos;s privacy notice
        </a>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Vercel Web Analytics</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Skill Market Cap enables Vercel Web Analytics to measure aggregate page views and traffic
          patterns. Vercel states that this product stores anonymized data, does not use cookies, and
          can record the page, referrer, coarse location, operating system, browser, and device type.
          The site sends no custom analytics events and has no form values to attach to analytics.
        </p>
        <a className="mt-3 inline-block rounded text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="https://vercel.com/docs/analytics/privacy-policy">
          Read Vercel Web Analytics privacy details
        </a>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Job-board data and external links</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The server fetches public Greenhouse and Ashby job-board data to build the ranking. Those
          requests contain no visitor-submitted profile because Skill Market Cap collects none. Job
          examples link to employer posting pages, and the site also links to skill.supply, GitHub,
          Adam Pang&apos;s site, and Vercel. A destination&apos;s own privacy terms apply after you leave.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Storage, cookies, and questions</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The Skill Market Cap application stores no visitor profile, message, resume, or account
          record, and its initial page response sets no cookie. Vercel separately controls its
          hosting records and aggregate analytics. For a privacy question about this site, use the
          current contact options published on Adam Pang&apos;s site and avoid placing sensitive details
          in a public GitHub issue.
        </p>
        <a className="mt-3 inline-block rounded text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="https://adampang.com">
          Contact the operator
        </a>
      </section>
    </InfoPage>
  );
}
