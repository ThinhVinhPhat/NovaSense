import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/db', () => ({
  db: { insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue(undefined) })) },
}))
vi.mock('@/db/schema', () => ({ leads: {} }))

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validBody = { name: 'Ada', email: 'ada@example.com', message: 'Hello!' }

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('WEBHOOK_URL', '')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('ok', { status: 200 })))
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('POST /api/contact', () => {
  it('returns 200 and inserts lead when valid (no webhook)', async () => {
    const { POST } = await import('@/app/api/contact/route')
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    const json = await res.json() as { success: boolean }
    expect(json.success).toBe(true)
  })

  it('returns 422 on invalid email', async () => {
    const { POST } = await import('@/app/api/contact/route')
    const res = await POST(makeRequest({ ...validBody, email: 'bad' }))
    expect(res.status).toBe(422)
  })

  it('returns 422 on missing name', async () => {
    const { POST } = await import('@/app/api/contact/route')
    const res = await POST(makeRequest({ ...validBody, name: '' }))
    expect(res.status).toBe(422)
  })

  it('rejects honeypot submissions with 422 (schema-level guard)', async () => {
    const { POST } = await import('@/app/api/contact/route')
    const res = await POST(makeRequest({ ...validBody, _honey: 'bot' }))
    expect(res.status).toBe(422)
  })

  it('returns 400 for non-JSON body', async () => {
    const { POST } = await import('@/app/api/contact/route')
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
