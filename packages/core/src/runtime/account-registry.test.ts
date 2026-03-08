import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { loadAccountRegistry } from "./account-registry";

describe("account registry", () => {
  it("loads account configs from the runtime accounts directory", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-"));
    const accountDir = join(runtimeRoot, "accounts", "work-a");

    await mkdir(accountDir, { recursive: true });
    await writeFile(
      join(accountDir, "account.json"),
      JSON.stringify({ label: "work-a", tags: ["business"] }, null, 2)
    );

    const accounts = await loadAccountRegistry(join(runtimeRoot, "accounts"));

    expect(accounts).toEqual([
      {
        id: "work-a",
        label: "work-a",
        homePath: join(accountDir, "home"),
        browserProfilePath: join(accountDir, "browser-profile"),
        disabled: false,
        tags: ["business"],
      },
    ]);
  });
});
