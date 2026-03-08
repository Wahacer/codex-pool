const ACCOUNTS = [
  {
    id: "account-a",
    label: "Account A",
    status: "unknown",
  },
];

export function GET() {
  return Response.json({ accounts: ACCOUNTS });
}
