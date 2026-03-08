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

Runtime state is created outside the repo under `~/.codex-pool`:

```text
~/.codex-pool/
├── accounts/
├── logs/
├── state/
└── workspaces/
```

## First Run

1. Start the dashboard:

```bash
pnpm --filter @codex-pool/dashboard dev
```

2. Create one or more account entries from the dashboard.
3. For each account, run `codex login` against the `CODEX_HOME` shown in the table.

```bash
CODEX_HOME=~/.codex-pool/accounts/work-a/home codex login
```

4. Keep disabled accounts out of rotation from the dashboard when needed.

## Current Status

The repository currently includes:

- runtime bootstrap and account manifest creation
- SQLite-backed account repository
- workspace memory and handoff builder
- account selection logic
- minimal native `codex` launcher wrapper with auto account selection
- quota snapshot parser
- local Next.js dashboard with real account create and enable/disable operations
