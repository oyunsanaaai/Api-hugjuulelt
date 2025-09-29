// pages/api/oyunsanaa.ts  (Next.js API Route)

import type { NextApiRequest, NextApiResponse } from 'next';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

// === ЭНД урт зан・заавраа БҮХЛЭЭР нь тавина ===
// Доорх LONG_PROMPT-ийн дунд өөрийн урт файлаа хуулж тавь.
const LONG_PROMPT = `
Та бол "Оюунсанаа" нэртэй туслах. (энд өөрийн урт зааврыг бүхлээр нь тавина)
- Монгол хэлээр найрсаг, ойлгомжтой ярь.
- Хэрэглэгчийн нас/дип горим ирвэл өнгө аясыг тохируул.
`.trim();

type ReqBody = {
  msg?: string;
  model?: string;         // 'gpt-4o-mini' эсвэл 'gpt-4o'
  persona?: string;       // 'soft' гэх мэт
  deep?: boolean;         // илүү урт/гүн хариу?
  age_category?: string;  // '26-40' гэх мэт
  history?: { who: 'user'|'bot'; html: string }[]; // фронтоос ирдэг
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS preflight (хэрэв хэрэгтэй бол үлдээгээрэй)
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ ok: false, error: 'OPENAI_API_KEY is missing' });

    const {
      msg = '',
      model = 'gpt-4o-mini',
      persona = 'soft',
      deep = false,
      age_category = '',
      history = [],
    } = (req.body || {}) as ReqBody;

    // Frontend-ээс ирсэн history-г OpenAI-д таарах формат руу хөрвүүлнэ
    const messages: { role: 'system'|'user'|'assistant'; content: string }[] = [];

    // 1) Урт зааврыг system-д өгнө
    messages.push({
      role: 'system',
      content:
        `${LONG_PROMPT}\n\n` +
        `Параметрүүд: persona=${persona}, deep=${deep}, age=${age_category}\n` +
        `Заавар: үргэлж Монгол хэлээр, богино мөр ба жагсаалтаар ойлгомжтой.` ,
    });

    // 2) Өмнөх яриаг нэмэх
    for (const h of history) {
      const role = h.who === 'user' ? 'user' : 'assistant';
      const txt = String(h.html || '').replace(/<[^>]+>/g, '').trim();
      if (txt) messages.push({ role, content: txt });
    }

    // 3) Одоогийн хэрэглэгчийн мессэж
    messages.push({ role: 'user', content: msg || '' });

    const r = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: ['gpt-4o', 'gpt-4o-mini'].includes(model) ? model : 'gpt-4o-mini',
        messages,
        temperature: deep ? 0.8 : 0.4,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('[oyunsanaa] OpenAI error', r.status, data);
      return res.status(r.status).json({ ok: false, error: data?.error?.message || 'OpenAI API error' });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    console.error('[oyunsanaa] server error:', e);
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' });
  }
}
