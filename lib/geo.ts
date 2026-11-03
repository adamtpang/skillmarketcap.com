/** Country labels taken only from posting fields. City names alone stay Unspecified. */

const ISO2: Record<string, string> = {
  AE: "United Arab Emirates", AR: "Argentina", AT: "Austria", AU: "Australia", BE: "Belgium",
  BG: "Bulgaria", BR: "Brazil", CA: "Canada", CH: "Switzerland", CL: "Chile", CN: "China",
  CO: "Colombia", CR: "Costa Rica", CY: "Cyprus", CZ: "Czechia", DE: "Germany", DK: "Denmark",
  EE: "Estonia", EG: "Egypt", ES: "Spain", FI: "Finland", FR: "France", GB: "United Kingdom",
  GH: "Ghana", GR: "Greece", HK: "Hong Kong", HR: "Croatia", HU: "Hungary", ID: "Indonesia",
  IE: "Ireland", IL: "Israel", IN: "India", IS: "Iceland", IT: "Italy", JP: "Japan", KE: "Kenya",
  KR: "South Korea", LT: "Lithuania", LU: "Luxembourg", LV: "Latvia", MX: "Mexico", MY: "Malaysia",
  NG: "Nigeria", NL: "Netherlands", NO: "Norway", NZ: "New Zealand", PE: "Peru", PH: "Philippines",
  PK: "Pakistan", PL: "Poland", PT: "Portugal", RO: "Romania", RS: "Serbia", SA: "Saudi Arabia",
  SE: "Sweden", SG: "Singapore", SI: "Slovenia", SK: "Slovakia", TH: "Thailand", TR: "Turkey",
  TW: "Taiwan", UA: "Ukraine", UK: "United Kingdom", US: "United States", UY: "Uruguay",
  VN: "Vietnam", ZA: "South Africa",
};

const COUNTRY_NAMES = [
  "United Arab Emirates", "United Kingdom", "United States of America", "United States",
  "South Africa", "South Korea", "New Zealand", "Saudi Arabia", "Czech Republic", "Czechia",
  "Hong Kong", "Costa Rica", "Puerto Rico", "Dominican Republic", "El Salvador",
  "Bosnia and Herzegovina", "North Macedonia", "Trinidad and Tobago",
  "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Bulgaria", "Canada", "Chile",
  "China", "Colombia", "Croatia", "Cyprus", "Denmark", "Egypt", "Estonia", "Finland",
  "France", "Germany", "Ghana", "Greece", "Hungary", "Iceland", "India", "Indonesia",
  "Ireland", "Israel", "Italy", "Japan", "Kenya", "Latvia", "Lithuania", "Luxembourg",
  "Malaysia", "Mexico", "Netherlands", "Nigeria", "Norway", "Pakistan", "Peru",
  "Philippines", "Poland", "Portugal", "Romania", "Serbia", "Singapore", "Slovakia",
  "Slovenia", "Spain", "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey", "Türkiye",
  "Ukraine", "Uruguay", "Vietnam", "Viet Nam",
  "England", "Scotland", "Wales", "Northern Ireland", "Great Britain",
].sort((a, b) => b.length - a.length);

const NAME_TO_COUNTRY: Record<string, string> = {
  "united states of america": "United States",
  "united states": "United States",
  "usa": "United States",
  "u.s.a.": "United States",
  "u.s.": "United States",
  "us": "United States",
  "united kingdom": "United Kingdom",
  "great britain": "United Kingdom",
  "uk": "United Kingdom",
  "u.k.": "United Kingdom",
  "england": "United Kingdom",
  "scotland": "United Kingdom",
  "wales": "United Kingdom",
  "northern ireland": "United Kingdom",
  "czech republic": "Czechia",
  "czechia": "Czechia",
  "viet nam": "Vietnam",
  "türkiye": "Turkey",
  "republic of korea": "South Korea",
  "korea, republic of": "South Korea",
};

for (const name of COUNTRY_NAMES) {
  const key = name.toLowerCase();
  if (!NAME_TO_COUNTRY[key]) NAME_TO_COUNTRY[key] = name;
}

const US_STATE =
  /\b(AL|AK|AZ|AR|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY)\b/;

const US_STATE_NAME =
  /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|west virginia|wisconsin|wyoming|district of columbia)\b/i;

const CA_PROVINCE = /\b(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)\b/;
const CA_PROVINCE_NAME =
  /\b(alberta|british columbia|manitoba|new brunswick|newfoundland|nova scotia|ontario|prince edward island|quebec|québec|saskatchewan|yukon|northwest territories|nunavut)\b/i;

const REMOTE_ONLY =
  /^(remote|hybrid|anywhere|worldwide|global|emea|apac|latam|americas|north america|europe|asia|africa|multiple locations?|various|flexible)$/i;

export function countryFromCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const cleaned = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cleaned)) return null;
  return ISO2[cleaned] ?? null;
}

export function countryFromName(value: string | null | undefined): string | null {
  if (!value) return null;
  const key = value.trim().toLowerCase().replace(/\./g, "");
  if (NAME_TO_COUNTRY[key]) return NAME_TO_COUNTRY[key];
  const dotted = value.trim().toLowerCase();
  return NAME_TO_COUNTRY[dotted] ?? null;
}

function countryInSegment(segment: string): string | "remote" | null {
  const text = segment.trim();
  if (!text) return null;
  if (REMOTE_ONLY.test(text)) return "remote";
  const lower = text.toLowerCase();
  for (const name of COUNTRY_NAMES) {
    const needle = name.toLowerCase();
    if (lower.includes(needle)) return NAME_TO_COUNTRY[needle] ?? name;
  }
  if (/\b(usa|u\.s\.a\.|u\.s\.|uk|u\.k\.)\b/i.test(text)) {
    if (/\b(uk|u\.k\.)\b/i.test(text)) return "United Kingdom";
    return "United States";
  }
  if (US_STATE.test(text) || US_STATE_NAME.test(text)) return "United States";
  if (CA_PROVINCE.test(text) || CA_PROVINCE_NAME.test(text)) return "Canada";
  if (/^remote\b/i.test(text)) {
    const rest = text.replace(/^remote\b[\s,:-]*/i, "");
    if (!rest) return "remote";
    return countryInSegment(rest);
  }
  return null;
}

/** Parse a free-text location. Unresolved places stay Unspecified. Disagreeing countries are Multiple. */
export function countryFromLocation(location: string | null | undefined): string {
  if (!location || !location.trim()) return "Unspecified";
  const segments = location.split(/\s*(?:\||;|\bor\b|\/)\s*/i).map((part) => part.trim()).filter(Boolean);
  const found = new Set<string>();
  let unresolved = false;
  for (const segment of segments.length ? segments : [location]) {
    const country = countryInSegment(segment);
    if (country === "remote" || country === null && REMOTE_ONLY.test(segment)) continue;
    if (!country) unresolved = true;
    else found.add(country);
  }
  if (found.size > 1) return "Multiple";
  if (found.size === 1 && !unresolved) return [...found][0];
  if (found.size === 1 && unresolved) return "Unspecified";
  return "Unspecified";
}

/** Structured country from the API wins. Otherwise read the location text. */
export function postingCountry(structured: string | null | undefined, location: string | null | undefined): string {
  const named = countryFromName(structured) ?? countryFromCode(structured);
  if (named) return named;
  return countryFromLocation(location);
}
