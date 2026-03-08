import { getRuntimeRoot } from "./runtime-paths";

export interface AccountConfig {
  label: string;
}

export function parseAccountConfig(input: { label: string }): AccountConfig {
  if (!input.label.trim()) {
    throw new Error("Account label is required");
  }

  return {
    label: input.label,
  };
}

export { getRuntimeRoot };
