# Design Sync Notes — Portfolio Website

## Repo shape
- Vite app (not a library package): `shape = "package"` with synth-entry mode from `srcDir: "src/app/components/ui"`.
- No library dist — converter synthesizes the bundle from source. Type contracts are weaker than a compiled library build.
- Package manager: npm (`package-lock.json`). Install: `npm ci`.

## CSS
- `cssEntry` points at `dist/assets/index-C3_NDXK3.css` — this is the Vite-built, Tailwind-processed CSS.
- **Re-sync risk**: the CSS filename hash changes with each `vite build`. After rebuilding, run `ls dist/assets/*.css` to find the new name and update `cfg.cssEntry` before running the converter.
- Tailwind v4 (`@tailwindcss/vite: 4.1.12`): class utilities generated at build time, not shipped separately.

## Fonts
- All fonts loaded via Google Fonts remote `@import` in `src/styles/fonts.css` (Bebas Neue, Playfair Display, Caveat, Inter, Young Serif, etc.).
- Local .ttf files at repo root (Caveat.ttf, Satisfy.ttf, YoungSerif-Regular.ttf) have no `@font-face` CSS — they're unused by the CSS chain.
- `runtimeFontPrefixes` covers all Google Fonts families → `[FONT_REMOTE]` is expected and informational.

## Excluded components
- `StickyWorks`: hard-codes portfolio project images (`../../images/...`) and content — not a generic component; excluded via `componentSrcMap`.
- `CardItem`: interface exported from `expanding-cards.tsx`, not a renderable component; excluded via `componentSrcMap`.

## Path aliases
- `@/*` → `./src/*` in `tsconfig.json`. esbuild reads this via the `--tsconfig` flag.
- `ExpandingCards` imports `@/components/ui/project-card` — resolves via the alias to `src/components/ui/project-card.tsx`.

## Preview scope (first sync)
- Floor cards for all 44 shadcn/ui components.
- Rich authored previews: `ExpandingCards`, `StickyWorks` (excluded — floor card), `ProjectCard` (in `src/components/ui/`).
- Animation-driven components (ExpandingCards, ResumePlane, HeroVisual): GSAP/ScrollTrigger won't run in static headless preview — these will show the static initial state.

## Re-sync risks
- `cssEntry` hash: update after any `vite build` (see CSS section above).
- `ExpandingCards` preview: GSAP scroll animation is interaction-driven; static preview shows only the initial collapsed state. Acceptable for floor/authored card.
- Google Fonts: loaded via runtime @import — previews depend on network access at render time.
- Node version: no `.nvmrc` present; tested with system Node. If Node version changes and build fails, pin in `.nvmrc`.
