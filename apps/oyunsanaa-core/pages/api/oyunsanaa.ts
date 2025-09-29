// pages/api/oyunsanaa.ts (CHAT project)
import type { NextApiRequest, NextApiResponse } from 'next';

const CORE_API = process.env.CORE_API_URL!; // доор env тохируулна

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    const r = await fetch(CORE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e:any) {
    return res.status(500).json({ ok:false, error: e?.message || 'Proxy error' });
  }
}
