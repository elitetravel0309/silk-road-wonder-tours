// verify-live-images.cjs — check deployed images + index card markup
const https = require('https');
const base = 'https://silkroadwondertours.com';
const paths = [
  '/assets/images/central-asia-architecture.jpg',
  '/assets/images/desert-dunes.jpg',
  '/assets/images/xinjiang-landscape.jpg',
  '/assets/images/og-default.jpg',
];
const get = (p) => new Promise((res) => {
  https.get(base + p, (r) => {
    const len = parseInt(r.headers['content-length'] || '0', 10);
    const type = r.headers['content-type'] || '';
    r.resume();
    res({ p, code: r.statusCode, len, type });
  }).on('error', (e) => res({ p, err: e.message }));
});
(async () => {
  for (const p of paths) console.log(JSON.stringify(await get(p)));
  // index HTML card check
  await new Promise((r) => https.get(base + '/', (resp) => {
    let d = '';
    resp.on('data', (c) => (d += c));
    resp.on('end', () => {
      const silk = d.match(/Silk Road[^>]*?og-default\.jpg/) || d.match(/og-default\.jpg[^<]*?Silk Road/);
      const gansu = d.match(/Gansu[^>]*?desert-dunes\.jpg/) || d.match(/desert-dunes\.jpg[^<]*?Gansu/);
      const kashgar = d.match(/Kashgar[^>]*?central-asia-architecture\.jpg/) || d.match(/central-asia-architecture\.jpg[^<]*?Kashgar/);
      const xinjiang = d.match(/Xinjiang[^>]*?xinjiang-landscape\.jpg/) || d.match(/xinjiang-landscape\.jpg[^<]*?Xinjiang/);
      console.log('index cards:', JSON.stringify({ silk: !!silk, gansu: !!gansu, kashgar: !!kashgar, xinjiang: !!xinjiang }));
      r();
    });
  }).on('error', (e) => console.log('index err', e.message)));
})();
