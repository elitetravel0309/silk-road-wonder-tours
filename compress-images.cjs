const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImages() {
  const imageDirs = ['public/assets/images', 'public/assets'];
  let totalOriginal = 0, totalCompressed = 0, compressedCount = 0;

  for (const dir of imageDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const originalSize = fs.statSync(filePath).size;
      totalOriginal += originalSize;
      
      try {
        const buffer = await sharp(filePath).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
        const compressedSize = buffer.length;
        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        
        if (compressedSize < originalSize) {
          fs.writeFileSync(filePath, buffer);
          totalCompressed += compressedSize;
          compressedCount++;
          console.log(`  ${file}: ${(originalSize/1024).toFixed(1)}KB -> ${(compressedSize/1024).toFixed(1)}KB (saved ${savings}%)`);
        } else {
          totalCompressed += originalSize;
          console.log(`  ${file}: already optimized (${(originalSize/1024).toFixed(1)}KB)`);
        }
      } catch (err) {
        console.log(`  ${file}: ERROR - ${err.message}`);
        totalCompressed += originalSize;
      }
    }
  }

  console.log(`\n=== Compression Summary ===`);
  console.log(`Images compressed: ${compressedCount}`);
  console.log(`Total original: ${(totalOriginal/1024).toFixed(1)} KB`);
  console.log(`Total compressed: ${(totalCompressed/1024).toFixed(1)} KB`);
  console.log(`Total savings: ${((1 - totalCompressed/totalOriginal)*100).toFixed(1)}%`);
}

compressImages().catch(console.error);
