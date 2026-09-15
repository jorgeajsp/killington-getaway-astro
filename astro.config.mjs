// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://killingtongetaway.com',
  integrations: [react(), mdx(), tailwind({ applyBaseStyles: false })],

  vite: {
    ssr: {
      noExternal: ['react-leaflet'], // Fix Leaflet SSR issues
    }
  }
});