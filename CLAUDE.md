# NovaSense — Project Guide

## Product

**NovaSense** — "The Future of Smart Living." An AI-powered Smart Hub that connects and controls an entire smart-home ecosystem (lights, cameras, air conditioning, curtains, door locks, sensors, IoT devices) by voice or app.

**Positioning:** Intelligent brain of the home; premium, calm technology that quietly orchestrates daily life.

**Highlight features:** natural-language AI voice control; universal device compatibility (Matter, Zigbee, Z-Wave, Thread, Wi-Fi, Bluetooth); whole-home control of lights/cameras/AC/curtains/locks/sensors; smart automations, scenes & routines; on-device (edge) AI for speed & privacy; unified mobile app + voice; energy monitoring & insights.

**Tech specs:** dedicated AI NPU processor; far-field multi-mic array with noise cancellation; Wi-Fi 6 + Bluetooth 5.3 + Zigbee 3.0 + Z-Wave + Thread + Matter; supports 100+ simultaneous devices; local processing with optional cloud; companion app for iOS & Android; compact desktop form factor; USB-C / DC power.

---

## Mandatory Rules

**R1 — Phase-by-phase, each phase = its own Git branch.** Never skip ahead. Only start a new phase after DoD → code-review → merged to main.

**R2 — Stay on task, but understand the architecture.** Do only the work listed in the current phase. Extras go to NOTES.md "Emergent backlog". If ambiguous → pick reasonable option, record in NOTES.md.

However, staying on task does NOT mean ignoring architectural correctness. Before writing any piece of code, ask:
- **What problem does this solve?** Is it scoped to one place or shared across the system?
- **What are the constraints?** Will other routes / modules need the same logic? Does isolating it create a correctness bug (e.g. per-route Maps that fail to enforce a global rate limit)?
- **What are the tradeoffs?** Inline = simpler now, harder to reuse. Extracted = more files, but prevents duplication and hidden bugs.
- **What errors will occur if I don't extract?** If the answer is "a silent correctness failure" (not just code smell), extraction is required in the current task, not deferred.

Rule of thumb: extract when two or more routes share the same logic AND keeping it inline would produce different behavior than sharing it (e.g. independent Maps vs one shared Map). Do NOT extract speculatively for hypothetical future callers.

**R3 — Run `code-review` skill after every task.** Fix critical/high findings. Record medium/low skips in NOTES.md. Only commit after review is resolved.

**R4 — No explanatory comments in source code.** No `// this does X`, no logic-explaining JSDoc. Exceptions: framework directives (`"use client"`, `// @ts-expect-error`, ESLint pragmas only).

**R5 — Git & Commit rules (CRITICAL):**
- Push under user's identity only
- **NEVER** add `Co-Authored-By: Claude` or any AI credit line
- Conventional Commits: `feat:`, `fix:`, `perf:`, `chore:`, `docs:`, `style:`, `refactor:`
- Branch: `feat/phase-<n>-<slug>`
- Small commits, one per logical unit

**R6 — Report after each phase:** branch name, commits, code-review result, DoD checklist met.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript 5 strict
- **Styling:** Tailwind CSS 3 + CSS variables design tokens
- **Animation:** Framer Motion + IntersectionObserver
- **Forms:** React Hook Form + Zod (client + server validation)
- **State:** Zustand + localStorage persist
- **Backend:** Next.js Route Handlers (`app/api/`)
- **Fonts:** next/font — Geist (body) + Sora (headings)
- **Deploy:** Vercel

---

## Commands

```bash
npm install          # install deps
npm run dev          # start dev server (localhost:3000)
npm run build        # production build
npm run lint         # ESLint check
npm run format       # Prettier format
npx lighthouse http://localhost:3000 --output=json   # Lighthouse CLI
```

---

## Conventions

- Branch: `feat/phase-<n>-<slug>` (bootstrap: `chore/bootstrap-claude-md`)
- Commits: Conventional Commits, short + meaningful
- Folder: `components/ui/`, `components/layout/`, `components/sections/`, `components/ecommerce/`, `components/chatbot/`, `lib/`, `store/`, `content/`
- Icons: lucide-react (tree-shakeable)
- Images: next/image, AVIF/WebP, `sizes` prop always set
- Theme: `class` strategy on `<html>`, CSS variables in `globals.css`, no flash via inline script in `<head>`
- No explanatory comments — naming IS documentation

---

## ENV Variables (`.env.local`, never committed)

```
WEBHOOK_URL=               # webhook.site / Make / n8n endpoint
LLM_PROVIDER=openai        # openai | gemini
LLM_API_KEY=               # server-only, never NEXT_PUBLIC_
LLM_MODEL=gpt-4o-mini      # model ID
NEXT_PUBLIC_SITE_URL=      # https://novasense.vercel.app
```

---

## Phase Roadmap

- [x] Bootstrap — CLAUDE.md
- [x] Phase 0 — Setup & technical foundation
- [x] Phase 1 — Design System & Dark Mode
- [x] Phase 2 — Page structure & core sections
- [x] Phase 3 — Technical SEO & Performance
- [x] Phase 4 — Form + Webhook + Tracking + Toast
- [x] Phase 5 — Advanced animation, Scrollytelling & Parallax
- [x] Phase 6 — Mini E-commerce
- [x] Phase 7 — Product advisory chatbot
- [x] Phase 8 — Full QA, audit & Deploy
- [x] Phase 9 — Premium redesign (Aurora system, 12-section landing, hybrid commerce)

---

## Hard Constraints

- PageSpeed Insights Mobile ≥ 85/100
- Responsive 320px → 1440px+ (no horizontal overflow)
- Full SEO/OG: title, description, og:*, Twitter Card, JSON-LD Product schema
- `prefers-reduced-motion` respected on all animations
- ENV-driven secrets with safe fallbacks (no page crash if missing)

---

## References

- Full spec + decisions: `NOTES.md`
- Original prompt: execution spec provided at project start
