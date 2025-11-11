import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillMarketCap - Track & Rank Professional Skills",
  description: "Track and analyze professional skills like cryptocurrencies. Real-time salary data, job openings, and market trends for tech and business skills.",
  keywords: ["skills", "salary", "job market", "tech skills", "career", "professional development"],
  authors: [{ name: "SkillMarketCap" }],
  openGraph: {
    title: "SkillMarketCap - Track & Rank Professional Skills",
    description: "Track and analyze professional skills like cryptocurrencies. Real-time salary data, job openings, and market trends.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillMarketCap - Track & Rank Professional Skills",
    description: "Track and analyze professional skills like cryptocurrencies.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  Built with Next.js & shadcn/ui. Skill data updated daily.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                  <span>•</span>
                  <a href="https://github.com" className="hover:text-primary transition-colors">
                    GitHub
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} className={className}>{children}</a>;
}
