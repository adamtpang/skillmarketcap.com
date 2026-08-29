import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./site-chrome";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function InfoPage({ eyebrow, title, intro, children }: InfoPageProps) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-1 flex-col px-5 sm:px-8">
      <SiteHeader />
      <main className="flex-1 pb-16 pt-12 sm:pt-16">
        <header className="max-w-2xl">
          <div className="font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {eyebrow}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{intro}</p>
        </header>
        <div className="mt-10 max-w-2xl space-y-8">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
