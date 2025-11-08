## Quick context

- This is an Astro site (Astro v5) using local frontmatter-driven components to render content from YAML files in `content/`.
- Key local helper: `src/content.config.ts` defines collections (`index`, `services`) and helper wrappers `getEntry` / `getCollection` used throughout pages.
- A local package `lib/astro-frontmatter-components` (referenced in `package.json`) provides `Frontmatter`, `parseBlocks`, `queryBlocks` and block-schemas used to render modular page sections.

## Where to look first

- Content and content patterns: `content/` (YAML files). Services live under `content/services/**` and are validated by `src/content.config.ts`.
- Page entry points: `src/pages/*.astro` (e.g. `src/pages/index.astro`, `src/pages/services/[slug].astro`). They call `getEntry`/`getCollection` to fetch content and pass `sections`/`blocks` into layouts.
- Site shell / schema logic: `src/layouts/Root.astro` — central place where `Frontmatter` is rendered and page-level JSON-LD schemas are aggregated (see how `queryBlocks` and `seo` helpers from `src/sections/*` are used).
- Block and SEO patterns: check `src/sections/Reviews.astro`, `Faq.astro`, `Cardshow.astro` for examples of exporting `schema` and `seo` utilities consumed by `Root.astro`.

## Key patterns an AI agent should follow

- Content-first rendering: content files (YAML) describe `sections`/`blocks` that are turned into UI with the local `Frontmatter` system. Use `parseBlocks`/`queryBlocks` to discover and manipulate block data.
  - Example: `src/content.config.ts` uses `parseBlocks(c)` in collection schemas.
- Use `getEntry('index','index')` and `getCollection('services')` instead of manually reading files; `getCollection` filters out `draft: true` in non-DEV builds.
- Schema generation: many sections export `seo(...)` helpers. `Root.astro` calls these to append JSON-LD — preserve this pattern when adding sections.
- Avoid leaking secrets into templates: there is an explicit comment in `Root.astro` warning about moving `import.meta.env.YOUTUBE_API_KEY`. Keep secrets only in server-side code or environment variables that are consumed safely.

## Build / dev / debug commands (discovered)

- Project README recommends Bun commands (preferred by author):
  - `bun install` — install deps
  - `bun dev` — start dev server (local host shown in README)
  - `bun build` / `bun preview`
- `package.json` contains equivalent npm scripts for Astro (so `npm run dev` / `npm run build` / `npm run preview` work too). Use whichever matches your environment; README indicates the repo owner commonly uses Bun.
- Useful developer checks: `astro check` (Astro + content schema checks) and the repo includes ESLint / Prettier configs.

## Integration points and deploy notes

- Netlify adapter present: see `@astrojs/netlify` in `package.json` and `netlify.toml` for deployment behavior.
- Local library: `lib/astro-frontmatter-components` is referenced as a local package in `package.json` — edits there can change content parsing and block validation across the site.
- Manifest & icons: `src/pages/manifest.json.ts` is dynamically imported from layouts (see `Root.astro`); changes affect favicon/apple icons generation.

## Small examples / quick recipes

- Add a new service page:
  1. Create `content/services/<slug>.yaml` following other `content/services/*` files.
  2. Ensure frontmatter `title`, `desc`, `image` (schema) exist to satisfy `src/content.config.ts`.
  3. The site will pick it up via `getCollection('services')` automatically; use `draft: true` to hide from production.

- Add a new block type:
  1. Inspect `lib/astro-frontmatter-components/src` to see current block definitions.
  2. Add parsing helpers and update `parseBlocks`/`Frontmatter` integration.
  3. Update `src/sections/*` to export `schema`/`seo` if the block needs JSON-LD.

## File pointers (high signal)

- Content config and helpers: `src/content.config.ts`
- Page shell and schema aggregation: `src/layouts/Root.astro`
- Site entry pages: `src/pages/index.astro`, `src/pages/services/[slug].astro`
- Section patterns (exporting `schema`/`seo`): `src/sections/Reviews.astro`, `src/sections/Faq.astro`, `src/sections/Cardshow.astro`
- Local frontmatter toolkit: `lib/astro-frontmatter-components/` (used via `import 'astro-frontmatter-components'`)

## Quick dos & don'ts

- Do use existing helpers: `getEntry` / `getCollection`, `parseBlocks`, `queryBlocks`, and exported `seo` functions.
- Do run the dev server with the same runtime the repo's README expects (the author uses Bun). If you don't have Bun, use `npm run dev`.
- Don't move or inline secret env keys into templates — e.g., keep `YOUTUBE_API_KEY` out of client-side/inline script contexts.

If any of these sections are unclear or you'd like me to include specific examples (small code snippets showing a YAML -> Frontmatter flow, or a merge with an existing instruction file), tell me which area to expand and I will iterate.
