import { readFileSync } from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";

export type ProviderComp = { roles: number; comp: number };

export type CaptureCensus = {
  postings: number;
  compByProvider: Record<string, ProviderComp>;
  /** Title is exactly "Forward Deployed Engineer". Not a BLS occupation. */
  exactForwardDeployedEngineer: { postings: number; boards: number };
  /** Title contains the phrase "forward deployed", any capitalization. Includes non-engineer titles. */
  forwardDeployedPhrase: { postings: number; boards: number };
};

const EXACT_FDE_TITLE = "Forward Deployed Engineer";
const FDE_PHRASE = /forward deployed/i;

let cached: CaptureCensus | null = null;

export function loadCaptureCensus(): CaptureCensus {
  if (cached) return cached;
  const file = path.join(process.cwd(), "data/expanded-postings.jsonl.gz");
  const lines = gunzipSync(readFileSync(file)).toString("utf8").split("\n");
  const compByProvider: Record<string, ProviderComp> = {};
  const exactBoards = new Set<string>();
  const phraseBoards = new Set<string>();
  let postings = 0;
  let exactPostings = 0;
  let phrasePostings = 0;

  for (const line of lines) {
    if (!line) continue;
    const row = JSON.parse(line) as { provider?: string; title?: string; key?: string; compUsd?: number | null };
    postings += 1;
    const provider = row.provider ?? "unknown";
    const bucket = compByProvider[provider] ?? { roles: 0, comp: 0 };
    bucket.roles += 1;
    if (typeof row.compUsd === "number") bucket.comp += 1;
    compByProvider[provider] = bucket;
    const title = row.title ?? "";
    const board = row.key ?? "";
    if (title === EXACT_FDE_TITLE) {
      exactPostings += 1;
      exactBoards.add(board);
    }
    if (FDE_PHRASE.test(title)) {
      phrasePostings += 1;
      phraseBoards.add(board);
    }
  }

  cached = {
    postings,
    compByProvider,
    exactForwardDeployedEngineer: { postings: exactPostings, boards: exactBoards.size },
    forwardDeployedPhrase: { postings: phrasePostings, boards: phraseBoards.size },
  };
  return cached;
}
