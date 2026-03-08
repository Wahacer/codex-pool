import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { parseAccountConfig } from "@codex-pool/shared";

export async function loadAccountRegistry(accountsRoot: string) {
  const entries = await readdir(accountsRoot, { withFileTypes: true }).catch(
    () => []
  );

  const accounts = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const accountDir = join(accountsRoot, entry.name);
        const configPath = join(accountDir, "account.json");
        const raw = await readFile(configPath, "utf8");
        const parsed = JSON.parse(raw) as {
          label: string;
          disabled?: boolean;
          tags?: string[];
        };

        return parseAccountConfig(accountDir, parsed);
      })
  );

  return accounts.sort((left, right) => left.label.localeCompare(right.label));
}
