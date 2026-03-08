import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { createAccountManifest, setAccountDisabled } from "./account-manifest";

describe("createAccountManifest", () => {
  it("creates account metadata and directories", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-account-"));

    const account = await createAccountManifest(runtimeRoot, "work-a");

    expect(account.id).toBe("work-a");
    expect(
      JSON.parse(
        await readFile(
          join(runtimeRoot, "accounts", "work-a", "account.json"),
          "utf8"
        )
      )
    ).toEqual({
      label: "work-a",
      disabled: false,
      tags: [],
    });
  });

  it("updates the disabled flag for an existing account", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-account-"));
    await createAccountManifest(runtimeRoot, "work-a");

    const account = await setAccountDisabled(runtimeRoot, "work-a", true);

    expect(account.disabled).toBe(true);
    expect(
      JSON.parse(
        await readFile(
          join(runtimeRoot, "accounts", "work-a", "account.json"),
          "utf8"
        )
      )
    ).toEqual({
      label: "work-a",
      disabled: true,
      tags: [],
    });
  });
});
