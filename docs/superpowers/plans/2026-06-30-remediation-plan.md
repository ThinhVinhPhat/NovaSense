# NovaSense — Phase 10 Remediation Plan

> Nguồn: báo cáo đánh giá hệ thống 2026-06-30 (skill `code-review` + `senior-fullstack`).
> Mục tiêu: đóng các lỗ hổng so với đề bài (bắt buộc + điểm cộng), không làm vỡ phần đã chạy tốt.
> Tuân thủ CLAUDE.md: R1 (mỗi task = 1 nhánh), R3 (code-review sau mỗi task), R4 (không comment giải thích), R5 (Conventional Commits, không AI credit), R6 (báo cáo sau mỗi phase).

## Quyết định scope đã chốt với chủ dự án

| # | Vấn đề | Quyết định |
|---|--------|-----------|
| 1 | Form đăng ký nhận tin | Dùng **form Contact** làm lead capture; **xóa** `/api/subscribe` + `subscribeSchema` mồ côi |
| 2 | Tracking click/scroll | **Tự xây** `/api/track` → forward `WEBHOOK_URL` |
| 3 | Backend lưu trữ | **Thêm DB thật (SQLite)** — qua **libSQL/Turso** để chạy được trên Vercel (xem rủi ro R1) |
| 4 | Wishlist + Recently-viewed | **Dựng UI** cho cả hai (store đã có sẵn) |

## Rủi ro & phụ thuộc cần chủ dự án

