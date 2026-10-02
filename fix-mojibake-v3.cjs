// fix-mojibake-v3.cjs — final GBK mojibake restoration
// v3: adds Bopomofo/Ext-A ranges + tail-byte completion heuristic for '?'.
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

const isMoji = (ch) => {
  const c = ch.codePointAt(0);
  return (
    (c >= 0x3400 && c <= 0x9fff) ||      // CJK + Ext-A + symbols actually used
    (c >= 0x3100 && c <= 0x312f) ||       // Bopomofo (GBK includes these)
    (c >= 0x30a0 && c <= 0x30ff) ||       // katakana
    c === 0x3220 || c === 0x20ac ||
    (c >= 0xff00 && c <= 0xffef) ||
    c === 0x9225 || c === 0x922b || c === 0x923d || c === 0x9242 ||
    c === 0x923f || c === 0x922e || c === 0x9241
  );
};

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
  [/鉂\?/g, '❌ '],
  [/馃挕/g, '💡'],
  [/鈮\?/g, '≈ '],
  [/虏/g, '²'],
  [/烀ゅ寘瀛\?/g, '烤包子'],
  [/鈥\?/g, '— '],
  [/鈫\?/g, '→ '],
  [/鈽\?/g, '★'],
];

// Try completing a truncated UTF-8 tail with candidate continuation bytes.
function completeTail(bytes, need) {
  if (need === 0) return bytes;
  const cont = [];
  const rec = (depth, acc) => {
    if (depth === need) { cont.push(Buffer.from(acc)); return; }
    for (let b = 0x80; b <= 0xbf; b++) rec(depth + 1, acc.concat(b));
  };
  rec(0, []);
  for (const cand of cont) {
    const full = Buffer.concat([Buffer.from(bytes), cand]);
    const s = full.toString('utf8');
    if (!s.includes('\ufffd')) return full;
  }
  return null;
}

function decodeBytes(bytes) {
  // Try plain decode; if truncated tail, complete it.
  let s = Buffer.from(bytes).toString('utf8');
  if (!s.includes('\ufffd')) return s;
  const b = Buffer.from(bytes);
  // figure how many continuation bytes the tail needs
  const last = b[b.length - 1];
  let need = 0;
  if (last >= 0xf0 && last <= 0xf4) need = 3;
  else if (last >= 0xe0 && last <= 0xef) need = 2;
  else if (last >= 0xc0 && last <= 0xdf) need = 1;
  else if (b.length >= 2) {
    const p = b[b.length - 2];
    if (p >= 0xf0 && p <= 0xf4) need = 2;
    else if (p >= 0xe0 && p <= 0xef) need = 1;
    else if (b.length >= 3) {
      const q = b[b.length - 3];
      if (q >= 0xf0 && q <= 0xf4) need = 1;
    }
  }
  if (need > 0) {
    const full = completeTail(b, need);
    if (full) {
      const d = full.toString('utf8');
      if (!d.includes('\ufffd')) return d;
    }
  }
  return null;
}

function fixMojibakeRun(seg) {
  if (!seg) return seg;
  // 1) direct iconv round-trip
  try {
    const b = iconv.encode(seg, 'gbk');
    const d = decodeBytes(b);
    if (d && !d.includes('\ufffd')) return d;
  } catch {}
  // 2) segment ends with '?': try prefix without '?', completing truncated tail
  const qs = (seg.match(/\?/g) || []).length;
  if (qs > 0) {
    const prefix = seg.replace(/\?/g, '');
    try {
      const b = iconv.encode(prefix, 'gbk');
      const d = decodeBytes(b);
      if (d && !d.includes('\ufffd')) return d;
    } catch {}
  }
  // 3) pattern replacements + remaining CJK runs
  let s = seg;
  for (const [re, rep] of PATTERNS) s = s.replace(re, rep);
  s = s.replace(/[\u3100-\u312f\u3400-\u9fff\u30a0-\u30ff]+/g, (m) => {
    try {
      const b = iconv.encode(m, 'gbk');
      const d = decodeBytes(b);
      return d && !d.includes('\ufffd') ? d : m;
    } catch { return m; }
  });
  return s;
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
      const r = fixMojibakeRun(run);
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
