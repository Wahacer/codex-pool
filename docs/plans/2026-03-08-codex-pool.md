# Codex Pool Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a local-first multi-account Codex launcher and dashboard that uses native ChatGPT logins, preserves workspace continuity, and refreshes near-official quota snapshots from authenticated browser profiles.

**Architecture:** Use a pnpm TypeScript workspace with a shared core package, a CLI launcher, and a local dashboard. Runtime auth and session state live under `~/.codex-pool`, while the repo stores source, tests, and docs only.

**Tech Stack:** pnpm workspace, TypeScript, Node.js, Next.js, better-sqlite3, Playwright, Zod, Vitest

---

### Task 1: Bootstrap workspace and shared tooling

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `apps/dashboard/package.json`
- Create: `apps/cli/package.json`
- Create: `packages/core/package.json`
- Create: `packages/shared/package.json`
- Test: `package.json`

**Step 1: Write the failing setup check**

```json
{
  "scripts": {
    "check:workspace": "pnpm -r --if-present exec node -e \"console.log('workspace-ok')\""
  }
}
```

**Step 2: Run test to verify it fails**

Run: `pnpm check:workspace`
Expected: FAIL because workspace files do not exist yet.

**Step 3: Write minimal implementation**

```yaml
packages:
  - apps/*
  - packages/*
```

**Step 4: Run test to verify it passes**

Run: `pnpm install && pnpm check:workspace`
Expected: PASS with `workspace-ok` output from each package.

**Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore apps/dashboard/package.json apps/cli/package.json packages/core/package.json packages/shared/package.json
git commit -m "chore: bootstrap codex-pool workspace"
```

### Task 2: Add runtime path helpers and config schema

**Files:**
- Create: `packages/shared/src/runtime-paths.ts`
- Create: `packages/shared/src/config.ts`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/config.test.ts`
- Modify: `packages/shared/package.json`
- Test: `packages/shared/src/config.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { getRuntimeRoot, parseAccountConfig } from "./config";

describe("config", () => {
  it("resolves runtime root under home directory", () => {
    expect(getRuntimeRoot("/Users/demo")).toBe("/Users/demo/.codex-pool");
  });

  it("parses account config labels", () => {
    expect(parseAccountConfig({ label: "work-a" }).label).toBe("work-a");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @codex-pool/shared test -- config.test.ts`
Expected: FAIL because the files are missing.

**Step 3: Write minimal implementation**

```ts
export function getRuntimeRoot(homeDir: string) {
  return `${homeDir}/.codex-pool`;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @codex-pool/shared test -- config.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/shared/package.json packages/shared/src
git commit -m "feat: add shared runtime config helpers"
```

### Task 3: Implement SQLite schema and account repository

**Files:**
- Create: `packages/core/src/db/schema.ts`
- Create: `packages/core/src/db/client.ts`
- Create: `packages/core/src/accounts/repository.ts`
- Create: `packages/core/src/accounts/repository.test.ts`
- Create: `packages/core/src/index.ts`
- Modify: `packages/core/package.json`
- Test: `packages/core/src/accounts/repository.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { createTestRepository } from "./repository";

describe("account repository", () => {
  it("stores and reads account status", () => {
    const repo = createTestRepository();
    repo.upsertAccount({ id: "a", label: "work-a", status: "available" });
    expect(repo.listAccounts()[0].status).toBe("available");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @codex-pool/core test -- repository.test.ts`
Expected: FAIL because no repository exists yet.

**Step 3: Write minimal implementation**

```ts
repo.upsertAccount({ id: "a", label: "work-a", status: "available" });
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @codex-pool/core test -- repository.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/package.json packages/core/src
git commit -m "feat: add sqlite-backed account repository"
```

### Task 4: Implement workspace memory and handoff persistence

**Files:**
- Create: `packages/core/src/workspaces/memory.ts`
- Create: `packages/core/src/workspaces/handoff.ts`
- Create: `packages/core/src/workspaces/handoff.test.ts`
- Test: `packages/core/src/workspaces/handoff.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { buildHandoff } from "./handoff";

describe("handoff", () => {
  it("includes goal and pending todo", () => {
    const handoff = buildHandoff({
      goal: "finish launcher",
      pendingTodos: ["write selector parser"],
    });
    expect(handoff.prompt).toContain("finish launcher");
    expect(handoff.prompt).toContain("write selector parser");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @codex-pool/core test -- handoff.test.ts`
Expected: FAIL because handoff builder is missing.

**Step 3: Write minimal implementation**

```ts
export function buildHandoff(input: { goal: string; pendingTodos: string[] }) {
  return {
    prompt: `Goal: ${input.goal}\nPending:\n- ${input.pendingTodos.join("\n- ")}`,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @codex-pool/core test -- handoff.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/workspaces
git commit -m "feat: add workspace memory and handoff persistence"
```

### Task 5: Implement account selection and cooldown logic

**Files:**
- Create: `packages/core/src/accounts/select-account.ts`
- Create: `packages/core/src/accounts/select-account.test.ts`
- Test: `packages/core/src/accounts/select-account.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { selectAccount } from "./select-account";

describe("selectAccount", () => {
  it("skips cooling-down accounts", () => {
    const selected = selectAccount([
      { id: "a", status: "cooling_down", cooldownUntil: "2099-01-01T00:00:00.000Z" },
      { id: "b", status: "available" },
    ]);
    expect(selected?.id).toBe("b");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @codex-pool/core test -- select-account.test.ts`
Expected: FAIL because selector logic does not exist.

**Step 3: Write minimal implementation**

