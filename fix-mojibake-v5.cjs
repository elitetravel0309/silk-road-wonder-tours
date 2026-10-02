// fix-mojibake-v5.cjs — deterministic fix for 5 remaining files (no guessing)
const fs = require('fs');
const iconv = require('iconv-lite');

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

// deterministic replacements — '?' patterns and known double-corruption
const PATTERNS = [
  [/鍐嶈/g, '再见'],
  [/鈥\?/g, '— '],
  [/鈫\?/g, '→ '],
  [/鉁\?/g, '✅ '],
  [/鉂\?/g, '❌ '],
  [/鈮\?/g, '≈ '],
  [/鈽\?/g, '★'],
  [/猸\?/g, '🏨 '],
  [/鈽€锔\?/g, '☀️ '],
  [/馃彌锔\?/g, '🏛️ '],
  [/馃彅锔\?/g, '🏔️ '],
  [/馃尋锔\?/g, '🌤️ '],
  [/馃椇锔\?/g, '🗺️ '],
  [/鉂勶笍/g, '❄️'],
  [/鈿狅笍/g, '⚠️'],
  [/虏/g, '²'],
];

function exactIconv(m) {
  try {
    const b = iconv.encode(m, 'gbk');
    const d = Buffer.from(b).toString('utf8');
    return d.includes('\ufffd') ? m : d;
  } catch { return m; }
}

let total = 0;
for (const rel of files) {
  const p = ROOT + rel;
  const s = fs.readFileSync(p, 'utf8');
  let out = '';
  let run = '';
  let fixed = 0;
  const flush = () => {
    if (run) {
      let r = run;
      for (const [re, rep] of PATTERNS) r = r.replace(re, rep);
      // exact iconv for remaining pure-CJK runs (no '?')
      r = r.replace(/[\u3100-\u312f\u3400-\u9fff\u30a0-\u30ff]+/g, (m) => {
        const d = exactIconv(m);
        return d;
      });
      if (r !== run) fixed++;
      out += r;
      run = '';
    }
  };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (isMoji(ch) || (ch === '?' && run.length > 0)) { run += ch; }
    else { flush(); out += ch; }
  }
  flush();
  if (out !== s) { fs.writeFileSync(p, out, 'utf8'); total++; console.log(`FIXED ${rel} (runs: ${fixed})`); }
  else console.log(`OK    ${rel}`);
}
console.log(`\nFiles updated: ${total}`);
