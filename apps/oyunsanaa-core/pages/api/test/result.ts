// apps/oyunsanaa-core/pages/api/test/result.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;
    return res.status(200).json({ ok: true, result: { id: id ?? null } });
  }
  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    return res.status(200).json({ ok: true, received: body });
  }
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
