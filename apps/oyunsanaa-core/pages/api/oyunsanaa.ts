// apps/oyunsanaa-core/pages/api/oyunsanaa.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Оюунсанаагийн зан чанар, зорилго (system prompt)
const SYSTEM_PROMPT = `
Та бол "Оюунсанаа (OS Chat)" — сэтгэлийн боловсролын дотно, халамжилдаг, хошин өнгө аястай туслагч.
Та эмч биш (онош, эмчилгээ хийхгүй). Зөвхөн зөвлөгөө, дадал, дэмжлэгийн түвшинд тусална. Аюултай үед мэргэжлийн тусламж руу чиглүүл.
Хүмүүсийн амьдралыг 6 талбарт тэнцвэржүүлэхэд тусал: 
1) Сэтгэлзүй 2) Эрүүл мэнд (унтлаг, хоол, хөдөлгөөн) 3) Зорилго/цагийн менежмент
4) Харилцаа/орчин 5) Санхүү 6) Өөрийгөө ойлгох/дадал.

Өдөр тутмын жижиг даалгавар, сануулга, урам, дүгнэлт өг. Шахалтгүй, тулгалтгүй—хэрэглэгчийн хурдаар.
Хэллэг: дотно, товч, шүүмжлэлгүй, эерэг, урамтай. Хэт онол бичиж залхаахгүй, асуултаар ойлгуулна.
Насны ангиллыг харгалз: 0–7, 8–12, 13–18, 19–25, 26–40, 41–55, 56–70, 70+. Хэрэглэгч хэлбэл тохируул.
Эрүүл мэндийн зөвлөгөөнд: ус, нойр, хөдөлгөөн, хоол, муу зуршлыг аажмаар сайжруулах дадал санал болго.
Санхүү: орлого-зарлагыг энгийнээр ангилж, хуримтлал, өр төлөвлөгөө, зорилго руу жижиг алхмаар уриал.
Зорилго: өдөр/7 хоног/сар/жил алхам болгож, бодит цагийн нөөцтэй уялдуулж төлөвлөхийг тусал.
Тэмдэглэл: Талархал, дурсамж, ухаарал, гомдол зэрэг тусгай сэдвүүдээр бичүүлэхийг дэмж.
Ямар ч шалтгаанд урам өгч, хэт хатуу дүгнэхгүй. Үнэн зөв зүйл дээр тайван бат зогс.
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET -> health
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, message: "Оюунсанаа API ажиллаж байна 🚀" });
    }

    // POST -> чат/даалгавар
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only GET/POST allowed" });
    }

    // Body: { message, deep?, age_category?, imageUrl? }
    const { message, deep = false, age_category, imageUrl } = req.body || {};

    if (!message && !imageUrl) {
      return res.status(400).json({ error: "message эсвэл imageUrl заавал хэрэгтэй" });
    }

    // Зураг орж ирвэл эсвэл deep=true бол gpt-4o, бусад үед 4o-mini
    const model = imageUrl || deep ? "gpt-4o" : "gpt-4o-mini";

    // System + User messages
    const systemMsg = {
      role: "system" as const,
      content: age_category
        ? `${SYSTEM_PROMPT}\n\nХэрэглэгчийн насны ангилал: ${age_category}.`
        : SYSTEM_PROMPT,
    };

    // Хэрэглэгчийн контент (зурагтай эсвэл текст)
    const userContent =
      imageUrl
        ? [
            { type: "text", text: message || "Зураг дээр үндэслэн зөвлөгөө өг." },
            { type: "image_url", image_url: { url: imageUrl } },
          ]
        : message;

    const userMsg = { role: "user" as const, content: userContent as any };

    const completion = await client.chat.completions.create({
      model,
      messages: [systemMsg, userMsg],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    return res.status(200).json({
      ok: true,
      model,
      reply,
    });
  } catch (err: any) {
    console.error("oyunsanaa error:", err?.response?.data || err?.message || err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
