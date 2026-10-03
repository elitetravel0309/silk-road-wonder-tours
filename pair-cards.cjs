// pair destination card name + image in homepage HTML
const https = require('https');
https.get('https://silkroadwondertours.com/', (r) => {
  let d = '';
  r.on('data', (c) => (d += c));
  r.on('end', () => {
    const names = ['Silk Road', 'Xinjiang', 'Beijing', 'Dunhuang', 'Gansu', 'Shanghai', 'Tibet', 'Urumqi', 'Kashgar', 'Uzbekistan', "Xi'an", 'Zhangjiajie', 'Yunnan', 'Sichuan', 'Qinghai', 'Kyrgyzstan', 'Kazakhstan', 'Zhangye', 'Jiayuguan', 'Turpan', 'Tajikistan'];
    for (const n of names) {
      // card links: <a href="/destinations/..."> often wraps img + name
      const re = new RegExp('<a[^>]*href="[^"]*"[^>]*>([\\s\\S]{0,600}?)' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]{0,80}?</a>', 'i');
      const m = d.match(re);
      if (m) {
        const img = m[1].match(/\/assets\/images\/([a-z0-9-]+\.jpg)/);
        console.log(n, '=>', img ? img[1] : '(no img in anchor)');
      } else {
        // try name then image within 500 chars
        const i = d.indexOf(n);
        if (i >= 0) {
          const win = d.slice(Math.max(0, i - 500), i + 30);
          const img = win.match(/\/assets\/images\/([a-z0-9-]+\.jpg)/g);
          console.log(n, '=> (loose)', img ? img[img.length - 1] : '(none)');
        } else console.log(n, '=> NOT FOUND');
      }
    }
  });
});
