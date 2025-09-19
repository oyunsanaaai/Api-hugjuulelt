// apps/oyunsanaa-core/pages/api/openai.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const model = req.query.model === "full" ? "gpt-4o" : "gpt-4o-mini";

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: "Сайн уу?" }],
    });

    res.status(200).json({
      ok: true,
      model,
      message: completion.choices[0].message,
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
