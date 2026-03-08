import { mkdir } from "node:fs/promises";
import { join } from "node:path";

export async function ensureRuntimeLayout(runtimeRoot: string) {
  await Promise.all(
    ["accounts", "logs", "state", "workspaces"].map((directory) =>
      mkdir(join(runtimeRoot, directory), { recursive: true })
    )
  );
}
