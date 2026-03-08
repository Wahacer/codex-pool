import { getRuntimeRootFromEnv } from "@codex-pool/shared";

import { launchCodex } from "./launch-codex";
import { resolveLaunchAccount } from "./resolve-launch-account";

function parseArguments(argv: string[]) {
  const [, , ...rest] = argv;

  if (rest[0] === "--codex-home") {
    const [, codexHome, ...args] = rest;

    if (!codexHome) {
      throw new Error("Missing value for --codex-home");
    }

    return {
      codexHome,
      args,
    };
  }

  return {
    codexHome: null,
    args: rest,
  };
}

const parsed = parseArguments(process.argv);
const runtimeRoot = getRuntimeRootFromEnv(process.env);
const account = parsed.codexHome
  ? { homePath: parsed.codexHome }
  : await resolveLaunchAccount(runtimeRoot);

if (!account) {
  throw new Error("No enabled account found under the runtime accounts directory");
}

const child = launchCodex(account.homePath, parsed.args);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
