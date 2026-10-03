// check index destination cards
const https = require('https');
https.get('https://silkroadwondertours.com/', (r) => {
  let d = '';
  r.on('data', (c) => (d += c));
  r.on('end', () => {
    // find destination card images in order
    const imgs = [...d.matchAll(/\/assets\/images\/([a-z0-9-]+\.jpg)/g)].map((m) => m[1]);
    // dedupe keep order
    const seen = new Set(); const list = [];
    for (const i of imgs) if (!seen.has(i)) { seen.add(i); list.push(i); }
    console.log('ALL unique images on homepage (order):');
    console.log(list.join('\n'));
    // find the destinations block context: print around 'Silk Road' and 'Kashgar'
    for (const name of ['Silk Road', 'Xinjiang', 'Gansu', 'Kashgar']) {
      const idx = d.indexOf(name);
      const ctx = d.slice(Math.max(0, idx - 400), idx + 40);
      const m = ctx.match(/\/assets\/images\/([a-z0-9-]+\.jpg)/g);
      console.log('\n' + name + ' -> image(s) in preceding 400 chars:', m ? m[m.length - 1] : '(none)');
    }
  });
});
