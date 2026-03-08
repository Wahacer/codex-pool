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
