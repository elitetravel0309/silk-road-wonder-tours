// compress-images.cjs — compress heavy images with sharp (resize ≤1600w, webp q80 / jpg q82)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
);

const files = walk('public/assets/images').filter((f) => /\.(jpg|jpeg|webp)$/i.test(f));
let saved = 0, done = 0, skipped = 0;
(async () => {
for (const f of files) {
  const size = fs.statSync(f).size;
  if (size < 200 * 1024) { skipped++; continue; } // only heavy ones
  const meta = await sharp(f).metadata();
  const w = meta.width || 0;
  const targetW = Math.min(w, 1600);
  const out = path.join(path.dirname(f), '_tmp' + path.extname(f));
  let opts = {};
  if (/\.webp$/i.test(f)) opts = { quality: 80 };
  else opts = { quality: 82, mozjpeg: true };
  await sharp(f).resize({ width: targetW, withoutEnlargement: true }).toFormat(meta.format, opts).toFile(out);
  const ns = fs.statSync(out).size;
  if (ns < size) {
    try {
      fs.renameSync(out, f);
    } catch (e) {
      try { fs.copyFileSync(out, f); fs.unlinkSync(out); }
      catch (e2) { console.log(`LOCKED, kept original ${f.replace('public/', '')}`); try { fs.unlinkSync(out); } catch (_) {} continue; }
    }
    saved += size - ns;
    done++;
    console.log(`${(size / 1024).toFixed(0)}KB -> ${(ns / 1024).toFixed(0)}KB  ${f.replace('public/', '')}  (${w}px)`);
  } else {
    skipped++;
    console.log(`SKIP (no gain) ${f.replace('public/', '')}`);
  }
  try { fs.unlinkSync(out); } catch (_) {}
}
console.log(`\ncompressed: ${done}, skipped: ${skipped}, saved: ${(saved / 1024).toFixed(0)}KB`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
