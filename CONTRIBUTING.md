# Contribuyendo a MultiTools SEO

Gracias por tu interés en aportar. Este proyecto es un sitio estático Astro (SSG) de micro-herramientas client-side. No hay backend ni cómputo en servidor: **toda la lógica de cada herramienta corre en el navegador del usuario**.

## Reglas de oro

1. **No rompas el JavaScript de las tools.** Astro empaqueta los `<script>` como `type="module"`, donde `document.currentScript` es `null`. Por eso cada tool debe:
   - Declarar `<div id="box-MiTool" class="tool-box">` como contenedor raíz.
   - Resolver su DOM con `document.getElementById('box-MiTool')` (o `currentScript?.parentElement` como fallback, nunca solo el fallback).
2. **Toda herramienta debe registrarse en la búsqueda del sidebar.** Añade `data-search="nombre visible en español"` al `<a>` que enlaza la tool en `Sidebar.astro`. La búsqueda filtra por ese atributo (insensible a acentos vía `normalize('NFD')`).
3. **Bilingüe por defecto.** Toda herramienta nueva necesita su entrada en ES y EN (título SEO, meta descripción, `h1`, texto SEO) en `src/content/tools/`.
4. **Sin dependencias de servidor.** Nada de `fetch` a tu backend, DB, ni SSR. Lo que no se pueda hacer 100% en el navegador, no va.
5. **Sin reutilizar código de it-tools.** Este repo es clean-room (evitar GPL-3.0). Reimplementa la funcionalidad, no copies su código.

## Cómo añadir una herramienta (paso a paso)

1. **Crea el componente** `src/components/MiTool.astro`:
   ```astro
   ---
   // sin props de servidor
   ---
   <div id="box-MiTool" class="tool-box">
     <!-- tu UI aquí -->
   </div>

   <script>
     const box = document.getElementById('box-MiTool') ?? document.currentScript?.parentElement;
     if (box) {
       // tu lógica client-side usando `box.querySelector(...)`
     }
   </script>
   ```
2. **Crea los datos** en `src/content/tools/mi-slug.json` (ES) y `mi-slug.json` (EN, en la misma carpeta) con los campos: `slug`, `component`, `titulo_seo`, `meta_descripcion`, `h1`, `texto_seo`, `ads_layout`, `categoria`.
3. **Registra el componente** en el `componentMap` de `src/pages/[locale]/[slug].astro` (import + entrada).
4. **Enlázala en la sidebar** `src/components/Sidebar.astro` con `data-search` (nombre en español visible).
5. **Verifica localmente:**
   ```bash
   npm install
   npm run dev      # revisa la tool en /es/mi-slug y /en/mi-slug
   npm run build    # debe generar 193+ páginas sin errores
   ```
6. **Abre un PR** describiendo la herramienta y el caso de uso SEO (qué long-tail ataca).

## Estado y procedencia

- Reimplementación *clean-room* de [it-tools](https://github.com/CorentinTh/it-tools). No es fork; se reescribió para evitar GPL-3.0 y permitir monetización.
- Licencia: **AGPL-3.0** (ver `LICENSE`).

## Entorno

- Node 22+, npm 10+.
- Astro 7, Tailwind CSS v4 (compilado vía `@tailwindcss/vite`, NO CDN).
- Deploy en Vercel (build estático, sin Docker).
