/**
 * Live roles, pulled from each company's PUBLIC applicant-tracking board.
 * Greenhouse and Ashby both publish an open job-board API, so this is real
 * inventory from public endpoints. We cache the small
 * normalized result hourly, not the multi-megabyte provider response.
 */

import { unstable_cache } from "next/cache";
import type { Job } from "./job-normalization";
import { loadBoard } from "./job-loader";
export { loadBoard } from "./job-loader";
export type { Job } from "./job-normalization";

export { BOARDS } from "./boards";

const REVALIDATE = 3600; // an hour is fresh enough for a job board

async function loadJobs(slug: string, includeDescriptions: boolean): Promise<Job[]> {
  const result = await loadBoard(slug);
  return result.jobs.map(job => includeDescriptions ? job : { ...job, description: null });
}

const fetchCachedJobs = unstable_cache(
  async (slug: string) => loadJobs(slug, false),
  ["public-job-boards-v4"],
  { revalidate: REVALIDATE, tags: ["public-job-boards"] }
);

export async function fetchJobs(slug: string): Promise<Job[]> {
  return fetchCachedJobs(slug);
}

/** Used only inside the cached skill-market aggregation. */
export async function fetchJobsWithDescriptions(slug: string): Promise<Job[]> {
  return loadJobs(slug, true);
}

/** Open-role counts for the whole directory, fetched in parallel. */
export async function fetchJobCounts(slugs: string[]): Promise<Record<string, number>> {
  const entries = await Promise.all(
    slugs.map(async (slug) => [slug, (await fetchJobs(slug)).length] as const)
  );
  return Object.fromEntries(entries);
}
