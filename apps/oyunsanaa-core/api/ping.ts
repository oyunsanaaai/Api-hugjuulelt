export const config = { runtime: "edge" };
export default function handler() {
  return new Response("ok", {
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}
