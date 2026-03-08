import {
  getAccountsRoot,
  getBrowserProfilePath,
  getCodexHomePath,
  getRuntimeRoot,
  getStateDbPath,
} from "./runtime-paths";

export interface AccountConfig {
  id: string;
  label: string;
  homePath: string;
  browserProfilePath: string;
  disabled: boolean;
  tags: string[];
}

export function getRuntimeRootFromEnv(env: {
  CODEX_POOL_HOME?: string;
  HOME?: string;
}) {
  if (env.CODEX_POOL_HOME?.trim()) {
    return env.CODEX_POOL_HOME;
  }

  if (!env.HOME?.trim()) {
    throw new Error("HOME is required when CODEX_POOL_HOME is not set");
  }

  return getRuntimeRoot(env.HOME);
}

export function parseAccountConfig(
  accountDir: string,
  input: {
    label: string;
    disabled?: boolean;
    tags?: string[];
  }
): AccountConfig {
  if (!input.label.trim()) {
    throw new Error("Account label is required");
  }

  return {
    id: input.label,
    label: input.label,
    homePath: getCodexHomePath(accountDir),
    browserProfilePath: getBrowserProfilePath(accountDir),
    disabled: input.disabled ?? false,
    tags: input.tags ?? [],
  };
}

export { getAccountsRoot, getRuntimeRoot, getStateDbPath };
