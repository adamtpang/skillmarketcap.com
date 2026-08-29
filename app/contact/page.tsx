import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { InfoPage } from "../_components/info-page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Adam Pang about Skill Market Cap data corrections, verified job-board sources, or site problems through published public channels.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Reach the operator through a published channel"
      intro="Adam Pang builds and operates Skill Market Cap. The project does not have a sales team, account support desk, or contact form, so questions should use one of the real public routes below."
    >
      <section>
        <h2 className="text-lg font-semibold tracking-tight">Corrections and site issues</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Open a public GitHub issue for a broken role link, a job-board source problem, a
          classification question, or a reproducible bug. Issues and the GitHub account that opens
          them are public, so do not include a resume, private employment details, credentials, or
          other sensitive information.
        </p>
        <a
          href="https://github.com/adamtpang/skillmarketcap.com/issues/new"
          className="mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Open a GitHub issue
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Private or general contact</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Adam Pang&apos;s public site maintains his current direct-contact options. Use that route for
          a message that does not belong in a public issue. Skill Market Cap does not receive or
          store messages when you follow the link.
        </p>
        <a
          href="https://adampang.com"
          className="mt-4 inline-flex items-center gap-1.5 rounded text-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Visit Adam Pang&apos;s contact site
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Career market-fit analysis</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Skill Market Cap itself does not accept resumes or run personal analyses. The sibling site
          skill.supply is the separate tool for comparing a background with live demand. Its own
          privacy terms apply to anything entered there.
        </p>
        <a
          href="https://skill.supply"
          className="mt-4 inline-flex items-center gap-1.5 rounded text-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Try the market-fit analysis
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </section>
    </InfoPage>
  );
}
