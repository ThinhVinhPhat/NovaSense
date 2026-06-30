import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/db', () => ({
  db: { insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue(undefined) })) },
}))
vi.mock('@/db/schema', () => ({ events: {} }))

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('WEBHOOK_URL', '')
  vi.stubEnv('TRACK_WEBHOOK_URL', '')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('ok', { status: 200 })))
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('POST /api/track', () => {
  it('accepts click event and returns success', async () => {
    const { POST } = await import('@/app/api/track/route')
    const res = await POST(makeRequest({ type: 'click', path: '/', ts: 1700000000000, label: 'hero-cta' }))
    expect(res.status).toBe(200)
    const json = await res.json() as { success: boolean }
    expect(json.success).toBe(true)
  })

  it('accepts scroll event and returns success', async () => {
    const { POST } = await import('@/app/api/track/route')
    const res = await POST(makeRequest({ type: 'scroll', path: '/', ts: 1700000000000, depth: 50 }))
    expect(res.status).toBe(200)
  })

  it('returns 422 for click missing label', async () => {
    const { POST } = await import('@/app/api/track/route')
    const res = await POST(makeRequest({ type: 'click', path: '/', ts: 1700000000000 }))
    expect(res.status).toBe(422)
  })

  it('returns 422 for unknown event type', async () => {
    const { POST } = await import('@/app/api/track/route')
    const res = await POST(makeRequest({ type: 'pageview', path: '/', ts: 1700000000000 }))
    expect(res.status).toBe(422)
  })

  it('returns 400 for non-JSON body', async () => {
    const { POST } = await import('@/app/api/track/route')
    const req = new NextRequest('http://localhost/api/track', {
      method: 'POST',
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
