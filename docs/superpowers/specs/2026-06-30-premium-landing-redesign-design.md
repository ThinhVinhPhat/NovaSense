# NovaSense Premium Landing Redesign — Design Spec

**Date:** 2026-06-30
**Status:** Approved (design), pending spec review
**Supersedes:** the section layout from the original 9-phase build; reuses its technical foundation (SEO, tokens, stores, forms, chatbot).

---

## Goal

Refactor the NovaSense landing page from a functional template into a premium, high-conversion brand experience: a dark-first "Aurora" aesthetic with choreographed motion, a complete 12-section narrative, and a hybrid commercial model (hardware e-commerce + service subscription tiers).

## Context

The existing site (Phases 0–8 complete) has a solid technical base — dark mode with no-flash, SEO/OG/JSON-LD, Zod-validated forms, Zustand cart/wishlist/recently-viewed stores, a chatbot proxy, reduced-motion support. The visual layer reads as templated: text-forward hero, no social proof, dead vertical space, flat surfaces, shallow motion, and a thin conversion funnel (single newsletter CTA).

Two rendering bugs were fixed prior to this redesign (cart drawer portal, chat widget position) and are not part of this spec.

## Decisions (resolved during brainstorming)

1. **Commercial model — Hybrid.** Keep hardware e-commerce (cart, product variants, wishlist, recently-viewed). ADD a Pricing section for **NovaSense+ service tiers** (subscription). Hardware add-to-cart and service-tier subscription are distinct flows; tier CTAs do not use the hardware cart.
2. **Assets — Generated placeholders.** All imagery is self-contained: CSS/SVG device mockups, SVG brand wordmarks, generated initial-avatars. Every asset is a swappable component prop/slot so real assets drop in later without layout changes.
3. **Visual direction — Aurora (dark-first).** Deep near-black canvas, indigo→violet→cyan gradient glows, glassmorphic surfaces, subtle grain. Light mode remains fully supported.
4. **Showcase library — Framer Motion** (already installed). SwiperJS is NOT added; the showcase is a view-switcher built with `AnimatePresence`.
5. **Service tiers** — Starter (free), Professional ($9/mo), Enterprise (contact sales).

---

## Visual System — "Aurora"

Implemented as Tailwind v4 CSS-first tokens in `app/globals.css` (`@theme` + `.dark` overrides). New tokens layer on top of existing `--color-*` tokens; existing token names are preserved.

### Canvas & background
- Dark canvas: `#07080d`. Light canvas: `#fbfbfd`.
- **Gradient mesh / glows:** radial gradients in indigo `#6366f1` → violet `#8b5cf6` → cyan `#22d3ee`, heavily blurred, positioned behind hero and product. Rendered as fixed/absolute decorative layers with `pointer-events-none` and `aria-hidden`.
- **Grain:** an inline SVG `feTurbulence` noise overlay at 2–3% opacity, fixed, `pointer-events-none`, to prevent gradient banding.

### Surfaces (glassmorphism)
- Glass card: `bg-white/[0.04]` (dark) / `bg-white/70` (light), `backdrop-blur-xl`, `border border-white/8` (dark) / `border-black/5` (light), layered shadow + inner highlight.
- Reusable component `GlassCard` encapsulates this so usage is uniform.

### Typography
- Headings: Sora, fluid `clamp()` scale, display sizes up to ~80px, tight letter-spacing on large sizes.
- Body: Geist.
- Gradient text utility for hero headline and key numbers.

### Depth
- Three elevation tiers expressed via shadow + optional glow, never a flat border alone.

### Tokens to add (names)
`--color-canvas`, `--gradient-aurora`, `--color-glass`, `--color-glass-border`, glow shadow tokens, gradient-text helper. Exact values live in the implementation plan.

---

## Motion System

All motion is gated behind `useReducedMotion()` (Framer Motion). When reduced motion is preferred, every primitive renders its static fallback (no transforms, no opacity animation, no particles).

Reusable primitives (in `components/ui/` or `components/motion/`):
- `Reveal` — extends existing `ScrollReveal`; fade+rise on in-view, `once: true`.
- `Stagger` — orchestrates child reveal with delay steps.
- `Counter` — counts up from 0 to target when in view (IntersectionObserver + requestAnimationFrame). Supports suffix/prefix and decimals.
- `Magnetic` — CTA buttons pull subtly toward the cursor on hover (pointer-fine devices only).
- `TiltCard` — glass card tilts on pointer move with spring; flattens on leave.
- `ParticleField` — canvas-based floating particles behind hero; capped count, throttled rAF, paused when offscreen; renders nothing under reduced motion.
- Scroll-progress timeline — the Why/Timeline section uses `useScroll` to drive a progress indicator.

---

## Section Architecture

The page is assembled in `app/page.tsx` (Server Component) in this order. Client interactivity is isolated to leaf components.

