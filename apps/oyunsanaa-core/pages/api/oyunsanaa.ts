// pages/api/oy-chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS (шаардлагатай бол үлдээ)
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is missing' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const model   = String(body.model || 'gpt-4o-mini').trim();
    const msg     = String(body.msg || '').trim();
    const persona = String(body.persona || 'soft').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!msg) return res.status(400).json({ error: 'Message is required' });

    // Өмнөх мессежүүдийг OpenAI формат руу
    const messages: { role: 'system'|'user'|'assistant', content: string }[] = [];

    // Сэтгэлийн туслагч Оюунсанаа юм 
    const SYSTEM = `
Та дотно, эмпатитай сэтгэл заслын туслагч байна.
Зөвхөн монголоор ярь. Өөрийгөө танилцуулахдаа л нэрээ хэлнэ.
Хариу 2–5 өгүүлбэрийн хэмжээнд, богино, ойлгомжтой байг.`.trim();

    messages.push({ role: 'system', content: SYSTEM });

    for (const h of history) {
      const who = h?.who === 'bot' ? 'assistant' : 'user';
      const text = (h?.html ?? h?.text ?? '').toString().replace(/<[^>]+>/g, '').trim();
      if (text) messages.push({ role: who as any, content: text });
    }

    messages.push({ role: 'user', content: msg });

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
        max_tokens: 600, // урт текстийг даах
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('[oy-chat] OpenAI error:', r.status, data);
      return res.status(r.status).json({ error: data?.error?.message || 'OpenAI API error' });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({
      reply,
      model,
      persona,
      userId: null,
      timestamp: Date.now(),
    });
  } catch (e: any) {
    console.error('[oy-chat] server error:', e);
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
