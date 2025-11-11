import { mockSkills } from "@/data/mockSkills";
import { SkillSearch } from "@/components/skill-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatSalary } from "@/lib/utils";
import { TrendingUp, Briefcase, DollarSign, Target } from "lucide-react";

export default function Home() {
  const totalSkills = mockSkills.length;
  const avgSalary =
    mockSkills.reduce((sum, skill) => sum + skill.avgSalary, 0) / totalSkills;
  const totalJobs = mockSkills.reduce(
    (sum, skill) => sum + skill.jobOpenings,
    0
  );
  const highDemandSkills = mockSkills.filter(
    (s) => s.demandLevel === "High"
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          Professional Skills Market Rankings
        </h1>
        <p className="text-muted-foreground text-lg">
          Track salaries, job openings, and demand for the most valuable professional skills
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills Tracked</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSkills}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSalary(avgSalary)}</div>
            <p className="text-xs text-muted-foreground">
              Mean across all skills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Openings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalJobs)}</div>
            <p className="text-xs text-muted-foreground">
              Active positions globally
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Demand Skills</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highDemandSkills}</div>
            <p className="text-xs text-muted-foreground">
              Skills in high demand
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Rankings Table with Search */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Top Skills by Market Score</h2>
        <SkillSearch skills={mockSkills} />
      </div>
    </div>
  );
}
