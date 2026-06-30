# NovaSense — Technical Notes

## Decisions

- Using `create-next-app` scaffold with App Router, no `/src` dir
- Fonts: Geist (body) + Sora (headings) via next/font/google
- Icon library: lucide-react (tree-shakeable)
- Theme strategy: `class` on `<html>` element

- **Tailwind CSS v4 installed** (plan assumed v3) — `create-next-app` latest scaffold installs Tailwind v4. No `tailwind.config.ts` file. Phase 1 design system must use Tailwind v4 CSS-first: `@theme {}` block in `globals.css` for tokens, `@custom-variant dark` for dark mode class strategy. The Phase 1 plan's JS config approach must be adapted to v4 CSS API.
- **Next.js 16.2.9 installed** (plan assumed 15.x) — App Router API compatible; no functional changes needed.
- **next.config.ts** has `/* config options here */` comment violating R4 — fix when editing next.config.ts in Phase 3.
- **Geist_Mono** loaded in layout.tsx but unused — either wire `--font-mono` in Phase 1 design tokens or remove the import.
- **layout.tsx metadata** still has scaffold defaults — replace in Phase 1.
- **exactOptionalPropertyTypes: true** in tsconfig — may conflict with Next.js/third-party types; skipLibCheck mitigates most; monitor in Phase 3+ Route Handlers.

## Phase 3 — SEO & Performance

- **og-image.svg is a placeholder** — replace with designed PNG (1200×630) before launch.
- **Lighthouse score: to be measured at deploy time** — Lighthouse CLI requires a running server; skipped in CI.

## Emergent Backlog

- Phase 1: Remove Geist_Mono from layout.tsx OR wire --font-mono in design tokens
- Phase 1: Replace placeholder metadata in layout.tsx
- Phase 1: Adapt design token config to Tailwind v4 CSS-first API (no tailwind.config.ts)
- Phase 3: Remove explanatory comment from next.config.ts (resolved in Phase 3)
- Phase 7: Streaming chat response — implemented as non-streaming for reliability; add streaming (ReadableStream/SSE) if needed
- Phase 6: WishlistDrawer / RecentlyViewed panel — ProductCard tracks both via stores but no dedicated UI drawer; add if needed
- Phase 4: /api/track endpoint missing — analytics.ts calls sendBeacon('/api/track') which fails silently; add a real track Route Handler if analytics forwarding is required

## Phase 9 — Premium Redesign decisions

- ProductShowcase variant selector uses `aria-pressed` (toggle-button semantics), NOT `role="tab"`. Deliberate: the variant buttons select a product model, they do not switch tab panels, so `role="tab"`/`aria-selected` would be incorrect a11y. The Front/Side/Back/Exploded view switcher correctly uses `role="tab"`/`aria-selected` (it does switch panels). Recently-viewed store remains in code but has no UI surface in the new layout (accepted).
- ParticleField fill color is a fixed decorative constant (dark-mode accent); accepted — the canvas is decorative and dark-first.
