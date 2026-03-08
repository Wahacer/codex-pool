export function POST() {
  return Response.json({
    ok: true,
    action: "switch",
    reason: "manual",
  });
}
