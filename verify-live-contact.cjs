// verify-live-contact.cjs
const https = require('https');
const get = (u) => new Promise((res, rej) => {
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => res({ status: r.statusCode, body: d }));
  }).on('error', rej);
});
(async () => {
  const urls = [
    'https://silkroadwondertours.com/contact',
    'https://silkroadwondertours.com/faq',
    'https://silkroadwondertours.com/blog',
    'https://silkroadwondertours.com/search',
    'https://silkroadwondertours.com/review',
  ];
  for (const u of urls) {
    const r = await get(u);
    if (r.status !== 200) { console.log('FAIL', u, r.status); continue; }
    const t = r.body.match(/<title>([^<]*)<\/title>/)?.[1];
    const dup = (t.match(/Silk Road Wonders/g) || []).length > 1;
    console.log((dup ? 'DUP ' : 'OK  ') + u.replace('https://silkroadwondertours.com', '') + ' :: ' + t);
  }
  // contact specifics
  const c = (await get('https://silkroadwondertours.com/contact')).body;
  console.log('\ncontact org schemas:', (c.match(/"@type":"(Organization|TravelAgency)"/g) || []).length);
  console.log('contact has inquiryFormMain:', c.includes('inquiryFormMain'));
  console.log('contact no 4444:', !c.includes('4444'));
  console.log('contact has whatsapp qr:', c.includes('whatsapp-qr.png'));
  console.log('contact has wechat qr:', c.includes('wechat-qr.png'));
  // review count consistency on homepage
  const h = (await get('https://silkroadwondertours.com/')).body;
  console.log('\nhome 8+ featured:', h.includes('8+ featured reviews'));
  console.log('home no 320+ reviews:', !h.includes('320+ reviews'));
})();
