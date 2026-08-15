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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
