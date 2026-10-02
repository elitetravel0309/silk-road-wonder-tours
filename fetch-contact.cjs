// fetch-contact.cjs
const https = require('https');
const get = (u) => new Promise((res, rej) => {
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => res({ status: r.statusCode, headers: r.headers, body: d, url: r.url || u }));
  }).on('error', rej);
});
(async () => {
  const r = await get('https://www.silkroadwondertours.com/contact');
  console.log('STATUS:', r.status, '| final URL:', r.url);
  console.log('content-type:', r.headers['content-type']);
  const b = r.body;
  console.log('length:', b.length);
  // form present?
  console.log('has <form>:', b.includes('<form'));
  console.log('has mailer.php:', b.includes('mailer.php'));
  console.log('has inquiries:', b.includes('inquiries'));
  console.log('has openstreetmap:', b.includes('openstreetmap'));
  console.log('has whatsapp:', b.includes('WhatsApp') || b.includes('whatsapp'));
  console.log('has wechat:', b.includes('WeChat') || b.includes('wechat'));
  // images
  const imgs = [...b.matchAll(/<img[^>]*>/g)].map((m) => m[0].match(/src="([^"]+)/)?.[1]).filter(Boolean);
  console.log('imgs:', imgs.length, imgs.slice(0, 8));
  // forms action
  const actions = [...b.matchAll(/<form[^>]*>/g)].map((m) => m[0]);
  console.log('forms:', actions);
  // title
  console.log('title:', b.match(/<title>([^<]*)<\/title>/)?.[1]);
  // broken refs: .html links
  const htmlLinks = [...b.matchAll(/href="([^"]*\.html[^"]*)"/g)].map((m) => m[1]);
  console.log('href .html:', htmlLinks.slice(0, 5));
  // scripts
  const scripts = [...b.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  console.log('scripts:', scripts);
})().catch((e) => console.error('ERR', e.message));
