// verify-dates.cjs
const fs = require('fs');
const checks = [
  ['dist/blog/sven-hedin-xinjiang.html', '2022-03-17'],
  ['dist/blog/china-diverse-destinations.html', '2026-01-29'],
  ['dist/blog/gansu-may-travel.html', '2021-10-22'],
  ['dist/blog/silk-road-food-guide.html', '2026-05-31'],
  ['dist/blog/best-time-to-visit-silk-road.html', '2026-08-29'],
  ['dist/blog/kashgar-travel-guide.html', '2026-01-01'],
];
for (const [f, expect] of checks) {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/"datePublished":"([^"]+)/);
  const ok = m && m[1] === expect;
  console.log((ok ? 'OK  ' : 'BAD ') + f.split('/').pop().replace('.html', '') + ' -> ' + (m ? m[1] : 'MISSING') + ' (expect ' + expect + ')');
}
// llms.txt present?
console.log('llms.txt in dist:', fs.existsSync('dist/llms.txt'));
