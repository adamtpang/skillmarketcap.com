"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Skill } from "@/lib/types";
import { SkillTable } from "@/components/skill-table";

interface SkillSearchProps {
  skills: Skill[];
}

export function SkillSearch({ skills }: SkillSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    skills.forEach(skill => {
      skill.category.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [skills]);

  // Filter skills based on search and categories
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategories.length === 0 ||
        skill.category.some(cat => selectedCategories.includes(cat));

      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategories.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search skills by name, category, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filter by Category</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allCategories.map(category => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => toggleCategory(category)}
            >
              {category}
              {selectedCategories.includes(category) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredSkills.length} of {skills.length} skills
        </span>
        {hasActiveFilters && (
          <span className="text-primary font-medium">
            {selectedCategories.length > 0 && `${selectedCategories.length} categories selected`}
          </span>
        )}
      </div>

      {/* Skills Table */}
      {filteredSkills.length > 0 ? (
        <SkillTable skills={filteredSkills} />
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No skills found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={clearFilters}
            className="text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
