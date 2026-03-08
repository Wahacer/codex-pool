# Manual Test Checklist

- [ ] Run `pnpm install` successfully in `/Users/wahacer/codex-pool`
- [ ] Run `pnpm test` and confirm all workspace tests pass
- [ ] Run `pnpm --filter @codex-pool/dashboard build` and confirm the Next.js build succeeds
- [ ] Run `pnpm --filter @codex-pool/dashboard dev` and open the local dashboard in a browser
- [ ] Confirm the home page renders the `Codex Pool` heading
- [ ] Create an account from the dashboard form and confirm it appears in the table
- [ ] Confirm the table shows the generated `CODEX_HOME` path
- [ ] Confirm the account row can be toggled between `Enable` and `Disable`
- [ ] Confirm `GET /api/accounts` returns JSON
- [ ] Confirm `POST /api/accounts` creates a new account entry
- [ ] Confirm `POST /api/refresh` returns a queued response
- [ ] Confirm `POST /api/switch` returns a manual switch response
- [ ] Confirm `POST /api/accounts/{id}/enable` returns `action: "enable"`
- [ ] Confirm `POST /api/accounts/{id}/disable` returns `action: "disable"`
- [ ] Confirm the CLI test passes with `pnpm --filter @codex-pool/cli test`
- [ ] Confirm the quota parser test passes with `pnpm --filter @codex-pool/core test -- parser.test.ts`
