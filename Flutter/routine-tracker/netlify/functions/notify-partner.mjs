/**
 * POST /.netlify/functions/notify-partner
 * Body: { whoMissed: 'chaithu'|'sujesh', date: 'YYYY-MM-DD', missed: string[] }
 *
 * Sends WhatsApp to the PARTNER via free CallMeBot API.
 * Setup: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */

const PARTNERS = {
  chaithu: {
    name: 'Chaithu',
    phone: process.env.CHAITHU_WHATSAPP || process.env.VITE_CHAITHU_WHATSAPP || '919744415022',
    apikey: process.env.CHAITHU_CALLMEBOT_APIKEY || '',
  },
  sujesh: {
    name: 'Sujesh',
    phone: process.env.SUJESH_WHATSAPP || process.env.VITE_SUJESH_WHATSAPP || '919526494378',
    apikey: process.env.SUJESH_CALLMEBOT_APIKEY || '',
  },
};

function partnerOf(id) {
  return id === 'sujesh' ? 'chaithu' : 'sujesh';
}

async function sendCallMeBot(phone, apikey, text) {
  const digits = String(phone).replace(/\D/g, '');
  if (!digits || !apikey) {
    return { ok: false, error: 'not_configured' };
  }
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${digits}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(apikey)}`;

  const res = await fetch(url);
  const body = await res.text();
  if (!res.ok) {
    return { ok: false, error: body || `HTTP ${res.status}` };
  }
  return { ok: true, body };
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const whoMissed = payload.whoMissed;
  const date = payload.date || new Date().toISOString().slice(0, 10);
  const missed = Array.isArray(payload.missed) ? payload.missed : [];

  if (!whoMissed || !PARTNERS[whoMissed] || !missed.length) {
    return new Response(JSON.stringify({ error: 'whoMissed and missed[] required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const recipientId = partnerOf(whoMissed);
  const recipient = PARTNERS[recipientId];
  const who = PARTNERS[whoMissed];

  if (!recipient.phone || !recipient.apikey) {
    return new Response(
      JSON.stringify({
        error: 'not_configured',
        hint: `Set ${recipientId.toUpperCase()}_WHATSAPP and ${recipientId.toUpperCase()}_CALLMEBOT_APIKEY in Netlify env`,
      }),
      { status: 501, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const lines = missed.map((m, i) => `${i + 1}. ${m}`).join('\n');
  const text =
    `Hey 👋 Reminder from Our Daily Routine\n\n` +
    `*${who.name}* still has incomplete tasks for *${date}*:\n\n` +
    `${lines}\n\n` +
    `Gentle nudge — finish them when you can 💪❤️`;

  const result = await sendCallMeBot(recipient.phone, recipient.apikey, text);

  if (!result.ok) {
    return new Response(JSON.stringify(result), {
      status: result.error === 'not_configured' ? 501 : 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ ok: true, notified: recipient.name, about: who.name }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

