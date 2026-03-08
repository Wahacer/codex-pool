import type { DatabaseSync } from "node:sqlite";

import { createInMemoryDatabase } from "../db/client";

export interface AccountRecord {
  id: string;
  label: string;
  status: string;
}

export function createAccountRepository(database: DatabaseSync) {
  const upsertStatement = database.prepare(`
    INSERT INTO accounts (id, label, status)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      label = excluded.label,
      status = excluded.status
  `);

  const listStatement = database.prepare(
    "SELECT id, label, status FROM accounts ORDER BY label ASC"
  );

  return {
    upsertAccount(account: AccountRecord) {
      upsertStatement.run(account.id, account.label, account.status);
    },
    listAccounts() {
      return listStatement.all() as unknown as AccountRecord[];
    },
  };
}

export function createTestRepository() {
  return createAccountRepository(createInMemoryDatabase());
}
