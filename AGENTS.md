<!-- BEGIN:imported-claude-context -->
@AGENTS.md

Read `HANDOFF_FROM_SKILL_SUPPLY.md` first if you are picking this up
cold. It explains why this repo exists, what came with it, and what was
deliberately left behind.

Read `ECOSYSTEM.md` in skill.supply for the Talent Trifecta constitution.
This repo is the demand-side measurement layer of that same thesis.

## Scaffold provenance (standing rule: start from a template)

This repo was NOT hand-scaffolded from an empty directory. It was
extracted from `skill.supply` on 2026-08-15, carrying that repo's
already-shipped, production-proven Next.js 16 + React 19 + Tailwind v4
configuration (tsconfig, next.config.ts, postcss, eslint, globals.css
design tokens) plus the three library files the feature actually needs.
Source: https://github.com/adamtpang/skill.supply

That satisfies the workspace rule of starting from an established base
rather than a fresh hand-rolled scaffold, and it keeps design-system
parity with the sibling site for free.

## Hard rules inherited from the fleet

- **No em dashes** anywhere: code, copy, docs, or model output.
- **Never invent a number.** Every figure on the page traces to a real
  job board response. The "how the score works" section explicitly names
  what is NOT measured (salary, trends); do not quietly add either
  without the real data behind it.
- **Never guess an ATS slug.** `lib/jobs.ts` BOARDS entries must be
  verified against the live API before being committed.
<!-- END:imported-claude-context -->
<!-- BEGIN:claude-chat-continuation -->
Claude chat continuation: read `CODEX_CONTINUE_FROM_CLAUDE.md` to resume from the latest local Claude Code sessions for this project.
<!-- END:claude-chat-continuation -->
<!-- BEGIN:grok-chat-continuation -->
Grok chat continuation: read `GROK_CONTINUE_FROM_CLAUDE.md` and/or `GROK_CONTINUE_FROM_CODEX.md` when resuming in Grok. Refresh with `node .grok/sync-to-grok.js` from Aether root.
<!-- END:grok-chat-continuation -->
Read `HANDOFF_FROM_SKILL_SUPPLY.md` first when picking this up cold: it
explains why this repo was split out of skill.supply, what came with it,
what was left behind, and the one real gotcha (lib/companies.ts and
lib/jobs.ts are duplicated across both repos on purpose and will drift).

Read `ECOSYSTEM.md` in skill.supply for the Talent Trifecta constitution.
This repo is the demand-side measurement layer of that thesis.

Hard rules: no em dashes anywhere; never invent a number on the page;
never guess an ATS board slug, verify it against the live API first.
