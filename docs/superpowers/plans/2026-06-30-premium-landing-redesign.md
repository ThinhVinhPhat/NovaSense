# NovaSense Premium Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the NovaSense landing page into a premium dark-first "Aurora" experience with a complete 12-section narrative, choreographed reduced-motion-safe animation, and a hybrid commercial model (hardware cart + NovaSense+ service tiers).

**Architecture:** A design-system-first refactor. Phase 1 builds reusable Aurora visual tokens + motion primitives. Phases 2–7 build/elevate sections on top of them, each section isolated to a focused file with client interactivity at the leaves only. Phase 8 is QA. The existing technical foundation (SEO, stores, chatbot, theme, forms) is preserved.

**Tech Stack:** Next.js 16 (App Router), TypeScript 5 strict, Tailwind CSS v4 (CSS-first), Framer Motion, React Hook Form + Zod, Zustand, lucide-react.

**Spec:** `docs/superpowers/specs/2026-06-30-premium-landing-redesign-design.md`

## Global Constraints

- Tailwind v4 CSS-variable class syntax only: `bg-(--color-accent)`, `border-(--color-border)`, `text-(--color-text-primary)`. NEVER `bg-accent` shorthand, NEVER `style={}` for theme colors, NEVER a `tailwind.config.ts` for tokens.
- No explanatory comments in source (R4). Allowed: `'use client'`, ESLint pragmas.
- Conventional Commits. NEVER `Co-Authored-By: Claude` or any AI attribution (R5).
- One branch per sub-phase: `feat/phase-9-<slug>`. Code-review per phase (R3). Merge to main with `--no-ff` (R5).
- `prefers-reduced-motion` respected on EVERY animation: the reduced path renders a fully static fallback (no transforms, no opacity tweens, no particles), never a "reduced" animation.
- PageSpeed Insights Mobile ≥ 85; responsive 320px → 1440px with no horizontal overflow; SEO/OG/JSON-LD preserved.
- Secrets server-only; never `NEXT_PUBLIC_` for keys; `.env.local` never committed.

## Verification Model (no test runner exists)

This repo has no unit-test framework and never adopted one; do NOT add one. Every task is verified by:
1. `npm run build` — must complete with zero errors (TypeScript strict is the type-level gate).
2. `npm run lint` — must report zero errors and zero warnings.
3. The **Manual checks** listed in the task (browser observations at specified breakpoints / theme / reduced-motion).

The only runtime test is a `curl` check for `POST /api/contact` (Task 6.2), run against `npm run dev`.

Reduced-motion is tested by toggling OS "Reduce motion" OR DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce".

---

## File Structure

**New — visual system & motion (`components/`):**
- `components/ui/GlassCard.tsx` — glassmorphic surface wrapper.
- `components/sections/AuroraBackground.tsx` — fixed gradient-glow + grain backdrop (server component).
- `components/motion/Reveal.tsx` — in-view fade+rise (reduced-motion → static).
- `components/motion/Stagger.tsx` — orchestrates staggered child reveals.
- `components/motion/Counter.tsx` — count-up on in-view.
- `components/motion/Magnetic.tsx` — cursor-pull wrapper for CTAs.
- `components/motion/TiltCard.tsx` — pointer-tilt glass wrapper.
- `components/motion/ParticleField.tsx` — canvas particle backdrop.

**New — sections (`components/sections/`):**
- `Hero.tsx` (rewrite), `TrustedBy.tsx`, `ProductShowcase.tsx`, `WhyTimeline.tsx`, `Statistics.tsx`, `Testimonials.tsx`, `Pricing.tsx`, `Faq.tsx`, `Contact.tsx`, `Footer.tsx` (rewrite). `Features.tsx` (elevate), `Newsletter.tsx` (elevate).

**New — device & demo (`components/ui/`):**
- `DeviceMock.tsx` — CSS/SVG device renderer with a `view` prop (`front|side|back|exploded`).
- `DemoModal.tsx` — "Watch Demo" lightweight modal.

**New — content (`content/`):**
- `trusted-brands.ts`, `timeline.ts`, `stats.ts`, `testimonials.ts`, `pricing-tiers.ts`, `faq.ts`.

**New — API:**
- `app/api/contact/route.ts`, plus `contactSchema` added to `lib/validations.ts`.

**Modified:**
- `app/globals.css` — add Aurora tokens + `.text-gradient` utility.
- `app/layout.tsx` — mount `AuroraBackground`; body background → `--color-canvas`.
- `app/page.tsx` — assemble the 12 sections in order.
- `store/cart.ts` — none (reused). `content/products.ts` — reused by Showcase.

**Retired (deleted in Phase 3):**
- `components/sections/Shop.tsx`, `components/ecommerce/ProductCard.tsx`, `components/ecommerce/RecentlyViewed.tsx` (purchase moves into `ProductShowcase`).

---

## Phase 1 — Aurora Design System + Motion Primitives

Branch: `feat/phase-9-aurora-system`

### Task 1.1: Aurora tokens + gradient utility in globals.css

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces CSS custom properties available as Tailwind v4 utilities: `--color-canvas`, `--color-violet`, `--color-cyan`, `--color-glass`, `--color-glass-border`, `--shadow-glass`, `--shadow-glow`; and class `.text-gradient`.

- [ ] **Step 1: Add new tokens to the `@theme` block**

In `app/globals.css`, inside the existing `@theme { … }` block, after the `--color-accent-subtle` line, add:

```css
  --color-canvas: rgb(251 251 253);
  --color-violet: rgb(139 92 246);
  --color-cyan: rgb(34 211 238);
  --color-glass: rgb(255 255 255 / 0.7);
  --color-glass-border: rgb(15 23 42 / 0.06);
  --shadow-glass: 0 8px 32px 0 rgb(15 23 42 / 0.08);
  --shadow-glow: 0 0 48px 0 rgb(99 102 241 / 0.35);
```

- [ ] **Step 2: Add dark overrides to the `.dark` block**

Inside the existing `.dark { … }` block, after the `--color-accent-subtle` override, add:

```css
  --color-canvas: rgb(7 8 13);
  --color-glass: rgb(255 255 255 / 0.04);
  --color-glass-border: rgb(255 255 255 / 0.08);
  --shadow-glass: 0 8px 32px 0 rgb(0 0 0 / 0.5);
  --shadow-glow: 0 0 64px 0 rgb(99 102 241 / 0.45);
```

- [ ] **Step 3: Point the body background at the canvas token and add the gradient-text utility**

Change the existing `body { background-color: var(--color-bg); … }` rule so the background uses `var(--color-canvas)`:

```css
body {
  background-color: var(--color-canvas);
  color: var(--color-text-primary);
  font-feature-settings: "rlig" 1, "calt" 1;
}
```

Then append at the end of the file:

```css
.text-gradient {
  background-image: linear-gradient(
    135deg,
    var(--color-accent),
    var(--color-violet) 50%,
    var(--color-cyan)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

- [ ] **Step 4: Build + lint**

Run: `npm run build && npm run lint`
Expected: both pass, zero errors/warnings.

**Manual checks:** `npm run dev`, load `/` in dark mode — page background is near-black `#07080d`; toggle to light — background is `#fbfbfd`. Existing sections still render (unstyled-elevation is fine at this point).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: add aurora design tokens and gradient-text utility"
```

### Task 1.2: GlassCard + AuroraBackground

**Files:**
- Create: `components/ui/GlassCard.tsx`
- Create: `components/sections/AuroraBackground.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `GlassCard` — `(props: HTMLAttributes<HTMLDivElement>) => JSX` rounded glass surface; `AuroraBackground` — `() => JSX` fixed decorative backdrop (server component, no props).

- [ ] **Step 1: Create `components/ui/GlassCard.tsx`**

