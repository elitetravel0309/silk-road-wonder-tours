// verify-rebuild.cjs — check rebuilt blog files for mojibake, images, hrefs
const fs = require('fs');
const ROOT = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/';
const BAD = /鈥|鈫|掳|馃|涔|瞾|ㄩ|鎷|夋|瀛|烀|寘|鐑|鏁|鍠|浠|鍏|ヨ|棌|鍑|璺|ڔ|鍝|鍚|鐣|鍏|杈|緤|鑲|繑|鐗|鑺|鏂|鏉|灏|鍐|鐒|鐩|鍙|鍦|鍒|鍥|鎴|杩|杈|鏉|鎶|鎷|閰|鍢|馃/g;

const files = [
  'src/pages/blog/best-time-to-visit-silk-road.astro',
  'src/pages/blog/central-asia-travel-guide.astro',
  'src/pages/blog/china-diverse-destinations.astro',
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
  'src/pages/404.astro',
];

for (const f of files) {
  const c = fs.readFileSync(ROOT + f, 'utf8');
  const mj = c.match(BAD);
  const htmlHref = (c.match(/\.html/g) || []).length;
  const ffdd = c.includes('\ufffd') ? c.match(/\ufffd/g).length : 0;
  const imgs = c.match(/\/assets\/images\/[\w-]+\.(jpg|png|webp)/g) || [];
  const uniq = [...new Set(imgs)];
  console.log(f.split('/').pop());
  console.log(`   mojibake: ${mj ? mj.length + ' -> ' + [...new Set(mj)].join(' ') : '0'}, .html refs: ${htmlHref}, FFFD: ${ffdd}`);
  console.log(`   imgs(${uniq.length}): ${uniq.slice(0, 8).join(', ')}`);
}
