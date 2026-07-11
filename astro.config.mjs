// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://multitools.ander-labs.com',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'es',
      locales: { es: 'es', en: 'en' },
    },
  })],
  vite: {
    plugins: [tailwindcss()],
  },
});
