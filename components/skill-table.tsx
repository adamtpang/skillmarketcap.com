"use client";

import { useState } from "react";
import Link from "next/link";
import { Skill, SortColumn, SortDirection } from "@/lib/types";
import { formatSalary, formatNumber, formatPercentage, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SkillTableProps {
  skills: Skill[];
}

export function SkillTable({ skills: initialSkills }: SkillTableProps) {
  const [skills, setSkills] = useState(initialSkills);
  const [sortColumn, setSortColumn] = useState<SortColumn>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...skills].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (column.includes(".")) {
        const [key1, key2] = column.split(".");
        aVal = (a as any)[key1][key2];
        bVal = (b as any)[key1][key2];
      } else {
        aVal = (a as any)[column];
        bVal = (b as any)[column];
      }

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    setSkills(sorted);
  };

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
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("rank")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  #
                  {sortColumn === "rank" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Skill
                  {sortColumn === "name" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("marketScore")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Score
                  {sortColumn === "marketScore" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("avgSalary")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Avg Salary
                  {sortColumn === "avgSalary" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("jobOpenings")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Job Openings
                  {sortColumn === "jobOpenings" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                7d Trend
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("growthRate.week")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  7d %
                  {sortColumn === "growthRate.week" && (
                    sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Demand
              </th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr
                key={skill.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{skill.rank}</span>
                    {index > 0 && skill.rank < initialSkills[index].rank && (
                      <TrendingUp className="h-3 w-3 text-success" />
                    )}
                    {index > 0 && skill.rank > initialSkills[index].rank && (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <Link
                    href={`/skill/${skill.slug}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {skill.name}
                  </Link>
                  <div className="flex gap-1 mt-1">
                    {skill.category.slice(0, 2).map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <span className="font-semibold text-primary">
                    {skill.marketScore}
                  </span>
                </td>
                <td className="p-4 align-middle font-medium">
                  {formatSalary(skill.avgSalary)}
                </td>
                <td className="p-4 align-middle">
                  {formatNumber(skill.jobOpenings)}
                </td>
                <td className="p-4 align-middle">
                  <div className="h-8 w-24">
                    <svg width="100%" height="100%" viewBox="0 0 100 30">
                      <polyline
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        points={skill.trendData
                          .slice(-7)
                          .map((d, i) => {
                            const x = (i / 6) * 100;
                            const y = 30 - (d.salary / Math.max(...skill.trendData.slice(-7).map(t => t.salary))) * 30;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />
                    </svg>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div
                    className={cn(
                      "flex items-center gap-1 font-medium",
                      skill.growthRate.week > 0
                        ? "text-success"
                        : skill.growthRate.week < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                  >
                    {skill.growthRate.week > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : skill.growthRate.week < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {formatPercentage(Math.abs(skill.growthRate.week))}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <Badge variant={getDemandBadgeVariant(skill.demandLevel)}>
                    {skill.demandLevel}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
