import { loadAccountRegistry, selectAccount } from "@codex-pool/core";
import { getAccountsRoot } from "@codex-pool/shared";

export async function resolveLaunchAccount(runtimeRoot: string) {
  const accounts = await loadAccountRegistry(getAccountsRoot(runtimeRoot));
  const selected = selectAccount(
    accounts.map((account) => ({
      ...account,
      status: account.disabled ? "disabled" : "available",
    }))
  );

  return selected;
}
