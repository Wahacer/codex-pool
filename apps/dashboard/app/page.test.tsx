import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import Page from "./page";

describe("dashboard page", () => {
  it("renders account overview heading", async () => {
    render(await Page());
    expect(screen.getByText("Codex Pool")).toBeInTheDocument();
  });
});