1. **Hero** — Logo wordmark, gradient headline, supporting line, CSS/SVG device with glow, dual CTA: "Buy Now" (scrolls to Product Showcase, the hardware buy point) + "Watch Demo" (opens a lightweight modal with a placeholder video frame). Animated aurora background + `ParticleField`.
2. **Trusted By** — Row/marquee of generated monochrome SVG wordmarks: Samsung, LG, Xiaomi, Apple HomeKit, Google Home, Amazon Alexa. Grayscale by default, color/opacity lift on hover. Marquee respects reduced motion (static row).
3. **Features** — 6 `GlassCard`s with icon glow, staggered reveal: AI Voice Assistant, Smart Automation, Energy Saving, Remote Access, Security, Analytics.
4. **Product Showcase** — Tab switcher (Front / Side / Back / Exploded) over a CSS/SVG-rendered device; `AnimatePresence` crossfade/rotate between views. Optional drag/swipe on touch. **This section is the hardware buy point:** below the views, a compact product/variant selector (Hub $199 / Pro $299, color variants from `products.ts`) with price and Add-to-Cart wired to the existing cart store. The standalone Shop grid (`Shop.tsx` / `ProductCard.tsx`) is retired; its purchase function moves here. The recently-viewed store remains but has no dedicated UI surface in the new layout (acceptable; tracking optional).
5. **Why NovaSense** — Scroll-linked animated timeline: AI Learning → Voice Recognition → IoT Connectivity → Secure Cloud → OTA Update.
6. **Statistics** — Four animated counters: 500K+ Users, 98% Accuracy, 120+ Countries, 4.9★ Rating.
7. **Testimonials** — Glass carousel with generated initial-avatars, name, role, star rating, quote. Auto-advance (pausable, reduced-motion disables auto-advance), manual prev/next + dots.
8. **Pricing (NovaSense+ tiers)** — Three glass tier cards: Starter (free), Professional ($9/mo, highlighted), Enterprise (contact sales). Feature lists, distinct CTAs. NOT wired to the hardware cart: Starter/Professional CTAs route to a sign-up/pre-order intent (toast or contact), Enterprise routes to Contact section.
9. **FAQ** — Accessible accordion built on native `<details>`/`<summary>` (keyboard + screen-reader friendly), styled with glass.
10. **Contact** — Form: Name, Email, Phone, Message. Validated with React Hook Form + Zod (client) and re-validated server-side at a new `POST /api/contact` route that mirrors `/api/subscribe` (Zod, honeypot, webhook forward with safe fallback). Success/error via existing toast.
11. **Newsletter** — Existing component elevated to Aurora glass style; behavior unchanged (webhook, honeypot, tracking).
12. **Footer** — Multi-column: brand, nav, social (GitHub, Facebook, LinkedIn), Privacy/Terms links.

Header (sticky, glass) keeps theme toggle + the fixed cart drawer.

---

## Content Files (new)

Typed data modules under `content/`:
- `trusted-brands.ts` — brand name + SVG wordmark id list.
- `timeline.ts` — ordered steps `{ title, description, icon }`.
- `stats.ts` — `{ value, suffix, label }[]`.
- `testimonials.ts` — `{ name, role, rating, quote, initials }[]`.
- `pricing-tiers.ts` — `{ name, price, period, features[], cta, highlighted }[]`.
- `faq.ts` — `{ question, answer }[]`.

Existing `products.ts` (hardware variants) is unchanged.

---

## API

- **New:** `POST /api/contact` — body `{ name, email, phone?, message, _honey? }`. Validation: name required (max 100), email required valid, phone optional, message required (max 2000), honeypot `_honey` max(0) → silent success drain. Behavior mirrors `/api/subscribe`: 400 on bad JSON, 422 on Zod failure, forward to `WEBHOOK_URL` when set (skip safely if absent), 500 on forward error. API keys/secrets server-only.
- Existing `/api/subscribe` and `/api/chat` unchanged.

---

## Carried-over polish (folded into relevant phases)

- Cart line total and grand total formatted with `.toFixed(2)`.
- All buy/add-to-cart and tier-CTA controls are real `<button>`/`<a>` elements (keyboard-accessible), avoiding the prior pattern of a click handler on a non-interactive `<div>`.

---

## Hard Constraints (unchanged from project)

- PageSpeed Insights Mobile ≥ 85. Particle field and glows must be GPU-cheap and not regress this.
- Responsive 320px → 1440px+, no horizontal overflow.
- `prefers-reduced-motion` respected on every animation.
- Full SEO/OG/JSON-LD preserved.
- No explanatory comments in source (R4). Conventional Commits, no AI attribution (R5). Phase-by-phase branches (R1), code-review per phase (R3).
- Tailwind v4 CSS-variable class syntax (`bg-(--color-*)`), no `tailwind.config.ts` for tokens.

---

## Phasing — "Phase 9: Premium Redesign" (8 sub-phases)

Each sub-phase = its own branch, code-review, merge.

1. **Aurora design system + motion primitives** — tokens, gradient mesh, grain, `GlassCard`, `Reveal`/`Stagger`/`Counter`/`Magnetic`/`TiltCard`/`ParticleField`. No page changes yet beyond making primitives available.
2. **Hero + Trusted By** — new hero with device + particles; trusted-by marquee + `trusted-brands.ts`.
3. **Features + Product Showcase** — elevate Features to glass; build showcase view-switcher.
4. **Why/Timeline + Statistics** — scroll-linked timeline + `timeline.ts`; counters + `stats.ts`.
5. **Testimonials + Pricing** — carousel + `testimonials.ts`; tier cards + `pricing-tiers.ts`.
6. **FAQ + Contact** — accordion + `faq.ts`; contact form + `/api/contact`.
7. **Newsletter elevation + Footer + page assembly** — restyle newsletter, build footer, order all sections in `page.tsx`, fold in carried-over polish.
8. **QA sweep** — responsive 320–1440, a11y (contrast, focus, headings, labels), dark/light parity, reduced-motion verification, Lighthouse/PSI ≥ 85, NOTES/CLAUDE updates.

---

## Out of Scope

- Real media assets (provided later via documented slots).
- Real payment/checkout backend (CTAs are intent/pre-order/contact).
- Real subscription billing for NovaSense+ tiers.
- Streaming chat responses (existing backlog item).
- Live analytics endpoint (existing backlog item).
