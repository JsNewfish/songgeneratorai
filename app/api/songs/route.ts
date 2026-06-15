/**
 * GET /api/songs
 * Returns the current user's generated songs from Supabase.
 *
 * Requires songs table:
 *   CREATE TABLE IF NOT EXISTS songs (
 *     id text PRIMARY KEY,
 *     email text NOT NULL,
 *     title text,
 *     audio_url text,
 *     image_url text,
 *     duration int,
 *     style text,
 *     created_at timestamptz DEFAULT now()
 *   );
 *   CREATE INDEX IF NOT EXISTS songs_email_idx ON songs(email);
 */

import { auth } from '@/auth'
import { getAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))
  const offset = (page - 1) * limit

  try {
    const db = getAdminClient()
    const { data, error, count } = await db
      .from('songs')
      .select('id, title, audio_url, image_url, duration, style, created_at', { count: 'exact' })
      .eq('email', session.user.email)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return NextResponse.json({ songs: data ?? [], total: count ?? 0 })
  } catch (err) {
    console.error('[api/songs] query failed:', err)
    return NextResponse.json({ songs: [], total: 0 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let id: string
  try {
    const body = await req.json()
    id = body.id
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  try {
    const db = getAdminClient()
    // Only allow deleting own songs
    await db.from('songs').delete().eq('id', id).eq('email', session.user.email)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/songs] delete failed:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
