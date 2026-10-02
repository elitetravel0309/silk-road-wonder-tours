// verify-titles.cjs
const fs = require('fs');
const files = [
  'dist/contact.html', 'dist/blog.html', 'dist/faq.html', 'dist/gallery.html',
  'dist/review.html', 'dist/search.html', 'dist/index.html',
];
for (const f of files) {
  if (!fs.existsSync(f)) { console.log('MISSING', f); continue; }
  const c = fs.readFileSync(f, 'utf8');
  const t = c.match(/<title>([^<]*)<\/title>/)?.[1];
  const dup = (t.match(/Silk Road Wonders/g) || []).length > 1;
  console.log((dup ? 'DUP  ' : 'OK   ') + f.replace('dist/', '') + ' :: ' + t);
}
// contact specifics
const ct = fs.readFileSync('dist/contact.html', 'utf8');
console.log('\ncontact has second Organization schema:', (ct.match(/TravelAgency|"@type":"Organization"/g) || []).length);
console.log('contact has ContactPoint (from BaseLayout):', ct.includes('customer service'));
