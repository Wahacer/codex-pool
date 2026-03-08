# Session Handoff

Date: 2026-03-08

## Current Repo State

- Branch: `codex/bootstrap`
- Core implementation baseline: `a1cf2cf`
- Remote branches `main` and `codex/bootstrap` were synced to the same core feature state before this handoff note.

## What Is Done

- Runtime bootstrap is implemented.
  - Creates `~/.codex-pool/accounts`, `logs`, `state`, `workspaces`
- Account manifest management is implemented.
  - Can create account directories and `account.json`
  - Can toggle account `disabled` state
- CLI account selection is implemented.
  - Launcher auto-selects the first enabled account from the runtime registry
- Dashboard now uses real local runtime state.
  - Create account from the dashboard
  - Show generated `CODEX_HOME`
  - Toggle `Enable` and `Disable`
  - Home page is dynamic, not statically frozen
- README and setup docs were updated to reflect the current workflow.

## Verified

- `pnpm test`
- `pnpm --filter @codex-pool/dashboard build`

Both passed after the local account management workflow was completed.

## Current Local Workflow

1. Start dashboard:

```bash
pnpm --filter @codex-pool/dashboard dev
```

2. Create one or more accounts in the dashboard.
3. For each account, log in with native ChatGPT auth:

```bash
CODEX_HOME=~/.codex-pool/accounts/<account-id>/home codex login
```

4. Use the launcher wrapper so it picks the first enabled account automatically.

## Highest-Priority Next Steps

1. Add a first-class CLI command for runtime bootstrap and account creation so account setup is not dashboard-only.
2. Wire `POST /api/refresh` and `POST /api/switch` to real state transitions instead of placeholder responses.
3. Add workspace-level handoff generation and injection during account switches.
4. Add browser-profile-based official quota snapshot collection later.

## Known Gaps

- No official quota snapshot collection yet.
- No automatic account switching on detected rate-limit events yet.
- No real handoff injection into new Codex sessions yet.
- `refresh` and `switch` routes are still stubs.

## Resume Pointers

- Runtime account logic:
  - `packages/core/src/runtime/account-manifest.ts`
  - `packages/core/src/runtime/bootstrap.ts`
- Dashboard routes:
  - `apps/dashboard/app/api/accounts/route.ts`
  - `apps/dashboard/app/api/accounts/[id]/enable/route.ts`
  - `apps/dashboard/app/api/accounts/[id]/disable/route.ts`
- Dashboard UI:
  - `apps/dashboard/app/page.tsx`
  - `apps/dashboard/components/account-table.tsx`
- Setup docs:
  - `README.zh-CN.md`
  - `docs/setup.md`
