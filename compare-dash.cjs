// compare-dash.cjs — check whether working-tree vs f1175ce differs beyond dashes & images
const cp = require('child_process');
const g = 'C:/Tools/mingit/git-2.47.1/cmd/git.exe';
const fs = require('fs');

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
];

const norm = (s) => s.replace(/[–—]/g, 'DASH').replace(/\uFEFF/g, '');
const isImageLine = (s) => /assets\/images|ogImage|background:|width=|height=|loading=|class="img-fill"/.test(s);

let anyIssue = false;
for (const f of files) {
  const clean = cp.execSync(g + ' show f1175ce:' + f, { encoding: 'utf8' });
  const work = fs.readFileSync(f, 'utf8');
  const cl = clean.split('\n');
  const wl = work.split('\n');
  // line-by-line compare with dash normalization
  const issues = [];
  const max = Math.max(cl.length, wl.length);
  for (let i = 0; i < max; i++) {
    const a = cl[i] || '';
    const b = wl[i] || '';
    if (norm(a) === norm(b)) continue;
    if (isImageLine(a) || isImageLine(b)) continue;   // expected image diffs
    if (a.trim() === '' && b.trim() === '') continue;
    issues.push({ line: i + 1, clean: a.slice(0, 100), work: b.slice(0, 100) });
  }
  if (issues.length) {
    anyIssue = true;
    console.log('=== ' + f + ' — ' + issues.length + ' non-dash/image diffs');
    issues.slice(0, 8).forEach((x) => console.log(`  L${x.line}\n    clean: ${JSON.stringify(x.clean)}\n    work:  ${JSON.stringify(x.work)}`));
  } else {
    console.log('OK (only dash/image diffs): ' + f);
  }
}
console.log('\nNon-dash issues present:', anyIssue);
