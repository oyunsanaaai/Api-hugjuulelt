export const config = {
  runtime: "edge",
};

export default function handler() {
  return new Response(
    JSON.stringify({
      session_id: "demo",
      score_0_100: {
        mood: 70,
        sleep: 56,
        diet: 65,
        activity: 62,
        relations: 48,
        work: 60,
      },
      delta_percent: {
        mood: 20,
        sleep: 8,
        diet: 15,
        activity: 12,
        relations: -2,
        work: 10,
      },
      focus_top2: ["mood", "diet"],
      narrative: "Чиний ачаалал хэвийн түвшинтэй харьцуулахад арай өндөр байна.",
    }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    }
  );
}
