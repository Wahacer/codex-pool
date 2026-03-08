import { mkdtemp, readdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { ensureRuntimeLayout } from "./bootstrap";

describe("ensureRuntimeLayout", () => {
  it("creates the runtime root directories", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-bootstrap-"));

    await ensureRuntimeLayout(runtimeRoot);

    expect((await readdir(runtimeRoot)).sort()).toEqual([
      "accounts",
      "logs",
      "state",
      "workspaces",
    ]);
  });
});
