import { describe, expect, it } from "vitest";

import { parseQuotaSnapshot } from "./parser";

describe("quota parser", () => {
  it("extracts five-hour percentage from official text", () => {
    const result = parseQuotaSnapshot("5-hour usage limit 91% remaining");

    expect(result.fiveHourRemainingPercent).toBe(91);
    expect(result.quality).toBe("official");
  });
});
