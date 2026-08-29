// Batch add width/height to img tags without them
const fs = require('fs');
const path = require('path');

function findAstroFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(findAstroFiles(filePath));
    } else if (file.endsWith('.astro')) {
      results.push(filePath);
    }
  }
  return results;
}

const files = findAstroFiles('src');
let modifiedCount = 0;
let totalImgsModified = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Match img tags that don't have width= attribute
  // Skip logo, favicon, and images with inline height style
  const newContent = content.replace(/<img(?![^>]*\bwidth=)(?![^>]*logo)(?![^>]*favicon)(?![^>]*height:\s*\d+px)([^>]*)>/g, (match, attrs) => {
    modified = true;
    totalImgsModified++;
    return `<img${attrs} width="1200" height="800">`;
  });

  if (modified) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
    console.log(`  Modified: ${path.basename(file)}`);
  }
}

console.log(`\nTotal files modified: ${modifiedCount}`);
console.log(`Total img tags modified: ${totalImgsModified}`);

// Verify
let remaining = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const imgMatches = content.match(/<img[^>]*>/g) || [];
  for (const img of imgMatches) {
    if (!img.includes('width=')) {
      remaining++;
    }
  }
}
console.log(`Images still without width/height: ${remaining}`);
