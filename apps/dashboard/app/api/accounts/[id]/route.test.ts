import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { createAccountManifest, loadAccountRegistry } from "@codex-pool/core";
import { getAccountsRoot } from "@codex-pool/shared";
import { afterEach, describe, expect, it } from "vitest";

import { POST as disableAccount } from "./disable/route";
import { POST as enableAccount } from "./enable/route";

const originalRuntimeRoot = process.env.CODEX_POOL_HOME;

afterEach(() => {
  if (originalRuntimeRoot) {
    process.env.CODEX_POOL_HOME = originalRuntimeRoot;
    return;
  }

  delete process.env.CODEX_POOL_HOME;
});

describe("account toggle routes", () => {
  it("disables an account in the runtime registry", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-dashboard-"));
    process.env.CODEX_POOL_HOME = runtimeRoot;
    await createAccountManifest(runtimeRoot, "work-a");

    const response = await disableAccount(new Request("http://localhost"), {
      params: Promise.resolve({ id: "work-a" }),
    });

    expect(await response.json()).toEqual({
      ok: true,
      id: "work-a",
      action: "disable",
    });
    expect(
      (await loadAccountRegistry(getAccountsRoot(runtimeRoot)))[0]?.disabled
    ).toBe(true);
  });

  it("enables an account in the runtime registry", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-dashboard-"));
    process.env.CODEX_POOL_HOME = runtimeRoot;
    await createAccountManifest(runtimeRoot, "work-a");
    const disableResponse = await disableAccount(new Request("http://localhost"), {
      params: Promise.resolve({ id: "work-a" }),
    });

    expect(disableResponse.ok).toBe(true);

    const response = await enableAccount(new Request("http://localhost"), {
      params: Promise.resolve({ id: "work-a" }),
    });

    expect(await response.json()).toEqual({
      ok: true,
      id: "work-a",
      action: "enable",
    });
    expect(
      (await loadAccountRegistry(getAccountsRoot(runtimeRoot)))[0]?.disabled
    ).toBe(false);
  });
});
