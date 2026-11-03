type Job = { title: string; team: string | null; description?: string | null };

export type SkillCategory =
  | "Technical"
  | "Product"
  | "Business"
  | "Creative"
  | "Healthcare"
  | "Trades"
  | "Logistics"
  | "Education"
  | "Hospitality"
  | "Retail";

export type SkillDefinition = {
  slug: string;
  name: string;
  category: SkillCategory;
  source: "role" | "technical-requirements";
  pattern: RegExp;
};

const SOFTWARE_TITLE =
      /\b(software|frontend|front-end|backend|back-end|full[- ]stack|\bios\b|android|platform engineer|infrastructure engineer|machine learning engineer|member of technical staff|\bsre\b|site reliability|\bdeveloper\b|python|typescript|javascript|\breact\b|softwareentwickler|développeur|developpeur|desarrollador|sviluppatore|ontwikkelaar)\b/i;

const NON_SOFTWARE_TITLE =
  /\b(sales engineer|field engineer|field service|manufacturing engineer|mechanical engineer|electrical engineer|civil engineer|chemical engineer|industrial engineer|construction|station engineer|maintenance engineer|hardware engineer|solutions engineer)\b/i;

export const SKILLS: SkillDefinition[] = [
  {
    slug: "software-engineering",
    name: "Software engineering",
    category: "Technical",
    source: "role",
    pattern: SOFTWARE_TITLE,
  },
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
    pattern:
      /\b(data science|data scientist|data engineer|data analyst|analytics engineer|business intelligence|bi engineer|product analyst)\b/i,
  },
  {
    slug: "backend-systems",
    name: "Backend systems",
    category: "Technical",
    source: "technical-requirements",
    pattern:
      /\b(backend|back-end|distributed systems?|api design|microservices?|databases?|postgres|mysql|golang|rust|java|c\+\+)\b/i,
  },
  {
    slug: "cloud-infrastructure",
    name: "Cloud and infrastructure",
    category: "Technical",
    source: "technical-requirements",
    pattern:
      /\b(cloud|aws|amazon web services|azure|gcp|google cloud|kubernetes|terraform|devops|site reliability|sre|platform engineer)\b/i,
  },
  {
    slug: "security",
    name: "Security",
    category: "Technical",
    source: "role",
    pattern:
      /\b(cybersecurity|security engineer|application security|information security|infosec|threat detection|red team|blue team|soc 2|iam)\b/i,
  },
  {
    slug: "typescript-javascript",
    name: "TypeScript and JavaScript",
    category: "Technical",
    source: "technical-requirements",
    pattern:
      /\b(typescript|javascript|node\.js|nodejs|react(?:\.js)?|next\.js|frontend|front-end|full[- ]stack)\b/i,
  },
  {
    slug: "engineering-disciplines",
    name: "Engineering disciplines",
    category: "Technical",
    source: "role",
    pattern:
      /\b(mechanical engineer|electrical engineer|civil engineer|chemical engineer|industrial engineer|manufacturing engineer|hardware engineer)\b/i,
  },
  {
    slug: "product-management",
    name: "Product management",
    category: "Product",
    source: "role",
    pattern:
      /\b(product manager|product management|product lead|product strategy|technical product|growth product)\b/i,
  },
  {
    slug: "product-design",
    name: "Product design",
    category: "Creative",
    source: "role",
    pattern:
      /\b(product design|product designer|ux|user experience|ui design|visual design|design systems?|brand design|creative director)\b/i,
  },
  {
    slug: "sales-gtm",
    name: "Sales and go-to-market",
    category: "Business",
    source: "role",
    pattern:
      /\b(sales|account executive|business development|go-to-market|\bgtm\b|partnerships?|verkäufer|verkaeufer|vendeur|vendeuse|vendedor|vendedora)\b/i,
  },
  {
    slug: "marketing",
    name: "Marketing",
    category: "Business",
    source: "role",
    pattern:
      /\b(marketing|brand manager|demand generation|growth marketing|product marketing|\bseo\b|communications manager)\b/i,
  },
  {
    slug: "customer-success",
    name: "Customer success and support",
    category: "Business",
    source: "role",
    pattern:
      /\b(customer success|customer support|customer service|customer experience|solutions? engineer|solutions? architect|technical support|implementation|professional services|call center|contact center)\b/i,
  },
  {
    slug: "operations",
    name: "Operations",
    category: "Business",
    source: "role",
    pattern:
      /\b(business operations|strategy and operations|chief of staff|program manager|program management|revenue operations|\brevops\b|operations manager|operations associate|procurement)\b/i,
  },
  {
    slug: "finance",
    name: "Finance",
    category: "Business",
    source: "role",
    pattern:
      /\b(finance|financial planning|fp&a|accounting|accountant|treasury|\btax\b|controller|audit|underwriter|actuary|loan officer|banker|financial analyst|bookkeeper|buchhalter|buchhalterin|comptable|contador|contadora|boekhouder)\b/i,
  },
  {
    slug: "legal-policy",
    name: "Legal and policy",
    category: "Business",
    source: "role",
    pattern:
      /\b(legal|lawyer|counsel|compliance|privacy|regulatory|government affairs|public affairs|public policy|policy manager|policy counsel|policy analyst)\b/i,
  },
  {
    slug: "people-recruiting",
    name: "People and recruiting",
    category: "Business",
    source: "role",
    pattern:
      /\b(recruiter|recruiting|talent acquisition|people operations|human resources|\bhr\b|compensation|total rewards|workplace)\b/i,
  },
  {
    slug: "office-administration",
    name: "Office and administration",
    category: "Business",
    source: "role",
    pattern:
      /\b(administrative assistant|executive assistant|office manager|receptionist|office administrator|\bsecretary\b|admin assistant|office coordinator)\b/i,
  },
  {
    slug: "nursing-clinical",
    name: "Nursing and clinical care",
    category: "Healthcare",
    source: "role",
    pattern:
      /\b(registered nurse|\bnurse\b|nursing|nurse practitioner|licensed practical nurse|\blpn\b|\brn\b|\bcna\b|clinical nurse|midwife|midwives|pflegefachkraft|krankenpfleger|krankenschwester|altenpfleger|infirmier|infirmière|infirmiere|enfermero|enfermera|verpleegkundige|enfermeiro|enfermeira)\b/i,
  },
  {
    slug: "allied-health",
    name: "Allied health and care",
    category: "Healthcare",
    source: "role",
    pattern:
      /\b(physician|surgeon|psychiatrist|psychologist|dentist|dental hygienist|pharmacist|pharmacy technician|physical therapist|occupational therapist|speech therapist|radiologist|sonographer|phlebotomist|medical assistant|paramedic|\bemt\b|caregiver|home health|patient care|veterinary|veterinarian|\barzt\b|ärztin|arztin|médecin|medecin|médico|medico)\b/i,
  },
  {
    slug: "skilled-trades",
    name: "Skilled trades and construction",
    category: "Trades",
    source: "role",
    pattern:
      /\b(electrician|plumber|hvac|welder|welding|carpenter|pipefitter|pipe fitter|millwright|diesel mechanic|automotive technician|auto technician|maintenance technician|lineman|boilermaker|sheet metal|solar installer|wind turbine|journeyman|construction manager|construction superintendent|crane operator|roofer|ironworker|scaffolder|heavy equipment operator|concrete finisher|\bforeman\b|elektriker|électricien|electricien|electricista|elettricista|elektricien|mechaniker|mécanicien|mecanicien|mecánico|mecanico)\b/i,
  },
  {
    slug: "logistics",
    name: "Logistics and supply chain",
    category: "Logistics",
    source: "role",
    pattern:
      /\b(warehouse|forklift|dispatcher|truck driver|delivery driver|\bcdl\b|supply chain|logistics|fulfillment|material handler|dock associate|courier|fleet manager|inventory associate|order picker|lagerist|lagerarbeiter|magasinier|almacenista|magazijnmedewerker|kraftfahrer|berufskraftfahrer|chauffeur|livreur|camionero)\b/i,
  },
  {
    slug: "education",
    name: "Education and training",
    category: "Education",
    source: "role",
    pattern:
      /\b(teacher|professor|lecturer|\binstructor\b|tutor|teaching assistant|faculty|academic advisor|special education|curriculum designer|school principal|lehrer|lehrerin|enseignant|enseignante|professeur|profesor|profesora|docente|leerkracht)\b/i,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing and production",
    category: "Trades",
    source: "role",
    pattern:
      /\b(production operator|machine operator|assembler|cnc machinist|manufacturing|plant manager|quality inspector|production supervisor|fabrication)\b/i,
  },
  {
    slug: "hospitality",
    name: "Hospitality and food service",
    category: "Hospitality",
    source: "role",
    pattern:
      /\b(koch|köchin|cuisinier|cuisinière|cocinero|cocinera|chef|cook|bartender|barista|housekeeper|housekeeping|hotel manager|restaurant manager|food service|sous chef|line cook|dishwasher)\b/i,
  },
  {
    slug: "retail",
    name: "Retail",
    category: "Retail",
    source: "role",
    pattern:
      /\b(retail associate|store manager|cashier|merchandiser|sales associate|store associate|retail manager)\b/i,
  },
];

const TECHNICAL_ROLE =
  /\b(engineer|engineering|developer|data scientist|research scientist|research engineer|site reliability|sre|architect|full[- ]stack|front[- ]end|back[- ]end|member of technical staff|softwareentwickler|développeur|developpeur|desarrollador|sviluppatore|ontwikkelaar)\b/i;

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
  if (skill.slug === "software-engineering") {
    if (!isTechnicalRole(job) || NON_SOFTWARE_TITLE.test(job.title)) return false;
    return SOFTWARE_TITLE.test(role);
  }
  if (skill.source === "role") return skill.pattern.test(role);
  if (!isTechnicalRole(job)) return false;
  return skill.pattern.test([role, job.description].filter(Boolean).join(" "));
}
