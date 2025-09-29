// apps/oyunsanaa-core/pages/api/oyunsanaa.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS preflight (хэрэв өөр домэйноос дуудах бол)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { message, deep = false, age_category = "26-40" } = req.body || {};
    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ ok: false, error: "message талбар шаардлагатай" });
    }

    // Жишээ логик (эндээс цааш та хүссэнээ хийнэ)
    let reply = `Сайн уу! Чиний бичсэн: ${message}, deep=${deep}, насны ангилал=${age_category}`;

    if (message.trim() === "Оюунсанаа хэн бэ?") {
      reply =
        "Би таны амьдралын тэнцвэрийг дэмжих Оюунсанаа — таны сэтгэлийн туслагч AI.";
    }

    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
