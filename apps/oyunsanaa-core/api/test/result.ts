export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "GET only" }), {
      status: 405,
      headers: { "content-type": "application/json" }
    });
  }

  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id") ?? "demo";

  return new Response(
    JSON.stringify({
      session_id,
      score_0_100: { mood: 70, sleep: 56, diet: 65, activity: 62, relations: 48, work: 60 },
      delta_%: { mood: 20, sleep: 8, diet: 15, activity: 12, relations: -2, work: 10 },
      focus_top2: ["mood", "diet"],
      narrative: "Чиний ачаалал хэвийн түвшинтэй харьцуулахад арай өндөр байна."
    }),
    { headers: { "content-type": "application/json; charset=utf-8" } }
  );
}
