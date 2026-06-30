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
