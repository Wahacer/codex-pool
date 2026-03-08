# Codex Pool Design

Date: 2026-03-08

## Goal

Build a local-first system for heavy Codex CLI usage that keeps native ChatGPT Business login, rotates across multiple accounts, preserves workspace continuity with local handoff artifacts, and shows near-official quota information in a local web dashboard.

## Background

The user does not want:

- manual aliases such as `codex-a` / `codex-b`
- API-key-based relays or OpenAI Platform billing
- losing working context when switching accounts

The user does want:

- native `codex` usage with `Sign in with ChatGPT`
- multi-account rotation for Business-plan seats
- local dashboard visibility into account pool state
- a refresh action that can collect near-official quota information such as `5-hour usage 91% remaining`

## Constraints

- Local-only first. The first release runs on the user's Mac.
- No OpenAI API-key dependency.
- Each account keeps its own `CODEX_HOME` and OAuth/login state.
- Cross-account session resume is not available; continuity must be reconstructed locally.
- Official quota data has no documented public API for Codex CLI plan usage, so quota collection must come from authenticated browser-page snapshots plus local inference between snapshots.

## Non-Goals

- No hosted multi-user service in v1.
- No attempt to share a single OpenAI thread across accounts.
- No attempt to provide exact real-time quota data without refresh.
- No transparent OpenAI-compatible API relay.

## Recommended Architecture

Use a TypeScript pnpm workspace with three app surfaces:

1. `apps/cli`
   A local launcher that selects an account, prepares handoff context, and starts native `codex`.

2. `apps/dashboard`
   A local web UI for pool status, refresh actions, workspace memory inspection, and manual overrides.

3. `packages/core`
   Shared logic for account state, SQLite persistence, quota refresh orchestration, workspace memory, and event history.

The repo stores source code only. Runtime state lives under `~/.codex-pool`.

## Directory Layout

### Repo

```text
/Users/wahacer/codex-pool
├── apps/
│   ├── cli/
│   └── dashboard/
├── packages/
│   ├── core/
│   └── shared/
├── docs/
│   └── plans/
└── README.md
```

### Runtime

```text
/Users/wahacer/.codex-pool
├── accounts/
│   ├── account-a/
│   │   ├── browser-profile/
│   │   └── home/
│   └── account-b/
│       ├── browser-profile/
│       └── home/
├── workspaces/
│   └── <workspace-hash>/
│       ├── memory.md
│       ├── handoff.json
│       └── snapshots/
├── state/
│   └── pool.db
└── logs/
```

## State Model

### Account Layer

Per-account isolated assets:

- `CODEX_HOME`
- OAuth/login state
- per-account session index and history
- dedicated browser profile for quota collection

### Workspace Layer

Per-project assets independent of account:

- `memory.md` for long-lived project context
- `handoff.json` for the latest resumable work package
- optional snapshots for audits and debugging

### Control Layer

Shared local state:

- active account assignment
- rate-limit events
- cooldown estimates
- latest official quota snapshot
- refresh history

## Core Components

## 1. Account Registry

Tracks configured accounts and metadata:

- label
- `homePath`
- `browserProfilePath`
- status: `active`, `available`, `cooling_down`, `unknown`, `disabled`
- tags such as `reserved-openclaw`
- last quota sync result

## 2. Launcher Orchestrator

The user launches `codex-pool` instead of raw `codex`.

Flow:

1. Detect the current workspace path.
2. Resolve or create a workspace ID.
3. Load workspace memory and the latest handoff package.
4. Choose the best available account.
5. Set `CODEX_HOME` to the selected account.
6. Start native `codex` with an injected recovery prompt when needed.
7. Record session start and end events.
8. When a rate-limit signal is observed, persist the event, mark the account cooling down, and prepare a handoff package for the next account.

## 3. Handoff Builder

Generates a compact, deterministic recovery bundle for the next account:

- current objective
- last completed step
- files touched
- pending TODOs
- constraints and active skills
- reason for switch

This bundle is stored locally and injected into the next account as the initial prompt. This avoids depending on cross-account thread portability.

## 4. Quota Collector

Collects near-official quota data by using a dedicated browser profile per account.

Approach:

