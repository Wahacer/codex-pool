import { launchCodex } from "./launch-codex";

const [, , codexHome, ...args] = process.argv;

if (!codexHome) {
  throw new Error("Usage: codex-pool <codex-home> [codex args...]");
}

const child = launchCodex(codexHome, args);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
