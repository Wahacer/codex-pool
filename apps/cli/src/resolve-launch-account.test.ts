import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { resolveLaunchAccount } from "./resolve-launch-account";

describe("resolveLaunchAccount", () => {
  it("selects the first enabled account from the runtime accounts directory", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-cli-"));
    const disabledDir = join(runtimeRoot, "accounts", "disabled-a");
    const enabledDir = join(runtimeRoot, "accounts", "work-b");

    await mkdir(disabledDir, { recursive: true });
    await mkdir(enabledDir, { recursive: true });

    await writeFile(
      join(disabledDir, "account.json"),
      JSON.stringify({ label: "disabled-a", disabled: true }, null, 2)
    );
    await writeFile(
      join(enabledDir, "account.json"),
      JSON.stringify({ label: "work-b" }, null, 2)
    );

    const account = await resolveLaunchAccount(runtimeRoot);

    expect(account?.id).toBe("work-b");
    expect(account?.homePath).toBe(join(enabledDir, "home"));
  });
});
