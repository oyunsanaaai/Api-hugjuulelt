import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { message, deep, age_category } = req.body;
    // Одоохондоо зүгээр шалгах гэж энгийн хариу буцаая
    return res.status(200).json({
      ok: true,
      reply: `Сайн уу! Чиний бичсэн: ${message}, deep=${deep}, насны ангилал=${age_category}`,
    });
  } else {
    res.status(405).json({ ok: false, error: "Method not allowed" });
  }
}
