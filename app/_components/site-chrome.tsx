import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4 pt-6">
      <Link
        href="/"
        aria-label="Skill Market Cap home"
        className="inline-flex min-h-11 items-center rounded font-mono text-sm font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        skill<span className="text-brand">market</span>cap
      </Link>
      <nav className="flex items-center gap-4" aria-label="Site navigation">
        <a
          href="https://skill.supply"
          className="inline-flex min-h-11 items-center gap-1.5 rounded font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          skill.supply
          <ArrowUpRight className="size-3" aria-hidden />
        </a>
      </nav>
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
