const BASE_ID = process.env.BASE_ID;
const TABLE_ID = process.env.TABLE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!AIRTABLE_TOKEN || !BASE_ID || !TABLE_ID) {
    console.error('Missing Airtable env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Fetch all records with minimal payload (just the Email field).
  // The cap is 50, so pagination is unlikely but handled for correctness.
  const base = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_ID)}?fields[]=Email&pageSize=100`;

  let count = 0;
  let offset = null;

  try {
    do {
      const url = offset ? `${base}&offset=${encodeURIComponent(offset)}` : base;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      });
      const data = await response.json();

      if (!response.ok) {
        console.error('Airtable error:', data);
        throw new Error(data?.error?.message || 'Airtable API error');
      }

      count += data.records.length;
      offset = data.offset || null;
    } while (offset);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ count });
  } catch (err) {
    console.error('Count fetch failed:', err.message);
    return res.status(500).json({ error: 'Failed to fetch signup count' });
  }
};
