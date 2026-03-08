# Setup

## Prerequisites

- Node.js 23+
- pnpm 10+
- native `codex` CLI available on `PATH`
- one or more ChatGPT Business accounts for `codex login`

## Install

```bash
pnpm install
```

## Project Commands

```bash
pnpm test
pnpm --filter @codex-pool/dashboard dev
pnpm --filter @codex-pool/dashboard build
```

## Runtime Layout

Create and use a runtime root outside the repo:

```text
~/.codex-pool/
├── accounts/
├── logs/
├── state/
└── workspaces/
```

## Current Status

The repository currently includes:

- shared runtime config helpers
- SQLite-backed account repository
- workspace memory and handoff builder
- account selection logic
- minimal native `codex` launcher wrapper
- quota snapshot parser
- local Next.js dashboard skeleton with API routes

## Next Manual Step

The next implementation step is to add a real account registry under `~/.codex-pool`, then wire the launcher and dashboard routes to that runtime state instead of placeholder data.
