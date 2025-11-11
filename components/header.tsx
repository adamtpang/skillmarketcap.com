import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkillMarketCap
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Rankings
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/trends"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Trends
            </Link>
            <Link
              href="/compare"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Compare
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
