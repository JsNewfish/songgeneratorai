/**
 * POST /api/upload-audio
 *
 * Accepts multipart/form-data with a 'file' field (mp3/wav, max 20MB).
 * 1. Uploads the file to Supabase Storage (public bucket: audio-uploads)
 * 2. Sends the public URL to AceData POST /suno/upload
 * 3. Returns { audio_id, audio_url }
 *
 * Prerequisite: Create a PUBLIC Supabase Storage bucket named "audio-uploads"
 * in your Supabase dashboard → Storage → New bucket → enable "Public bucket".
 */

import { auth } from '@/auth'
import { getAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const SUNO_BASE = process.env.SUNO_API_BASE_URL ?? 'https://api.acedata.cloud/suno'
const SUNO_KEY = process.env.SUNO_API_KEY ?? ''
const BUCKET = 'audio-uploads'

export async function POST(req: Request) {
  // Auth
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse form data
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate type
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav']
  if (!file.type.startsWith('audio/') && !validTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File must be an MP3 or WAV audio file' }, { status: 400 })
  }

  // Validate size (max 20MB)
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 20MB' }, { status: 400 })
  }

  const db = getAdminClient()

  // Ensure bucket exists (create if needed)
  await db.storage.createBucket(BUCKET, { public: true }).catch(() => {
    // Likely already exists — ignore
  })

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp3'
  const safeEmail = session.user.email.replace(/[^a-z0-9]/gi, '_')
  const filename = `${safeEmail}_${Date.now()}.${ext}`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error: storageErr } = await db.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type || 'audio/mpeg', upsert: true })

  if (storageErr) {
    console.error('[upload-audio] storage error', storageErr)
    return NextResponse.json(
      { error: 'Storage upload failed. Make sure the "audio-uploads" bucket exists and is public in Supabase.' },
      { status: 500 }
    )
  }

  const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(filename)
  const publicUrl = urlData.publicUrl

  // Send to AceData Suno upload API
  let sunoData: { success: boolean; data?: { audio_id?: string }; error?: { message: string } }
  try {
    const sunoRes = await fetch(`${SUNO_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUNO_KEY}`,
        accept: 'application/json',
      },
      body: JSON.stringify({ audio_url: publicUrl }),
      signal: AbortSignal.timeout(90_000),
    })
    sunoData = await sunoRes.json()
    if (!sunoRes.ok || !sunoData.success) {
      throw new Error(sunoData.error?.message ?? `Suno HTTP ${sunoRes.status}`)
    }
  } catch (err) {
    console.error('[upload-audio] Suno upload error', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to process audio with Suno' },
      { status: 502 }
    )
  }

  return NextResponse.json({
    audio_id: sunoData.data?.audio_id,
    audio_url: publicUrl,
  })
}
