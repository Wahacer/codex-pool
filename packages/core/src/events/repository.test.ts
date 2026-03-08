import { describe, expect, it } from "vitest";

import { createEventRepository } from "./repository";

describe("event repository", () => {
  it("records switch events", () => {
    const repository = createEventRepository();

    repository.record({
      type: "switch",
      reason: "manual",
    });

    expect(repository.list()[0]?.type).toBe("switch");
  });
});
