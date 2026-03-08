import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { getAccountsRoot, parseAccountConfig } from "@codex-pool/shared";

import { ensureRuntimeLayout } from "./bootstrap";

export async function createAccountManifest(runtimeRoot: string, label: string) {
  const trimmedLabel = label.trim();

  if (!trimmedLabel) {
    throw new Error("Account label is required");
  }

  await ensureRuntimeLayout(runtimeRoot);

  const accountDir = join(getAccountsRoot(runtimeRoot), trimmedLabel);
  const config = {
    label: trimmedLabel,
    disabled: false,
    tags: [],
  };

  await Promise.all([
    mkdir(accountDir, { recursive: true }),
    mkdir(join(accountDir, "home"), { recursive: true }),
    mkdir(join(accountDir, "browser-profile"), { recursive: true }),
  ]);

  await writeFile(
    join(accountDir, "account.json"),
    `${JSON.stringify(config, null, 2)}\n`
  );

  return parseAccountConfig(accountDir, config);
}

export async function setAccountDisabled(
  runtimeRoot: string,
  accountId: string,
  disabled: boolean
) {
  const accountDir = join(getAccountsRoot(runtimeRoot), accountId);
  const configPath = join(accountDir, "account.json");
  const current = JSON.parse(await readFile(configPath, "utf8")) as {
    label: string;
    disabled?: boolean;
    tags?: string[];
  };
  const next = {
    label: current.label,
    disabled,
    tags: current.tags ?? [],
  };

  await writeFile(configPath, `${JSON.stringify(next, null, 2)}\n`);

  return parseAccountConfig(accountDir, next);
}
