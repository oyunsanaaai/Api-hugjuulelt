// apps/oyunsanaa-core/pages/api/app.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { task, data } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Та бол Оюунсанаа платформын арын үйлдлүүдийг (өгөгдөл ангилах, шинжилгээ хийх, санал зөвлөмж өгөх) хийдэг туслах систем юм.",
        },
        {
          role: "user",
          content: `Task: ${task}\nData:\n${JSON.stringify(data)}`,
        },
      ],
    });

    res.status(200).json({
      result: completion.choices[0].message.content,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
