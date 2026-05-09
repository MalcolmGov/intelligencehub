const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = process.env.RESEND_FROM || 'ZARA <onboarding@resend.dev>';

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json(res, 500, { error: 'RESEND_API_KEY is not configured on the server.' });

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
    const to = String(body.to || '').trim();
    const subject = String(body.subject || 'Latest Fintech AI Use Case Tracker Report').trim();
    const report = String(body.report || '').trim();

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return json(res, 400, { error: 'A valid recipient email is required.' });
    }
    if (!report) return json(res, 400, { error: 'Report content is required.' });

    const html = report
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    const resendRes = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to,
        subject,
        text: report,
        html: `<div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#0f172a">${html}</div>`
      })
    });

    const payload = await resendRes.json().catch(() => ({}));
    if (!resendRes.ok) {
      return json(res, resendRes.status, { error: payload.message || payload.error || 'Resend request failed.' });
    }

    return json(res, 200, { ok: true, id: payload.id });
  } catch (error) {
    return json(res, 500, { error: error.message || 'Unable to send report.' });
  }
};
