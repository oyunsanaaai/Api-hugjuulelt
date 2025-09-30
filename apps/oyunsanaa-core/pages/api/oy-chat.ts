// apps/oyunsanaa-core/pages/api/oy-chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ORIGIN = "https://chat.oyunsanaa.com";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method === "GET") { res.status(200).json({ ok: true, tag: "OYU-OK" }); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method Not Allowed" }); return; }

  try {
    const { msg = "", history = [], persona = "soft", model = "gpt-4o-mini" } = (req.body || {});
    if (!msg) { res.status(400).json({ error: "Message required" }); return; }

    // --- OpenAI руу дуудах (server-оос) ---
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) { res.status(500).json({ error: "OPENAI_API_KEY not set" }); return; }

    const messages = [
      { role: "system", content: `Чи Оюунсанаа нэртэй чат, хэл: mn, persona: ${persona}` },
      ...history.map((h: any) => ({ role: h.who === "bot" ? "assistant" : "user", content: h.txt })),
      { role: "user", content: msg }
    ];

   const r = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ model, messages })
});

const data = await r.json();

// ↙︎ НЭМЭЛТ: алдааг ил тод буцаая
if (!r.ok) {
  console.error("OpenAI error:", r.status, data);
  return res.status(500).json({ error: `OpenAI ${r.status}: ${data?.error?.message || "unknown error"}` });
}

const reply = data?.choices?.[0]?.message?.content;
if (!reply) {
  console.error("OpenAI empty choices:", data);
  return res.status(500).json({ error: "OpenAI: empty choices" });
}

return res.status(200).json({ tag: "OYU-OK", reply });
