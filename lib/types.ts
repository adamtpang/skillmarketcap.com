export interface Skill {
  id: string;
  rank: number;
  name: string;
  slug: string;
  category: string[];
  description: string;
  marketScore: number; // 0-100
  avgSalary: number;
  salaryRange: { min: number; max: number };
  jobOpenings: number;
  growthRate: {
    day: number;
    week: number;
    month: number;
    year: number;
  };
  demandLevel: 'High' | 'Medium' | 'Low';
  trendData: { date: string; salary: number; openings: number }[];
  relatedSkills: string[];
  topCompanies: string[];
  learningResources?: { name: string; url: string }[];
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  skillCount: number;
}

export type SortColumn =
  | 'rank'
  | 'name'
  | 'marketScore'
  | 'avgSalary'
  | 'jobOpenings'
  | 'growthRate.day'
  | 'growthRate.week'
  | 'growthRate.month'
  | 'growthRate.year';

export type SortDirection = 'asc' | 'desc';

export type TimePeriod = '24h' | '7d' | '30d' | '1y' | 'all';

export type ViewMode = 'all' | 'tech' | 'soft' | 'creative' | 'business';
