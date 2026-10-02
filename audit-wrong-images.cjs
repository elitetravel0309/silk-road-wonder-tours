// audit-wrong-images.cjs — find all refs to wrong images across src
const fs = require('fs');
const path = require('path');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk('src').filter((f) => /\.(astro|css)$/.test(f));
const wrong = ['central-asia-architecture', 'desert-dunes', 'xinjiang-landscape', 'hero-silkroad'];
for (const w of wrong) {
  console.log('\n=== ' + w + ' ===');
  let n = 0;
  for (const f of files) {
    const c = fs.readFileSync(f, 'utf8');
    const re = new RegExp('([\'"/])([^\'"/]*' + w + '[^\'"/]*)([\'"/])', 'g');
    for (const m of c.matchAll(re)) {
      n++;
      console.log('  ' + f.replace('src/', '') + ' :: ' + m[2]);
    }
  }
  console.log('  total:', n);
}
