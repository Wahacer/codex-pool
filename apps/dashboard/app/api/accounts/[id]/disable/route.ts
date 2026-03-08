import { setAccountDisabled } from "@codex-pool/core";
import { getRuntimeRootFromEnv } from "@codex-pool/shared";

export const dynamic = "force-dynamic";

export function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return context.params.then(async ({ id }) => {
    const runtimeRoot = getRuntimeRootFromEnv(process.env);

    await setAccountDisabled(runtimeRoot, id, true);

    if (request.headers.get("accept")?.includes("text/html")) {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/",
        },
      });
    }

    return Response.json({
      ok: true,
      id,
      action: "disable",
    });
  });
}
