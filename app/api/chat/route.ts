import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/content/chatbot-prompt'
import { chatSchema } from '@/lib/validations'

const FALLBACK_RESPONSES = [
  "I'd love to help! NovaSense is an AI-powered smart hub that connects all your home devices. What would you like to know?",
  "Great question! NovaSense supports Matter, Zigbee, Z-Wave, Thread, Wi-Fi, and Bluetooth — so it works with virtually every smart home device.",
  "NovaSense starts at $199 for the Hub and $299 for the Pro model. Both support 100+ simultaneous devices with on-device AI processing.",
]

const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const prev = rateLimitMap.get(ip) ?? []
  const window = prev.filter((t) => now - t < RATE_WINDOW_MS)
  if (window.length >= RATE_LIMIT) return true
  window.push(now)
  rateLimitMap.set(ip, window)
  if (rateLimitMap.size > 5_000) rateLimitMap.clear()
  return false
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = chatSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid messages' }, { status: 422 })
  }

  const { messages } = parsed.data
  const provider = process.env.LLM_PROVIDER ?? 'openai'
  const apiKey = process.env.LLM_API_KEY
  const model = process.env.LLM_MODEL ?? 'gpt-4o-mini'

  if (!apiKey) {
    const fallback =
      FALLBACK_RESPONSES[messages.length % FALLBACK_RESPONSES.length] ?? FALLBACK_RESPONSES[0]
    return NextResponse.json({ content: fallback })
  }

  if (provider === 'openai') {
    let res: Response
    try {
      res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 300,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(8000),
      })
    } catch {
      return NextResponse.json({ error: 'LLM timeout' }, { status: 504 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'LLM error' }, { status: 502 })
    }
    const data = (await res.json()) as { choices: { message: { content: string } }[] }
    const content = data.choices[0]?.message.content ?? ''
    return NextResponse.json({ content })
  }

  if (provider === 'gemini') {
    const geminiModel = model.startsWith('gemini') ? model : 'gemini-1.5-flash'
    const geminiMessages = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
    let res: Response
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: geminiMessages,
          }),
          signal: AbortSignal.timeout(8000),
        },
      )
    } catch {
      return NextResponse.json({ error: 'LLM timeout' }, { status: 504 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'LLM error' }, { status: 502 })
    }
    const data = (await res.json()) as {
      candidates: { content: { parts: { text: string }[] } }[]
    }
    const content = data.candidates[0]?.content.parts[0]?.text ?? ''
    return NextResponse.json({ content })
  }

  return NextResponse.json({ error: 'Unknown LLM provider' }, { status: 400 })
}
