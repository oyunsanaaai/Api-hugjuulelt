// pages/api/oyunsanaa.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Msg = { who: 'user'|'bot'; html?: string; text?: string };
type ReqBody = { model?: string; msg?: string; persona?: string; history?: Msg[] };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS (эндээс өөрчлөх хэрэггүй)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // GET тест — browser дээр шууд шалгахдаа энэ ажиллаж байгаа эсэхийг үзнэ
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: 'oyunsanaa API is running' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { msg = '', model = 'gpt-4o-mini', history = [] } = (req.body || {}) as ReqBody;

    // === Энд OpenAI дуудлагаа хийх гэж яарахгүй, эхлээд энгийн reply буцаая ===
    const reply = `Сайн уу! Чиний бичсэн: ${msg}, model=${model}, history=${history.length}`;

    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' });
  }
}
