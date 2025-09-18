export const config = { runtime: "edge" };
export default function handler() {
  return new Response(JSON.stringify({ api: true }), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
