import { describe, it, expect } from 'vitest'
import { contactSchema, trackSchema, chatSchema } from '@/lib/validations'

describe('contactSchema', () => {
  const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello!' }

  it('accepts valid input', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = contactSchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects message over 2000 chars', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'x'.repeat(2001) })
    expect(result.success).toBe(false)
  })

  it('rejects non-empty _honey (bot trap)', () => {
    const result = contactSchema.safeParse({ ...valid, _honey: 'bot' })
    expect(result.success).toBe(false)
  })

  it('allows optional phone', () => {
    const result = contactSchema.safeParse({ ...valid, phone: '+84901234567' })
    expect(result.success).toBe(true)
  })
})

describe('trackSchema', () => {
  it('accepts click event', () => {
    const result = trackSchema.safeParse({
      type: 'click', path: '/home', ts: 1700000000000, label: 'hero-cta',
    })
    expect(result.success).toBe(true)
  })

  it('accepts scroll event', () => {
    const result = trackSchema.safeParse({
      type: 'scroll', path: '/home', ts: 1700000000000, depth: 75,
    })
    expect(result.success).toBe(true)
  })

  it('rejects click without label', () => {
    const result = trackSchema.safeParse({
      type: 'click', path: '/home', ts: 1700000000000,
    })
    expect(result.success).toBe(false)
  })

  it('rejects scroll with depth > 100', () => {
    const result = trackSchema.safeParse({
      type: 'scroll', path: '/home', ts: 1700000000000, depth: 101,
    })
    expect(result.success).toBe(false)
  })

  it('rejects unknown type', () => {
    const result = trackSchema.safeParse({
      type: 'pageview', path: '/home', ts: 1700000000000,
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative ts', () => {
    const result = trackSchema.safeParse({
      type: 'click', path: '/home', ts: -1, label: 'x',
    })
    expect(result.success).toBe(false)
  })
})

describe('chatSchema', () => {
  const msg = { role: 'user' as const, content: 'Hi' }

  it('accepts valid messages array', () => {
    expect(chatSchema.safeParse({ messages: [msg] }).success).toBe(true)
  })

  it('rejects empty messages array', () => {
    expect(chatSchema.safeParse({ messages: [] }).success).toBe(false)
  })

  it('rejects more than 20 messages', () => {
    const result = chatSchema.safeParse({ messages: Array(21).fill(msg) })
    expect(result.success).toBe(false)
  })

  it('rejects content over 4000 chars', () => {
    const result = chatSchema.safeParse({
      messages: [{ role: 'user', content: 'x'.repeat(4001) }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid role', () => {
    const result = chatSchema.safeParse({
      messages: [{ role: 'system', content: 'hello' }],
    })
    expect(result.success).toBe(false)
  })
})
