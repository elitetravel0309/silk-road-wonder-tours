// rebuild-blog3.cjs — final: f1175ce base + bb75d08 global img + bfa1405 href-anchored card imgs + quote fix + href strip
const cp = require('child_process');
const fs = require('fs');
const g = 'C:/Tools/mingit/git-2.47.1/cmd/git.exe';
const ROOT = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/';

const files = [
  'src/pages/blog/best-time-to-visit-silk-road.astro',
  'src/pages/blog/central-asia-travel-guide.astro',
  'src/pages/blog/china-train-travel-guide.astro',
  'src/pages/blog/china-travel-visa-guide.astro',
  'src/pages/blog/gansu-heritage.astro',
  'src/pages/blog/gansu-may-travel.astro',
  'src/pages/blog/karakoram-highway.astro',
  'src/pages/blog/silk-road-food-guide.astro',
  'src/pages/blog/silk-road-monthly-guide.astro',
  'src/pages/blog/silk-road-photography-tips.astro',
  'src/pages/blog/sven-hedin-xinjiang.astro',
  'src/pages/blog/xinjiang-travel-guide.astro',
];

const IMG_RE = /\/assets\/images\/[\w-]+\.(?:jpg|png|webp)/g;

// bb75d08: global old->new image pairs (per hunk, only unique old)
function globalMap(commit, file) {
  const out = cp.execSync(g + ' show ' + commit + ' -- ' + file, { encoding: 'utf8' });
  const map = {};
  const seen = new Set();
  let cur = null;
  for (const line of out.split('\n')) {
    if (line.startsWith('@@')) { cur = { old: [], add: [] }; continue; }
    if (!cur) continue;
    if (line.startsWith('-') && !line.startsWith('---')) { const m = line.match(IMG_RE); if (m) cur.old.push(m[0]); }
    else if (line.startsWith('+') && !line.startsWith('+++')) { const m = line.match(IMG_RE); if (m) cur.add.push(m[0]); }
  }
  // collect per hunk, but only keep pairs whose old key is unique across file
  const pairs = [];
  for (const h of cur ? [] : []) {}
  return null; // unused
}

// Simpler bb75d08: collect all old/new within same hunk, map old->new only when old appears once overall
function buildGlobalMap(commit, file) {
  const out = cp.execSync(g + ' show ' + commit + ' -- ' + file, { encoding: 'utf8' });
  const hunks = [];
  let cur = null;
  for (const line of out.split('\n')) {
    if (line.startsWith('@@')) { cur = { old: [], add: [] }; hunks.push(cur); continue; }
    if (!cur) continue;
    if (line.startsWith('-') && !line.startsWith('---')) { const m = line.match(IMG_RE); if (m) cur.old.push(m[0]); }
    else if (line.startsWith('+') && !line.startsWith('+++')) { const m = line.match(IMG_RE); if (m) cur.add.push(m[0]); }
  }
  const pairList = [];
  for (const h of hunks) {
    const n = Math.min(h.old.length, h.add.length);
    for (let i = 0; i < n; i++) if (h.old[i] !== h.add[i]) pairList.push([h.old[i], h.add[i]]);
  }
  // group by old; keep mapping only if all new values for that old are identical
  const byOld = {};
  for (const [o, nw] of pairList) (byOld[o] = byOld[o] || new Set()).add(nw);
  const map = {};
  for (const [o, s] of Object.entries(byOld)) if (s.size === 1) map[o] = [...s][0];
  return map;
}

// bfa1405: extract href -> img from the bfa1405 text (not diff)
function hrefImgMap(commit, file) {
  const txt = cp.execSync(g + ' show ' + commit + ':' + file, { encoding: 'utf8' });
  const map = {};
  const re = /<a href="([^"]+)"[^>]*class="tour-card"[^>]*>.*?<img[^>]*src="(\/assets\/images\/[\w-]+\.(?:jpg|png|webp))"/gs;
  let m;
  while ((m = re.exec(txt))) {
    const href = m[1].replace(/\.html$/, '');
    map[href] = m[2];
  }
  return map;
}

for (const f of files) {
  let content = cp.execSync(g + ' show f1175ce:' + f, { encoding: 'utf8' });
  if (content.includes('\ufffd')) { console.log('SKIP (clean has FFFD): ' + f); continue; }

  // 1) bb75d08 global image change (og/hero/avatar)
  const gmap = buildGlobalMap('bb75d08', f);
  for (const [old, nw] of Object.entries(gmap)) content = content.split(old).join(nw);

  // 2) bfa1405 href-anchored card images
  const hmap = hrefImgMap('bfa1405', f);
  for (const [href, img] of Object.entries(hmap)) {
    const re = new RegExp('(<a href="' + href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\.html)?"[^>]*class="tour-card"[^>]*>.*?<img[^>]*src=")[^"]*(")', 'gs');
    content = content.replace(re, '$1' + img + '$2');
  }

  // 3) quote fix + href strip
  content = content.replace(/url\('(\/assets\/images\/[\w-]+\.(?:jpg|png|webp))(?!')/g, "url('$1')");
  content = content.replace(/\.html/g, '');
  content = content.replace(/href="\/index"/g, 'href="/"');

  fs.writeFileSync(ROOT + f, content, 'utf8');
  console.log(`REBUILT ${f}  (bb:${Object.keys(gmap).length}, cards:${Object.keys(hmap).length})`);
}
console.log('done');
