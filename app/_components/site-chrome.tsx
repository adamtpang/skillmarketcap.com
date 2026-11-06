import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const navLink =
  "inline-flex min-h-11 items-center rounded px-1 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50";

export function SiteHeader() {
  return (
    <header className="pt-6">
      <a
        href="#content"
        className="fixed top-4 left-4 z-50 -translate-y-24 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Link
          href="/"
          aria-label="Skill Market Cap home"
          className="inline-flex min-h-11 items-center rounded font-mono text-sm font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          skill<span className="text-brand">market</span>cap
        </Link>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-label="Site navigation">
          <Link href="/#rankings-title" className={navLink}>Ranking</Link>
          <Link href="/#outlook" className={navLink}>US outlook</Link>
          <Link href="/learn" className={navLink}>Learn</Link>
          <Link href="/data" className={navLink}>Data</Link>
          <a
            href="https://skill.supply/?utm_source=skillmarketcap&utm_medium=referral&utm_content=nav"
            className={`${navLink} gap-1.5`}
          >
            skill.supply
            <ArrowUpRight className="size-3" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-border py-6 text-xs leading-relaxed text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div>
        skill<span className="text-brand">market</span>cap · the demand side of the talent market,
        computed from real job boards.
      </div>
      <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer navigation">
        <Link className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="/learn">Learn</Link>
        <Link className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="/data">Data</Link>
        <Link className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="/about">
          About
        </Link>
        <Link className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="/contact">
          Contact
        </Link>
        <Link className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" href="/privacy">
          Privacy
        </Link>
        <a
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          href="https://github.com/adamtpang/skillmarketcap.com"
        >
          Source
        </a>
      </nav>
    </footer>
  );
}