- **R1 — SQLite trên Vercel:** file-SQLite (`better-sqlite3`) KHÔNG persist trên Vercel serverless (FS ephemeral/read-only). Plan dùng **Drizzle + `@libsql/client`**: `file:./local.db` cho dev, **Turso** (libsql://, SQLite-compatible, free tier) cho prod. → Cần chủ dự án tạo Turso DB và cấp `DATABASE_URL` + `DATABASE_AUTH_TOKEN`. Nếu deploy trên host có volume (Railway/Fly/VPS) thì dùng file-SQLite thẳng được.
- **R2 — Deploy:** Task P0.3 cần quyền truy cập tài khoản Vercel của chủ dự án để deploy lại + set ENV.
- **R3 — Chatbot rate-limit:** trên serverless, rate-limit in-memory chỉ là best-effort (mỗi instance một bộ nhớ). Production thật cần Upstash Redis; plan làm best-effort + ghi chú.

---

## WAVE P0 — Launch blockers (ưu tiên cao nhất, làm trước khi nộp)

**Nhánh:** `fix/phase-10-launch-blockers` · gộp 3 commit nhỏ.

### P0.1 — Sửa trùng thẻ `<h1>`
- **Vấn đề:** `Hero.tsx:29` và `ProductShowcase.tsx:47` đều `<h1>` → lỗi SEO/a11y.
- **File:** `components/sections/ProductShowcase.tsx`
- **Việc:** đổi `<h1>` → `<h2>`, giữ gradient span; bỏ override `text-5xl` lệch, dùng `text-3xl sm:text-4xl` đồng bộ các section khác.
- **AC:** `grep "<h1"` trên `components/` chỉ còn Hero; build sạch; Lighthouse không cảnh báo heading-order/multiple-h1.
- **Commit:** `fix: demote ProductShowcase heading to h2 to keep single h1`

### P0.2 — OG/Twitter image PNG động (next/og)
- **Vấn đề:** `og-image.svg` không render trên Facebook/Twitter/LinkedIn.
- **File mới:** `app/opengraph-image.tsx`, `app/twitter-image.tsx` dùng `ImageResponse` của `next/og` (1200×630, brand gradient + tagline). Gỡ khai báo `images` SVG thủ công trong `layout.tsx` (Next tự nhận diện).
- **AC:** `/opengraph-image` trả `image/png` 1200×630; FB Sharing Debugger / Twitter Card Validator render preview; không còn tham chiếu `og-image.svg`.
- **Commit:** `feat: generate dynamic OG/Twitter PNG via next/og`

### P0.3 — Deploy lại + đúng site URL (ops)
- **Vấn đề:** `novasense.vercel.app` → 404; canonical/OG/sitemap trỏ URL chết.
- **Việc:** deploy Vercel; set `NEXT_PUBLIC_SITE_URL` = URL prod thật; xác nhận `metadataBase`, `/sitemap.xml`, `/robots.txt` ra URL đúng.
- **AC:** URL live trả 200; sitemap/robots URL tuyệt đối đúng; **PSI mobile re-run ≥ 85** trên URL live.
- **Commit:** không (ops) — chỉ chỉnh ENV trên Vercel.

**Verify P0:** `npm run build` + `npm run lint` xanh; grep h1; kiểm thử social debugger; PSI live.

---

## WAVE P1 — Lỗ hổng bắt buộc, bảo mật, UX

### P1.1 — Dọn newsletter + Contact làm lead capture
- **Nhánh:** `refactor/phase-10-lead-capture`
- **File:** xóa `app/api/subscribe/route.ts`; bỏ `subscribeSchema`/`SubscribeInput` khỏi `lib/validations.ts`; `components/sections/Contact.tsx` thêm subheading nêu rõ "Để lại email để nhận tin & tư vấn" + (tùy chọn) checkbox `consent` (zod `boolean` optional).
- **AC:** route table build KHÔNG còn `/api/subscribe`; không export thừa; Contact vẫn validate + toast + forward webhook.
- **Commit:** `refactor: drop orphan subscribe route, use contact form as lead capture`

### P1.2 — Tracking thật: `/api/track` + đấu nối client
- **Nhánh:** `feat/phase-10-behavior-tracking`
- **File mới:** `app/api/track/route.ts` — zod `{ event: 'click'|'scroll', label?, depth?, path?, ts }`, giới hạn payload, forward `WEBHOOK_URL` (hoặc `TRACK_WEBHOOK_URL`), fallback an toàn nếu thiếu ENV.
- **Sửa:** `lib/analytics.ts` — `trackClick`/`initScrollTracking` gửi `navigator.sendBeacon('/api/track', …)` (fallback `fetch` keepalive); giữ `console` ở dev.
- **Mới:** `components/AnalyticsProvider.tsx` (`'use client'`) — `useEffect` gọi `initScrollTracking()` (cleanup khi unmount), mount trong `layout.tsx`. Gắn `trackClick` vào CTA chính (Buy Now, Pre-order, Add to Cart, mở chat).
- **AC:** click CTA / scroll mốc 25/50/75/100 phát `POST /api/track` (Network tab); forward webhook khi có ENV; không lỗi khi thiếu ENV; tôn trọng `prefers-reduced-motion` (không đổi hành vi đo).
- **Commit:** `feat: add /api/track route with zod + webhook forward`, `feat: wire client click/scroll tracking via sendBeacon`

### P1.3 — Menu điều hướng mobile
- **Nhánh:** `feat/phase-10-mobile-nav`
- **File:** `components/layout/Header.tsx` (+ tách `MobileNav.tsx` nếu gọn hơn).
- **Việc:** nút hamburger `< md`; panel xổ chứa nav links + ThemeToggle + Pre-order; `aria-expanded`/`aria-controls`; đóng khi click link / Escape / click ngoài; animation gate reduced-motion.
- **AC:** 320–767px hiện hamburger, mở đủ link, điều hướng được bằng phím, không tràn ngang.
- **Commit:** `feat: add accessible mobile navigation menu`

### P1.4 — Gia cố `/api/chat`
- **Nhánh:** `fix/phase-10-chat-hardening`
- **File:** `app/api/chat/route.ts`, `lib/validations.ts` (thêm `chatSchema`).
- **Việc:** thay cast `body as ChatBody` bằng `safeParse`: `messages` mảng (role enum, content ≤ 4000), số message ≤ 20, tổng size có trần; rate-limit in-memory theo IP (best-effort, ghi chú Upstash cho prod); `AbortController` timeout cho call LLM upstream.
- **AC:** payload sai/quá khổ → 422; burst lạm dụng → 429 (best-effort); upstream timeout → 502 gọn; happy path không đổi.
- **Commit:** `fix: validate and rate-limit /api/chat against abuse`

### P1.5 — Section Thông số kỹ thuật đầy đủ
- **Nhánh:** `feat/phase-10-specs-section`
- **File mới:** `components/sections/Specs.tsx` render `content/specs.ts` (5 nhóm: Processing/Connectivity/Audio/Capacity/Hardware) bằng `Section`+`Container`+`GlassCard`+`Reveal`. Thêm vào `page.tsx` (sau `ProductShowcase` hoặc `WhyTimeline`); thêm anchor `#specs` vào nav + Footer.
- **AC:** section hiển thị toàn bộ specs; responsive; đúng 1 `<h2>`; có trong điều hướng.
- **Commit:** `feat: add technical specifications section`

**Verify P1:** build+lint xanh sau mỗi nhánh; kiểm thử thủ công từng tính năng; code-review (R3) trước merge.

---

## WAVE P2 — Hoàn thiện điểm cộng, lưu trữ, dọn dẹp

### P2.1 — UI Wishlist + Recently-viewed
- **Nhánh:** `feat/phase-10-wishlist-recently`
- **Wishlist:** nút trái tim (toggle `useWishlist`) trên `ProductShowcase` (và card khác nếu có); badge + drawer wishlist ở `Header` (mẫu như `CartDrawer`).
- **Recently-viewed:** gọi `useRecentlyViewed.add(selected)` khi đổi model / add-to-cart; dải "Đã xem gần đây" dưới `ProductShowcase`.
- **AC:** toggle yêu thích persist qua reload; danh sách đã xem cập nhật khi xem model; cả hai có UI mượt; reduced-motion ổn.
- **Commit:** `feat: wishlist UI with persistent store`, `feat: recently-viewed products strip`

### P2.2 — Backend lưu trữ (Drizzle + libSQL/Turso)
- **Nhánh:** `feat/phase-10-db-storage`
- **Cài:** `drizzle-orm`, `@libsql/client`, `drizzle-kit` (dev).
- **File mới:** `db/schema.ts` (bảng `leads`: id, name, email, phone?, message?, source, consent?, created_at), `db/client.ts` (libSQL client từ `DATABASE_URL`/`DATABASE_AUTH_TOKEN`, `file:./local.db` khi dev), `drizzle.config.ts`, migration trong `db/migrations/`.
- **Sửa:** `/api/contact` (và tùy chọn `/api/track`) insert DB **song song** với forward webhook; fallback an toàn nếu thiếu ENV DB (skip insert + warn, không crash).
- **ENV mới:** `DATABASE_URL`, `DATABASE_AUTH_TOKEN` (thêm vào `.env.example` + CLAUDE.md).
- **AC:** submit Contact tạo 1 row (verify qua `drizzle studio`/count); chạy được local với `file:`; deploy được với Turso; thiếu ENV không vỡ trang.
- **Commit:** `feat: add drizzle schema + libsql client and migrations`, `feat: persist contact leads to database`
- **Phụ thuộc:** R1 (cần Turso token cho prod).

### P2.3 — Dọn dẹp + hygiene + tests
- **Nhánh:** `chore/phase-10-cleanup` (chạy SAU P1.5 + P2.1 để các file không còn dead)
- **JSON-LD:** bổ sung `price: 199`, `priceCurrency: 'USD'`, `priceValidUntil`, `availability` vào Offer trong `layout.tsx`.
- **Dead code:** xóa file thực sự không dùng (verify lại): `components/ui/ScrollReveal.tsx`, `components/ui/Card.tsx`. (`content/features.ts` ĐANG dùng — giữ.)
- **Branch hygiene:** push/prune nhánh phase 6–9 (origin chỉ có tới phase-5); đảm bảo origin phản ánh lịch sử.
- **NOTES.md:** sửa mục QA sai (khẳng định 1 h1; ghi `content/features.ts` orphan).
- **Commit:** `fix: complete JSON-LD product offer`, `chore: remove unused components and refresh notes`

### P2.4 — Tests (nâng coverage từ ~5%)
- **Nhánh:** `test/phase-10-coverage`
- **Cài:** Vitest (+ `@testing-library/react` nếu test component).
- **Phủ:** `lib/validations` (contact/chat schema), handler `/api/contact` (happy/invalid/honeypot/thiếu webhook), `/api/track`, `/api/chat` validation, reducer `store/cart` (add/remove/updateQty/total).
- **AC:** `npm run test` xanh; coverage `lib/` + `app/api/` > 0 đáng kể; thêm script `test` vào `package.json`.
- **Commit:** `test: add unit tests for validation, api routes, and cart store`

**Verify P2:** build+lint+test xanh; code-review; deploy lại + PSI cuối ≥ 85.

---

## Thứ tự thực thi & merge

1. **P0** (1 nhánh, nhanh) → merge → deploy lại ngay (gỡ blocker nộp bài).
2. **P1.1 → P1.5** (mỗi task 1 nhánh, code-review, merge tuần tự).
3. **P2.1 → P2.2 → P2.3 → P2.4** (P2.3 sau P1.5+P2.1).
4. Deploy + PSI + social-debugger verify cuối; cập nhật roadmap CLAUDE.md (Phase 10 ✓) + NOTES.md.

## Định nghĩa "Done" toàn cục
- Đề bài bắt buộc: ✅ 8/8 (deploy live 200, 1 h1, OG render, specs section, lead form).
- Điểm cộng: webhook+toast ✅, tracking thật ✅, dark mode ✅, animation/skeleton ✅, **DB ✅**, scrollytelling/parallax ✅, **mini e-commerce 3/3 ✅**, chatbot ✅ (đã gia cố).
- `npm run build` + `lint` + `test` xanh; PSI mobile ≥ 85 trên URL live; không dead code/orphan route.
