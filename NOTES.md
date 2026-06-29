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

## Emergent Backlog

- Phase 1: Remove Geist_Mono from layout.tsx OR wire --font-mono in design tokens
- Phase 1: Replace placeholder metadata in layout.tsx
- Phase 1: Adapt design token config to Tailwind v4 CSS-first API (no tailwind.config.ts)
- Phase 3: Remove explanatory comment from next.config.ts
