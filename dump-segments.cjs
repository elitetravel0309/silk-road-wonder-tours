// dump-segments.cjs — dump all mojibake runs in the 5 files (HEAD state)
const fs = require('fs');
const ROOT = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/';
const files = [
  'src/components/RelatedTours.astro',
  'src/pages/tibet-tours.astro',
  'src/pages/tour/11d-kashgar-kanas.astro',
  'src/pages/tour/11d-silk-road-xinjiang.astro',
  'src/pages/tour/silk-road-northern-xinjiang.astro',
];
const isMoji = (ch) => {
  const c = ch.codePointAt(0);
  return (
    (c >= 0x3400 && c <= 0x9fff) ||
    (c >= 0x3100 && c <= 0x312f) ||
    (c >= 0x30a0 && c <= 0x30ff) ||
    c === 0x3220 || c === 0x20ac ||
    (c >= 0xff00 && c <= 0xffef) ||
    c === 0x9225 || c === 0x922b || c === 0x923d || c === 0x9242 ||
    c === 0x923f || c === 0x922e || c === 0x9241
  );
};
for (const f of files) {
  const s = fs.readFileSync(ROOT + f, 'utf8');
  const seen = new Set();
  let run = '';
  const flush = () => { if (run) { seen.add(run); run = ''; } };
  for (const ch of s) {
    if (isMoji(ch) || (ch === '?' && run.length > 0)) run += ch;
    else flush();
  }
  flush();
  console.log('=== ' + f + ' (' + seen.size + ' unique segments)');
  for (const seg of [...seen].sort((a, b) => b.length - a.length)) {
    console.log('  ' + JSON.stringify(seg) + '  len=' + seg.length);
  }
}
