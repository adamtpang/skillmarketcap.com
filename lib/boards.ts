export type Board = { provider: "greenhouse" | "ashby"; board: string };

/** Verified live boards, keyed by company slug. */
export const BOARDS: Record<string, Board> = {
  anthropic: { provider: "greenhouse", board: "anthropic" },
  cursor: { provider: "ashby", board: "cursor" },
  ramp: { provider: "ashby", board: "ramp" },
  perplexity: { provider: "ashby", board: "perplexity" },
  linear: { provider: "ashby", board: "linear" },
  mercor: { provider: "ashby", board: "mercor" },
  "base-power": { provider: "ashby", board: "base-power" },
  saronic: { provider: "ashby", board: "saronic" },
  apptronik: { provider: "greenhouse", board: "apptronik" },
};

