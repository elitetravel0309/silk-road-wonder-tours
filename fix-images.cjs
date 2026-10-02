// fix-images.cjs — replace wrong image CONTENTS with correct ones (keep filenames)
const fs = require('fs');
const path = require('path');
const imgs = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/public/assets/images';
const bak = 'C:/Users/Administrator/WorkBuddy/2026-05-28-23-54-44/silkroad-travel/.image-backup-20261002';
fs.mkdirSync(bak, { recursive: true });

const plan = [
  { wrong: 'central-asia-architecture.jpg', src: 'uzbekistan.jpg' },
  { wrong: 'desert-dunes.jpg', src: 'og-default.jpg' },
  { wrong: 'xinjiang-landscape.jpg', src: 'xinjiang-kanas.jpg' },
];
for (const p of plan) {
  const w = path.join(imgs, p.wrong);
  const s = path.join(imgs, p.src);
  if (!fs.existsSync(w)) { console.log('MISSING wrong:', p.wrong); continue; }
  if (!fs.existsSync(s)) { console.log('MISSING src:', p.src); continue; }
  const srcBuf = fs.readFileSync(s);
  const bakPath = path.join(bak, p.wrong);
  if (!fs.existsSync(bakPath)) fs.writeFileSync(bakPath, fs.readFileSync(w));
  fs.writeFileSync(w, srcBuf);
  console.log('replaced', p.wrong, '<-', p.src, '(' + srcBuf.length + ' bytes)');
}
