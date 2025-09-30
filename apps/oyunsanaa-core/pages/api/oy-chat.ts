// apps/oyunsanaa-core/pages/api/oy-chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ORIGIN = "https://chat.oyunsanaa.com"; // чиний чатны домэйн

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method === "GET") { res.status(200).json({ ok: true, tag: "OYU-OK" }); return; } // шалгах амар

  if (req.method !== "POST") { res.status(405).json({ error: "Method Not Allowed" }); return; }

  try {
    const { msg = "", history = [], persona = "soft", model = "gpt-4o-mini" } = (req.body||{});
    if (!msg) { res.status(400).json({ error: "Message required" }); return; }

    // TODO: энд OpenAI дуудах кодоо оруул (одоо түр ECHO)
    res.status(200).json({ tag: "OYU-OK", reply: `echo: ${msg}` });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
}
