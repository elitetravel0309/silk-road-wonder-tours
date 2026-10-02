// fix-mojibake.cjs — restore GBK-mojibake text inside .astro files (UTF-8)
// v2: escaped regex '?', verified emoji map, '?' folded into runs.
const fs = require('fs');
const iconv = require('iconv-lite');

const ROOT = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/';
const files = [
  'src/pages/404.astro',
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

// Mojibake chars (GBK-misdecoded CJK etc.). '?' is handled separately by run logic.
const isMoji = (ch) => {
  const c = ch.codePointAt(0);
  return (
    (c >= 0x4e00 && c <= 0x9fff) ||
    (c >= 0x30a0 && c <= 0x30ff) ||
    c === 0x3220 || c === 0x20ac ||
    (c >= 0xff00 && c <= 0xffef) ||
    c === 0x9225 || c === 0x922b || c === 0x923d || c === 0x9242 ||
    c === 0x923f || c === 0x922e || c === 0x9241
  );
};

// Verified replacements for lossy sequences (the '?' swallowed tail bytes).
const PATTERNS = [
  [/馃彌锔\?/g, '🏛️ '],
  [/馃彅锔\?/g, '🏔️ '],
  [/馃尋锔\?/g, '🌤️ '],
  [/馃椇锔\?/g, '🗺️ '],
  [/馃攳/g, '🔍'],
  [/馃惈/g, '🐫'],
  [/馃懃/g, '👥'],
  [/馃挵/g, '💰'],
  [/馃泜/g, '🛂'],
  [/馃搵/g, '📋'],
  [/馃弳/g, '🏆'],
  [/馃尭/g, '🌸'],
  [/鈽€锔\?/g, '☀️ '],
  [/馃崅/g, '🍂'],
  [/鉂勶笍/g, '❄️'],
  [/鈿狅笍/g, '⚠️'],
  [/鉁\?/g, '✅'],
  [/馃挕/g, '💡'],
  [/鈮\?/g, '≈ '],
  [/虏/g, '²'],
  [/鈥\?/g, '— '],
  [/鈫\?/g, '→ '],
  [/鈽\?/g, '★'],
];

function fixMojibakeRun(seg) {
  if (!seg) return seg;
  const runPatterns = (s) => { for (const [re, rep] of PATTERNS) s = s.replace(re, rep); return s; };
  // Try full iconv round-trip first (handles CJK + en-dash like 鈥揗ay → –May).
  try {
    const b = iconv.encode(seg, 'gbk');
    const d = Buffer.from(b).toString('utf8');
    if (!d.includes('\ufffd')) return d;
  } catch {}
  // Lossy: pattern replacements, then iconv any remaining pure-CJK runs.
  let s = runPatterns(seg);
  s = s.replace(/[\u4e00-\u9fff\u30a0-\u30ff]+/g, (m) => {
    try {
      const b = iconv.encode(m, 'gbk');
      const d = Buffer.from(b).toString('utf8');
      return d.includes('\ufffd') ? m : d;
    } catch { return m; }
  });
  return s;
}

let totalFiles = 0;
for (const rel of files) {
  const p = ROOT + rel;
  const s = fs.readFileSync(p, 'utf8');
  let out = '';
  let run = '';
  let fixed = 0;
  const flush = () => {
    if (run) {
      const fixedRun = fixMojibakeRun(run);
      if (fixedRun !== run) fixed++;
      out += fixedRun;
      run = '';
    }
  };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (isMoji(ch) || (ch === '?' && run.length > 0)) {
      run += ch;
    } else {
      flush();
      out += ch;
    }
  }
  flush();
  if (out !== s) {
    fs.writeFileSync(p, out, 'utf8');
    totalFiles++;
    console.log(`FIXED ${rel} (runs: ${fixed})`);
  } else {
    console.log(`OK    ${rel}`);
  }
}
console.log(`\nFixed files: ${totalFiles}`);
