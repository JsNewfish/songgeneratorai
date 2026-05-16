/**
 * POST /api/lyrics
 * Generates lyrics using AceData Suno Lyrics API.
 * Body: { prompt: string }
 * Does NOT consume credits — lyrics generation is free.
 */

import { NextResponse } from 'next/server'

const SUNO_BASE = process.env.SUNO_API_BASE_URL ?? 'https://api.acedata.cloud/suno'
const SUNO_KEY = process.env.SUNO_API_KEY ?? ''

export async function POST(req: Request) {
  let body: { prompt?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const prompt = (body.prompt ?? '').trim()
  if (!prompt) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }

  try {
    const res = await fetch(`${SUNO_BASE}/lyrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUNO_KEY}`,
        accept: 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(30_000),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.error?.message ?? `HTTP ${res.status}`)
    }

    return NextResponse.json({
      title: data.data?.title ?? '',
      lyrics: data.data?.text ?? '',
    })
  } catch (err) {
    console.error('[api/lyrics] error', err)
    return NextResponse.json({ error: 'Lyrics generation failed' }, { status: 502 })
  }
}
