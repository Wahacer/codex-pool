import React from "react";

interface AccountRow {
  id: string;
  label: string;
  status: string;
  homePath: string;
  tags: string[];
}

export function AccountTable({ accounts }: { accounts: AccountRow[] }) {
  return (
    <>
      <form action="/api/accounts" method="post">
        <label htmlFor="account-label">Account label</label>
        <input id="account-label" name="label" type="text" required />
        <button type="submit">Add account</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Status</th>
            <th>Codex Home</th>
            <th>Tags</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.label}</td>
                <td>{account.status}</td>
                <td>{account.homePath}</td>
                <td>{account.tags.join(", ") || "-"}</td>
                <td>
                  <form
                    action={`/api/accounts/${account.id}/${account.status === "disabled" ? "enable" : "disable"}`}
                    method="post"
                  >
                    <button type="submit">
                      {account.status === "disabled" ? "Enable" : "Disable"}
                    </button>
                  </form>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No accounts yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
