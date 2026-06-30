import { NextRequest, NextResponse } from 'next/server'
import { trackSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const parsed = trackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false }, { status: 422 })
  }

  const webhookUrl = process.env.TRACK_WEBHOOK_URL ?? process.env.WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ success: true })
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...parsed.data, source: 'novasense-analytics' }),
      signal: AbortSignal.timeout(4000),
    })
  } catch (err) {
    console.error('[track] webhook error:', err)
  }

  return NextResponse.json({ success: true })
}
