import { mockSkills } from "@/data/mockSkills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function CategoriesPage() {
  // Group skills by category
  const categoryMap = new Map<string, typeof mockSkills>();

  mockSkills.forEach(skill => {
    skill.category.forEach(cat => {
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(skill);
    });
  });

  const categories = Array.from(categoryMap.entries()).map(([name, skills]) => ({
    name,
    skills,
    avgSalary: skills.reduce((sum, s) => sum + s.avgSalary, 0) / skills.length,
    totalJobs: skills.reduce((sum, s) => sum + s.jobOpenings, 0),
    avgGrowth: skills.reduce((sum, s) => sum + s.growthRate.year, 0) / skills.length,
  })).sort((a, b) => b.skills.length - a.skills.length);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Skill Categories</h1>
        <p className="text-muted-foreground text-lg">
          Explore skills grouped by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name}</span>
                <Badge variant="secondary">{category.skills.length} skills</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Salary</p>
                  <p className="text-2xl font-bold">
                    ${Math.round(category.avgSalary / 1000)}k
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-xl font-semibold">
                    {(category.totalJobs / 1000).toFixed(1)}K
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Avg Growth</p>
                  <p className={`text-xl font-semibold flex items-center gap-1 ${category.avgGrowth > 0 ? 'text-success' : 'text-destructive'}`}>
                    <TrendingUp className="h-4 w-4" />
                    {category.avgGrowth > 0 ? '+' : ''}{category.avgGrowth.toFixed(1)}%
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Top Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.slice(0, 3).map(skill => (
                      <Link key={skill.id} href={`/skill/${skill.slug}`}>
                        <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                          {skill.name.length > 20 ? skill.name.substring(0, 20) + '...' : skill.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
