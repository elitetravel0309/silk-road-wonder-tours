// compress-images3.cjs — toFile to temp, buffered overwrite with retry
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
    const srcBuf = fs.readFileSync(f); // read once; sharp works on buffer so it never holds the file handle
    const meta = await sharp(srcBuf).metadata();
    const w = meta.width || 0;
    const targetW = Math.min(w, 1600);
    const opts = /\.webp$/i.test(f) ? { quality: 80 } : { quality: 82, mozjpeg: true };
    const tmp = path.join(path.dirname(f), '_tmp' + path.extname(f));
    await sharp(srcBuf).resize({ width: targetW, withoutEnlargement: true }).toFormat(meta.format, opts).toFile(tmp);
    const buf = fs.readFileSync(tmp);
    fs.unlinkSync(tmp);
    let applied = false;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        fs.writeFileSync(f, buf);
        applied = true;
        break;
      } catch (e) {
        if (attempt === 5) { locked++; console.log(`LOCKED (kept original) ${f.replace('public/', '')} :: ${e.code}`); }
        else await sleep(800);
      }
    }
    if (!applied) continue;
    const ns = buf.length;
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
