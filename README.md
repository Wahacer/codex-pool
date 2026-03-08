# codex-pool

Local-first orchestration for multi-account Codex CLI usage with:

- native `Sign in with ChatGPT` accounts
- workspace-level handoff and memory
- half-automatic official quota snapshots
- a local dashboard for account pool operations

## Commands

```bash
pnpm install
pnpm test
pnpm --filter @codex-pool/dashboard dev
pnpm --filter @codex-pool/dashboard build
```

## Current Modules

- `packages/shared`: runtime path and config helpers
- `packages/core`: account repository, selector, handoff, quota parser, events
- `apps/cli`: native `codex` launcher wrapper
- `apps/dashboard`: local Next.js dashboard and API routes

## Runtime State

Runtime state lives outside the repo in `~/.codex-pool`.

Recommended layout:

```text
~/.codex-pool/
├── accounts/
├── logs/
├── state/
└── workspaces/
```

## Current Scope

This repository currently provides the first working foundation:

- tested core packages
- a buildable dashboard shell
- a minimal launcher shell

The next milestone is wiring real runtime account state and browser-based quota refresh into the dashboard and launcher.
