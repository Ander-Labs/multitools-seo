import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tools = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tools' }),
  schema: z.object({
    slug: z.string(),
    component: z.string(),
    titulo_seo: z.string().max(60),
    meta_descripcion: z.string().max(160),
    h1: z.string(),
    texto_seo: z.string().min(300),
    categoria: z.string(),
    ads_layout: z.enum(['aggressive', 'standard', 'clean']).default('standard'),
  }),
});

const toolsEn = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tools-en' }),
  schema: z.object({
    slug: z.string(),
    component: z.string(),
    titulo_seo: z.string().max(60),
    meta_descripcion: z.string().max(160),
    h1: z.string(),
    texto_seo: z.string().min(300),
    category: z.string(),
    ads_layout: z.enum(['aggressive', 'standard', 'clean']).default('standard'),
  }),
});

export const collections = { tools, toolsEn };
