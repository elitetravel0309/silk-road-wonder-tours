// fix-mojibake-v4.cjs — fix remaining 5 mojibake files (RelatedTours, tibet-tours, 3 tour pages)
// Improved tail-need computation: walk back from tail over continuation bytes to find lead.
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

const PATTERNS = [
  [/鈥\?/g, '— '],
  [/鈫\?/g, '→ '],
  [/鉁\?/g, '✅ '],
  [/鉂\?/g, '❌ '],
  [/鈮\?/g, '≈ '],
  [/鈽\?/g, '★'],
  [/鈽€锔\?/g, '☀️ '],
  [/馃彌锔\?/g, '🏛️ '],
  [/馃彅锔\?/g, '🏔️ '],
  [/馃尋锔\?/g, '🌤️ '],
  [/馃椇锔\?/g, '🗺️ '],
  [/鉂勶笍/g, '❄️'],
  [/鈿狅笍/g, '⚠️'],
  [/虏/g, '²'],
];

// how many continuation bytes the UTF-8 tail is missing (walk back from end)
function tailNeed(b) {
  let i = b.length - 1;
  let cont = 0;
  while (i >= 0 && b[i] >= 0x80 && b[i] <= 0xbf) { cont++; i--; }
  if (i < 0) return 0;
  const lead = b[i];
  let needed = 0;
  if (lead >= 0xf0 && lead <= 0xf4) needed = 3;
  else if (lead >= 0xe0 && lead <= 0xef) needed = 2;
  else if (lead >= 0xc0 && lead <= 0xdf) needed = 1;
  return needed > cont ? needed - cont : 0;
}

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
  const b = Buffer.from(bytes);
  let s = b.toString('utf8');
  if (!s.includes('\ufffd')) return s;
  const need = tailNeed(b);
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
  try {
    const b = iconv.encode(seg, 'gbk');
    const d = decodeBytes(b);
    if (d && !d.includes('\ufffd')) return d;
  } catch {}
  const qs = (seg.match(/\?/g) || []).length;
  if (qs > 0) {
    const prefix = seg.replace(/\?/g, '');
    try {
      const b = iconv.encode(prefix, 'gbk');
      const d = decodeBytes(b);
      if (d && !d.includes('\ufffd')) return d;
    } catch {}
  }
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
