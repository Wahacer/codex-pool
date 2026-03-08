export function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return context.params.then(({ id }) =>
    Response.json({
      ok: true,
      id,
      action: "enable",
    })
  );
}
