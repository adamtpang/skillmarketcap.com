/**
 * US Bureau of Labor Statistics figures read from the official pages on 2026-11-06.
 * Employment Projections 2025-35 were released August 27, 2026:
 * https://www.bls.gov/emp/notices/2026/projections-release.htm
 *
 * Employment, percent growth, numeric change, and annual openings are the printed
 * National Employment Matrix figures. Table 1.10 prints employment in thousands
 * with one decimal. This file keeps that decimal. Convert with jobsFromThousands.
 * Do not replace the printed numeric change with 2035 employment minus 2025
 * employment: those rounded levels can disagree with the printed change by 0.1
 * thousand.
 *
 * Wages are May 2025 OEWS median annual wages for wage-and-salary workers.
 * They are not means, not total compensation, and not advertised band midpoints.
 * The May 15, 2026 OEWS news release prints mean annual wages that are higher.
 * Those means are not stored here.
 *
 * OOH whole-number percents are a second printed rounding. They are stored only
 * when that profile was opened. There is no SOC for Forward Deployed Engineer.
 */

export const OUTLOOK_CHECKED_ON = "2026-11-06";
export const PROJECTIONS_RELEASED_ON = "2026-08-27";
export const WAGE_REFERENCE = "May 2025";
export const OEWS_NEWS_RELEASED_ON = "2026-05-15";

export const OUTLOOK_SOURCES = {
  release: {
    label: "Employment Projections 2025-35 release notice",
    url: "https://www.bls.gov/emp/notices/2026/projections-release.htm",
  },
  table13: {
    label: "Table 1.3 Fastest growing occupations",
    url: "https://www.bls.gov/emp/tables/fastest-growing-occupations.htm",
  },
  table110: {
    label: "Table 1.10 Occupational separations and openings",
    url: "https://www.bls.gov/emp/tables/occupational-separations-and-openings.htm",
  },
  mostNewJobs: {
    label: "OOH most new jobs",
    url: "https://www.bls.gov/ooh/most-new-jobs.htm",
  },
  oews: {
    label: "OEWS news release, May 2025 reference period",
    url: "https://www.bls.gov/news.release/ocwage.htm",
  },
} as const;

export type OfficialOccupation = {
  id: string;
  title: string;
  soc: string;
  /** Printed EMP percent, one decimal. */
  growthPercent: number;
  /** Printed OOH whole-number percent. Null when that profile was not opened. */
  oohGrowthPercent: number | null;
  /** Printed 2025 employment, in thousands. */
  employment2025Thousands: number;
  /** Printed 2035 employment, in thousands. Not a substitute for numericChangeThousands. */
  employment2035Thousands: number;
  /** Printed numeric employment change, in thousands. */
  numericChangeThousands: number;
  /** Printed average annual openings, in thousands. Growth plus replacements. */
  openingsThousands: number;
  /** Printed May 2025 OEWS median annual wage, dollars. */
  medianAnnualWage: number;
  profileUrl: string;
  /** Group-page or title trap. Absent when the profile line is the same occupation. */
  caution?: string;
};

