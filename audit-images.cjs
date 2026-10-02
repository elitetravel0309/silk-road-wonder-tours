// audit-images.cjs — audit <img> attrs across src + heavy files in public
const fs = require('fs');
const path = require('path');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
);

// 1) img tag audit
const files = walk('src').filter((f) => f.endsWith('.astro'));
let total = 0, noAlt = 0, noLoading = 0, noDims = 0, lazy = 0;
const noAltFiles = new Set(), noDimsFiles = new Set();
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  for (const m of c.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    total++;
    if (!/alt=/.test(tag)) { noAlt++; noAltFiles.add(f.replace('src/', '')); }
    if (!/loading=/.test(tag)) { noLoading++; }
    else if (/loading="lazy"/.test(tag)) lazy++;
    if (!/(width|height)=/.test(tag)) { noDims++; noDimsFiles.add(f.replace('src/', '')); }
  }
}
console.log(`IMG total: ${total} | no-alt: ${noAlt} (${[...noAltFiles].slice(0,6).join(', ')}) | no-loading: ${noLoading} | lazy: ${lazy} | no-dims: ${noDims} (${[...noDimsFiles].slice(0,6).join(', ')})`);

// 2) heavy images in public
const imgs = walk('public/assets/images').filter((f) => /\.(jpg|png|webp)$/i.test(f));
const heavy = imgs.map((f) => ({ f, s: fs.statSync(f).size }))
  .sort((a, b) => b.s - a.s).slice(0, 12);
console.log('\nHeaviest images (public/assets/images):');
for (const { f, s } of heavy) console.log('  ' + (s / 1024).toFixed(0) + 'KB  ' + f.replace('public/', ''));

// 3) CSS background-image refs
const css = fs.readFileSync('public/css/style.css', 'utf8');
const bg = css.match(/url\(['"]?([^'")]+)['"]?\)/g) || [];
console.log('\nCSS bg url count:', bg.length);
