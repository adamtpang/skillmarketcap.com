import { mockSkills } from "@/data/mockSkills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TrendingUp, TrendingDown, Flame, Zap } from "lucide-react";
import { formatSalary, formatNumber, formatPercentage } from "@/lib/utils";

export default function TrendsPage() {
  // Sort skills by different metrics
  const topGainers = [...mockSkills]
    .sort((a, b) => b.growthRate.week - a.growthRate.week)
    .slice(0, 10);

  const topLosers = [...mockSkills]
    .sort((a, b) => a.growthRate.week - b.growthRate.week)
    .filter(s => s.growthRate.week < 0)
    .slice(0, 10);

  const emergingSkills = [...mockSkills]
    .sort((a, b) => b.growthRate.year - a.growthRate.year)
    .slice(0, 10);

  const highestPaying = [...mockSkills]
    .sort((a, b) => b.avgSalary - a.avgSalary)
    .slice(0, 10);

  const mostInDemand = [...mockSkills]
    .sort((a, b) => b.jobOpenings - a.jobOpenings)
    .slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Market Trends</h1>
        <p className="text-muted-foreground text-lg">
          Track the hottest and fastest-moving skills in the market
        </p>
      </div>

      {/* Top Gainers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-success" />
            Top Gainers (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topGainers.map((skill, index) => (
              <Link key={skill.id} href={`/skill/${skill.slug}`}>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                    <div>
                      <p className="font-semibold">{skill.name}</p>
                      <p className="text-sm text-muted-foreground">{formatSalary(skill.avgSalary)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="success" className="text-success">
                      +{formatPercentage(skill.growthRate.week)}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emerging Skills */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            Emerging Skills (Fastest Growing)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergingSkills.map((skill, index) => (
              <Link key={skill.id} href={`/skill/${skill.slug}`}>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                    <div>
                      <p className="font-semibold">{skill.name}</p>
                      <div className="flex gap-2 mt-1">
                        {skill.category.slice(0, 2).map(cat => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="success">
                      +{formatPercentage(skill.growthRate.year)} YoY
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Highest Paying */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-secondary" />
              Highest Paying Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highestPaying.map((skill, index) => (
                <Link key={skill.id} href={`/skill/${skill.slug}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">{index + 1}</span>
                      <p className="font-medium">{skill.name.length > 25 ? skill.name.substring(0, 25) + '...' : skill.name}</p>
                    </div>
                    <p className="font-bold text-primary">{formatSalary(skill.avgSalary)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most In Demand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-accent" />
              Most In-Demand Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostInDemand.map((skill, index) => (
                <Link key={skill.id} href={`/skill/${skill.slug}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">{index + 1}</span>
                      <p className="font-medium">{skill.name.length > 25 ? skill.name.substring(0, 25) + '...' : skill.name}</p>
                    </div>
                    <p className="font-bold text-primary">{formatNumber(skill.jobOpenings)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Losers (if any) */}
      {topLosers.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-destructive" />
              Declining Skills (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLosers.map((skill, index) => (
                <Link key={skill.id} href={`/skill/${skill.slug}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                      <div>
                        <p className="font-semibold">{skill.name}</p>
                        <p className="text-sm text-muted-foreground">{formatSalary(skill.avgSalary)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="destructive" className="text-destructive-foreground">
                        {formatPercentage(skill.growthRate.week)}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
