import { loadAccountRegistry } from "@codex-pool/core";
import { getAccountsRoot, getRuntimeRootFromEnv } from "@codex-pool/shared";

export async function GET() {
  const runtimeRoot = getRuntimeRootFromEnv(process.env);
  const accounts = await loadAccountRegistry(getAccountsRoot(runtimeRoot));

  return Response.json({ accounts });
}
