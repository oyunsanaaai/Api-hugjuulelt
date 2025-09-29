import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Only POST is allowed' });
  }

  // ...таны одоогийн прокси/логик үргэлжилнэ...
}

  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ ok: false, error: 'OPENAI_API_KEY is not set' })
    }

    const { msg = '', model = 'gpt-4o-mini', history = [] } = (req.body || {}) as ReqBody

    // history -> OpenAI messages
    const messages: { role: 'user' | 'assistant'; content: string }[] = []
    for (const h of history) {
      const role = h?.who === 'user' ? 'user' : 'assistant'
      const content = String(h?.html || '').replace(/<[^>]+>/g, '').trim()
      if (content) messages.push({ role, content })
    }
    messages.push({ role: 'user', content: String(msg || '') })

    // OpenAI Responses API
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        temperature: 0.4,
      }),
    })

    const data = await r.json()

    if (!r.ok) {
      console.error('[oyunsanaa] OpenAI error:', r.status, data)
      return res.status(r.status).json({ ok: false, error: data?.error?.message || 'OpenAI API error' })
    }

    const reply =
      data?.output_text ??
      data?.choices?.[0]?.message?.content ??
      ''

    return res.status(200).json({ ok: true, reply: String(reply || '').trim() })
  } catch (e: any) {
    console.error('[oyunsanaa] server error:', e)
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' })
  }
}
