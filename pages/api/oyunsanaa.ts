// pages/api/oyunsanaa.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ReqBody = {
  model?: string;
  msg?: string;
  history?: { who: 'user' | 'bot'; html?: string; text?: string }[];
  persona?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS (хэрэв өөр домэйнээс дуудвал)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ ok: false, error: 'OPENAI_API_KEY is missing' });

    const { model = 'gpt-4o-mini', msg = '', history = [], persona = 'soft' } =
      (req.body || {}) as ReqBody;

    // history → OpenAI messages болгох (урт мессежүүдийг авч чадна)
    const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [];
    messages.push({
      role: 'system',
      content:
        persona === 'soft'
          ? 'Чи Оюунсанаа нэртэй, эелдгээр, товч тодорхой хариулдаг монгол туслах.'
          : 'You are a helpful assistant.',
    });

    for (const m of history) {
      const role = m?.who === 'bot' ? 'assistant' : 'user';
      const content = String(m?.text || m?.html || '').replace(/<[^>]+>/g, '').trim();
      if (content) messages.push({ role, content });
    }
    messages.push({ role: 'user', content: String(msg || '') });

    // OpenAI chat completion
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('[oyunsanaa] OpenAI error:', r.status, data);
      return res.status(r.status).json({ ok: false, error: data?.error?.message || 'OpenAI error' });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    console.error('[oyunsanaa] server error:', e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
