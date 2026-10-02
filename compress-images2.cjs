// compress-images2.cjs — compress heavy images, sharp toFile direct + retry
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const files = walk('public/assets/images')
  .filter((f) => /\.(jpg|jpeg|webp)$/i.test(f) && !/^_tmp/i.test(path.basename(f)));

let saved = 0, done = 0, skipped = 0, locked = 0;
(async () => {
  for (const f of files) {
    const size = fs.statSync(f).size;
    if (size < 200 * 1024) { skipped++; continue; }
    const meta = await sharp(f).metadata();
    const w = meta.width || 0;
    const targetW = Math.min(w, 1600);
    let opts = /\.webp$/i.test(f) ? { quality: 80 } : { quality: 82, mozjpeg: true };
    let ns = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await sharp(f).resize({ width: targetW, withoutEnlargement: true }).toFormat(meta.format, opts).toFile(f);
        ns = fs.statSync(f).size;
        break;
      } catch (e) {
        if (attempt === 2) { locked++; console.log(`LOCKED (kept original) ${f.replace('public/', '')} :: ${e.code}`); ns = null; }
        else await sleep(300);
      }
    }
    if (ns === null) continue;
    if (ns < size) {
      saved += size - ns;
      done++;
      console.log(`${(size / 1024).toFixed(0)}KB -> ${(ns / 1024).toFixed(0)}KB  ${f.replace('public/', '')}  (${w}px)`);
    } else {
      skipped++;
      console.log(`SKIP (no gain) ${f.replace('public/', '')}`);
    }
  }
  console.log(`\ncompressed: ${done}, skipped: ${skipped}, locked: ${locked}, saved: ${(saved / 1024).toFixed(0)}KB`);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
