export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), {
      status: 405,
      headers: { "content-type": "application/json" }
    });
  }

  const body = await req.json();
  const user = {
    id: "u_" + Math.random().toString(36).slice(2, 8),
    name: body.name ?? "Guest",
    age: body.age ?? null,
    category: body.category ?? "general"
  };

  return new Response(JSON.stringify({ success: true, user }), {
    headers: { "content-type": "application/json" }
  });
}
