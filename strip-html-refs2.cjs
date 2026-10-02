// strip-html-refs2.cjs — canonical attrs, search.astro url data, TourCard template, index search link
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/';

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );
}
const files = walk(ROOT + 'src').filter((f) => f.endsWith('.astro'));

const reCanonical = /(canonical="https?:\/\/[^"]*)\.html"/g;       // canonical attrs
const reSearchUrl = /(url:")(?!https?:)([^"]*)\.html"/g;           // search.astro JS url data (relative)
const reTemplate = /(\$\{tour\.slug\}\.html)/g;                    // TourCard template literal
const reSearchLink = /(search\.html)(\?)/g;                        // index sitelinks target

let total = 0, filesChanged = 0;
for (const f of files) {
  const c0 = fs.readFileSync(f, 'utf8');
  let c = c0;
  c = c.replace(reCanonical, '$1"');
  c = c.replace(reSearchUrl, '$1$2"');
  c = c.replace(reTemplate, '${tour.slug}');
  c = c.replace(reSearchLink, 'search$2');
  if (c !== c0) {
    fs.writeFileSync(f, c, 'utf8');
    filesChanged++;
    const n = (c0.match(/\.html/g) || []).length - (c.match(/\.html/g) || []).length;
    total += n;
    console.log(`${n}x  ${path.basename(f)}`);
  }
}
console.log(`\nFiles changed: ${filesChanged}, .html removed: ${total}`);
