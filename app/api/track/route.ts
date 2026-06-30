import { NextRequest, NextResponse } from 'next/server'
import { trackSchema } from '@/lib/validations'
import { db } from '@/db'
import { events } from '@/db/schema'

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

  try {
    await db.insert(events).values({
      type: parsed.data.type,
      path: parsed.data.path,
      ts: parsed.data.ts,
      label: parsed.data.type === 'click' ? parsed.data.label : null,
      depth: parsed.data.type === 'scroll' ? parsed.data.depth : null,
    })
  } catch (err) {
    console.error('[track] DB error:', err)
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
