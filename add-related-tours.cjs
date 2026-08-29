const fs = require('fs');
const path = require('path');

const blogDir = 'src/pages/blog';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.astro'));

let updated = 0;
let skipped = 0;

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if RelatedTours already imported
  if (content.includes("RelatedTours")) {
    console.log(`⏭️  ${file}: already has RelatedTours, skipping`);
    skipped++;
    return;
  }

  // Check if has CtaSection import
  if (!content.includes("CtaSection")) {
    console.log(`⚠️  ${file}: no CtaSection found, skipping`);
    skipped++;
    return;
  }

  // Add import after CtaSection import
  const importPattern = /(import CtaSection from '..\/..\/components\/CtaSection\.astro';)/;
  if (importPattern.test(content)) {
    content = content.replace(importPattern, "$1\nimport RelatedTours from '../../components/RelatedTours.astro';");
  } else {
    console.log(`⚠️  ${file}: could not find import pattern`);
    skipped++;
    return;
  }

  // Add RelatedTours before <CtaSection />
  if (content.includes("<CtaSection />")) {
    content = content.replace("<CtaSection />", "<RelatedTours />\n\n<CtaSection />");
  } else {
    console.log(`⚠️  ${file}: could not find <CtaSection />`);
    skipped++;
    return;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file}: added RelatedTours`);
  updated++;
});

console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped, ${files.length} total`);
