export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405, headers: { "content-type": "application/json" }
    });
  }
  const body = await req.json();
  return new Response(JSON.stringify({
    success: true,
    session_id: body.session_id ?? "demo",
    answers: body.answers ?? []
  }), { headers: { "content-type": "application/json" } });
}
