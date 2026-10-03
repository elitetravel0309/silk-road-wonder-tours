// parse actual card pairs from built dist/index.html
const fs = require('fs');
const d = fs.readFileSync('dist/index.html', 'utf8');
// destination cards are typically <a ...><img src="..."><span>Name</span></a>
// find all img tags and look ahead for a short name token
const re = /<a[^>]*class="[^"]*(?:dest|card)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
let m; let n = 0;
while ((m = re.exec(d)) && n < 30) {
  const blk = m[1];
  const img = blk.match(/\/assets\/images\/([a-z0-9-]+\.jpg)/);
  const title = blk.match(/(?:alt|title|aria-label)="([^"]{2,40})"/) || blk.match(/>([A-Za-zÀ-ž][^<>]{1,40})</);
  if (img) { n++; console.log((title ? title[1].trim() : '?').padEnd(24), '=>', img[1]); }
}
if (n === 0) {
  // fallback: contiguous image+text pairs anywhere
  const re2 = /\/assets\/images\/([a-z0-9-]+\.jpg)[\s\S]{0,300}?>(Silk Road|Xinjiang|Beijing|Dunhuang|Gansu|Shanghai|Tibet|Urumqi|Kashgar|Uzbekistan|Xi&#39;an|Xi&#x27;an|Xi'an|Zhangjiajie|Yunnan|Sichuan|Qinghai|Kyrgyzstan|Kazakhstan|Zhangye|Jiayuguan|Turpan|Tajikistan)</g;
  let m2;
  while ((m2 = re2.exec(d))) console.log(m2[2].padEnd(24), '=>', m2[1]);
}
