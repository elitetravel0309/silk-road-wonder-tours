// strip-html-refs.cjs — remove .html from attribute values and schema URLs site-wide
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/';

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );
}
const files = walk(ROOT + 'src').filter((f) => f.endsWith('.astro'));

const reAttr = /((?:href|src|action)=")([^"]*)\.html"/g;      // attribute values
const reSchema = /("(?:url|item)":\s*")(https?:\/\/[^"]*)\.html"/g; // JSON-LD url/item
const reSiteUrl = /(siteUrl \+ ")([^"]*)\.html"/g;            // JS: siteUrl + "/x.html"

let total = 0, filesChanged = 0;
for (const f of files) {
  const p = f;
  let c = fs.readFileSync(p, 'utf8');
  const before = c;
  c = c.replace(reAttr, '$1$2"');
  c = c.replace(reSchema, '$1$2"');
  c = c.replace(reSiteUrl, '$1$2"');
  if (c !== before) {
    fs.writeFileSync(p, c, 'utf8');
    filesChanged++;
    const n = (before.match(/\.html/g) || []).length - (c.match(/\.html/g) || []).length;
    total += n;
    console.log(`${n}x  ${f}`);
  }
}
console.log(`\nFiles changed: ${filesChanged}, .html refs removed: ${total}`);
// report remaining .html occurrences
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/[^\n]*\.html[^\n]*/g);
  if (m) for (const l of m) console.log('REMAIN: ' + f + ' :: ' + l.trim().slice(0, 110));
}
