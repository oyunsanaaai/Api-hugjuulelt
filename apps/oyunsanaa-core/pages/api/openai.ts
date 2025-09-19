import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Сайн уу?" }],
  });

  res.status(200).json({ result: completion.choices[0].message });
}
8
