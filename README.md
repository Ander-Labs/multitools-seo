# MultiTools SEO

Plataforma SaaS de micro-herramientas optimizada para **SEO programático masivo** y monetización por anuncios. Genera tráfico orgánico (long-tail) y lo convierte en ingresos con AdSense, sin costo de infraestructura (sitio estático).

> Reimplementación *clean-room* del set de herramientas de [it-tools](https://github.com/CorentinTh/it-tools) en Astro. No es un fork: se reescribió en otro framework para evitar el conflicto de licencia GPL-3.0 y permitir monetización cerrada.

## Stack

- **Astro 7** (SSG, HTML plano para Googlebot → Core Web Vitals)
- **Content Collections** (catálogo de tools tipado con Zod)
- **Islas client-side** (100% en navegador, 0 cómputo en servidor → RNF-002)
- **i18n nativo** ES/EN con `hreflang` (SEO bilingüe)
- **@astrojs/sitemap** (sitemap automático → RF-005)
- **Vercel** (deploy estático, gratis)

## Estado actual

| Hito | Estado |
|------|--------|
| Scaffold Astro + repo | ✅ |
| 85 herramientas client-side | ✅ |
| Bilingüe ES/EN + hreflang | ✅ |
| Sidebar de categorías (acordeón) | ✅ |
| Sitemap automático + hreflang en sitemap | ✅ |
| SEO on-page (canonical, OG/Twitter, robots.txt) | ✅ |
| Deploy Vercel | ⏳ pendiente |
| Contenedor AdSense diferido 2s (RF-004) | ⏳ pendiente |

## Estructura

```text
/
├── src/
│   ├── components/        # 85 componentes <Name>Tool.astro (lógica client-side)
│   ├── content/
│   │   ├── config.ts      # schema Zod de la colección 'tools'
│   │   └── tools/         # 85 JSON (slug, component, titulo_seo, meta_descripcion, h1, texto_seo, ads_layout, categoria)
│   ├── layouts/           # Layout.astro (head/SEO) + ToolLayout.astro (slot tool)
│   ├── pages/
│   │   ├── [locale]/[slug].astro   # rutas bilingües /es/<slug> /en/<slug>
│   │   └── [locale]/index.astro    # home con sidebar de categorías
│   └── styles/global.css
├── astro.config.mjs       # i18n + sitemap + site
└── package.json
```

## Comandos

| Comando           | Acción                                      |
|-------------------|---------------------------------------------|
| `npm install`     | Instala dependencias                        |
| `npm run dev`     | Servidor local en `localhost:4321`          |
| `npm run build`   | Build de producción a `./dist/`             |
| `npm run preview` | Preview local del build                     |

## Cómo añadir una herramienta

1. Crea `src/components/MiTool.astro` con la UI en `<div id="box-MiTool" class="tool-box">` y la lógica en un `<script>` usando `document.getElementById('box-MiTool')` (o `currentScript?.parentElement` como fallback) como scope. **No uses solo `currentScript?.parentElement`: en Astro v7 los scripts son `type="module"` y `currentScript` es `null`, lo que rompe el JS en silencio.**
2. Crea `src/content/tools/mi-slug.json` (ES) y su par EN con los campos del schema + `categoria`.
3. Añade el import y la entrada en `componentMap` dentro de `src/pages/[locale]/[slug].astro`.
4. Enlaza la tool en `Sidebar.astro` con `data-search="nombre en español"` para que aparezca en la búsqueda.
5. `npm run build` → la página se genera sola en `/es/mi-slug` y `/en/mi-slug`.

> Flujo completo para contribuyentes externos en `CONTRIBUTING.md`.

## Documentación

La documentación completa del proyecto (estado, arquitectura, checklists SEO/AdSense/GSC, mantenimiento) está en [`docs/WIKI.md`](./docs/WIKI.md).

**Propietaria / cerrada (All rights reserved)** — ver [`LICENSE`](./LICENSE).

Reimplementación *clean-room* de [it-tools](https://github.com/CorentinTh/it-tools): se reescribió la funcionalidad sin reutilizar su código fuente, para evitar el conflicto de licencia GPL-3.0 y permitir monetización cerrada. El código fuente se publica solo para referencia; no otorga licencia de uso, modificación ni redistribución.
