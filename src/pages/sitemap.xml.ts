import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://multitools-seo.vercel.app';
const LOCALES = ['es', 'en'] as const;

export const GET: APIRoute = async () => {
  const [esTools, enTools] = await Promise.all([
    getCollection('tools'),
    getCollection('toolsEn'),
  ]);

  const urls: string[] = [];

  // Páginas estáticas por locale
  const staticPages = ['', 'about', 'contact', 'privacy', 'herramientas'];
  for (const locale of LOCALES) {
    for (const page of staticPages) {
      const path = `/${locale}/${page}`.replace(/\/$/, '');
      urls.push(`${SITE}${path}`);
    }
  }

  // Herramientas por locale
  for (const t of esTools) urls.push(`${SITE}/es/${t.data.slug}`);
  for (const t of enTools) urls.push(`${SITE}/en/${t.data.slug}`);

  // Categorías por locale (agrupadas igual que [categoria].astro)
  const esCats = new Set(esTools.map((t) => t.data.categoria));
  const enCats = new Set(enTools.map((t) => t.data.category));
  for (const c of esCats) urls.push(`${SITE}/es/herramientas/${encodeURIComponent(c)}`);
  for (const c of enCats) urls.push(`${SITE}/en/herramientas/${encodeURIComponent(c)}`);

  const now = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
