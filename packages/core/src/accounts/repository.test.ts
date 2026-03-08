import { describe, expect, it } from "vitest";

import { createTestRepository } from "./repository";

describe("account repository", () => {
  it("stores and reads account status", () => {
    const repository = createTestRepository();

    repository.upsertAccount({
      id: "a",
      label: "work-a",
      status: "available",
    });

    expect(repository.listAccounts()[0]?.status).toBe("available");
  });
});
