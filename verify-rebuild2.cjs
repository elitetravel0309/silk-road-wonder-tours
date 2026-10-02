// verify-rebuild2.cjs — compare rebuilt files vs bfa1405 (images), check mojibake/href/quotes
const cp = require('child_process');
const fs = require('fs');
const g = 'C:/Tools/mingit/git-2.47.1/cmd/git.exe';
const ROOT = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/';
const BAD = /鈥|鈫|掳|馃|涔|瞾|ㄩ|鎷|夋|瀛|烀|寘|鐑|鏁|鍠|浠|鍏|ヨ|棌|鍑|璺|ڔ|鍝|鍚|鐣|杈|緤|鑲|鏂|鏉|灏|鍐|鐒|鐩|鍙|鍦|鍒|鍥|鎴|杩|鏉|鎶|鎷|閰|鍢|锛/g;

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

let allOk = true;
for (const f of files) {
  const cur = fs.readFileSync(ROOT + f, 'utf8');
  const target = cp.execSync(g + ' show bfa1405:' + f, { encoding: 'utf8' });
  const imgSet = (s) => [...new Set((s.match(/\/assets\/images\/[\w-]+\.(?:jpg|png|webp)/g) || []))].sort();
  const a = imgSet(cur), b = imgSet(target);
  const onlyCur = a.filter(x => !b.includes(x));
  const onlyTarget = b.filter(x => !a.includes(x));
  const mj = cur.match(BAD);
  const html = (cur.match(/\.html/g) || []).length;
  const qbug = (cur.match(/url\('\/assets\/images\/[\w-]+\.(?:jpg|png|webp)\)/g) || []).length;
  const ffdd = (cur.match(/\ufffd/g) || []).length;
  const ok = mj === null && html === 0 && qbug === 0 && ffdd === 0 && onlyCur.length === 0 && onlyTarget.length === 0;
  if (!ok) allOk = false;
  console.log((ok ? 'OK  ' : 'DIFF') + ' ' + f.split('/').pop());
  if (mj) console.log('   mojibake: ' + [...new Set(mj)].join(' '));
  if (html) console.log('   .html refs: ' + html);
  if (qbug) console.log('   quote bug: ' + qbug);
  if (ffdd) console.log('   FFFD: ' + ffdd);
  if (onlyCur.length) console.log('   only in cur: ' + onlyCur.join(', '));
  if (onlyTarget.length) console.log('   only in target(bfa1405): ' + onlyTarget.join(', '));
}
console.log('\nAll clean vs bfa1405 images:', allOk);
