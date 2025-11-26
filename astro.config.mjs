import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  root: '.',
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  site: 'https://brjoy.com.br',
  base: '/',
  trailingSlash: 'ignore',

  server: {
    port: 4321,
    host: true
  },

  build: {
    format: 'directory',
    assets: 'assets'
  },

  integrations: [sitemap()]
});