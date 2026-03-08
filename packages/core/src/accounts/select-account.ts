export interface SelectableAccount {
  id: string;
  label: string;
  status: string;
  cooldownUntil?: string;
}

export function selectAccount(accounts: SelectableAccount[]) {
  const now = Date.now();

  return (
    accounts.find((account) => {
      if (account.status !== "available") {
        return false;
      }

      if (!account.cooldownUntil) {
        return true;
      }

      return Number.isNaN(Date.parse(account.cooldownUntil))
        ? true
        : Date.parse(account.cooldownUntil) <= now;
    }) ?? null
  );
}
