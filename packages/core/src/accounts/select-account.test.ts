import { describe, expect, it } from "vitest";

import { selectAccount } from "./select-account";

describe("selectAccount", () => {
  it("skips cooling-down accounts", () => {
    const selected = selectAccount([
      {
        id: "a",
        label: "work-a",
        status: "cooling_down",
        cooldownUntil: "2099-01-01T00:00:00.000Z",
      },
      {
        id: "b",
        label: "work-b",
        status: "available",
      },
    ]);

    expect(selected?.id).toBe("b");
  });
});
