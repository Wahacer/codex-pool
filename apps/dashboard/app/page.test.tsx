import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { createAccountManifest } from "@codex-pool/core";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import Page from "./page";

const originalRuntimeRoot = process.env.CODEX_POOL_HOME;

afterEach(() => {
  cleanup();

  if (originalRuntimeRoot) {
    process.env.CODEX_POOL_HOME = originalRuntimeRoot;
    return;
  }

  delete process.env.CODEX_POOL_HOME;
});

describe("dashboard page", () => {
  it("renders account overview heading", async () => {
    render(await Page());
    expect(screen.getByText("Codex Pool")).toBeInTheDocument();
  });

  it("renders account management controls", async () => {
    const runtimeRoot = await mkdtemp(join(tmpdir(), "codex-pool-page-"));
    process.env.CODEX_POOL_HOME = runtimeRoot;
    await createAccountManifest(runtimeRoot, "work-a");

    render(await Page());

    expect(screen.getByLabelText("Account label")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Add account",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Disable",
      })
    ).toBeInTheDocument();
  });
});
