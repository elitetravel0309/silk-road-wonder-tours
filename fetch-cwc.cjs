// fetch-cwc.cjs — audit chinawondercars.com live for the same issues
const https = require('https');
const get = (u) => new Promise((res, rej) => {
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => res({ status: r.statusCode, body: d, url: r.url || u }));
  }).on('error', rej);
});
const audit = (name, body) => {
  const t = body.match(/<title>([^<]*)<\/title>/)?.[1];
  const dup = (t.match(/China Wonder Cars/g) || []).length > 1;
  const orgs = (body.match(/"@type":"(Organization|TravelAgency|AutoRental|LocalBusiness)"/g) || []).length;
  const ph = body.match(/\+?86[- ]?[0-9]{3,4}[- ]?[0-9]{4}[- ]?[0-9]{4}/g) || [];
  const placeholder = body.includes('4444') || body.includes('123-4567') || body.includes('555');
  console.log(`\n=== ${name} ===`);
  console.log('title:', t, dup ? ' [DUP BRAND]' : '');
  console.log('org schemas:', orgs);
  console.log('phones found:', [...new Set(ph)].slice(0, 4));
  console.log('placeholder tel:', placeholder);
};
(async () => {
  const urls = [
    ['HOME', 'https://www.chinawondercars.com/'],
    ['BLOG', 'https://www.chinawondercars.com/blog'],
    ['ABOUT', 'https://www.chinawondercars.com/about'],
    ['CONTACT', 'https://www.chinawondercars.com/contact'],
  ];
  for (const [n, u] of urls) {
    try {
      const r = await get(u);
      if (r.status !== 200) { console.log(`\n=== ${n} === FAIL ${r.status} -> ${r.url}`); continue; }
      audit(n, r.body);
      if (n === 'HOME') {
        console.log('home has review count text:', (r.body.match(/\d[\d,]*\+?\s*(reviews?|travelers|clients)/gi) || []).slice(0, 5));
      }
    } catch (e) { console.log(`\n=== ${n} === ERR`, e.message); }
  }
})();
