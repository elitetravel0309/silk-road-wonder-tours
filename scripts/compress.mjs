import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const imgDir = join(process.cwd(), 'public', 'assets', 'images');
const files = readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

console.log('[compress] Optimizing images...\n');
let totalBefore = 0, totalAfter = 0;

for (const f of files) {
  const srcPath = join(imgDir, f);
  const tmpPath = srcPath + '.compress_tmp';
  const before = readFileSync(srcPath).length;
  totalBefore += before;

  try {
    const pipeline = sharp(srcPath).resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80, progressive: true });
    await pipeline.toFile(tmpPath);

    const compressed = readFileSync(tmpPath);
    // Write back original
    const buf = Buffer.from(compressed);
    writeFileSync(srcPath, buf);
    // Remove temp
    try { require('fs').unlinkSync(tmpPath); } catch {}

    const after = compressed.length;
    totalAfter += after;
    const pct = ((1 - after / before) * 100).toFixed(0);
    console.log(`  ${pct > 10 ? '✓' : '~'} ${f}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (-${pct}%)`);
  } catch (e) {
    console.log(`  ✗ ${f}: ${e.message}`);
    totalAfter += before;
  }
}

const totalPct = ((1 - totalAfter / totalBefore) * 100).toFixed(0);
console.log(`\n  Total: ${(totalBefore/1024).toFixed(0)}KB → ${(totalAfter/1024).toFixed(0)}KB (-${totalPct}%)`);
console.log('[compress] Done.');
