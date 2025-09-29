import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { message, deep } = req.body;

    // deep=true бол gpt-4o, үгүй бол gpt-4o-mini
    const model = deep ? "gpt-4o" : "gpt-4o-mini";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "Та бол 'Оюунсанаа' нэртэй дотно, халамжтай, хошин өнгө аястай сэтгэлийн боловсролын туслагч чатбот. Насны ангилал, хэрэглэгчийн мэдээллийг харгалзан зөв дадал, өдөр тутмын даалгавар, дэмжлэг өгдөг.",
        },
        { role: "user", content: message }
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content, model });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