- Each account is logged into ChatGPT manually once in its own persistent browser profile.
- The dashboard exposes a `Refresh` action.
- Refresh launches or reuses an authenticated browser context and navigates to the relevant official page.
- The collector extracts visible quota text or structured values from the page.
- The raw extracted text is stored alongside parsed normalized fields.

Data quality levels:

- `official`: direct snapshot from the authenticated page
- `estimated`: locally inferred after a rate-limit event or between snapshots
- `unknown`: no usable recent data

Displayed dashboard fields:

- `5h remaining`
- `weekly status`
- `last official sync`
- `data quality`
- `cooldown estimate`

Because OpenAI does not expose a documented public API for this quota class, the collector must be selector-driven and resilient to page changes. The first release should keep the extraction layer configurable and log raw source text for debugging.

## 5. Dashboard

The local dashboard should expose four views.

### Overview

- active workspace
- active account
- number of available accounts
- last switch reason
- last official sync

### Accounts

- account label
- account status
- last official snapshot
- estimated cooldown
- browser-profile health
- manual enable/disable actions

### Workspace

- current `memory.md`
- latest `handoff.json`
- recent switch chain

### Events

- quota refreshes
- switch events
- rate-limit detections
- manual account overrides

## 6. Storage

Use SQLite for operational state and event logs.

Suggested tables:

- `accounts`
- `account_snapshots`
- `workspaces`
- `handoffs`
- `sessions`
- `events`

File-backed workspace artifacts remain on disk outside SQLite so they stay easy to inspect and edit manually.

## Rate-Limit and Switching Strategy

The first release should be conservative.

Detect switching triggers from:

- launcher-observed process failures
- explicit rate-limit text in captured output
- manual dashboard actions

Do not try to fully proxy every TUI byte in v1. That path is fragile and expensive to maintain.

Recommended switching behavior:

1. mark current account as cooling down
2. store handoff bundle
3. choose next available account
4. relaunch `codex` with recovery prompt
5. record the switch chain in SQLite

## Security

- Keep runtime auth material under `~/.codex-pool/accounts/*/home`.
- Never store account passwords in the repo.
- Store browser profiles locally only.
- Avoid syncing `~/.codex-pool` to cloud drives.
- Redact cookies, tokens, and raw session headers from logs.

## Error Handling

- If quota extraction fails, keep the previous official snapshot and mark the current check as failed.
- If no account is available, surface a clear dashboard and CLI message with next estimated recovery times.
- If workspace memory is missing or malformed, fall back to a minimal handoff prompt instead of blocking launch.
- If the browser profile is logged out, mark the account `needs_reauth` and guide the user to relogin manually.

## Testing Strategy

- Unit tests for account selection, cooldown logic, handoff generation, and snapshot normalization.
- Integration tests for SQLite persistence and launcher state transitions.
- Contract tests for quota parser logic using captured HTML/text fixtures.
- Smoke test for dashboard API endpoints.
- Manual verification for browser-profile login and official refresh.

## Technology Choices

- Package manager: pnpm
- Language: TypeScript
- Runtime: Node.js
- CLI: `tsx` during development, packaged Node CLI for use
- Storage: SQLite via `better-sqlite3`
- Dashboard server: Next.js App Router or Vite + local API server; recommendation is Next.js for a single-process local app
- Browser automation: Playwright with persistent contexts
- Validation: Zod
- Testing: Vitest

## Recommended Phases

### Phase 1

- bootstrap workspace
- SQLite schema
- account registry
- workspace memory and handoff storage

### Phase 2

- launcher orchestration
- account selection
- event logging

### Phase 3

- dashboard overview and accounts view
- manual enable/disable and switch actions

### Phase 4

- official quota refresh via browser profiles
- parsed snapshot display
- failure diagnostics

## Open Risks

- Official page selectors may change over time.
- Some quota values may only be exposed in authenticated UI flows that require extra navigation.
- Native Codex TUI behavior may vary between versions, so rate-limit detection should remain modular.

## Decision Summary

The project will not use API keys or API relays. It will keep native ChatGPT login per account, move continuity to a local workspace-memory layer, and use browser-assisted official snapshots for quota visibility.
