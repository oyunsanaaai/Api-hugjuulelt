// apps/oyunsanaa-core/pages/api/oy-chat.ts
import { OYUNSANAA_PROMPT } from "../../prompts/oyunsanaa";
import type { NextApiRequest, NextApiResponse } from "next";

const ORIGIN = "https://chat.oyunsanaa.com";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method === "GET")    { res.status(200).json({ ok: true, tag: "OYU-OK" }); return; }
  if (req.method !== "POST")   { res.status(405).json({ error: "Method Not Allowed" }); return; }

  try {
    const { msg = "", history = [], persona = "soft", model = "gpt-4o-mini" } = (req.body || {});
    if (!msg) { res.status(400).json({ error: "Message required" }); return; }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) { res.status(500).json({ error: "OPENAI_API_KEY not set" }); return; }

    // Уртын контент → system context (12000 тэмдэгтээр танав)
    const context = OYUNSANAA_PROMPT.slice(0, 12000);

    const messages = [
      {
        role: "system",
        content: `Доорх баримтыг ЯГ ДАГА (монголоор хариул). 
        Хариулт зөвхөн баримтаас үндэслэсэн байх.
        Баримт: """${context}"""`
      },
      ...history.map((h: any) => ({
        role: h.who === "bot" ? "assistant" : "user",
        content: String(h.txt || "")
      })),
      { role: "user", content: String(msg) }
    ];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages })
    });
    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({ error: `OpenAI ${r.status}: ${data?.error?.message || "unknown"}` });
    }

    const reply: string | undefined = data?.choices?.[0]?.message?.content;
    if (!reply) { return res.status(500).json({ error: "OpenAI: empty choices" }); }

    res.status(200).json({ tag: "OYU-OK", reply });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
}
