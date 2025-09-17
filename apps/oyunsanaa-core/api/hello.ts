export const config = { runtime: "edge" }; // зөв

export default async function handler() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
