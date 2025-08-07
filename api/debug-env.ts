import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow in development or with a secret key
  const debugKey = req.query.key;
  if (process.env.NODE_ENV === 'production' && debugKey !== process.env.DEBUG_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    nodeEnv: process.env.NODE_ENV,
    envVarCheck: {
      AIRTABLE_API_KEY: {
        exists: !!process.env.AIRTABLE_API_KEY,
        length: process.env.AIRTABLE_API_KEY?.length || 0,
        prefix: process.env.AIRTABLE_API_KEY?.substring(0, 10) || 'MISSING'
      },
      AIRTABLE_BASE_ID: {
        exists: !!process.env.AIRTABLE_BASE_ID,
        value: process.env.AIRTABLE_BASE_ID || 'MISSING'
      },
      HASH_SALT: {
        exists: !!process.env.HASH_SALT,
        length: process.env.HASH_SALT?.length || 0
      }
    },
    allAirtableKeys: Object.keys(process.env).filter(k => k.includes('AIRTABLE'))
  };

  return res.status(200).json(diagnostics);
}