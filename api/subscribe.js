const BASE_ID = process.env.BASE_ID;
const TABLE_ID = process.env.TABLE_ID;

module.exports = async function handler(req, res) {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

  if (!AIRTABLE_TOKEN) {
    console.error('AIRTABLE_TOKEN env var is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_ID)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        Email: email.trim(),
        Name: (name || '').trim(),
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Airtable error:', data);
    return res.status(response.status).json({
      error: data?.error?.message || 'Failed to subscribe. Please try again.',
    });
  }

  return res.status(200).json({ success: true, id: data.id });
};
