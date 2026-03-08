import { describe, expect, it } from "vitest";

import { buildHandoff } from "./handoff";

describe("handoff", () => {
  it("includes goal and pending todo", () => {
    const handoff = buildHandoff({
      goal: "finish launcher",
      pendingTodos: ["write selector parser"],
    });

    expect(handoff.prompt).toContain("finish launcher");
    expect(handoff.prompt).toContain("write selector parser");
  });
});
