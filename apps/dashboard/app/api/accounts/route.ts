import { createAccountManifest, loadAccountRegistry } from "@codex-pool/core";
import { getAccountsRoot, getRuntimeRootFromEnv } from "@codex-pool/shared";

export const dynamic = "force-dynamic";

export async function GET() {
  const runtimeRoot = getRuntimeRootFromEnv(process.env);
  const accounts = await loadAccountRegistry(getAccountsRoot(runtimeRoot));

  return Response.json({ accounts });
}

export async function POST(request: Request) {
  const runtimeRoot = getRuntimeRootFromEnv(process.env);
  const contentType = request.headers.get("content-type") ?? "";
  const acceptsHtml = request.headers.get("accept")?.includes("text/html");
  const rawLabel = contentType.includes("application/json")
    ? ((await request.json()) as { label?: string }).label
    : await request.formData().then((formData) => formData.get("label"));
  const account = await createAccountManifest(
    runtimeRoot,
    typeof rawLabel === "string" ? rawLabel : ""
  );

  if (acceptsHtml) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/",
      },
    });
  }

  return Response.json(
    {
      ok: true,
      id: account.id,
      action: "create",
    },
    {
      status: 201,
    }
  );
}
