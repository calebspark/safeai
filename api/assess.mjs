// SafeAI · POST /api/assess  (Vercel serverless function)
// Thin wrapper over the shared engine. Holds ANTHROPIC_API_KEY server-side.
// Setup: add ANTHROPIC_API_KEY in Vercel > SafeAI project > Settings > Environment
// Variables (value from Bento Box .env). Then deploy.

import { assess } from './_engine.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const profile = (req.body && req.body.profile) || {};
  const result = await assess(profile);
  if (!result.ok) {
    return res.status(result.status || 500).json({ error: result.reason, detail: result.detail });
  }
  return res.status(200).json(result.data);
}
