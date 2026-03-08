import React from "react";

import { loadAccountRegistry } from "@codex-pool/core";
import { getAccountsRoot, getRuntimeRootFromEnv } from "@codex-pool/shared";

import { AccountTable } from "../components/account-table";

export default async function Page() {
  const runtimeRoot = getRuntimeRootFromEnv(process.env);
  const accounts = await loadAccountRegistry(getAccountsRoot(runtimeRoot));
  const tableAccounts =
    accounts.length > 0
      ? accounts.map((account) => ({
          id: account.id,
          label: account.label,
          status: account.disabled ? "disabled" : "available",
        }))
      : [];

  return (
    <main>
      <h1>Codex Pool</h1>
      <p>Local dashboard for account pool visibility.</p>
      <AccountTable accounts={tableAccounts} />
    </main>
  );
}
