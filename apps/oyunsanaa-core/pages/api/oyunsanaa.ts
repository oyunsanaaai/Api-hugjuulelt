// apps/oyunsanaa-core/pages/api/oyunsanaa.ts
import type { NextApiRequest, NextApiResponse } from 'next';

function setCors(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ ok: false, error: 'OPENAI_API_KEY is missing' });

    // Body: { model?: string, msg: string, history?: {who:'user'|'bot', html:string}[] }
    const { model = 'gpt-4o-mini', msg = '', history = [] } = (req.body ?? {}) as any;

    // Истори-г OpenAI формат руу хувиргах
    const messages: { role: 'system'|'user'|'assistant'; content: string }[] = [
      {
        role: 'system',
        content:
          'Чи "Оюунсанаа" нэртэй дотно, эелдэг монгол туслагч. Богино, ойлгомжтой, шүүмжлэлгүй хариул.'
      }
    ];
    for (const m of history) {
      const role = m?.who === 'bot' ? 'assistant' : 'user';
      const content = String(m?.html ?? '').replace(/<[^>]+>/g, '').trim();
      if (content) messages.push({ role, content });
    }
    messages.push({ role: 'user', content: String(msg ?? '') });

    // Зөвшөөрөх модель
    const allow = ['gpt-4o', 'gpt-4o-mini'];
    const resolvedModel = allow.includes(model) ? model : 'gpt-4o-mini';

    // OpenAI руу дуудах (Chat Completions)
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: resolvedModel,
        messages,
        temperature: 0.4,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('[oyunsanaa] OpenAI error:', r.status, data);
      return res.status(r.status).json({ ok: false, error: data?.error?.message || 'OpenAI error' });
    }

    const reply: string =
      data?.choices?.[0]?.message?.content?.trim?.() || 'Одоохондоо хариу олдсонгүй.';
    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    console.error('[oyunsanaa] server error:', e);
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' });
  }
}
