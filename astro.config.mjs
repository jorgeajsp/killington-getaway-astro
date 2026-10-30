// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  site: 'https://killingtongetaway.com',
  integrations: [react(), mdx(), tailwind({ applyBaseStyles: false })],

  vite: {
    ssr: {
      noExternal: ['react-leaflet'], // Fix Leaflet SSR issues
    }
  },

  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  })
});