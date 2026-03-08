# codex-pool

English | [简体中文](./README.zh-CN.md)

Local-first account pooling and context handoff for Codex CLI, with native ChatGPT login and a quota-aware dashboard.

## Overview

`codex-pool` is a local-first toolchain for heavy Codex CLI usage across multiple ChatGPT accounts.

It is being built around four core ideas:

- native `Sign in with ChatGPT` account usage
- workspace-level handoff and memory
- quota-aware local operations
- a local dashboard for account pool visibility and control

## Commands

```bash
pnpm install
pnpm test
pnpm --filter @codex-pool/dashboard dev
pnpm --filter @codex-pool/dashboard build
```

## Quick Start

1. Start the local dashboard with `pnpm --filter @codex-pool/dashboard dev`.
2. Create an account entry from the dashboard form.
3. Copy the generated `CODEX_HOME` path shown in the table.
4. Run `CODEX_HOME=/path/to/account/home codex login` for each account you want to enroll.
5. Launch Codex through the wrapper so it auto-selects an enabled account.

## Modules

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

The repository currently provides the core local workflow:

- tested runtime bootstrap and account manifest management
- a dashboard that can create accounts and toggle enable or disable state
- a launcher that auto-selects the first enabled local account

The next milestone is browser-based official quota snapshots and automatic handoff injection across account switches.

## Acknowledgements

Thanks to `openai@gpt-5.4` for design and implementation assistance.
