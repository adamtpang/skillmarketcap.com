type Job = { title: string; team: string | null; description?: string | null };

export type SkillDefinition = {
  slug: string;
  name: string;
  category: "Technical" | "Product" | "Business" | "Creative";
  source: "role" | "technical-requirements";
  pattern: RegExp;
};

export const SKILLS: SkillDefinition[] = [
  {
    slug: "ai-machine-learning",
    name: "AI and machine learning",
    category: "Technical",
    source: "role",
    pattern:
      /\b(ai|artificial intelligence|machine learning|deep learning|llm|large language model|model training|inference|pytorch|tensorflow|computer vision|nlp|evals?)\b/i,
  },
  {
    slug: "python",
    name: "Python",
    category: "Technical",
    source: "technical-requirements",
    pattern: /\bpython\b/i,
  },
  {
    slug: "data-analytics",
    name: "Data and analytics",
    category: "Technical",
    source: "role",
    pattern: /\b(data science|data scientist|data engineer|analytics|analyst|business intelligence|bi engineer|experimentation|a\/b test)\b/i,
  },
  {
    slug: "backend-systems",
    name: "Backend systems",
    category: "Technical",
    source: "technical-requirements",
    pattern: /\b(backend|back-end|distributed systems?|api design|microservices?|databases?|postgres|mysql|golang|rust|java|c\+\+)\b/i,
  },
  {
    slug: "cloud-infrastructure",
    name: "Cloud and infrastructure",
    category: "Technical",
    source: "technical-requirements",
    pattern: /\b(cloud|aws|amazon web services|azure|gcp|google cloud|kubernetes|terraform|devops|site reliability|sre|platform engineer)\b/i,
  },
  {
    slug: "security",
    name: "Security",
    category: "Technical",
    source: "role",
    pattern: /\b(cybersecurity|security engineer|application security|information security|infosec|threat detection|red team|blue team|soc 2|iam)\b/i,
  },
  {
    slug: "typescript-javascript",
    name: "TypeScript and JavaScript",
    category: "Technical",
    source: "technical-requirements",
    pattern: /\b(typescript|javascript|node\.js|nodejs|react(?:\.js)?|next\.js|frontend|front-end|full[- ]stack)\b/i,
  },
  {
    slug: "product-management",
    name: "Product management",
    category: "Product",
    source: "role",
    pattern: /\b(product manager|product management|product lead|product strategy|technical product|growth product)\b/i,
  },
  {
    slug: "product-design",
    name: "Product design",
    category: "Creative",
    source: "role",
    pattern: /\b(product design|product designer|ux|user experience|ui design|visual design|design systems?|brand design|creative director)\b/i,
  },
  {
    slug: "sales-gtm",
    name: "Sales and go-to-market",
    category: "Business",
    source: "role",
    pattern: /\b(sales|account executive|business development|go-to-market|\bgtm\b|demand generation|growth marketing|product marketing|partnerships?)\b/i,
  },
  {
    slug: "customer-success",
    name: "Customer success and support",
    category: "Business",
    source: "role",
    pattern: /\b(customer success|customer support|customer experience|solutions? engineer|solutions? architect|technical support|implementation|professional services)\b/i,
  },
  {
    slug: "operations",
    name: "Operations",
    category: "Business",
    source: "role",
    pattern: /\b(operations|business operations|strategy and operations|chief of staff|program manager|program management|procurement|supply chain)\b/i,
  },
  {
    slug: "finance",
    name: "Finance",
    category: "Business",
    source: "role",
    pattern: /\b(finance|financial planning|fp&a|accounting|accountant|treasury|tax|controller|audit)\b/i,
  },
  {
    slug: "legal-policy",
    name: "Legal and policy",
    category: "Business",
    source: "role",
    pattern: /\b(legal|lawyer|counsel|compliance|privacy|policy|regulatory|government affairs|public affairs)\b/i,
  },
  {
    slug: "people-recruiting",
    name: "People and recruiting",
    category: "Business",
    source: "role",
    pattern: /\b(recruiter|recruiting|talent acquisition|people operations|human resources|\bhr\b|compensation|total rewards|workplace)\b/i,
  },
];

const TECHNICAL_ROLE =
  /\b(engineer|engineering|developer|data scientist|research scientist|research engineer|site reliability|sre|architect|full[- ]stack|front[- ]end|back[- ]end|member of technical staff)\b/i;

// A team's name describes its context, not the employee's occupation.
const NON_TECHNICAL_TITLE =
  /\b(account executive|recruiter|recruiting|product manager|product management|product marketing|demand planning|counsel|accountant|business development)\b/i;

export function isTechnicalRole(job: Job): boolean {
  return TECHNICAL_ROLE.test(job.title) && !NON_TECHNICAL_TITLE.test(job.title);
}

export function roleText(job: Job): string {
  return [job.title, job.team].filter(Boolean).join(" ");
}

/** Median of an already-sorted list. Null on empty: no disclosure, no number. */
export function median(sorted: number[]): number | null {
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  const upper = sorted[mid] ?? 0;
  return sorted.length % 2 === 1 ? upper : Math.round(((sorted[mid - 1] ?? 0) + upper) / 2);
}

export function matchesSkill(skill: SkillDefinition, job: Job): boolean {
  const role = roleText(job);
  if (skill.slug === "ai-machine-learning") {
    return isTechnicalRole(job) && skill.pattern.test(role);
  }
  if (skill.source === "role") return skill.pattern.test(role);
  if (!isTechnicalRole(job)) return false;
  return skill.pattern.test([role, job.description].filter(Boolean).join(" "));
}

