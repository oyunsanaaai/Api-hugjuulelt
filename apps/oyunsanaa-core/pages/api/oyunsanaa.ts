// pages/api/oyunsanaa.ts  (Next.js API route)

import type { NextApiRequest, NextApiResponse } from 'next';

const OPENAI_API = 'https://api.openai.com/v1/chat/completions';
const SYS_PROMPT = `
Чи "Оюунсанаа" нэртэй туслах.
- Энгийн асуултад богино, ойлгомжтой.
- Илүү гүн яриа/зөвлөгөөнд тайван, эелдэг өнгөөр шаталсан тайлбар.
- Монгол хэл дээр ярина (хэрэглэгч өөр хэлээр асуувал тэр хэлээр).
- Хариултын өмнө битгий асуулт буцааж давтаарай.
`;

function clean(s: any) {
  return String(s || '').replace(/<[^>]+>/g, '').trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS (хэрэв гаднаас шууд дуудах бол)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ ok: false, error: 'OPENAI_API_KEY тохируулаагүй' });

    // front-end-ээс ирж буй мэдээлэл
    const { msg = '', history = [], deep = false, model } = (req.body || {}) as {
      msg?: string;
      history?: { who: 'user' | 'bot'; html?: string; text?: string }[];
      deep?: boolean;
      model?: string;
    };

    // түүхийг OpenAI-ийн формат руу хөрвүүлэх
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: SYS_PROMPT },
    ];

    for (const m of history || []) {
      const role = m?.who === 'user' ? 'user' : 'assistant';
      const content = clean(m?.html || m?.text);
      if (content) messages.push({ role, content });
    }

    messages.push({ role: 'user', content: clean(msg) });

    // аль загвар ажиллуулах вэ (анхдагч нь gpt-4o-mini)
    const chosen = model || (deep ? 'gpt-4o' : 'gpt-4o-mini');

    const r = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: chosen,
        messages,
        temperature: 0.4,
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
