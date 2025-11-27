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
    assets: 'assets',
    inlineStylesheets: 'auto'
  },

  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  },

  integrations: [sitemap()]
});