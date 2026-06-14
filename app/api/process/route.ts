/**
 * POST /api/process
 *
 * 对已有歌曲进行二次处理，支持 action:
 *   extend  — 延长歌曲   (需要 audio_id, continue_at, lyric?)
 *   cover   — 翻唱歌曲   (需要 audio_id)
 *   stems   — 分离音轨   (需要 audio_id)
 *
 * 每次调用消耗 1 积分，失败自动退还。
 */

import { auth } from '@/auth'
import { deductCredits, addCredits } from '@/lib/credits'
import { getAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const SUNO_BASE = process.env.SUNO_API_BASE_URL ?? 'https://api.acedata.cloud/suno'
const SUNO_KEY = process.env.SUNO_API_KEY ?? ''

type ProcessBody = {
  action: 'extend' | 'cover' | 'stems'
  audio_id: string
  continue_at?: number
  lyric?: string
  style?: string
  model?: string
}

function buildFallbackCover(title: string, style?: string): string {
  const prompt = encodeURIComponent(`music album cover art ${title}${style ? ' ' + style : ''}, artistic, colorful`)
  return `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: ProcessBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { action, audio_id, continue_at, lyric, style, model } = body
  if (!action || !audio_id) {
    return NextResponse.json({ error: 'action and audio_id are required' }, { status: 400 })
  }
  if (!['extend', 'cover', 'stems'].includes(action)) {
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  }

  // Deduct credit
  let newBalance: number
  try {
    newBalance = await deductCredits(session.user.email, 10)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Insufficient credits') {
      return NextResponse.json({ error: 'No credits remaining. Please purchase more.' }, { status: 402 })
    }
    return NextResponse.json({ error: 'Credit check failed' }, { status: 500 })
  }

  // Build payload per action
  let payload: Record<string, unknown>
  if (action === 'extend') {
    payload = {
      action: 'extend',
      audio_id,
      model: model ?? 'chirp-v4',
      continue_at: continue_at ?? 0,
      custom: !!lyric,
      ...(lyric ? { lyric } : {}),
      ...(style ? { style } : {}),
    }
  } else if (action === 'cover') {
    payload = {
      action: 'cover',
      audio_id,
      model: model ?? 'chirp-v4',
      ...(style ? { style } : {}),
    }
  } else {
    // stems
    payload = { action: 'stems', audio_id }
  }

  let sunoData: { success: boolean; data?: Array<{ id: string; title?: string; audio_url: string; image_url?: string; state: string; duration?: number; style?: string }>; error?: { message: string } }
  try {
    const res = await fetch(`${SUNO_BASE}/audios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUNO_KEY}`,
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(150_000),
    })
    sunoData = await res.json()
    if (!res.ok || !sunoData.success) {
      throw new Error(sunoData.error?.message ?? `HTTP ${res.status}`)
    }
  } catch (err) {
    await addCredits(session.user.email, 10).catch(() => null)
    console.error('[api/process] Suno error', err)
    return NextResponse.json({ error: 'Processing failed. Credit refunded.' }, { status: 502 })
  }

  const completed = (sunoData.data ?? []).filter(t => t.state === 'succeeded' && t.audio_url)
  if (completed.length === 0) {
    await addCredits(session.user.email, 10).catch(() => null)
    return NextResponse.json({ error: 'No output tracks. Credit refunded.' }, { status: 502 })
  }

  const tracksOut = completed.map(t => ({
    id: t.id,
    title: t.title || 'Untitled Track',
    audio_url: t.audio_url,
    image_url: t.image_url || buildFallbackCover(t.title || 'music', t.style),
    duration: t.duration,
    style: t.style ?? style ?? null,
  }))

  // Persist to DB
  try {
    const db = getAdminClient()
    await db.from('songs').upsert(
      tracksOut.map(t => ({
        id: t.id,
        email: session.user!.email,
        title: t.title,
        audio_url: t.audio_url,
        image_url: t.image_url,
        duration: t.duration ? Math.round(t.duration) : null,
        style: t.style,
      })),
      { onConflict: 'id' }
    )
  } catch (dbErr) {
    console.warn('[api/process] DB save failed:', dbErr)
  }

  return NextResponse.json({ tracks: tracksOut, credits_remaining: newBalance })
}
