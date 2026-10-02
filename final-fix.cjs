// final-fix.cjs — fix china-diverse (ڔ→·, .html) and 404 (.html) with UTF-8 safe writes
const fs = require('fs');
const ROOT = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/';

const targets = [
  { file: 'src/pages/blog/china-diverse-destinations.astro',
    rules: [
      [/\u06946 min read/g, '· 6 min read'],            // ڔ6 min read
      [/Travel Consultant \u0694/g, 'Travel Consultant · '], // ڔ500+
      [/\.html/g, ''],
      [/href="\/index"/g, 'href="/"'],
    ] },
  { file: 'src/pages/404.astro',
    rules: [
      [/\.html/g, ''],
      [/href="\/index"/g, 'href="/"'],
    ] },
];

for (const t of targets) {
  const p = ROOT + t.file;
  let c = fs.readFileSync(p, 'utf8');
  let log = [];
  for (const [re, rep] of t.rules) {
    const hits = (c.match(re) || []).length;
    c = c.replace(re, rep);
    if (hits) log.push(`  ${t.file}: ${hits}x ${re}`);
  }
  fs.writeFileSync(p, c, 'utf8');
  log.forEach((l) => console.log(l));
  console.log('fixed ' + t.file);
}
// verify
for (const t of targets) {
  const c = fs.readFileSync(ROOT + t.file, 'utf8');
  const html = (c.match(/\.html/g) || []).length;
  const weird = (c.match(/[\u0694\u74ba]/g) || []).length;
  const ffdd = (c.match(/\ufffd/g) || []).length;
  console.log(`verify ${t.file}: .html=${html}, weird=${weird}, FFFD=${ffdd}`);
}
