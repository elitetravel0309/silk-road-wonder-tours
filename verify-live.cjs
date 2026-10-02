// verify-live.cjs — authoritative live verification (script file, UTF-8 safe)
const https = require('https');
const get = (u) => new Promise((res, rej) => {
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Encoding': 'identity' } }, (r) => {
    let d = '';
    r.on('data', (c) => (d += c));
    r.on('end', () => res({ status: r.statusCode, url: r.url || u, body: d }));
  }).on('error', rej);
});

(async () => {
  const checks = [
    ['https://silkroadwondertours.com/llms.txt', (b) => b.includes('# Silk Road Wonders'), 'llms.txt content'],
    ['https://silkroadwondertours.com/', (b) => b.includes('153-4772-3823') && !b.includes('4444'), 'phone fixed'],
    ['https://silkroadwondertours.com/', (b) => b.includes('"reviewCount":"8"'), 'rating=8'],
    ['https://silkroadwondertours.com/blog/sven-hedin-xinjiang', (b) => b.includes('"datePublished":"2022-03-17"'), 'sven date'],
    ['https://silkroadwondertours.com/blog/china-diverse-destinations', (b) => b.includes('Beijing') && !/[\u9200-\u948f]/.test(b), 'china-diverse clean'],
    ['https://silkroadwondertours.com/', (b) => b.includes('hotels · English'), 'index bullet'],
    ['https://silkroadwondertours.com/luxury-silk-road', (b) => b.includes('Star Hotels · Private') || b.includes('·'), 'luxury bullet'],
  ];
  for (const [u, fn, name] of checks) {
    try {
      const r = await get(u);
      if (r.status !== 200) { console.log(`FAIL ${name}: HTTP ${r.status}`); continue; }
      console.log((fn(r.body) ? 'OK  ' : 'BAD ') + name + '  [' + u.replace('https://silkroadwondertours.com', '') + ']');
    } catch (e) {
      console.log(`ERR ${name}: ${e.message.slice(0, 60)}`);
    }
  }
})();
