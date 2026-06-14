/**
 * POST /api/singing-photo
 *
 * Generate a singing/talking video from a face photo + audio file.
 * Uses Replicate SadTalker model for lip-sync animation.
 * Cost: ~$0.01 per 10-second video
 *
 * Required env vars:
 *   REPLICATE_API_TOKEN  — Replicate API token (from replicate.com)
 *
 * Flow:
 *   1. Upload photo + audio to Supabase Storage → public URLs
 *   2. POST https://api.replicate.com/v1/predictions (SadTalker model)
 *   3. Poll until status = succeeded
 *   4. Return output video URL
 *
 * Costs 10 credits per generation.
 */

import { auth } from '@/auth'
import { deductCredits, addCredits } from '@/lib/credits'
import { getAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const REPLICATE_BASE = 'https://api.replicate.com/v1'
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN ?? ''
// SadTalker model on Replicate (cjwbw/sadtalker)
const SADTALKER_VERSION = '3aa3dac9353cc4d6bd62a8f95957bd844003b401d900b52a68a3dc94b0f7a52b'
const BUCKET = 'audio-uploads'
const CREDIT_COST = 10

function replicateHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Token ${REPLICATE_TOKEN}`,
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!REPLICATE_TOKEN) {
    return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const photoFile = formData.get('photo') as File | null
  const audioFile = formData.get('audio') as File | null
  const style = (formData.get('style') as string) || 'natural'
  const poseScale = (formData.get('pose_scale') as string) || 'medium'

  if (!photoFile || !audioFile) {
    return NextResponse.json({ error: 'photo and audio files are required' }, { status: 400 })
  }

  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validImageTypes.includes(photoFile.type)) {
    return NextResponse.json({ error: 'Photo must be JPG, PNG or WEBP' }, { status: 400 })
  }
  if (photoFile.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Photo must be under 10MB' }, { status: 400 })
  }
  if (!audioFile.type.startsWith('audio/')) {
    return NextResponse.json({ error: 'Audio must be MP3, WAV or M4A' }, { status: 400 })
  }
  if (audioFile.size > 30 * 1024 * 1024) {
    return NextResponse.json({ error: 'Audio must be under 30MB' }, { status: 400 })
  }

  // Deduct credits
  let newBalance: number
  try {
    newBalance = await deductCredits(session.user.email, CREDIT_COST)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'Insufficient credits') {
      return NextResponse.json({ error: 'No credits remaining. Please purchase more.' }, { status: 402 })
    }
    return NextResponse.json({ error: 'Credit check failed' }, { status: 500 })
  }

  const db = getAdminClient()
  const ts = Date.now()

  try {
    // 1. Upload photo to Supabase Storage
    const photoExt = photoFile.name.split('.').pop() || 'jpg'
    const photoPath = `singing-photo/${session.user.email}/${ts}-photo.${photoExt}`
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer())

    const { error: photoUploadErr } = await db.storage
      .from(BUCKET)
      .upload(photoPath, photoBuffer, { contentType: photoFile.type, upsert: true })
    if (photoUploadErr) throw new Error(`Photo upload failed: ${photoUploadErr.message}`)

    const { data: photoPublic } = db.storage.from(BUCKET).getPublicUrl(photoPath)

    // 2. Upload audio to Supabase Storage
    const audioExt = audioFile.name.split('.').pop() || 'mp3'
    const audioPath = `singing-photo/${session.user.email}/${ts}-audio.${audioExt}`
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())

    const { error: audioUploadErr } = await db.storage
      .from(BUCKET)
      .upload(audioPath, audioBuffer, { contentType: audioFile.type, upsert: true })
    if (audioUploadErr) throw new Error(`Audio upload failed: ${audioUploadErr.message}`)

    const { data: audioPublic } = db.storage.from(BUCKET).getPublicUrl(audioPath)

    // Map UI params to SadTalker options
    const stillMode = style === 'natural'
    const poseStyle = poseScale === 'large' ? 20 : poseScale === 'small' ? 0 : 10

    // 3. Create Replicate prediction
    const predRes = await fetch(`${REPLICATE_BASE}/predictions`, {
      method: 'POST',
      headers: replicateHeaders(),
      body: JSON.stringify({
        version: SADTALKER_VERSION,
        input: {
          source_image: photoPublic.publicUrl,
          driven_audio: audioPublic.publicUrl,
          preprocess: 'crop',
          still_mode: stillMode,
          use_enhancer: false,
          batch_size: 1,
          size: 256,
          pose_style: poseStyle,
          expression_scale: style === 'lively' ? 1.5 : style === 'soft' ? 0.7 : 1.0,
        },
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!predRes.ok) {
      const errText = await predRes.text()
      throw new Error(`Replicate prediction failed: ${predRes.status} ${errText}`)
    }

    const predData: {
      id: string
      status: string
      urls: { get: string }
      error?: string
    } = await predRes.json()

    const predId = predData.id
    const pollUrl = predData.urls.get

    // 4. Poll for completion (up to 3 minutes, every 5s)
    const MAX_POLLS = 36
    let videoUrl: string | null = null

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000))

      const pollRes = await fetch(pollUrl, {
        headers: replicateHeaders(),
        signal: AbortSignal.timeout(15_000),
      })
      if (!pollRes.ok) continue

      const pollData: {
        id: string
        status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
        output?: string | string[]
        error?: string
      } = await pollRes.json()

      if (pollData.status === 'succeeded') {
        // output can be a string or array depending on model version
        const output = pollData.output
        videoUrl = Array.isArray(output) ? output[0] : (output ?? null)
        break
      }
      if (pollData.status === 'failed' || pollData.status === 'canceled') {
        throw new Error(`Replicate prediction ${pollData.status}: ${pollData.error ?? 'unknown'}`)
      }
    }

    if (!videoUrl) {
      throw new Error('Timed out waiting for video generation')
    }

    return NextResponse.json({
      id: predId,
      video_url: videoUrl,
      credits_remaining: newBalance,
    })
  } catch (err) {
    await addCredits(session.user.email, CREDIT_COST).catch(() => null)
    console.error('[api/singing-photo] error', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed. Credits refunded.' },
      { status: 502 },
    )
  }
}
