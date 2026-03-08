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

The repository currently provides the first working foundation:

- tested core packages
- a buildable dashboard shell
- a minimal launcher shell

The next milestone is wiring real runtime account state and browser-based quota refresh into the dashboard and launcher.

## Acknowledgements

Thanks to `openai@gpt-5.4` for design and implementation assistance.
