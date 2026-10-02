// audit-titles.cjs — find BaseLayout titles containing brand name + 320 mentions
const fs = require('fs');
const path = require('path');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
);
const files = walk('src').filter((f) => f.endsWith('.astro'));
console.log('=== titles containing "Silk Road Wonders" ===');
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  for (const m of c.matchAll(/<BaseLayout[^>]*title="([^"]+)"/g)) {
    if (/Silk Road Wonders/i.test(m[1])) console.log(f.replace('src/', '') + ' :: ' + m[1]);
  }
}
console.log('\n=== "320" contexts ===');
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const i = c.indexOf('320');
  if (i >= 0) console.log(f.replace('src/', '') + ' :: ...' + c.slice(Math.max(0, i - 60), i + 40).replace(/\n/g, ' ') + '...');
}
