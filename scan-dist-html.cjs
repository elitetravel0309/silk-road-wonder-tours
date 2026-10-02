// scan-dist-html.cjs — count .html hrefs in dist + list files
const fs = require('fs');
const path = require('path');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
);
let n = 0;
const hits = {};
const files = walk('dist').filter((f) => f.endsWith('.html'));
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/href="[^"]*\.html/g) || [];
  n += m.length;
  if (m.length) hits[f.replace('dist/', '')] = m.length;
}
console.log('html pages:', files.length, '| href .html count:', n);
const top = Object.entries(hits).sort((a, b) => b[1] - a[1]).slice(0, 10);
for (const [f, c] of top) console.log(c, f);
