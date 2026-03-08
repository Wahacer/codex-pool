import { DatabaseSync } from "node:sqlite";

import { ACCOUNT_TABLE_SQL } from "./schema";

export function createInMemoryDatabase() {
  const database = new DatabaseSync(":memory:");

  database.exec(ACCOUNT_TABLE_SQL);

  return database;
}
