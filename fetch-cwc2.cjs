// fetch-cwc2.cjs — locate placeholder tel and schema on live pages
const https = require('https');
const get = (u) => new Promise((res, rej) => {
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => res({ status: r.statusCode, body: d }));
  }).on('error', rej);
});
(async () => {
  const pages = {
    HOME: 'https://www.chinawondercars.com/',
    ABOUT: 'https://www.chinawondercars.com/about',
    CONTACT: 'https://www.chinawondercars.com/contact',
  };
  for (const [n, u] of Object.entries(pages)) {
    const b = (await get(u)).body;
    console.log(`\n========== ${n} ==========`);
    // placeholder contexts
    for (const pat of ['4444', '123-4567', '555 123', '555-123', '0000']) {
      let i = b.indexOf(pat);
      if (i >= 0) console.log(`placeholder '${pat}': ...${b.slice(Math.max(0, i - 80), i + 60).replace(/\s+/g, ' ')}...`);
    }
    // schema blocks
    const schemas = [...b.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    console.log('ld+json blocks:', schemas.length);
    schemas.forEach((s, idx) => {
      const t = s.match(/"@type"\s*:\s*"([^"]+)"/)?.[1];
      console.log(`  block ${idx}: @type=${t} | has aggregateRating:${s.includes('aggregateRating')} | has telephone:${s.includes('telephone')}`);
      if (s.includes('telephone')) console.log('    tel ctx:', s.match(/telephone[^,}]{0,50}/)?.[0]);
      if (s.includes('aggregateRating')) console.log('    rating ctx:', s.match(/aggregateRating[\s\S]{0,220}/)?.[0].replace(/\s+/g, ' '));
    });
  }
})();
