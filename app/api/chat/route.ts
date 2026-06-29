import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/content/chatbot-prompt'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatBody {
  messages: ChatMessage[]
}

const FALLBACK_RESPONSES = [
  "I'd love to help! NovaSense is an AI-powered smart hub that connects all your home devices. What would you like to know?",
  "Great question! NovaSense supports Matter, Zigbee, Z-Wave, Thread, Wi-Fi, and Bluetooth — so it works with virtually every smart home device.",
  "NovaSense starts at $199 for the Hub and $299 for the Pro model. Both support 100+ simultaneous devices with on-device AI processing.",
]

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { messages } = body as ChatBody
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 422 })
  }

  const provider = process.env.LLM_PROVIDER ?? 'openai'
  const apiKey = process.env.LLM_API_KEY
  const model = process.env.LLM_MODEL ?? 'gpt-4o-mini'

  if (!apiKey) {
    const fallback = FALLBACK_RESPONSES[Math.floor(messages.length % FALLBACK_RESPONSES.length)]
    return NextResponse.json({ content: fallback })
  }

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })
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
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiMessages,
        }),
      },
    )
    if (!res.ok) {
      return NextResponse.json({ error: 'LLM error' }, { status: 502 })
    }
    const data = (await res.json()) as { candidates: { content: { parts: { text: string }[] } }[] }
    const content = data.candidates[0]?.content.parts[0]?.text ?? ''
    return NextResponse.json({ content })
  }

  return NextResponse.json({ error: 'Unknown LLM provider' }, { status: 400 })
}
