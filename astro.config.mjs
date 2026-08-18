// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

// The public portfolio is prerendered. Only the routes injected by the Keystatic
// integration (/keystatic and /api/keystatic) opt out of prerendering.
export default defineConfig({
  site: 'https://aorih.com',
  output: 'static',
  adapter: netlify(),
  integrations: [react(), keystatic(), sitemap({ filter: (page) => !page.includes('/keystatic') })],
});
