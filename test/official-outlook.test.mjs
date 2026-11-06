import assert from "node:assert/strict";
import test from "node:test";
import { loadCaptureCensus } from "../lib/capture-census.ts";
import { formatPercentOf, formatUsd, SMALL_DISCLOSURE_COUNT } from "../lib/display.ts";
import {
  OFFICIAL_OCCUPATIONS,
  PAY_COMPARISONS,
  PROJECTIONS_RELEASED_ON,
  jobsFromThousands,
  rankedOccupations,
} from "../lib/official-outlook.ts";

test("projection vintage is the August 27, 2026 release and wages stay May 2025 medians", () => {
  assert.equal(PROJECTIONS_RELEASED_ON, "2026-08-27");
  assert.equal(OFFICIAL_OCCUPATIONS.some((row) => /fde|forward deployed/i.test(row.soc)), false);
  assert.equal(OFFICIAL_OCCUPATIONS.some((row) => "marketCap" in row), false);
  for (const row of OFFICIAL_OCCUPATIONS) {
    assert.match(row.soc, /^\d{2}-\d{4}$/);
    assert.equal(Number.isInteger(row.medianAnnualWage), true);
    assert.ok(row.profileUrl.startsWith("https://www.bls.gov/"));
  }
});

test("printed thousands convert without replacing the printed change", () => {
  assert.equal(jobsFromThousands(174.7), 174_700);
  assert.equal(jobsFromThousands(5_917.6), 5_917_600);
  assert.equal(jobsFromThousands(17_461.8), 17_461_800);
  assert.equal(jobsFromThousands(95.3), 95_300);
  assert.equal(jobsFromThousands(1.5), 1_500);
  const software = OFFICIAL_OCCUPATIONS.find((row) => row.soc === "15-1252");
  const total = OFFICIAL_OCCUPATIONS.find((row) => row.soc === "00-0000");
  const security = OFFICIAL_OCCUPATIONS.find((row) => row.soc === "15-1212");
  assert.equal(jobsFromThousands(software.employment2035Thousands - software.employment2025Thousands), 174_800);
  assert.equal(jobsFromThousands(software.numericChangeThousands), 174_700);
  assert.equal(jobsFromThousands(total.employment2035Thousands - total.employment2025Thousands), 5_917_700);
  assert.equal(jobsFromThousands(total.numericChangeThousands), 5_917_600);
  assert.equal(jobsFromThousands(security.employment2035Thousands - security.employment2025Thousands), 40_500);
  assert.equal(jobsFromThousands(security.numericChangeThousands), 40_600);
});

test("group quick facts and OEWS means are not stored as the occupation median", () => {
  const software = OFFICIAL_OCCUPATIONS.find((row) => row.soc === "15-1252");
  const nurse = OFFICIAL_OCCUPATIONS.find((row) => row.soc === "29-1171");
  assert.equal(software.medianAnnualWage, 135_980);
  assert.notEqual(software.medianAnnualWage, 134_040);
  assert.notEqual(software.medianAnnualWage, 148_100);
  assert.equal(software.oohGrowthPercent, 10);
  assert.equal(software.growthPercent, 10.2);
  assert.equal(jobsFromThousands(software.openingsThousands), 95_300);
  assert.equal(nurse.medianAnnualWage, 132_300);
  assert.equal(nurse.oohGrowthPercent, 41);
  assert.notEqual(nurse.medianAnnualWage, 134_920);
  assert.notEqual(nurse.growthPercent, 36);
});

test("percent growth, numeric change, openings, and wages rank different occupations", () => {
  const options = { includeBaseline: false };
  assert.equal(rankedOccupations("growthPercent", options)[0].soc, "29-1171");
  assert.equal(rankedOccupations("numericChangeThousands", options)[0].soc, "31-1120");
  assert.equal(rankedOccupations("openingsThousands", options)[0].soc, "31-1120");
  assert.equal(rankedOccupations("medianAnnualWage", options)[0].soc, "11-3021");
  assert.equal(rankedOccupations("numericChangeThousands")[0].soc, "00-0000");
  assert.notEqual(rankedOccupations("growthPercent", options)[0].soc, rankedOccupations("medianAnnualWage", options)[0].soc);
});

test("pay comparisons name neighbors and do not invent a premium", () => {
  for (const item of PAY_COMPARISONS) {
    assert.equal(OFFICIAL_OCCUPATIONS.some((row) => row.id === item.occupationId), true);
    assert.equal(/premium|market cap|causes/i.test(item.relationship), false);
  }
  assert.equal(PAY_COMPARISONS.some((item) => item.skillSlug === "ai-machine-learning"), false);
});

test("display rounding does not turn a small share or a dollar into a different headline", () => {
  assert.equal(formatPercentOf(417, 286_405), "0.1%");
  assert.equal(formatPercentOf(1_410, 286_405), "0.5%");
  assert.equal(formatPercentOf(29_884, 286_405), "10.4%");
  assert.equal(formatPercentOf(1, 286_405), "<0.1%");
  assert.equal(formatUsd(63_750), "$63,750");
  assert.equal(formatUsd(135_699), "$135,699");
  assert.equal(formatUsd(135_980), "$135,980");
  assert.equal(SMALL_DISCLOSURE_COUNT, 30);
});

test("capture census counts salary bands and exact forward deployed titles", () => {
  const census = loadCaptureCensus();
  assert.equal(census.postings, 286_405);
  assert.equal(census.compByProvider.ashby.comp, 14_420);
  assert.equal(census.compByProvider.lever.comp, 1_775);
  assert.equal(census.compByProvider.recruitee.comp, 167);
  assert.equal(census.compByProvider.greenhouse.comp, 0);
  assert.equal(census.compByProvider.workable.comp, 0);
  assert.equal(census.compByProvider.rippling.comp, 0);
  assert.equal(census.compByProvider.personio.comp, 0);
  assert.equal(census.exactForwardDeployedEngineer.postings, 271);
  assert.equal(census.exactForwardDeployedEngineer.boards, 213);
  assert.equal(census.forwardDeployedPhrase.postings, 1_332);
  assert.equal(census.forwardDeployedPhrase.boards, 539);
});
