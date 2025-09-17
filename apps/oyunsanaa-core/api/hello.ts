export const config = { runtime: "nodejs18.x" };

export default async function handler() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" }
  });
}
