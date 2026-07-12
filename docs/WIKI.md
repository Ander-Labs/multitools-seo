# MultiTools SEO — Wiki del proyecto

Documentación viva del proyecto. Última actualización: 2026-07-11.

## 1. Qué es

Sitio estático de micro-herramientas para desarrolladores (reimplementación *clean-room* de [it-tools](https://github.com/CorentinTh/it-tools)). 85 herramientas client-side, bilingüe ES/EN, pensado para tráfico long-tail + AdSense.

- **Stack:** Astro v7 (SSG) + Tailwind v4 compilado (`@tailwindcss/vite`, NO CDN) + TypeScript.
- **Deploy:** Vercel (static, sin backend).
- **Dominio (AdSense):** `https://multitools-seo.vercel.app`
- **Licencia:** Propietaria / cerrada (All rights reserved). Código no reutilizable sin permiso.

## 2. Estado actual (checklist)

| Hito | Estado | Notas |
|------|--------|-------|
| Scaffold Astro + repo | ✅ | |
| 85 herramientas client-side | ✅ | 170 páginas (85×2) + 2 home + legales |
| Bilingüe ES/EN + hreflang | ✅ | `prefixDefaultLocale: true` |
| Sidebar de categorías (acordeón) | ✅ | |
| Sitemap automático + hreflang en sitemap | ✅ | 564 alternates |
| SEO on-page (canonical, OG/Twitter, robots.txt) | ✅ | |
| Iconos + manifest (PWA) | ✅ | apple-touch, favicon 16/32, android-chrome, webmanifest |
| Redirect `/` → `/es/` (301 servidor) | ✅ | `vercel.json` |
| Páginas legales (Privacy/About/Contact) | ✅ | bilingües, requeridas por AdSense |
| Cookie consent banner | ✅ | carga AdSense solo tras aceptar |
| Meta google-site-verification | ✅ | Search Console |
| AdSense (auto-ads) | 🔄 | loader `ca-pub-2964007773702778`, solicitud de revisión enviada |
| Deploy Vercel | ✅ | `multitools-seo.vercel.app` |
| GSC verificado + sitemap enviado | ⏳ | paso manual en GSC (click "Verificar") |

## 3. Arquitectura y decisiones

### 3.1 Herramientas (tools)
- Cada tool = componente `src/components/XxxTool.astro` + 2 archivos de contenido SEO:
  - `src/content/tools/<slug>.json` (ES)
  - `src/content/tools-en/<slug>.json` (EN)
- El marcado se hace con `getCollection('tools')` / `getCollection('toolsEn')`.
- **Regla de oro del JS (NO romper):** los `<script>` de Astro se emiten como `type=module`, donde `document.currentScript` es `null`. Los tools deben resolver su DOM con `id="box-X"` + `document.getElementById('box-X')`, NO solo `currentScript?.parentElement`.

### 3.2 Búsqueda
- Búsqueda client-side en el sidebar (fuerza abrir categorías al escribir). Usa `data-search` en cada `<a>` y `.cat-group` por categoría.

### 3.3 SEO
- `Layout.astro` calcula `canonical`, `hreflang` (es/en/x-default) y OG/Twitter desde `Astro.url.pathname` + `Astro.site`.
- Sitemap vía `@astrojs/sitemap` con `i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } }` (forma correcta en v3; ni `serialize` ni array funcionan).
- `robots.txt` en `public/` apunta a `https://multitools-seo.vercel.app/sitemap-index.xml`.

### 3.4 AdSense
- Auto-ads activado (solo loader global, sin `data-ad-slot` por unidad).
- Loader se inyecta desde `CookieConsent.astro` **solo tras aceptar** el banner (cumple consentimiento previo GDPR/UE).
- Cliente: `ca-pub-2964007773702778`.

### 3.5 Redirect raíz
- `vercel.json` redirige `/` → `/es/` con `permanent: true` (301/308 servidor). Evita el meta-refresh de 2s que generaba Astro SSG y demoraba la primera impresión.

## 4. Checklist para aprobar AdSense (ya cubierto)

1. ✅ `site` en `astro.config.mjs` apunta a dominio real (`multitools-seo.vercel.app`, no localhost).
2. ✅ Privacy Policy bilingüe con mención a Google AdSense + cookies.
3. ✅ About + Contact.
4. ✅ Cookie consent banner que carga ads tras aceptar.
5. ✅ Contenido original y útil (170 páginas).
6. ⏳ Tráfico orgánico estable (lo genera la indexación + backlinks).
7. ⏳ (Recomendado) Dominio propio `multitools.ander-labs.com` da más confianza que `.vercel.app`.

## 5. Checklist para verificar en Google Search Console

1. Entrar a search.google.com/search-console.
2. Añadir propiedad `https://multitools-seo.vercel.app` (URL prefix).
3. GSC lee la meta `google-site-verification` del HTML → "Verificar".
4. Menú **Sitemaps** → pegar `https://multitools-seo.vercel.app/sitemap-index.xml` → enviar.
5. Esperar días/semanas a que reporte "indexadas".

> Nota: la verificación es solo código + 1 click. La **indexación real** depende de tiempo + backlinks (promoción, no código).

## 6. Cómo añadir una herramienta (para contribuidores)

1. Crear `src/components/MiTool.astro` con UI en `<div id="box-MiTool" class="tool-box">` y lógica en `<script>` usando `document.getElementById('box-MiTool')`.
2. Crear `src/content/tools/mi-tool.json` (ES) y `src/content/tools-en/mi-tool.json` (EN) con `slug`, `h1`, `categoria`, `titulo_seo`, `meta_descripcion`, `texto_seo`.
3. El `[slug].astro` y el sidebar ya los enlazan automáticamente vía `getCollection`.
4. `npm run build` y verificar que la página se genera sin errores.
5. Ver `CONTRIBUTING.md` para reglas completas.

> Traducciones EN: `scripts/translate-en.mjs` genera/hint los `tools-en/*.json` (herramienta de mantenimiento, no borrar).

## 7. Mantenimiento

- **Build local:** `npm run build` (genera `dist/`, 199 páginas aprox).
- **Deploy:** push a `main` → Vercel re-deploya solo.
- **NO correr `npm run build` hacia el servidor de producción** (consume su espacio); el agente builda localmente para verificar.
- **Limpieza:** no hay archivos legacy. `.vscode/` y `scripts/` se conservan.
- **Servidor:** no hay backend. Si hay un `serve dist -l 4322` colgado localmente, matarlo (proceso zombie de preview).

## 8. Pendientes conocidos

- [ ] Conectar dominio propio `multitools.ander-labs.com` en Vercel (cambiar `site` + `robots.txt`).
- [ ] Backlinks / autoridad (blog Blogger cruzado, README, comunidades LATAM).
- [ ] JSON-LD `SoftwareApplication` en `Layout` (rich results en SERP).
- [ ] Cruce SEO blog↔tools (enlaces recíprocos).
- [ ] Internal linking entre tools relacionadas (link juice).
- [ ] Medir Core Web Vitals reales (Lighthouse) post-deploy.

## 9. Créditos

- Reimplementación *clean-room* de it-tools (funcionalidad, sin reutilizar su código fuente).
- Marca: Ander-Labs (@Ander_Labs en X/Twitter).