```tsx
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type GlassCardProps = HTMLAttributes<HTMLDivElement>

export function GlassCard({ className, children, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-(--color-glass-border) bg-(--color-glass) shadow-(--shadow-glass) backdrop-blur-xl',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/sections/AuroraBackground.tsx`**

```tsx
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[55vh] w-[55vh] -translate-x-1/2 rounded-full bg-(--color-accent) opacity-25 blur-[130px]" />
      <div className="absolute top-1/3 -left-32 h-[45vh] w-[45vh] rounded-full bg-(--color-violet) opacity-20 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-[45vh] w-[45vh] rounded-full bg-(--color-cyan) opacity-[0.12] blur-[130px]" />
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
```

(The `style` here carries an inline SVG data-URI background image, not a theme color — this is the allowed exception to the no-`style` rule.)

- [ ] **Step 3: Mount AuroraBackground in `app/layout.tsx`**

Add the import after the `ToastProvider` import:

```tsx
import { AuroraBackground } from '@/components/sections/AuroraBackground'
```

Update the `<body>` className so it uses the canvas token, and render `<AuroraBackground />` as the first child of `<body>`:

```tsx
      <body className={`${geist.variable} ${sora.variable} font-sans antialiased bg-(--color-canvas) text-(--color-text-primary)`}>
        <AuroraBackground />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToastProvider>
          {children}
          <ChatWidget />
        </ToastProvider>
      </body>
```

- [ ] **Step 4: Build + lint**

Run: `npm run build && npm run lint`
Expected: both pass.

**Manual checks:** Soft indigo/violet/cyan glows visible behind content in dark mode; barely-visible grain texture; glows do not block clicks (links still work); no horizontal scrollbar at 320px.

- [ ] **Step 5: Commit**

```bash
git add components/ui/GlassCard.tsx components/sections/AuroraBackground.tsx app/layout.tsx
git commit -m "feat: add glass surface and aurora backdrop"
```

### Task 1.3: Motion primitives — Reveal, Stagger, Counter

**Files:**
- Create: `components/motion/Reveal.tsx`
- Create: `components/motion/Stagger.tsx`
- Create: `components/motion/Counter.tsx`

**Interfaces:**
- Produces:
  - `Reveal` — `{ children, delay?: number, y?: number, className?: string }`. In-view fade+rise once; reduced-motion → plain `<div>`.
  - `Stagger` — `{ children, step?: number, className?: string }`. Wraps children; sets a CSS-driven stagger via Framer `staggerChildren`. Children should be `Reveal` items or `motion` items; here `Stagger` provides a parent variant and renders children inside `motion.div`. To keep usage simple, `Stagger` renders a `motion.div` with `variants` and each direct child is wrapped automatically is NOT done — instead consumers use `Reveal` with incremental `delay`. `Stagger` is a thin in-view container that triggers once. (See Step 2.)
  - `Counter` — `{ to: number, durationMs?: number, decimals?: number, prefix?: string, suffix?: string, className?: string }`. Counts up when scrolled into view; reduced-motion → shows final value immediately.

- [ ] **Step 1: Create `components/motion/Reveal.tsx`**

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `components/motion/Stagger.tsx`**

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggerProps {
  children: ReactNode
  step?: number
  className?: string
}

