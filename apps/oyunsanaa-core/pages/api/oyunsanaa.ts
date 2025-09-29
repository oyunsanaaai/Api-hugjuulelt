// apps/oyunsanaa-core/pages/api/oyunsanaa.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Оюунсанаа API ажиллаж байна 🚀' });
}
