// apps/oyunsanaa-core/pages/api/oyunsanaa.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // 2) зөвхөн POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok:false, error: 'Only POST is allowed' });
  }

  try {
    // 3) оролт
    const { msg = '', model = 'gpt-4o-mini', history = [] } = (req.body || {}) as {
      msg?: string; model?: string; history?: { who:'user'|'bot'; html:string }[];
    };

    // 4) нууц түлхүүр
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ ok:false, error: 'OPENAI_API_KEY is not set' });

    // 5) history -> OpenAI messages
    const messages: { role:'user'|'assistant'; content:string }[] = [];
    for (const m of history) {
      const role = m?.who === 'bot' ? 'assistant' : 'user';
      const content = String(m?.html || '').replace(/<[^>]+>/g, '').trim();
      if (content) messages.push({ role, content });
    }
    messages.push({ role: 'user', content: String(msg || '') });

    // 6) OpenAI дуудлага
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: ['gpt-4o', 'gpt-4o-mini'].includes(model) ? model : 'gpt-4o-mini',
        messages,
        temperature: 0.4,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('[oy-chat] OpenAI error:', r.status, data);
      return res.status(r.status).json({ ok:false, error: data?.error?.message || 'OpenAI API error' });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({ ok:true, reply });
  } catch (e:any) {
    console.error('[oy-chat] server error:', e);
    return res.status(500).json({ ok:false, error: 'Server error' });
  }
}