export const OFFICIAL_OCCUPATIONS: OfficialOccupation[] = [
  {
    id: "all-occupations",
    title: "All occupations",
    soc: "00-0000",
    growthPercent: 3.5,
    oohGrowthPercent: 3,
    employment2025Thousands: 170_280.8,
    employment2035Thousands: 176_198.5,
    numericChangeThousands: 5_917.6,
    openingsThousands: 17_461.8,
    medianAnnualWage: 50_980,
    profileUrl: OUTLOOK_SOURCES.table13.url,
  },
  {
    id: "nurse-practitioners",
    title: "Nurse practitioners",
    soc: "29-1171",
    growthPercent: 41.0,
    oohGrowthPercent: 41,
    employment2025Thousands: 336.3,
    employment2035Thousands: 474.1,
    numericChangeThousands: 137.8,
    openingsThousands: 29.4,
    medianAnnualWage: 132_300,
    profileUrl: "https://www.bls.gov/ooh/healthcare/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.htm",
    caution:
      "The OOH quick facts box covers nurse anesthetists, nurse midwives, and nurse practitioners together. That box prints median pay $134,920, a 36% outlook, employment change of 144,000, and about 32,200 openings. This row is nurse practitioners only.",
  },
  {
    id: "solar-photovoltaic-installers",
    title: "Solar photovoltaic installers",
    soc: "47-2231",
    growthPercent: 36.5,
    oohGrowthPercent: 37,
    employment2025Thousands: 31.1,
    employment2035Thousands: 42.4,
    numericChangeThousands: 11.3,
    openingsThousands: 4.2,
    medianAnnualWage: 53_140,
    profileUrl: "https://www.bls.gov/ooh/construction-and-extraction/solar-photovoltaic-installers.htm",
  },
  {
    id: "data-scientists",
    title: "Data scientists",
    soc: "15-2051",
    growthPercent: 34.6,
    oohGrowthPercent: 35,
    employment2025Thousands: 275.6,
    employment2035Thousands: 371.0,
    numericChangeThousands: 95.4,
    openingsThousands: 24.8,
    medianAnnualWage: 120_230,
    profileUrl: "https://www.bls.gov/ooh/math/data-scientists.htm",
  },
  {
    id: "wind-turbine-service-technicians",
    title: "Wind turbine service technicians",
    soc: "49-9081",
    growthPercent: 29.5,
    oohGrowthPercent: 30,
    employment2025Thousands: 11.8,
    employment2035Thousands: 15.3,
    numericChangeThousands: 3.5,
    openingsThousands: 1.5,
    medianAnnualWage: 64_120,
    profileUrl: "https://www.bls.gov/ooh/installation-maintenance-and-repair/wind-turbine-technicians.htm",
    caution:
      "The OOH page title is Wind Turbine Technicians. The matrix title for SOC 49-9081 is Wind turbine service technicians.",
  },
  {
    id: "medical-health-services-managers",
    title: "Medical and health services managers",
    soc: "11-9111",
    growthPercent: 24.2,
    oohGrowthPercent: 24,
    employment2025Thousands: 640.4,
    employment2035Thousands: 795.5,
    numericChangeThousands: 155.1,
    openingsThousands: 62.3,
    medianAnnualWage: 123_860,
    profileUrl: "https://www.bls.gov/ooh/management/medical-and-health-services-managers.htm",
  },
  {
    id: "computer-research-scientists",
    title: "Computer and information research scientists",
    soc: "15-1221",
    growthPercent: 21.8,
    oohGrowthPercent: 22,
    employment2025Thousands: 38.6,
    employment2035Thousands: 47.0,
    numericChangeThousands: 8.4,
    openingsThousands: 2.9,
    medianAnnualWage: 140_300,
    profileUrl: "https://www.bls.gov/ooh/computer-and-information-technology/computer-and-information-research-scientists.htm",
  },
  {
    id: "information-security-analysts",
    title: "Information security analysts",
    soc: "15-1212",
    growthPercent: 21.0,
    oohGrowthPercent: 21,
    employment2025Thousands: 192.9,
    employment2035Thousands: 233.4,
    numericChangeThousands: 40.6,
    openingsThousands: 14.1,
    medianAnnualWage: 129_180,
    profileUrl: "https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm",
  },
  {
    id: "home-health-aides",
    title: "Home health and personal care aides",
    soc: "31-1120",
    growthPercent: 18.1,
    oohGrowthPercent: 18,
    employment2025Thousands: 4_677.1,
    employment2035Thousands: 5_524.4,
    numericChangeThousands: 847.3,
    openingsThousands: 760.5,
    medianAnnualWage: 35_800,
    profileUrl: "https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm",
  },
  {
    id: "computer-information-systems-managers",
    title: "Computer and information systems managers",
    soc: "11-3021",
    growthPercent: 15.8,
    oohGrowthPercent: 16,
    employment2025Thousands: 685.8,
    employment2035Thousands: 793.9,
    numericChangeThousands: 108.1,
    openingsThousands: 53.5,
    medianAnnualWage: 175_140,
    profileUrl: "https://www.bls.gov/ooh/management/computer-and-information-systems-managers.htm",
  },
  {
    id: "software-developers",
    title: "Software developers",
    soc: "15-1252",
    growthPercent: 10.2,
    oohGrowthPercent: 10,
    employment2025Thousands: 1_717.8,
    employment2035Thousands: 1_892.6,
    numericChangeThousands: 174.7,
    openingsThousands: 95.3,
    medianAnnualWage: 135_980,
    profileUrl: "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",
    caution:
      "The OOH quick facts box adds software quality assurance analysts and testers (SOC 15-1253). That box prints median pay $134,040, employment change of 185,400, and about 106,100 openings. This row is software developers only. The May 2025 OEWS news release also prints a mean annual wage of $148,100 for software developers. The mean is not this median.",
  },
];

export const PAY_COMPARISONS = [
  {
    skillSlug: "software-engineering",
    occupationId: "software-developers",
    relationship:
      "Nearest national volume neighbor for software titles in this capture. The site row is a title pattern on these boards. SOC 15-1252 is a US occupation. The dollar gap is not a return to learning a skill.",
  },
  {
    skillSlug: "data-analytics",
    occupationId: "data-scientists",
    relationship:
      "The site row includes data analysts and data engineers as well as data scientists. SOC 15-2051 is data scientists only.",
  },
  {
    skillSlug: "security",
    occupationId: "information-security-analysts",
    relationship:
      "The site row matches several security titles. SOC 15-1212 is information security analysts.",
  },
] as const;

/** Printed thousands times 1,000. The source decimal is tenths of a thousand, so the result is nearest 100 jobs, not an exact headcount. */
export function jobsFromThousands(thousands: number): number {
  return Math.round(thousands * 1000);
}

export function occupationById(id: string): OfficialOccupation {
  const found = OFFICIAL_OCCUPATIONS.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown official occupation: ${id}`);
  return found;
}

export function rankedOccupations(
  key: "growthPercent" | "numericChangeThousands" | "openingsThousands" | "medianAnnualWage",
  options?: { includeBaseline?: boolean },
): OfficialOccupation[] {
  const rows = options?.includeBaseline === false
    ? OFFICIAL_OCCUPATIONS.filter((row) => row.id !== "all-occupations")
    : OFFICIAL_OCCUPATIONS;
  return [...rows].sort((a, b) => b[key] - a[key] || a.title.localeCompare(b.title));
}
