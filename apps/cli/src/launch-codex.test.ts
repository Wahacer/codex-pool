import { describe, expect, it } from "vitest";

import { buildLaunchEnv } from "./launch-codex";

describe("launch env", () => {
  it("sets CODEX_HOME to the selected account", () => {
    expect(buildLaunchEnv("/tmp/account-a").CODEX_HOME).toBe("/tmp/account-a");
  });
});
