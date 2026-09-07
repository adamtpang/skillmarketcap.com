import { BOARDS } from './boards.ts';
import { normalizeBoard } from './pipeline.mjs';
import type { Job } from './job-normalization.ts';

export type BoardResult = {
  company: string;
  status: 'ok' | 'failed';
  url: string | null;
  fetchedAt: string;
  jobs: Job[];
  error?: string;
};

export async function loadBoard(slug: string, fetcher: typeof fetch = fetch): Promise<BoardResult> {
  const board = BOARDS[slug];
  const url = !board ? null : board.provider === 'greenhouse'
    ? `https://boards-api.greenhouse.io/v1/boards/${board.board}/jobs?content=true`
    : `https://api.ashbyhq.com/posting-api/job-board/${board.board}?includeCompensation=true`;
  try {
    if (!board || !url) throw new Error('Board not configured');
    const response = await fetcher(url, { cache:'no-store',signal:AbortSignal.timeout(15000),headers:{'user-agent':'skillmarketcap.com'} });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const {jobs} = normalizeBoard(await response.json(),{company:slug,...board});
    return {company:slug,status:'ok',url,fetchedAt:new Date().toISOString(),jobs};
  } catch (error) {
    return {company:slug,status:'failed',url,fetchedAt:new Date().toISOString(),jobs:[],error:error instanceof Error ? error.message : 'Source read failed'};
  }
}
