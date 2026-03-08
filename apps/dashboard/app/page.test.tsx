import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Page from "./page";

describe("dashboard page", () => {
  it("renders account overview heading", () => {
    render(<Page />);
    expect(screen.getByText("Codex Pool")).toBeInTheDocument();
  });
});
