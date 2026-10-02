// fix-remaining-mojibake.cjs — fix verified remaining mojibake:
//  1) em-dash family GBK-misread chars (鈀..鑰 range) -> — (em-dash)
//  2) "路" between Latin/English tokens (was ·) -> ·
const fs = require('fs');
const path = require('path');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
);

const targets = walk('src').filter((f) => f.endsWith('.astro'));
let total = 0;
for (const f of targets) {
  const c0 = fs.readFileSync(f, 'utf8');
  let c = c0;
  // 1) GBK-misread em-dash family: any char in 鈀..鑰 range that is a GBK misread of UTF-8 dash/star etc.
  //    Safe: these are never legitimate in this site's content except as mojibake.
  c = c.replace(/[\u9200-\u948f]/g, '—');
  // 2) "路" surrounded by Latin/space/digit/hyphen -> was · (bullet)
  c = c.replace(/([A-Za-z0-9&\- ])路([ A-Za-z0-9])/g, '$1·$2');
  if (c !== c0) {
    fs.writeFileSync(f, c, 'utf8');
    const n = (c0.match(/[\u9200-\u948f]/g) || []).length + (c0.match(/[A-Za-z0-9&\- ]路[ A-Za-z0-9]/g) || []).length;
    total += n;
    console.log(`${n}x  ${f.replace('src/', '')}`);
  }
}
console.log('fixed total:', total);

// verify: show any remaining suspicious patterns
console.log('\n=== remaining check ===');
for (const f of targets) {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/[\u9200-\u948f]|[A-Za-z0-9&\- ]路[ A-Za-z0-9]/g);
  if (m) console.log('STILL:', f.replace('src/', ''), m.slice(0, 5));
}
