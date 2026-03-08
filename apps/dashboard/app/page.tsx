import { AccountTable } from "../components/account-table";

const ACCOUNTS = [
  {
    id: "account-a",
    label: "Account A",
    status: "unknown",
  },
];

export default function Page() {
  return (
    <main>
      <h1>Codex Pool</h1>
      <p>Local dashboard for account pool visibility.</p>
      <AccountTable accounts={ACCOUNTS} />
    </main>
  );
}