```ts
export function selectAccount(accounts: Array<{ id: string; status: string }>) {
  return accounts.find((account) => account.status === "available") ?? null;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @codex-pool/core test -- select-account.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/accounts/select-account*
git commit -m "feat: add account selection logic"
```

### Task 6: Build CLI launcher around native codex

**Files:**
- Create: `apps/cli/src/main.ts`
- Create: `apps/cli/src/launch-codex.ts`
- Create: `apps/cli/src/launch-codex.test.ts`
- Modify: `apps/cli/package.json`
- Test: `apps/cli/src/launch-codex.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { buildLaunchEnv } from "./launch-codex";

describe("launch env", () => {
  it("sets CODEX_HOME to the selected account", () => {
    expect(buildLaunchEnv("/tmp/account-a").CODEX_HOME).toBe("/tmp/account-a");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @codex-pool/cli test -- launch-codex.test.ts`
Expected: FAIL because launcher code is missing.

**Step 3: Write minimal implementation**

```ts
export function buildLaunchEnv(codexHome: string) {
  return { ...process.env, CODEX_HOME: codexHome };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @codex-pool/cli test -- launch-codex.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/cli/package.json apps/cli/src
git commit -m "feat: add codex launcher cli"
```

### Task 7: Add official quota refresh collector

**Files:**
- Create: `packages/core/src/quota/collector.ts`
- Create: `packages/core/src/quota/parser.ts`
- Create: `packages/core/src/quota/parser.test.ts`
- Create: `packages/core/test/fixtures/quota-snapshot.html`
- Test: `packages/core/src/quota/parser.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { parseQuotaSnapshot } from "./parser";

describe("quota parser", () => {
  it("extracts five-hour percentage from official text", () => {
    const result = parseQuotaSnapshot("5-hour usage limit 91% remaining");
    expect(result.fiveHourRemainingPercent).toBe(91);
    expect(result.quality).toBe("official");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @codex-pool/core test -- parser.test.ts`
Expected: FAIL because parser code is missing.

**Step 3: Write minimal implementation**

```ts
export function parseQuotaSnapshot(input: string) {
  const match = input.match(/5-hour.*?(\\d+)%/i);
  return {
    fiveHourRemainingPercent: match ? Number(match[1]) : null,
    quality: match ? "official" : "unknown",
  };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @codex-pool/core test -- parser.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/quota packages/core/test/fixtures
git commit -m "feat: add official quota snapshot parser"
```

### Task 8: Expose local dashboard API and overview page

**Files:**
- Create: `apps/dashboard/app/page.tsx`
- Create: `apps/dashboard/app/api/accounts/route.ts`
- Create: `apps/dashboard/app/api/refresh/route.ts`
- Create: `apps/dashboard/components/account-table.tsx`
- Create: `apps/dashboard/app/page.test.tsx`
- Modify: `apps/dashboard/package.json`
- Test: `apps/dashboard/app/page.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import Page from "./page";

test("renders account overview heading", () => {
  render(<Page />);
  expect(screen.getByText("Codex Pool")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @codex-pool/dashboard test -- page.test.tsx`
Expected: FAIL because the page does not exist.

**Step 3: Write minimal implementation**

```tsx
export default function Page() {
  return <main><h1>Codex Pool</h1></main>;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @codex-pool/dashboard test -- page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/dashboard
git commit -m "feat: add dashboard overview and refresh api"
```

### Task 9: Wire manual account actions and switch events

**Files:**
- Create: `packages/core/src/events/repository.ts`
- Create: `apps/dashboard/app/api/accounts/[id]/disable/route.ts`
- Create: `apps/dashboard/app/api/accounts/[id]/enable/route.ts`
- Create: `apps/dashboard/app/api/switch/route.ts`
- Create: `packages/core/src/events/repository.test.ts`
- Test: `packages/core/src/events/repository.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { createEventRepository } from "./repository";

describe("event repository", () => {
  it("records switch events", () => {
    const repo = createEventRepository();
    repo.record({ type: "switch", reason: "manual" });
    expect(repo.list()[0].type).toBe("switch");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @codex-pool/core test -- repository.test.ts`
Expected: FAIL because event persistence does not exist.

**Step 3: Write minimal implementation**

```ts
repo.record({ type: "switch", reason: "manual" });
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @codex-pool/core test -- repository.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/events apps/dashboard/app/api/accounts apps/dashboard/app/api/switch
git commit -m "feat: add account control actions"
```

### Task 10: Add end-to-end smoke verification and setup docs

**Files:**
- Create: `docs/setup.md`
- Create: `docs/manual-test-checklist.md`
- Modify: `README.md`
- Test: `docs/manual-test-checklist.md`

**Step 1: Write the failing verification checklist**

```md
- [ ] add two ChatGPT Business accounts
- [ ] log each account into its browser profile
- [ ] launch codex through codex-pool
- [ ] refresh quota snapshot from dashboard
- [ ] switch account and verify handoff prompt appears
```

**Step 2: Run verification to verify it fails**

Run: `pnpm lint && pnpm test`
Expected: FAIL until earlier tasks are complete.

**Step 3: Write minimal implementation**

```md
# Setup

1. Install dependencies
2. Create accounts
3. Login browser profiles
4. Start dashboard
5. Launch codex through wrapper
```

**Step 4: Run verification to verify it passes**

Run: `pnpm lint && pnpm test`
Expected: PASS

**Step 5: Commit**

```bash
git add README.md docs/setup.md docs/manual-test-checklist.md
git commit -m "docs: add setup and manual verification guide"
```
