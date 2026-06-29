import { NextRequest, NextResponse } from 'next/server'
import { subscribeSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 })
  }

  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid data' },
      { status: 422 },
    )
  }

  const { email, name, _honey } = parsed.data
  if (_honey) {
    // Silently succeed for bots — do not forward
    return NextResponse.json({ success: true, message: 'Subscribed!' })
  }

  const webhookUrl = process.env.WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[subscribe] WEBHOOK_URL not configured — skipping forward')
    return NextResponse.json({ success: true, message: 'Subscribed!' })
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, source: 'novasense-landing', timestamp: Date.now() }),
    })
    if (!res.ok) throw new Error(`Webhook returned ${res.status}`)
    return NextResponse.json({ success: true, message: "You're on the list!" })
  } catch (err) {
    console.error('[subscribe] Webhook error:', err)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
