import { spawn } from "node:child_process";

export function buildLaunchEnv(codexHome: string) {
  return {
    ...process.env,
    CODEX_HOME: codexHome,
  };
}

export function launchCodex(codexHome: string, args: string[] = []) {
  return spawn("codex", args, {
    env: buildLaunchEnv(codexHome),
    stdio: "inherit",
  });
}
