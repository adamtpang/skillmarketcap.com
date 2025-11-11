"use client";

import { useState } from "react";
import { mockSkills } from "@/data/mockSkills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatSalary, formatNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Plus, X } from "lucide-react";

export default function ComparePage() {
  const [selectedSkills, setSelectedSkills] = useState<typeof mockSkills>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = mockSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedSkills.find(s => s.id === skill.id)
  );

  const addSkill = (skill: typeof mockSkills[0]) => {
    if (selectedSkills.length < 4) {
      setSelectedSkills([...selectedSkills, skill]);
      setSearchQuery("");
    }
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== skillId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Compare Skills</h1>
        <p className="text-muted-foreground text-lg">
          Compare up to 4 skills side-by-side
        </p>
      </div>

      {/* Search & Add Skills */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Skills to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && filteredSkills.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-card border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredSkills.slice(0, 10).map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => addSkill(skill)}
                      className="w-full text-left p-3 hover:bg-muted transition-colors flex items-center justify-between"
                    >
                      <span>{skill.name}</span>
                      <Plus className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map(skill => (
                  <Badge key={skill.id} variant="secondary" className="px-3 py-2">
                    {skill.name}
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedSkills.length > 0 ? (
        <div className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Metric</th>
                      {selectedSkills.map(skill => (
                        <th key={skill.id} className="text-left p-3 font-medium">
                          {skill.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">Rank</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3 font-semibold">#{skill.rank}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">Market Score</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3 font-bold text-primary">{skill.marketScore}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">Demand Level</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3">
                          <Badge variant={skill.demandLevel === 'High' ? 'success' : skill.demandLevel === 'Medium' ? 'secondary' : 'outline'}>
                            {skill.demandLevel}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Metric</th>
                      {selectedSkills.map(skill => (
                        <th key={skill.id} className="text-left p-3 font-medium">
                          {skill.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">Avg Salary</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3 font-bold">{formatSalary(skill.avgSalary)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">Min Salary</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3">{formatSalary(skill.salaryRange.min)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">Max Salary</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3">{formatSalary(skill.salaryRange.max)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Market Demand */}
          <Card>
            <CardHeader>
              <CardTitle>Market Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Metric</th>
                      {selectedSkills.map(skill => (
                        <th key={skill.id} className="text-left p-3 font-medium">
                          {skill.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">Job Openings</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3 font-semibold">{formatNumber(skill.jobOpenings)}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">7d Growth</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3">
                          <span className={skill.growthRate.week > 0 ? 'text-success font-semibold' : 'text-destructive font-semibold'}>
                            {skill.growthRate.week > 0 ? '+' : ''}{formatPercentage(skill.growthRate.week)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-muted-foreground">Year Growth</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="p-3">
                          <span className={skill.growthRate.year > 0 ? 'text-success font-semibold' : 'text-destructive font-semibold'}>
                            {skill.growthRate.year > 0 ? '+' : ''}{formatPercentage(skill.growthRate.year)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedSkills.map(skill => (
                  <div key={skill.id}>
                    <p className="font-medium mb-2">{skill.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.category.map(cat => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Select skills above to start comparing
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
