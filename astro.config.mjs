import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://silkroadwondertours.com',
  output: 'static',
  build: { format: 'file' },
  integrations: [sitemap()]
});
