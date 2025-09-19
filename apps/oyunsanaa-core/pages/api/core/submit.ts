// apps/oyunsanaa-core/pages/api/core/submit.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  return res.status(200).json({ ok: true, action: "submit", payload });
}
