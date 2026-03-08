export function getRuntimeRoot(homeDir: string) {
  return `${homeDir}/.codex-pool`;
}

export function getAccountsRoot(runtimeRoot: string) {
  return `${runtimeRoot}/accounts`;
}

export function getStateDbPath(runtimeRoot: string) {
  return `${runtimeRoot}/state/pool.db`;
}

export function getCodexHomePath(accountDir: string) {
  return `${accountDir}/home`;
}

export function getBrowserProfilePath(accountDir: string) {
  return `${accountDir}/browser-profile`;
}
