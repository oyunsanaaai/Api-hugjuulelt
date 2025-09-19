// apps/oyunsanaa-core/pages/api/core/register.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  return res.status(201).json({ ok: true, action: "register", data });
}
