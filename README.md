# NovaSense — The Future of Smart Living

A premium brand landing page for NovaSense, an AI-powered smart-home hub.

**Live:** nova-sense-one.vercel.app

## PageSpeed Insights (Mobile — measured 2026-06-30)

- Performance: 88/100
- Accessibility: 93/100
- Best Practices: 100/100
- SEO: 100/100

## Local Development

```bash
npm install
cp .env.example .env.local  # fill in your values
npm run dev                  # http://localhost:3000
npm run build                # production build
npm run lint                 # ESLint check
```

## Environment Variables

| Variable | Description |
|---|---|
| `WEBHOOK_URL` | Webhook endpoint for newsletter signups (webhook.site / Make / n8n) |
| `LLM_PROVIDER` | `openai` or `gemini` |
| `LLM_API_KEY` | Server-only LLM API key |
| `LLM_MODEL` | Model ID (e.g. `gpt-4o-mini`, `gemini-1.5-flash`) |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL (for OG + sitemap) |
