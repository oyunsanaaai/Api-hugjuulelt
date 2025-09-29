import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true, message: 'running' });
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
  const { msg = '' } = (req.body || {}) as any;
  return res.status(200).json({ ok: true, reply: `Сайн уу! Чиний бичсэн: ${msg}` });
}
