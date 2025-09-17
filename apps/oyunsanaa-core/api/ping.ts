export const config = { runtime: "edge" };

export default function handler() {
  // Зөвхөн ил тод string буцаана
  return new Response("ok", {
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}
