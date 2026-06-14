/**
 * POST /api/generate
 *
 * Body: { prompt: string, style?: string, duration?: number }
 *
 * Flow:
 *  1. Authenticate via NextAuth session
 *  2. Deduct 1 credit
 *  3. Call AceData Suno API (synchronous — waits ~1-2 min, returns completed tracks)
 *  4. Return { tracks: GeneratedTrack[] }
 *
 * AceData API docs: https://platform.acedata.cloud/documents/suno-audios
 */

import { auth } from '@/auth'
import { deductCredits, addCredits } from '@/lib/credits'
import { getAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const SUNO_BASE = process.env.SUNO_API_BASE_URL ?? 'https://api.acedata.cloud/suno'
const SUNO_KEY = process.env.SUNO_API_KEY ?? ''

type SunoTrack = {
  id: string
  title: string
  audio_url: string
  image_url?: string
  state: string
  duration?: number
  style?: string
}

/** Fallback AI cover via Pollinations.ai (free, no API key needed) */
function buildFallbackCover(title: string, style?: string): string {
  const prompt = encodeURIComponent(`music album cover art ${title}${style ? ' ' + style : ''}, artistic, colorful`)
  return `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`
}

type SunoResponse = {
  success: boolean
  task_id?: string
  data?: SunoTrack[]
  error?: { code: string; message: string }
}

export async function POST(req: Request) {
  // 1. Auth check
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse & validate body
  let body: { prompt?: string; style?: string; instrumental?: boolean; exclude_style?: string; duration?: number; audio_id?: string; model?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const prompt = (body.prompt ?? '').trim()
  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }
  const style = (body.style ?? '').trim()
  const instrumental = body.instrumental === true
  const exclude_style = (body.exclude_style ?? '').trim()
  const audio_id = typeof body.audio_id === 'string' ? body.audio_id.trim() || undefined : undefined

  // Map frontend model id (v4, v3, v2.1, v2, v1) to Suno API model name
  const modelIdMap: Record<string, string> = {
    'v4': 'chirp-v4',
    'v3': 'chirp-v3',
    'v2.1': 'chirp-v2.1',
    'v2': 'chirp-v2',
    'v1': 'chirp-v1',
  }
  const sunoModel = modelIdMap[body.model ?? 'v4'] ?? 'chirp-v4'

  // 3. Deduct credit before generation
  let newBalance: number
  try {
    newBalance = await deductCredits(session.user.email, 10)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Insufficient credits') {
      return NextResponse.json(
        { error: 'No credits remaining. Please purchase more.' },
        { status: 402 }
      )
    }
    console.error('[api/generate] credits error', err)
    return NextResponse.json({ error: 'Credit check failed' }, { status: 500 })
  }

  // 4. Call AceData Suno API (synchronous, ~1-2 min timeout)
  let sunoRes: SunoResponse
  try {
    const response = await fetch(`${SUNO_BASE}/audios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUNO_KEY}`,
        accept: 'application/json',
      },
      body: JSON.stringify({
        action: 'generate',
        prompt,
        model: sunoModel,
        instrumental,
        ...(style ? { style } : {}),
        ...(exclude_style ? { negative_tags: exclude_style } : {}),
        // If user uploaded a reference track, bias generation toward its style
        ...(audio_id ? { audio_id, audio_weight: 0.8 } : {}),
      }),
      // AceData can take up to 2 minutes
      signal: AbortSignal.timeout(150_000),
    })

    sunoRes = await response.json()

    if (!response.ok || !sunoRes.success) {
      throw new Error(sunoRes.error?.message ?? `HTTP ${response.status}`)
    }
  } catch (err) {
    // Refund credit on failure
    await addCredits(session.user.email, 10).catch(() => null)
    console.error('[api/generate] Suno error', err)
    return NextResponse.json(
      { error: 'Music generation failed. Credit refunded.' },
      { status: 502 }
    )
  }

  // 5. Filter completed tracks
  const completed = (sunoRes.data ?? []).filter(
    (t) => t.state === 'succeeded' && t.audio_url
  )

  if (completed.length === 0) {
    await addCredits(session.user.email, 10).catch(() => null)
    return NextResponse.json(
      { error: 'No tracks were generated. Credit refunded.' },
      { status: 502 }
    )
  }

  // 6. Build response tracks (use Suno image_url, fallback to Pollinations.ai)
  const tracksOut = completed.map((t) => ({
    id: t.id,
    title: t.title || 'Untitled Track',
    audio_url: t.audio_url,
    image_url: t.image_url || buildFallbackCover(t.title || 'music', style || t.style),
    duration: t.duration,
  }))

  // 7. Persist to Supabase (non-blocking, fail silently)
  try {
    const db = getAdminClient()
    const rows = tracksOut.map((t) => ({
      id: t.id,
      email: session.user!.email,
      title: t.title,
      audio_url: t.audio_url,
      image_url: t.image_url,
      duration: t.duration ? Math.round(t.duration) : null,
      style: style || null,
    }))
    await db.from('songs').upsert(rows, { onConflict: 'id' })
  } catch (dbErr) {
    console.warn('[api/generate] DB save failed (songs table may not exist):', dbErr)
  }

  return NextResponse.json({
    tracks: tracksOut,
    credits_remaining: newBalance,
  })
}