export function Stagger({ children, step = 0.08, className }: StaggerProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step } },
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
```

Usage note for later tasks: children of `Stagger` that should animate are `motion.div variants={staggerItem}`. Under reduced motion `Stagger` renders a plain `<div>` and the `motion.div` children (which also call `useReducedMotion` if built via `Reveal`) stay static; when children are raw `motion.div variants={staggerItem}` with no in-view trigger of their own, they inherit the parent and remain at the `hidden`→`show` controlled by the parent only when not reduced. For reduced-motion safety in consumers, raw `motion.div variants={staggerItem}` MUST also be rendered without initial offset when reduced — consumers use the helper `Reveal` where possible, or guard with `useReducedMotion`.

- [ ] **Step 3: Create `components/motion/Counter.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface CounterProps {
  to: number
  durationMs?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function Counter({
  to,
  durationMs = 1600,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return

    let raf = 0
    let startTs = 0
    let triggered = false

    function tick(ts: number) {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(to * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting && !triggered) {
          triggered = true
          raf = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, durationMs, reduced])

  const display = reduced ? to : value

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
```

- [ ] **Step 4: Build + lint**

Run: `npm run build && npm run lint`
Expected: both pass.

**Manual checks:** Temporarily render `<Counter to={500} suffix="K+" />` in a section, scroll to it — number animates 0→500. Toggle reduce-motion — number shows 500 immediately with no animation. Remove the temporary render before commit.

- [ ] **Step 5: Commit**

```bash
git add components/motion/Reveal.tsx components/motion/Stagger.tsx components/motion/Counter.tsx
git commit -m "feat: add reveal, stagger, and counter motion primitives"
```

### Task 1.4: Motion primitives — Magnetic, TiltCard, ParticleField

**Files:**
- Create: `components/motion/Magnetic.tsx`
- Create: `components/motion/TiltCard.tsx`
- Create: `components/motion/ParticleField.tsx`

**Interfaces:**
- Produces:
  - `Magnetic` — `{ children, strength?: number, className?: string }`. Pointer-pull; reduced-motion or no result → static `<span>`.
  - `TiltCard` — `{ children, className?: string, max?: number }`. Pointer tilt with spring; reduced-motion → static `<div>`.
  - `ParticleField` — `{ className?: string, count?: number }`. Canvas particles; reduced-motion → renders `null`.

- [ ] **Step 1: Create `components/motion/Magnetic.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import type { ReactNode, MouseEvent } from 'react'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  function handleMove(e: MouseEvent<HTMLSpanElement>) {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  if (reduced) {
    return <span className={className}>{children}</span>
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      className={className}
    >
      {children}
    </motion.span>
  )
}
```

- [ ] **Step 2: Create `components/motion/TiltCard.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import type { ReactNode, MouseEvent } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  max?: number
}

export function TiltCard({ children, className, max = 8 }: TiltCardProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rx.set(-py * max)
    ry.set(px * max)
  }

  function reset() {
    rx.set(0)
    ry.set(0)
  }

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Create `components/motion/ParticleField.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface ParticleFieldProps {
  className?: string
  count?: number
}

export function ParticleField({ className, count = 40 }: ParticleFieldProps) {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: 0.6 + (i % 5) * 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }))

    function resize() {
      const c = canvasRef.current
      if (!c) return
      c.width = c.clientWidth * dpr
      c.height = c.clientHeight * dpr
      ctx!.scale(dpr, dpr)
    }

    function draw() {
      const c = canvasRef.current
      if (!c || !running) return
      ctx!.clearRect(0, 0, c.clientWidth, c.clientHeight)
      ctx!.fillStyle = 'rgba(129,140,248,0.5)'
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = c.clientWidth
        if (p.x > c.clientWidth) p.x = 0
        if (p.y < 0) p.y = c.clientHeight
        if (p.y > c.clientHeight) p.y = 0
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      running = entry.isIntersecting
      if (running) {
        raf = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf)
      }
    })

    resize()
    window.addEventListener('resize', resize)
    observer.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [reduced, count])

  if (reduced) return null

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
```

- [ ] **Step 4: Build + lint**

Run: `npm run build && npm run lint`
Expected: both pass.

**Manual checks:** Add temporary `<ParticleField className="absolute inset-0" />` inside a `relative` block — particles drift; under reduce-motion the canvas is absent. Remove temporary render before commit.

- [ ] **Step 5: Commit + merge phase**

```bash
git add components/motion/Magnetic.tsx components/motion/TiltCard.tsx components/motion/ParticleField.tsx
git commit -m "feat: add magnetic, tilt, and particle motion primitives"
git checkout main
git merge feat/phase-9-aurora-system --no-ff -m "feat(phase-9): aurora design system and motion primitives"
```

**Page-wiring model (applies to Phases 2–7):** Each section phase wires its section into `app/page.tsx` immediately so it is testable and the build stays green. Retirements happen the moment the replacement is wired. The final section ORDER is set in Phase 7. Sections retired across the redesign: `Shop.tsx`, `ProductCard.tsx`, `RecentlyViewed.tsx` (purchase → ProductShowcase, Phase 3); `Scrollytelling.tsx` (→ WhyTimeline, Phase 4); `Specs.tsx` (tech specs → spec strip inside ProductShowcase, Phase 3). The `recently-viewed` store file remains but is unused (acceptable; not imported anywhere after Phase 3).

---

## Phase 2 — Hero + Trusted By

Branch: `feat/phase-9-hero-trusted`

### Task 2.1: Trusted By section

**Files:**
- Create: `content/trusted-brands.ts`
- Create: `components/sections/TrustedBy.tsx`

**Interfaces:**
- Consumes: `Reveal` (Task 1.3), `Container` (existing `@/components/ui/Container`).
- Produces: `trustedBrands: { name: string }[]`; `TrustedBy` — `() => JSX` (server component).

- [ ] **Step 1: Create `content/trusted-brands.ts`**

```ts
export interface Brand {
  name: string
}

export const trustedBrands: Brand[] = [
  { name: 'Samsung' },
  { name: 'LG' },
  { name: 'Xiaomi' },
  { name: 'Apple HomeKit' },
  { name: 'Google Home' },
  { name: 'Amazon Alexa' },
]
```

- [ ] **Step 2: Create `components/sections/TrustedBy.tsx`**

Text wordmarks (trademark-safe) instead of real logos, per the generated-placeholder decision. Static row (no marquee — dropped for perf/simplicity, R2).

```tsx
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { trustedBrands } from '@/content/trusted-brands'

export function TrustedBy() {
  return (
    <section aria-label="Compatible brands" className="border-y border-(--color-glass-border) py-10">
      <Container>
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-(--color-text-muted)">
            Works with the brands you already own
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedBrands.map((brand) => (
              <li
                key={brand.name}
                className="font-heading text-lg font-semibold text-(--color-text-muted) opacity-70 grayscale transition hover:text-(--color-text-secondary) hover:opacity-100"
              >
                {brand.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
```

- [ ] **Step 3: Build + lint.** `npm run build && npm run lint` → both pass.

- [ ] **Step 4: Commit**

```bash
git add content/trusted-brands.ts components/sections/TrustedBy.tsx
git commit -m "feat: add trusted-by brand strip"
```

### Task 2.2: DeviceMock (shared device renderer)

**Files:**
- Create: `components/ui/DeviceMock.tsx`

**Interfaces:**
- Produces: `type DeviceView = 'front' | 'side' | 'back' | 'exploded'`; `DeviceMock` — `{ view?: DeviceView, className?: string }` (server component). Used by Hero (front) and ProductShowcase (all views).

- [ ] **Step 1: Create `components/ui/DeviceMock.tsx`**

A premium abstract hub puck rendered in CSS — glow halo, brushed body, mic-ring dots; each view changes the composition.

```tsx
import { cn } from '@/lib/utils'

export type DeviceView = 'front' | 'side' | 'back' | 'exploded'

interface DeviceMockProps {
  view?: DeviceView
  className?: string
}

function MicRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid h-3/4 w-3/4 place-items-center rounded-full border border-white/10">
        <div className="flex h-1/2 w-1/2 items-center justify-center rounded-full bg-gradient-to-br from-(--color-accent) to-(--color-violet) shadow-(--shadow-glow)">
          <div className="h-2 w-2 rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  )
}

export function DeviceMock({ view = 'front', className }: DeviceMockProps) {
  return (
    <div className={cn('relative aspect-square w-full max-w-sm select-none', className)}>
      <div className="absolute inset-6 rounded-full bg-(--color-accent) opacity-25 blur-3xl" />

      {view === 'front' && (
        <div className="absolute inset-8 rounded-[40%] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-2xl backdrop-blur-sm">
          <MicRing />
        </div>
      )}

      {view === 'side' && (
        <div className="absolute inset-x-16 inset-y-10 rounded-[28px] border border-white/10 bg-gradient-to-r from-white/[0.03] via-white/10 to-white/[0.03] shadow-2xl">
          <div className="absolute right-3 top-1/2 h-10 w-1 -translate-y-1/2 rounded-full bg-white/20" />
        </div>
      )}

      {view === 'back' && (
        <div className="absolute inset-8 rounded-[40%] border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/10 shadow-2xl">
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <div className="h-6 w-12 rounded-md border border-white/15 bg-black/30" />
            <div className="h-2 w-16 rounded-full bg-white/10" />
            <div className="h-2 w-10 rounded-full bg-white/10" />
          </div>
        </div>
      )}

      {view === 'exploded' && (
        <div className="absolute inset-6">
          <div className="absolute inset-x-10 top-2 h-16 rounded-[40%] border border-white/10 bg-white/[0.06]" />
          <div className="absolute inset-x-8 top-24 h-20 rounded-[36%] border border-white/10 bg-white/[0.04]">
            <MicRing />
          </div>
          <div className="absolute inset-x-12 bottom-2 h-14 rounded-[40%] border border-white/10 bg-white/[0.03]" />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Build + lint.** Both pass.

- [ ] **Step 3: Commit**

```bash
git add components/ui/DeviceMock.tsx
git commit -m "feat: add CSS device mock renderer"
```

### Task 2.3: DemoModal ("Watch Demo")

**Files:**
- Create: `components/ui/DemoModal.tsx`

**Interfaces:**
- Produces: `DemoModal` — `{ open: boolean, onClose: () => void }` (client). Portals to body, closes on Escape and backdrop click.

- [ ] **Step 1: Create `components/ui/DemoModal.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Play } from 'lucide-react'

interface DemoModalProps {
  open: boolean
  onClose: () => void
}

export function DemoModal({ open, onClose }: DemoModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product demo"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-(--color-glass-border) bg-(--color-bg-card) shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close demo"
          className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
        >
          <X size={20} />
        </button>
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-(--color-accent)/20 via-(--color-violet)/10 to-(--color-cyan)/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
            <Play size={28} className="ml-1 text-white" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
```

- [ ] **Step 2: Build + lint.** Both pass.

- [ ] **Step 3: Commit**

```bash
git add components/ui/DemoModal.tsx
git commit -m "feat: add watch-demo modal"
```

### Task 2.4: Hero rewrite + wire into page

**Files:**
- Modify (rewrite): `components/sections/Hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `DeviceMock`, `DemoModal`, `ParticleField`, `Magnetic`, `Button`, `Container`.
- Produces: `Hero` — `() => JSX` (client). Contains `#showcase` scroll target via anchor link.

- [ ] **Step 1: Rewrite `components/sections/Hero.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Magnetic } from '@/components/motion/Magnetic'
import { ParticleField } from '@/components/motion/ParticleField'
import { DeviceMock } from '@/components/ui/DeviceMock'
import { DemoModal } from '@/components/ui/DemoModal'
import { Reveal } from '@/components/motion/Reveal'
import { Play, ShoppingBag } from 'lucide-react'

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28">
      <ParticleField className="absolute inset-0 h-full w-full" />
      <Container>
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Reveal>
              <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-(--color-accent)">
                NovaSense AI
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-(--color-text-primary) sm:text-6xl">
                The Future of <span className="text-gradient">Smart Living</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-(--color-text-secondary) lg:mx-0">
                One AI hub that connects and orchestrates every device in your home — by voice or app. Calm, private, effortless.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Magnetic>
                  <Button asChild={false} size="lg" onClick={() => { document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    <ShoppingBag size={18} />
                    Buy Now
                  </Button>
                </Magnetic>
                <Button variant="secondary" size="lg" onClick={() => setDemoOpen(true)}>
                  <Play size={18} />
                  Watch Demo
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex justify-center">
            <DeviceMock view="front" className="max-w-md" />
          </Reveal>
        </div>
      </Container>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  )
}
```

Note: `Button` does not support `asChild`; remove the `asChild={false}` prop if it causes a TS error — it is shown only to signal the button wraps icon+label children. The correct minimal form is `<Button size="lg" onClick={...}>`.

- [ ] **Step 2: Wire Hero + TrustedBy into `app/page.tsx`**

Replace the imports/usages so the top of the page is the new Hero followed by TrustedBy. Edit `app/page.tsx`:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { TrustedBy } from '@/components/sections/TrustedBy'
import { Features } from '@/components/sections/Features'
import { Scrollytelling } from '@/components/sections/Scrollytelling'
import { Specs } from '@/components/sections/Specs'
import { Shop } from '@/components/sections/Shop'
import { Newsletter } from '@/components/sections/Newsletter'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <Scrollytelling />
        <Specs />
        <Shop />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Build + lint.** Both pass.

**Manual checks:** Hero shows gradient "Smart Living", device with glow, particles drifting (absent under reduce-motion); "Buy Now" smooth-scrolls toward the page (target `#showcase` arrives in Phase 3); "Watch Demo" opens modal, Escape + backdrop close it; magnetic pull on primary CTA (pointer devices); no overflow at 320px; readable in light + dark.

- [ ] **Step 4: Commit + merge phase**

```bash
git add components/sections/Hero.tsx app/page.tsx
git commit -m "feat: rebuild hero with device, particles, and dual CTA"
git checkout main
git merge feat/phase-9-hero-trusted --no-ff -m "feat(phase-9): premium hero and trusted-by"
```

---

## Phase 3 — Features (elevate) + Product Showcase (buy point)

Branch: `feat/phase-9-features-showcase`

### Task 3.1: Elevate Features to glass + tilt + stagger

**Files:**
- Modify (rewrite): `components/sections/Features.tsx`

**Interfaces:**
- Consumes: `GlassCard`, `TiltCard`, `Stagger` + `staggerItem`, `Container`, `Section`, `Badge`, lucide icons.
- Produces: `Features` — `() => JSX` (client, for tilt/stagger).

- [ ] **Step 1: Rewrite `components/sections/Features.tsx`**

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { TiltCard } from '@/components/motion/TiltCard'
import { Stagger, staggerItem } from '@/components/motion/Stagger'
import { Mic, Workflow, Leaf, Smartphone, ShieldCheck, BarChart3, Sparkles } from 'lucide-react'

const features = [
  { icon: Mic, title: 'AI Voice Assistant', desc: 'Natural-language control — no rigid commands, just speak.' },
  { icon: Workflow, title: 'Smart Automation', desc: 'Scenes and routines that orchestrate the whole home.' },
  { icon: Leaf, title: 'Energy Saving', desc: 'Track consumption and cut waste with real-time insights.' },
  { icon: Smartphone, title: 'Remote Access', desc: 'Control everything from anywhere via the unified app.' },
  { icon: ShieldCheck, title: 'Security', desc: 'AI cameras with face recognition and instant alerts.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Real-time statistics across every connected device.' },
]

export function Features() {
  const reduced = useReducedMotion()

  return (
    <Section id="features">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">
            <Sparkles size={12} />
            Features
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Everything your home needs, in one brain
          </h2>
        </div>
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            const card = (
              <GlassCard className="h-full p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-accent)/15 text-(--color-accent) shadow-(--shadow-glow)">
                  <Icon size={20} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-(--color-text-primary)">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">{f.desc}</p>
              </GlassCard>
            )
            return reduced ? (
              <div key={f.title}>{card}</div>
            ) : (
              <motion.div key={f.title} variants={staggerItem}>
                <TiltCard className="h-full">{card}</TiltCard>
              </motion.div>
            )
          })}
        </Stagger>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 2: Build + lint.** Both pass.

**Manual checks:** 6 glass cards, icon glow, staggered reveal on scroll; tilt on hover (pointer); under reduce-motion cards appear statically with no tilt. 1-col at 320px, 2-col tablet, 3-col desktop.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Features.tsx
git commit -m "feat: elevate features to glass cards with tilt and stagger"
```

### Task 3.2: Product Showcase (view switcher + buy point + spec strip)

**Files:**
- Create: `components/sections/ProductShowcase.tsx`

**Interfaces:**
- Consumes: `DeviceMock` + `DeviceView`, `productVariants` + `ProductVariant` (`@/content/products`), `useCart` (`@/store/cart`), `useToast`, `GlassCard`, `Button`, `Container`, `Section`, `Badge`, `framer-motion` `AnimatePresence`.
- Produces: `ProductShowcase` — `() => JSX` (client). Renders `id="showcase"` (Hero's Buy Now target).

- [ ] **Step 1: Create `components/sections/ProductShowcase.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { DeviceMock, type DeviceView } from '@/components/ui/DeviceMock'
import { productVariants, type ProductVariant } from '@/content/products'
import { useCart } from '@/store/cart'
import { Box, ShoppingCart } from 'lucide-react'

const views: { key: DeviceView; label: string }[] = [
  { key: 'front', label: 'Front' },
  { key: 'side', label: 'Side' },
  { key: 'back', label: 'Back' },
  { key: 'exploded', label: 'Exploded' },
]

const specStrip = [
  'AI NPU processor',
  'Wi-Fi 6 · BT 5.3 · Zigbee · Z-Wave · Thread · Matter',
  '100+ devices',
  'On-device AI',
]

export function ProductShowcase() {
  const reduced = useReducedMotion()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [view, setView] = useState<DeviceView>('front')
  const [selectedId, setSelectedId] = useState<string>(productVariants[0]!.id)

  const selected: ProductVariant = productVariants.find((v) => v.id === selectedId) ?? productVariants[0]!

  function handleAdd() {
    addItem(selected)
    toast({ title: 'Added to cart', description: `${selected.name} — ${selected.colorLabel}`, variant: 'success' })
  }

  return (
    <Section id="showcase">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">
            <Box size={12} />
            Product
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Designed from every angle
          </h2>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="relative flex aspect-square items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={reduced ? false : { opacity: 0, rotateY: -20 }}
                  animate={reduced ? {} : { opacity: 1, rotateY: 0 }}
                  exit={reduced ? {} : { opacity: 0, rotateY: 20 }}
                  transition={{ duration: 0.35 }}
                  className="flex w-full items-center justify-center"
                >
                  <DeviceMock view={view} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div role="tablist" aria-label="Device views" className="mt-6 flex justify-center gap-2">
              {views.map((v) => (
                <button
                  key={v.key}
                  role="tab"
                  aria-selected={view === v.key}
                  onClick={() => setView(v.key)}
                  className={
                    view === v.key
                      ? 'rounded-full bg-(--color-accent) px-4 py-1.5 text-sm font-medium text-white'
                      : 'rounded-full border border-(--color-glass-border) px-4 py-1.5 text-sm font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)'
                  }
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <GlassCard className="p-6 sm:p-8">
            <h3 className="font-heading text-2xl font-bold text-(--color-text-primary)">{selected.name}</h3>
            <p className="mt-1 text-sm text-(--color-text-secondary)">{selected.colorLabel}</p>
            <p className="mt-4 font-heading text-4xl font-extrabold text-(--color-text-primary)">
              ${selected.price.toFixed(2)}
            </p>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">Choose your model</p>
              <div className="flex flex-wrap gap-2">
                {productVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedId(v.id)}
                    aria-pressed={selectedId === v.id}
                    className={
                      selectedId === v.id
                        ? 'rounded-lg border border-(--color-accent) bg-(--color-accent)/10 px-3 py-2 text-left text-xs text-(--color-text-primary)'
                        : 'rounded-lg border border-(--color-glass-border) px-3 py-2 text-left text-xs text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)'
                    }
                  >
                    <span className="block font-semibold">{v.name}</span>
                    <span className="block">{v.colorLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button className="mt-7 w-full" size="lg" onClick={handleAdd}>
              <ShoppingCart size={18} />
              Add to Cart
            </Button>

            <ul className="mt-6 grid grid-cols-1 gap-2 border-t border-(--color-glass-border) pt-5 text-xs text-(--color-text-secondary) sm:grid-cols-2">
              {specStrip.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--color-accent)" />
                  {s}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 2: Retire Shop/Specs/ProductCard/RecentlyViewed and wire Showcase into the page**

Delete the retired files and update `app/page.tsx`:

```bash
git rm components/sections/Shop.tsx components/sections/Specs.tsx components/ecommerce/ProductCard.tsx components/ecommerce/RecentlyViewed.tsx
```

Edit `app/page.tsx` — remove the `Shop`, `Specs`, and `Scrollytelling` imports/usages that are now retired or being replaced, and insert `ProductShowcase` after `Features`. (Scrollytelling stays until Phase 4; keep it for now. Specs and Shop are removed now.) Result:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { TrustedBy } from '@/components/sections/TrustedBy'
import { Features } from '@/components/sections/Features'
import { ProductShowcase } from '@/components/sections/ProductShowcase'
import { Scrollytelling } from '@/components/sections/Scrollytelling'
import { Newsletter } from '@/components/sections/Newsletter'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <ProductShowcase />
        <Scrollytelling />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Build + lint.** Both pass. (If the build complains about an unused `recently-viewed` store import anywhere, confirm nothing imports it; the store file may remain unused.)

**Manual checks:** "Buy Now" in Hero now scrolls precisely to the showcase; tab switching crossfades/rotates the device (instant swap under reduce-motion); selecting a model updates name/price; price shows `.00`; "Add to Cart" increments the header cart badge and fires a success toast; cart drawer (fixed earlier) opens full-height. 320px: image stacks above the buy card.

- [ ] **Step 4: Commit + merge phase**

```bash
git add -A
git commit -m "feat: add product showcase as hardware buy point; retire shop and specs"
git checkout main
git merge feat/phase-9-features-showcase --no-ff -m "feat(phase-9): features elevation and product showcase"
```

---

## Phase 4 — Why/Timeline + Statistics

Branch: `feat/phase-9-timeline-stats`

### Task 4.1: Why NovaSense timeline (replaces Scrollytelling)

**Files:**
- Create: `content/timeline.ts`
- Create: `components/sections/WhyTimeline.tsx`

**Interfaces:**
- Consumes: `Reveal`, `Container`, `Section`, `Badge`, `framer-motion` (`useScroll`, `useSpring`, `useReducedMotion`).
- Produces: `timeline: TimelineStep[]`; `WhyTimeline` — `() => JSX` (client), renders `id="why"`.

- [ ] **Step 1: Create `content/timeline.ts`**

```ts
import type { LucideIcon } from 'lucide-react'
import { Brain, Mic, Wifi, ShieldCheck, RefreshCw } from 'lucide-react'

export interface TimelineStep {
  title: string
  description: string
  icon: LucideIcon
}

export const timeline: TimelineStep[] = [
  { title: 'AI Learning', description: 'NovaSense learns your routines and adapts automatically.', icon: Brain },
  { title: 'Voice Recognition', description: 'Far-field mics understand you from across the room.', icon: Mic },
  { title: 'IoT Connectivity', description: 'Speaks every protocol — Matter, Zigbee, Z-Wave, Thread.', icon: Wifi },
  { title: 'Secure Cloud', description: 'On-device processing with optional encrypted sync.', icon: ShieldCheck },
  { title: 'OTA Update', description: 'Gets smarter over time with seamless updates.', icon: RefreshCw },
]
```

- [ ] **Step 2: Create `components/sections/WhyTimeline.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/motion/Reveal'
import { timeline } from '@/content/timeline'
import { Route } from 'lucide-react'

export function WhyTimeline() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <Section id="why">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">
            <Route size={12} />
            Why NovaSense
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Built to get smarter every day
          </h2>
        </div>

        <div ref={ref} className="relative mx-auto mt-14 max-w-2xl">
          <div className="absolute left-5 top-0 h-full w-px bg-(--color-glass-border)" aria-hidden="true" />
          {!reduced && (
            <motion.div
              aria-hidden="true"
              style={{ scaleY, transformOrigin: 'top' }}
              className="absolute left-5 top-0 h-full w-px bg-(--color-accent)"
            />
          )}
          <ul className="space-y-10">
            {timeline.map((step, i) => {
              const Icon = step.icon
              return (
                <li key={step.title} className="relative pl-16">
                  <Reveal delay={reduced ? 0 : i * 0.05}>
                    <span className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full border border-(--color-glass-border) bg-(--color-bg-card) text-(--color-accent) shadow-(--shadow-glow)">
                      <Icon size={18} />
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-(--color-text-primary)">{step.title}</h3>
                    <p className="mt-1 text-sm text-(--color-text-secondary)">{step.description}</p>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 3: Replace Scrollytelling with WhyTimeline in `app/page.tsx` and delete Scrollytelling**

```bash
git rm components/sections/Scrollytelling.tsx
```

In `app/page.tsx`, swap the `Scrollytelling` import for `WhyTimeline` and replace `<Scrollytelling />` with `<WhyTimeline />`.

- [ ] **Step 4: Build + lint.** Both pass.

**Manual checks:** Timeline shows 5 steps; the accent progress line fills as you scroll through the section (static full line under reduce-motion); icons glow; 320px no overflow.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add why-novasense scroll timeline; retire scrollytelling"
```

### Task 4.2: Statistics counters

**Files:**
- Create: `content/stats.ts`
- Create: `components/sections/Statistics.tsx`

**Interfaces:**
- Consumes: `Counter` (Task 1.3), `GlassCard`, `Reveal`, `Container`, `Section`.
- Produces: `stats: Stat[]`; `Statistics` — `() => JSX` (server component; Counter is the client leaf).

- [ ] **Step 1: Create `content/stats.ts`**

```ts
export interface Stat {
  to: number
  suffix: string
  decimals?: number
  label: string
}

export const stats: Stat[] = [
  { to: 500, suffix: 'K+', label: 'Active users' },
  { to: 98, suffix: '%', label: 'Voice accuracy' },
  { to: 120, suffix: '+', label: 'Countries' },
  { to: 4.9, suffix: '★', decimals: 1, label: 'Average rating' },
]
```

- [ ] **Step 2: Create `components/sections/Statistics.tsx`**

```tsx
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { Counter } from '@/components/motion/Counter'
import { Reveal } from '@/components/motion/Reveal'
import { stats } from '@/content/stats'

export function Statistics() {
  return (
    <Section id="stats">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <GlassCard className="p-8 text-center">
                <p className="text-gradient font-heading text-4xl font-extrabold sm:text-5xl">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </p>
                <p className="mt-2 text-sm text-(--color-text-secondary)">{s.label}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 3: Add Statistics to `app/page.tsx`** after `<WhyTimeline />`.

- [ ] **Step 4: Build + lint.** Both pass.

**Manual checks:** Four stat cards; numbers count up when scrolled into view (4.9 shows one decimal); show final values immediately under reduce-motion; gradient numerals; 1-col 320px → 4-col desktop.

- [ ] **Step 5: Commit + merge phase**

```bash
git add -A
git commit -m "feat: add animated statistics counters"
git checkout main
git merge feat/phase-9-timeline-stats --no-ff -m "feat(phase-9): why-timeline and statistics"
```

---

## Phase 5 — Testimonials + Pricing

Branch: `feat/phase-9-testimonials-pricing`

### Task 5.1: Testimonials carousel

**Files:**
- Create: `content/testimonials.ts`
- Create: `components/sections/Testimonials.tsx`

**Interfaces:**
- Consumes: `GlassCard`, `Container`, `Section`, `Badge`, `framer-motion` (`AnimatePresence`, `motion`, `useReducedMotion`), lucide.
- Produces: `testimonials: Testimonial[]`; `Testimonials` — `() => JSX` (client), renders `id="testimonials"`.

- [ ] **Step 1: Create `content/testimonials.ts`**

```ts
export interface Testimonial {
  name: string
  role: string
  initials: string
  rating: number
  quote: string
}

export const testimonials: Testimonial[] = [
  { name: 'Ava Chen', role: 'Smart-home enthusiast', initials: 'AC', rating: 5, quote: 'NovaSense replaced four different apps. Now I just talk to my house.' },
  { name: 'Marcus Reid', role: 'Architect', initials: 'MR', rating: 5, quote: 'The on-device AI is shockingly fast and the design disappears into the room.' },
  { name: 'Lena Ortiz', role: 'Energy consultant', initials: 'LO', rating: 4, quote: 'Energy insights cut our standby draw noticeably within the first month.' },
  { name: 'Tomás Vidal', role: 'Developer', initials: 'TV', rating: 5, quote: 'Matter and Thread just worked. No hubs-on-hubs nonsense.' },
]
```

- [ ] **Step 2: Create `components/sections/Testimonials.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { testimonials } from '@/content/testimonials'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

export function Testimonials() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = testimonials.length

  function go(dir: number) {
    setIndex((i) => (i + dir + count) % count)
  }

  useEffect(() => {
    if (reduced || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000)
    return () => clearInterval(id)
  }, [reduced, paused, count])

  const t = testimonials[index]!

  return (
    <Section id="testimonials">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">
            <Quote size={12} />
            Testimonials
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Loved in homes worldwide
          </h2>
        </div>

        <div
          className="relative mx-auto mt-12 max-w-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <GlassCard className="p-8 text-center sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={reduced ? {} : { opacity: 1, y: 0 }}
                exit={reduced ? {} : { opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-(--color-accent) to-(--color-violet) font-heading font-bold text-white">
                  {t.initials}
                </div>
                <div className="mb-4 flex justify-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < t.rating ? 'fill-(--color-accent) text-(--color-accent)' : 'text-(--color-text-muted)'}
                    />
                  ))}
                </div>
                <p className="text-lg text-(--color-text-primary)">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 font-semibold text-(--color-text-primary)">{t.name}</p>
                <p className="text-sm text-(--color-text-muted)">{t.role}</p>
              </motion.div>
            </AnimatePresence>
          </GlassCard>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="rounded-full border border-(--color-glass-border) p-2 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index}
                  className={i === index ? 'h-2 w-6 rounded-full bg-(--color-accent)' : 'h-2 w-2 rounded-full bg-(--color-text-muted)'}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="rounded-full border border-(--color-glass-border) p-2 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 3: Add Testimonials to `app/page.tsx`** after `<Statistics />`.

- [ ] **Step 4: Build + lint.** Both pass.

**Manual checks:** Auto-advances every 5s; pauses on hover; prev/next + dots work; stars reflect rating; avatar initials gradient; auto-advance disabled under reduce-motion (manual nav still works).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add testimonials carousel"
```

### Task 5.2: Pricing tiers (NovaSense+)

**Files:**
- Create: `content/pricing-tiers.ts`
- Create: `components/sections/Pricing.tsx`

**Interfaces:**
- Consumes: `GlassCard`, `Button`, `Reveal`, `Container`, `Section`, `Badge`, lucide. Scroll targets `#showcase`, `#newsletter`, `#contact` (contact arrives Phase 6).
- Produces: `pricingTiers: PricingTier[]`; `Pricing` — `() => JSX` (client), renders `id="pricing"`.

- [ ] **Step 1: Create `content/pricing-tiers.ts`**

```ts
export interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'with every hub',
    description: 'Core control for your home.',
    features: ['Voice & app control', 'Up to 20 devices', 'Basic automations', 'Community support'],
    cta: 'Get started',
  },
  {
    name: 'Professional',
    price: '$9',
    period: 'per month',
    description: 'AI automations + insights.',
    features: ['Unlimited devices', 'Adaptive AI routines', 'Energy analytics', 'Priority support', 'Encrypted cloud sync'],
    cta: 'Choose Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'multi-property',
    description: 'For installers & estates.',
    features: ['Multi-property dashboard', 'API & webhooks', 'SLA & onboarding', 'Dedicated manager'],
    cta: 'Contact sales',
  },
]
```

- [ ] **Step 2: Create `components/sections/Pricing.tsx`**

```tsx
'use client'

import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'
import { pricingTiers } from '@/content/pricing-tiers'
import { Check, Gem } from 'lucide-react'

const ctaTarget: Record<string, string> = {
  Starter: 'showcase',
  Professional: 'newsletter',
  Enterprise: 'contact',
}

export function Pricing() {
  function handleCta(tier: string) {
    const id = ctaTarget[tier] ?? 'contact'
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section id="pricing">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">
            <Gem size={12} />
            NovaSense+ Plans
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Choose your level of intelligence
          </h2>
          <p className="mt-4 text-(--color-text-secondary)">
            Every hub includes Starter free. Upgrade anytime for adaptive AI and insights.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.06}>
              <GlassCard
                className={
                  tier.highlighted
                    ? 'relative h-full border-(--color-accent) p-8 shadow-(--shadow-glow)'
                    : 'relative h-full p-8'
                }
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--color-accent) px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold text-(--color-text-primary)">{tier.name}</h3>
                <p className="mt-1 text-sm text-(--color-text-secondary)">{tier.description}</p>
                <p className="mt-5">
                  <span className="font-heading text-4xl font-extrabold text-(--color-text-primary)">{tier.price}</span>
                  <span className="ml-1 text-sm text-(--color-text-muted)">{tier.period}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-(--color-text-secondary)">
                      <Check size={16} className="mt-0.5 flex-shrink-0 text-(--color-accent)" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.highlighted ? 'primary' : 'secondary'}
                  size="md"
                  className="mt-8 w-full"
                  onClick={() => handleCta(tier.name)}
                >
                  {tier.cta}
                </Button>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 3: Add Pricing to `app/page.tsx`** after `<Testimonials />`.

- [ ] **Step 4: Build + lint.** Both pass.

**Manual checks:** Three tiers; Professional highlighted with glow + "Most popular"; CTAs smooth-scroll (Starter→showcase, Pro→newsletter, Enterprise→contact once Phase 6 lands; until then Enterprise scroll is a no-op which is acceptable); 1-col 320px → 3-col desktop.

- [ ] **Step 5: Commit + merge phase**

```bash
git add -A
git commit -m "feat: add novasense+ pricing tiers"
git checkout main
git merge feat/phase-9-testimonials-pricing --no-ff -m "feat(phase-9): testimonials and pricing"
```

---

## Phase 6 — FAQ + Contact

Branch: `feat/phase-9-faq-contact`

### Task 6.1: FAQ accordion

**Files:**
- Create: `content/faq.ts`
- Create: `components/sections/Faq.tsx`

**Interfaces:**
- Consumes: `Reveal`, `Container`, `Section`, `Badge`, lucide.
- Produces: `faqItems: FaqItem[]`; `Faq` — `() => JSX` (server component; native `<details>`), renders `id="faq"`.

- [ ] **Step 1: Create `content/faq.ts`**

```ts
export interface FaqItem {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  { question: 'Which smart-home standards does NovaSense support?', answer: 'NovaSense speaks Matter, Zigbee 3.0, Z-Wave, Thread, Wi-Fi 6, and Bluetooth 5.3 — so it works with virtually every modern device.' },
  { question: 'Does it work without the internet?', answer: 'Yes. NovaSense processes AI on-device, so voice control and automations keep working even when your connection drops. Cloud sync is optional.' },
  { question: 'How many devices can it control?', answer: 'A single hub manages 100+ simultaneous devices across every supported protocol.' },
  { question: 'Is my data private?', answer: 'On-device (edge) AI means your voice and routines stay local by default. Cloud sync is encrypted and entirely opt-in.' },
  { question: 'What is the difference between Hub and Pro?', answer: 'Pro adds enhanced processing and expandable storage for larger homes and heavier automation workloads. Both run the full NovaSense AI.' },
]
```

- [ ] **Step 2: Create `components/sections/Faq.tsx`**

```tsx
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/motion/Reveal'
import { faqItems } from '@/content/faq'
import { HelpCircle, ChevronDown } from 'lucide-react'

export function Faq() {
  return (
    <Section id="faq">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">
            <HelpCircle size={12} />
            FAQ
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Questions, answered
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {faqItems.map((item, i) => (
            <Reveal key={item.question} delay={i * 0.04}>
              <details className="group rounded-2xl border border-(--color-glass-border) bg-(--color-glass) backdrop-blur-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-(--color-text-primary) [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown size={18} className="flex-shrink-0 text-(--color-text-muted) transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-(--color-text-secondary)">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 3: Build + lint.** Both pass.

**Manual checks:** Each row expands/collapses on click and Enter/Space (native `<details>`); chevron rotates when open; keyboard-focusable; readable both themes.

- [ ] **Step 4: Commit**

```bash
git add content/faq.ts components/sections/Faq.tsx
git commit -m "feat: add faq accordion"
```

### Task 6.2: Contact schema + `/api/contact` route

**Files:**
- Modify: `lib/validations.ts`
- Create: `app/api/contact/route.ts`

**Interfaces:**
- Consumes: `zod` (existing).
- Produces: `contactSchema`, `ContactInput`; `POST /api/contact` → `{ success: boolean, message: string }`.

- [ ] **Step 1: Add `contactSchema` to `lib/validations.ts`**

Append:

```ts
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(40).optional(),
  message: z.string().min(1, 'Message is required').max(2000),
  _honey: z.string().max(0, 'Bot detected').optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
```

- [ ] **Step 2: Create `app/api/contact/route.ts`** (mirrors `/api/subscribe`)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid data' },
      { status: 422 },
    )
  }

  const { name, email, phone, message, _honey } = parsed.data
  if (_honey) {
    return NextResponse.json({ success: true, message: 'Message sent!' })
  }

  const webhookUrl = process.env.WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[contact] WEBHOOK_URL not configured — skipping forward')
    return NextResponse.json({ success: true, message: 'Message sent!' })
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message, source: 'novasense-contact', timestamp: Date.now() }),
    })
    if (!res.ok) throw new Error(`Webhook returned ${res.status}`)
    return NextResponse.json({ success: true, message: "Thanks — we'll be in touch!" })
  } catch (err) {
    console.error('[contact] Webhook error:', err)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
```

- [ ] **Step 3: Build + lint.** Both pass.

- [ ] **Step 4: Runtime test the route**

Start dev server (`npm run dev`) in one shell, then in another:

```bash
curl -i -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"t@example.com\",\"message\":\"Hello\"}"
```
Expected: `HTTP/1.1 200` and `{"success":true,"message":"Message sent!"}` (no WEBHOOK_URL set locally → safe skip).

```bash
curl -i -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d "{\"name\":\"\",\"email\":\"bad\",\"message\":\"\"}"
```
Expected: `HTTP/1.1 422` and a `{"success":false,...}` validation message.

- [ ] **Step 5: Commit**

```bash
git add lib/validations.ts app/api/contact/route.ts
git commit -m "feat: add contact schema and api/contact route"
```

### Task 6.3: Contact form section + wire into page

**Files:**
- Create: `components/sections/Contact.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `contactSchema`/`ContactInput`, `useToast`, `GlassCard`, `Button`, `Container`, `Section`, `Badge`, RHF + zodResolver.
- Produces: `Contact` — `() => JSX` (client), renders `id="contact"`.

- [ ] **Step 1: Create `components/sections/Contact.tsx`**

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { Mails } from 'lucide-react'

const inputCls =
  'w-full rounded-md border border-(--color-glass-border) bg-(--color-bg) px-4 py-2.5 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)'

export function Contact() {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(data: ContactInput) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { success: boolean; message: string }
      if (json.success) {
        toast({ title: 'Message sent!', description: "We'll be in touch soon.", variant: 'success' })
        reset()
      } else {
        toast({ title: 'Could not send', description: json.message, variant: 'error' })
      }
    } catch {
      toast({ title: 'Network error', description: 'Please try again later.', variant: 'error' })
    }
  }

  return (
    <Section id="contact">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <Badge className="mb-4">
            <Mails size={12} />
            Contact
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Talk to our team
          </h2>
        </div>
        <GlassCard className="mx-auto mt-10 max-w-xl p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input type="text" tabIndex={-1} aria-hidden="true" className="hidden" {...register('_honey')} />
            <div>
              <input placeholder="Your name" aria-label="Name" className={inputCls} {...register('name')} />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <input type="email" placeholder="you@example.com" aria-label="Email" className={inputCls} {...register('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <input type="tel" placeholder="Phone (optional)" aria-label="Phone" className={inputCls} {...register('phone')} />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>
            <div>
              <textarea placeholder="How can we help?" aria-label="Message" rows={4} className={inputCls} {...register('message')} />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        </GlassCard>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 2: Add Faq + Contact to `app/page.tsx`** after `<Pricing />` (order finalized in Phase 7).

- [ ] **Step 3: Build + lint.** Both pass.

**Manual checks:** Empty submit shows inline name/email/message errors; valid submit shows success toast and clears the form; Pricing "Contact sales" now scrolls here; honeypot hidden field not tabbable.

- [ ] **Step 4: Commit + merge phase**

```bash
git add components/sections/Contact.tsx app/page.tsx
git commit -m "feat: add contact form section"
git checkout main
git merge feat/phase-9-faq-contact --no-ff -m "feat(phase-9): faq and contact"
```

---

## Phase 7 — Newsletter elevation + Footer + Final assembly + polish

Branch: `feat/phase-9-assembly-polish`

### Task 7.1: Elevate Newsletter to glass

**Files:**
- Modify: `components/sections/Newsletter.tsx`

**Interfaces:** unchanged public behavior; wraps content in `GlassCard`, swaps borders to `--color-glass-border`.

- [ ] **Step 1: Edit `components/sections/Newsletter.tsx`**

Add the import:

```tsx
import { GlassCard } from '@/components/ui/GlassCard'
```

Change the `<Section id="newsletter" className="bg-(--color-bg-subtle)">` opening to remove the subtle-bg and wrap the inner `<div className="mx-auto max-w-xl text-center">…</div>` in a `GlassCard`:

```tsx
    <Section id="newsletter">
      <Container>
        <GlassCard className="mx-auto max-w-2xl p-8 text-center sm:p-12">
          {/* existing Badge + h2 + p + form, unchanged */}
        </GlassCard>
      </Container>
    </Section>
```

In the email input className, change `border-(--color-border)` to `border-(--color-glass-border)` and `bg-(--color-bg)` stays. (No other behavior changes.)

- [ ] **Step 2: Build + lint.** Both pass.

**Manual checks:** Newsletter sits on a glass card over the aurora; form still validates + toasts; honeypot intact.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Newsletter.tsx
git commit -m "feat: elevate newsletter to glass surface"
```

### Task 7.2: Footer rewrite (multi-column + social)

**Files:**
- Modify (rewrite): `components/layout/Footer.tsx`

**Interfaces:**
- Produces: `Footer` — `() => JSX` (server component).

- [ ] **Step 1: Rewrite `components/layout/Footer.tsx`**

```tsx
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Github, Facebook, Linkedin } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Showcase', href: '#showcase' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why NovaSense', href: '#why' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]

const socials = [
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="border-t border-(--color-glass-border) py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-heading text-xl font-bold text-(--color-text-primary)">
              Nova<span className="text-(--color-accent)">Sense</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-(--color-text-secondary)">
              The intelligent brain of the home. Premium, calm technology.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="rounded-md border border-(--color-glass-border) p-2 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold text-(--color-text-primary)">{col.title}</h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="font-heading text-sm font-semibold text-(--color-text-primary)">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)">Terms</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-(--color-glass-border) pt-6 text-center text-xs text-(--color-text-muted)">
          © 2026 NovaSense. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
```

- [ ] **Step 2: Build + lint.** Both pass.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat: rebuild footer with columns and social links"
```

### Task 7.3: Final page order, header nav, cart polish

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `components/ecommerce/CartDrawer.tsx`

**Interfaces:** none new — finalizes the 12-section order and folds in carried-over polish.

- [ ] **Step 1: Set the final section order in `app/page.tsx`**

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { TrustedBy } from '@/components/sections/TrustedBy'
import { Features } from '@/components/sections/Features'
import { ProductShowcase } from '@/components/sections/ProductShowcase'
import { WhyTimeline } from '@/components/sections/WhyTimeline'
import { Statistics } from '@/components/sections/Statistics'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import { Newsletter } from '@/components/sections/Newsletter'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <ProductShowcase />
        <WhyTimeline />
        <Statistics />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Update Header nav links** in `components/layout/Header.tsx`

Replace the `navLinks` array (Specs was retired):

```tsx
const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#showcase', label: 'Product' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]
```

- [ ] **Step 3: Format cart prices in `components/ecommerce/CartDrawer.tsx`**

Change the line-item price `${item.variant.price * item.qty}` to:

```tsx
                          ${(item.variant.price * item.qty).toFixed(2)}
```

And the total `${total}` to:

```tsx
                  <span className="font-heading text-lg font-bold text-(--color-text-primary)">${total.toFixed(2)}</span>
```

- [ ] **Step 4: Build + lint.** Both pass.

**Manual checks:** All 12 sections render top-to-bottom in spec order; header nav anchors scroll to the right sections; cart prices show `.00`; no horizontal overflow 320→1440; chat (bottom-right) and cart drawer both usable.

- [ ] **Step 5: Commit + merge phase**

```bash
git add app/page.tsx components/layout/Header.tsx components/ecommerce/CartDrawer.tsx
git commit -m "feat: finalize section order, header nav, and cart price formatting"
git checkout main
git merge feat/phase-9-assembly-polish --no-ff -m "feat(phase-9): newsletter, footer, assembly, and polish"
```

---

## Phase 8 — QA Sweep + Performance + Docs

Branch: `feat/phase-9-qa`

### Task 8.1: Responsive, a11y, theme, reduced-motion sweep

**Files:** any section files needing fixes found during the sweep.

- [ ] **Step 1: Responsiveness** — In DevTools device toolbar, load `/` at 320, 375, 768, 1024, 1440px. At each: confirm `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal overflow), no overlapping text, header nav collapses on mobile, cart drawer + chat both reachable, all section grids reflow (1→2→3/4 col). Fix any overflow (usual culprits: fixed `w-[..]`, large headings — add `break-words`/reduce clamp).

- [ ] **Step 2: Accessibility** — Tab through the entire page: every interactive control (nav, buttons, tabs, carousel arrows/dots, accordion summaries, form fields, cart, chat) shows a visible focus ring and is reachable. Confirm one `<h1>` (Hero) and `<h2>` per section. Run DevTools Lighthouse Accessibility (or axe) and resolve any contrast < 4.5:1 (watch `--color-text-muted` on glass — darken if it fails).

- [ ] **Step 3: Dark/light parity** — Toggle theme. Every section is readable in both; no white flash on reload (theme script intact); glass borders visible in both; focus rings visible in both.

- [ ] **Step 4: Reduced motion** — DevTools → Rendering → "Emulate prefers-reduced-motion: reduce". Confirm: no particles, no reveal/stagger/tilt/magnetic motion, counters show final values immediately, testimonial auto-advance off (manual nav still works), showcase view swaps instantly, timeline shows a full static line. Everything remains fully usable.

- [ ] **Step 5: Build + lint, then commit any fixes**

```bash
npm run build && npm run lint
git add -A
git commit -m "fix: responsive, a11y, and reduced-motion sweep corrections"
```

(If the sweep finds nothing to fix, skip the commit and note it in the phase report.)

### Task 8.2: Lighthouse + documentation

**Files:**
- Modify: `NOTES.md`, `README.md`, `CLAUDE.md`

- [ ] **Step 1: Production Lighthouse (mobile)**

```bash
npm run build
npx next start
```
In a second shell:
```bash
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --output=json --output-path=./lighthouse-redesign.json --quiet
```
Read the four scores. **Performance must be ≥ 85** (hard constraint). If below 85, the most likely regressions are the particle canvas and the backdrop-blur glass — mitigate: lower `ParticleField` `count`, reduce blur radius on glows, or gate the particle field to `lg:` screens. Re-measure until ≥ 85. Delete `lighthouse-redesign.json` after recording (do not commit it).

- [ ] **Step 2: Record scores in `NOTES.md`**

Under a new `## Phase 9 — Premium Redesign` heading, append the four measured scores and the date.

- [ ] **Step 3: Update `README.md`** — under the PSI section, replace the placeholder mobile scores with the measured redesign scores.

- [ ] **Step 4: Update `CLAUDE.md` roadmap** — add to the Phase Roadmap list:

```markdown
- [x] Phase 9 — Premium redesign (Aurora system, 12-section landing, hybrid commerce)
```

- [ ] **Step 5: Commit + merge phase**

```bash
git add NOTES.md README.md CLAUDE.md
git commit -m "docs: record phase-9 redesign lighthouse scores and roadmap"
git checkout main
git merge feat/phase-9-qa --no-ff -m "feat(phase-9): QA sweep and performance docs"
```

---

## Plan Self-Review (author check — completed)

**Spec coverage:** Every spec section maps to a task — visual system + motion primitives (Phase 1); all 12 sections (Phases 2–7); hybrid commerce = cart retained + Showcase buy point (Task 3.2) + NovaSense+ tiers (Task 5.2); `/api/contact` (Task 6.2); carried-over polish — `.toFixed(2)` and real `<button>`/`<a>` controls (Tasks 7.3 + used throughout); hard constraints enforced in Global Constraints and verified in Phase 8.

**Type consistency:** `DeviceView`/`DeviceMock` (2.2) consumed in 3.2; `productVariants`/`ProductVariant` + `useCart().addItem` match `store/cart.ts` and `content/products.ts`; `Stagger`+`staggerItem` (1.3) consumed in 3.1; `Counter` props consumed in 4.2; `contactSchema`/`ContactInput` (6.2) consumed in 6.3; `GlassCard`/`Reveal` consumed everywhere. With `noUncheckedIndexedAccess: true`, indexed accesses (`productVariants[0]`, `testimonials[index]`) use `!` — required by the type checker, allowed by ESLint.

**Known notes for implementers:** (a) `Button` has no `asChild` prop — the Hero snippet flags removing the illustrative `asChild={false}`. (b) The Newsletter edit keeps the existing Badge/heading/form markup and only wraps it in `GlassCard` + swaps one border token. (c) `ParticleField`/glass are the perf-sensitive pieces; Phase 8 Step 1 gives the mitigation path if PSI dips below 85.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-30-premium-landing-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, spec + quality review between tasks, fast iteration. Matches how Phases 0–8 were executed.

**2. Inline Execution** — execute tasks in this session with batch checkpoints.

Which approach?
