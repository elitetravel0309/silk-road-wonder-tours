// rebuild-blog.cjs — rebuild 12 clean-source blog files from f1175ce,
// replay bb75d08/bfa1405 image changes, strip .html hrefs.
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

// Extract old→new image path pairs from a commit's diff for a file.
function imagePairs(commit, file) {
  const out = cp.execSync(g + ' show ' + commit + ' -- ' + file, { encoding: 'utf8' });
  const pairs = [];
  const lines = out.split('\n');
  for (const line of lines) {
    if (!line.startsWith('+') && !line.startsWith('-')) continue;
    const isAdd = line.startsWith('+');
    const m = line.match(/\/assets\/images\/[\w-]+\.(?:jpg|png|webp)/g);
    if (!m || m.length === 0) continue;
    // only single-image changes
    if (m.length === 1 && (line.includes('ogImage') || line.includes('url(') || line.includes('img') || line.includes('background'))) {
      pairs.push({ side: isAdd ? '+' : '-', img: m[0] });
    }
  }
  return pairs;
}

// Build old→new map: for consecutive (-img, +img) in same context.
function buildMap(commit, file) {
  const out = cp.execSync(g + ' show ' + commit + ' -- ' + file, { encoding: 'utf8' });
  const map = {};
  const lines = out.split('\n');
  let oldImg = null;
  for (const line of lines) {
    if (line.startsWith('-')) {
      const m = line.match(/\/assets\/images\/[\w-]+\.(?:jpg|png|webp)/);
      if (m && /ogImage|url\(|img|background/.test(line)) oldImg = m[0];
    } else if (line.startsWith('+')) {
      const m = line.match(/\/assets\/images\/[\w-]+\.(?:jpg|png|webp)/);
      if (m && /ogImage|url\(|img|background/.test(line)) {
        if (oldImg && m[0] !== oldImg) map[oldImg] = m[0];
        oldImg = null;
      } else {
        oldImg = null;
      }
    } else {
      oldImg = null;
    }
  }
  return map;
}

for (const f of files) {
  let content = cp.execSync(g + ' show f1175ce:' + f, { encoding: 'utf8' });
  if (content.includes('\ufffd')) { console.log('SKIP (clean source has FFFD?): ' + f); continue; }

  // Replay bb75d08 image changes
  const bb = buildMap('bb75d08', f);
  for (const [old, nw] of Object.entries(bb)) {
    content = content.split(old).join(nw);
  }
  // Replay bfa1405 image changes (tour cards)
  const bf = buildMap('bfa1405', f);
  for (const [old, nw] of Object.entries(bf)) {
    content = content.split(old).join(nw);
  }

  // Strip .html from hrefs/urls and normalize /index
  content = content.replace(/\.html/g, '');
  content = content.replace(/href="\/index"/g, 'href="/"');

  fs.writeFileSync(ROOT + f, content, 'utf8');
  console.log(`REBUILT ${f}  (bb:${Object.keys(bb).length} img, bf:${Object.keys(bf).length} img)`);
}
console.log('done');
