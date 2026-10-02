// rebuild-blog2.cjs — correct hunk-paired image replay + quote fix + href strip
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
const isImgLine = (l) => /ogImage|url\(|img|background/.test(l);

// Parse commit diff into hunks; pair old->new image replacements per hunk.
function buildMap(commit, file) {
  const out = cp.execSync(g + ' show ' + commit + ' -- ' + file, { encoding: 'utf8' });
  const map = {};
  const hunks = [];
  let cur = null;
  for (const line of out.split('\n')) {
    if (line.startsWith('@@')) { cur = { old: [], add: [] }; hunks.push(cur); continue; }
    if (!cur) continue;
    if (line.startsWith('-') && !line.startsWith('---')) {
      const m = line.match(IMG_RE);
      if (m && isImgLine(line)) cur.old.push(m[0]);
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      const m = line.match(IMG_RE);
      if (m && isImgLine(line)) cur.add.push(m[0]);
    }
  }
  for (const h of hunks) {
    const n = Math.min(h.old.length, h.add.length);
    for (let i = 0; i < n; i++) {
      if (h.old[i] !== h.add[i]) map[h.old[i]] = h.add[i];
    }
  }
  return map;
}

for (const f of files) {
  let content = cp.execSync(g + ' show f1175ce:' + f, { encoding: 'utf8' });
  if (content.includes('\ufffd')) { console.log('SKIP (clean has FFFD): ' + f); continue; }

  for (const [commit, tag] of [['bb75d08', 'bb'], ['bfa1405', 'bf']]) {
    const map = buildMap(commit, f);
    for (const [old, nw] of Object.entries(map)) {
      content = content.split(old).join(nw);
    }
    console.log(`  ${tag}(${f.split('/').pop()}): ${Object.keys(map).length} img pairs`);
  }

  // Replay bb75d08 quote fix: url('/assets/images/x.jpg) -> url('/assets/images/x.jpg')
  content = content.replace(/url\('(\/assets\/images\/[\w-]+\.(?:jpg|png|webp))(?!')/g, "url('$1')");

  // Strip .html and normalize /index
  content = content.replace(/\.html/g, '');
  content = content.replace(/href="\/index"/g, 'href="/"');

  fs.writeFileSync(ROOT + f, content, 'utf8');
  console.log('REBUILT ' + f);
}
console.log('done');
