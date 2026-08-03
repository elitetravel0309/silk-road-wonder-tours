import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { allTours } from '../src/data/all-tours.ts';

const dir = join(process.cwd(), 'src', 'pages', 'tour');
mkdirSync(dir, { recursive: true });
let count = 0, skipped = 0;

for (const [cat, tours] of Object.entries(allTours)) {
  for (const t of tours) {
    const path = join(dir, `${t.slug}.astro`);
    // Skip original 21 tours that have embedded HTML body (BaseLayout, not TourPageLayout)
    if (existsSync(path)) {
      const existing = readFileSync(path, 'utf8');
      if (!existing.includes('TourPageLayout')) {
        skipped++;
        continue;
      }
    }

    const data = JSON.stringify(t, null, 2);
    const content = `---
import TourPageLayout from '../../components/TourPageLayout.astro';

const tour = ${data};
---

<TourPageLayout
  title={tour.title}
  duration={tour.duration}
  route={tour.route}
  image={tour.image}
  price={tour.price || ''}
  originalPrice={tour.originalPrice || ''}
  features={tour.features || []}
  overview={tour.overview || ''}
  highlights={tour.highlights || []}
  category={tour.category || '${cat}'}
/>
`;
    writeFileSync(join(dir, `${t.slug}.astro`), content);
    count++;
  }
}
console.log(`Generated ${count} tour pages (${skipped} skipped — original pages preserved).`);
