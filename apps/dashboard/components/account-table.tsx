interface AccountRow {
  id: string;
  label: string;
  status: string;
}

export function AccountTable({ accounts }: { accounts: AccountRow[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Account</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <tr key={account.id}>
            <td>{account.label}</td>
            <td>{account.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
