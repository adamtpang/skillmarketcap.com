/** One sector label per posting, from the title first and the team only when the title matches nothing. */

const SECTORS: Array<{ sector: string; pattern: RegExp }> = [
  {
    sector: "Healthcare",
    pattern:
      /\b(nurse|nursing|\brn\b|\blpn\b|\bcna\b|physician|surgeon|dentist|pharmacist|therapist|medical assistant|paramedic|caregiver|patient care|clinical|midwife|veterinary|pflegefachkraft|krankenpfleger|infirmier|enfermero|enfermera|arzt|médecin|medecin|medico)\b/i,
  },
  {
    sector: "Skilled trades",
    pattern:
      /\b(electrician|plumber|hvac|welder|carpenter|mechanic|millwright|maintenance technician|lineman|boilermaker|journeyman|construction|crane operator|roofer|foreman|elektriker|electricien|electricista|mechaniker)\b/i,
  },
  {
    sector: "Education",
    pattern: /\b(teacher|professor|lecturer|instructor|tutor|faculty|academic|curriculum|school|lehrer|enseignant|professeur|profesor|docente)\b/i,
  },
  {
    sector: "Hospitality",
    pattern: /\b(chef|cook|bartender|barista|housekeep|hotel|restaurant|food service|dishwasher|koch|cuisinier|cocinero)\b/i,
  },
  {
    sector: "Logistics",
    pattern:
      /\b(warehouse|forklift|dispatcher|driver|supply chain|logistics|fulfillment|courier|fleet|inventory|material handler)\b/i,
  },
  {
    sector: "Manufacturing",
    pattern: /\b(production|assembler|machinist|manufacturing|plant manager|fabrication|cnc)\b/i,
  },
  {
    sector: "Retail",
    pattern: /\b(retail|cashier|store manager|merchandis|store associate)\b/i,
  },
  {
    sector: "Finance",
    pattern:
      /\b(finance|accountant|accounting|treasury|controller|audit|underwriter|actuary|banker|bookkeeper|fp&a|buchhalter|comptable|contador)\b/i,
  },
  {
    sector: "Legal",
    pattern: /\b(legal|lawyer|counsel|compliance|attorney|regulatory)\b/i,
  },
  {
    sector: "People",
    pattern: /\b(recruiter|recruiting|talent acquisition|human resources|\bhr\b|people partner)\b/i,
  },
  {
    sector: "Sales",
    pattern: /\b(sales|account executive|business development|partnerships?)\b/i,
  },
  {
    sector: "Marketing",
    pattern: /\b(marketing|brand|\bseo\b|communications)\b/i,
  },
  {
    sector: "Administration",
    pattern: /\b(administrative assistant|executive assistant|receptionist|office manager|secretary)\b/i,
  },
  {
    sector: "Software",
    pattern:
      /\b(software|frontend|front-end|backend|back-end|full[- ]stack|developer|site reliability|\bsre\b|data scientist|data engineer|machine learning|security engineer|product engineer)\b/i,
  },
  {
    sector: "Creative",
    pattern: /\b(designer|design|ux|user experience|copywriter|video editor)\b/i,
  },
  {
    sector: "Operations",
    pattern: /\b(operations manager|business operations|chief of staff|program manager|procurement)\b/i,
  },
];

function matchSector(text: string): string | null {
  for (const { sector, pattern } of SECTORS) {
    if (pattern.test(text)) return sector;
  }
  return null;
}

export function sectorForRole(title: string, team: string | null): string {
  return matchSector(title) ?? (team ? matchSector(team) : null) ?? "Unspecified";
}

export function modeSector(sectors: string[]): string {
  const counts = new Map<string, number>();
  for (const sector of sectors) {
    if (sector === "Unspecified") continue;
    counts.set(sector, (counts.get(sector) ?? 0) + 1);
  }
  if (counts.size === 0) return "Unspecified";
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
}
