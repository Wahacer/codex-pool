import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { loadAccountRegistry } from "@codex-pool/core";
import { getAccountsRoot } from "@codex-pool/shared";
import { afterEach, describe, expect, it } from "vitest";

import { POST } from "./route";

const originalRuntimeRoot = process.env.CODEX_POOL_HOME;

afterEach(() => {
  if (originalRuntimeRoot) {
    process.env.CODEX_POOL_HOME = originalRuntimeRoot;
    return;
  }

  delete process.env.CODEX_POOL_HOME;
});

describe("accounts route", () => {
  it("creates an account from a JSON request", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-dashboard-"));
    process.env.CODEX_POOL_HOME = runtimeRoot;

    const response = await POST(
      new Request("http://localhost/api/accounts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ label: "work-a" }),
      })
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      ok: true,
      id: "work-a",
      action: "create",
    });
    expect((await loadAccountRegistry(getAccountsRoot(runtimeRoot)))[0]?.id).toBe(
      "work-a"
    );
  });

  it("redirects back to the dashboard for HTML form submissions", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-dashboard-"));
    process.env.CODEX_POOL_HOME = runtimeRoot;
    const formData = new FormData();

    formData.set("label", "work-b");

    const response = await POST(
      new Request("http://localhost/api/accounts", {
        method: "POST",
        headers: {
          accept: "text/html",
        },
        body: formData,
      })
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/");
    expect((await loadAccountRegistry(getAccountsRoot(runtimeRoot)))[0]?.id).toBe(
      "work-b"
    );
  });
});
