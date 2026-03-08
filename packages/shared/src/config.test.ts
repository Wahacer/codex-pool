import { describe, expect, it } from "vitest";

import {
  getAccountsRoot,
  getRuntimeRoot,
  getRuntimeRootFromEnv,
  getStateDbPath,
  parseAccountConfig,
} from "./config";

describe("config", () => {
  it("resolves runtime root under home directory", () => {
    expect(getRuntimeRoot("/Users/demo")).toBe("/Users/demo/.codex-pool");
  });

  it("prefers CODEX_POOL_HOME when present", () => {
    expect(
      getRuntimeRootFromEnv({
        CODEX_POOL_HOME: "/tmp/codex-pool",
        HOME: "/Users/demo",
      })
    ).toBe("/tmp/codex-pool");
  });

  it("derives account paths from the account directory", () => {
    expect(
      parseAccountConfig("/tmp/codex-pool/accounts/work-a", {
        label: "work-a",
      })
    ).toEqual({
      id: "work-a",
      label: "work-a",
      homePath: "/tmp/codex-pool/accounts/work-a/home",
      browserProfilePath: "/tmp/codex-pool/accounts/work-a/browser-profile",
      disabled: false,
      tags: [],
    });
  });

  it("builds runtime subpaths from the runtime root", () => {
    expect(getAccountsRoot("/tmp/codex-pool")).toBe("/tmp/codex-pool/accounts");
    expect(getStateDbPath("/tmp/codex-pool")).toBe(
      "/tmp/codex-pool/state/pool.db"
    );
  });
});
