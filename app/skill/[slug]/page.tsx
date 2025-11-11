import { mockSkills } from "@/data/mockSkills";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatSalary, formatNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Briefcase, DollarSign, Target, Users } from "lucide-react";
import Link from "next/link";
import { SkillChart } from "@/components/skill-chart";

export async function generateStaticParams() {
  return mockSkills.map((skill) => ({
    slug: skill.slug,
  }));
}

export default async function SkillDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = mockSkills.find((s) => s.slug === slug);

  if (!skill) {
    notFound();
  }

  const getDemandBadgeVariant = (level: string) => {
    switch (level) {
      case "High":
        return "success";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Rankings</Link>
        <span className="mx-2">/</span>
        <span>{skill.name}</span>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-muted-foreground">#{skill.rank}</span>
              <h1 className="text-4xl font-bold">{skill.name}</h1>
            </div>
            <p className="text-lg text-muted-foreground">{skill.description}</p>
          </div>
          <Badge variant={getDemandBadgeVariant(skill.demandLevel)} className="text-lg px-4 py-2">
            {skill.demandLevel} Demand
          </Badge>
        </div>

        <div className="flex gap-2 flex-wrap">
          {skill.category.map((cat) => (
            <Badge key={cat} variant="outline">
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{skill.marketScore}</div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatSalary(skill.avgSalary)}</div>
            <p className="text-xs text-muted-foreground">
              Range: {formatSalary(skill.salaryRange.min)} - {formatSalary(skill.salaryRange.max)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Openings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(skill.jobOpenings)}</div>
            <p className="text-xs text-muted-foreground">Active positions globally</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year Growth</CardTitle>
            {skill.growthRate.year > 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${skill.growthRate.year > 0 ? 'text-success' : 'text-destructive'}`}>
              {skill.growthRate.year > 0 ? '+' : ''}{formatPercentage(skill.growthRate.year)}
            </div>
            <p className="text-xs text-muted-foreground">Year-over-year growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Growth</p>
                <p className={`text-2xl font-bold ${skill.growthRate.day > 0 ? 'text-success' : 'text-destructive'}`}>
                  {skill.growthRate.day > 0 ? '+' : ''}{formatPercentage(skill.growthRate.day)}
                </p>
              </div>
              {skill.growthRate.day > 0 ? (
                <TrendingUp className="h-8 w-8 text-success" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">7d Growth</p>
                <p className={`text-2xl font-bold ${skill.growthRate.week > 0 ? 'text-success' : 'text-destructive'}`}>
                  {skill.growthRate.week > 0 ? '+' : ''}{formatPercentage(skill.growthRate.week)}
                </p>
              </div>
              {skill.growthRate.week > 0 ? (
                <TrendingUp className="h-8 w-8 text-success" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">30d Growth</p>
                <p className={`text-2xl font-bold ${skill.growthRate.month > 0 ? 'text-success' : 'text-destructive'}`}>
                  {skill.growthRate.month > 0 ? '+' : ''}{formatPercentage(skill.growthRate.month)}
                </p>
              </div>
              {skill.growthRate.month > 0 ? (
                <TrendingUp className="h-8 w-8 text-success" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Salary Trend (90 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillChart data={skill.trendData} />
        </CardContent>
      </Card>

      {/* Related Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Hiring Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {skill.topCompanies.map((company, index) => (
                <div key={company} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                  <span className="font-medium">{company}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Related Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skill.relatedSkills.map((relatedSkill) => {
                const related = mockSkills.find(s => s.name === relatedSkill);
                return related ? (
                  <Link key={relatedSkill} href={`/skill/${related.slug}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {relatedSkill}
                    </Badge>
                  </Link>
                ) : (
                  <Badge key={relatedSkill} variant="outline">
                    {relatedSkill}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Resources */}
      {skill.learningResources && skill.learningResources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {skill.learningResources.map((resource) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{resource.name}</span>
                    <span className="text-xs text-muted-foreground">External Link →</span>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
