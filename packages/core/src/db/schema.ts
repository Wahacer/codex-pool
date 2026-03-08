export const ACCOUNT_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    status TEXT NOT NULL
  )
`;
