import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skillmarketcap.com"),
  title: {
    default: "Skill Market Cap · what the job market is actually asking for",
    template: "%s · Skill Market Cap",
  },
  description:
    "A live demand ranking of skills, computed hourly from the real roles published on public job boards. Directional, sourced, and honest about what it does not measure.",
  alternates: {
    canonical: "https://skillmarketcap.com",
  },
  openGraph: {
    title: "Skill Market Cap",
    description:
      "Which skills appear most often across live roles at high-potential companies, ranked from real job-board data.",
    url: "https://skillmarketcap.com",
    siteName: "Skill Market Cap",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Market Cap",
    description: "Live skill demand, computed from real job boards, not opinion.",
  },
};

// Real entities only. Organization.sameAs points at skill.supply, the only
// other official property linked from this site (nav, footer, and CTA in
// app/page.tsx): same author, same "Talent Trifecta" thesis, documented as
// kin in HANDOFF_FROM_SKILL_SUPPLY.md. No SearchAction: this site has no
// search feature to describe.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://skillmarketcap.com/#organization",
    name: "Skill Market Cap",
    url: "https://skillmarketcap.com",
    sameAs: ["https://skill.supply"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://skillmarketcap.com/#website",
    name: "Skill Market Cap",
    url: "https://skillmarketcap.com",
    description:
      "A live demand ranking of skills, computed hourly from the real roles published on public job boards.",
    publisher: { "@id": "https://skillmarketcap.com/#organization" },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
