import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

type UserCreditRow = {
  email: string
  created_at?: string | null
  updated_at?: string | null
  plan?: string | null
}

type SongRow = {
  id: string
  email: string
  created_at?: string | null
}

function pct(curr: number, prev: number): number | null {
  if (prev === 0) return curr === 0 ? 0 : null
  return ((curr - prev) / prev) * 100
}

function inRange(dt: string | null | undefined, start: Date, end: Date): boolean {
  if (!dt) return false
  const t = new Date(dt).getTime()
  return t >= start.getTime() && t < end.getTime()
}

function isoDay(dt: string): string {
  return new Date(dt).toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getAdminClient()

  const now = new Date()
  const d7 = new Date(now)
  d7.setDate(d7.getDate() - 7)
  const d30 = new Date(now)
  d30.setDate(d30.getDate() - 30)
  const d60 = new Date(now)
  d60.setDate(d60.getDate() - 60)

  const warnings: string[] = []

  const probe = await db.from('user_credits').select('*').limit(1)
  if (probe.error) {
    return NextResponse.json(
      { error: `Failed to read user_credits schema: ${probe.error.message}` },
      { status: 500 }
    )
  }

  const sample = (probe.data && probe.data[0]) || {}
  const cols = Object.keys(sample)
  const hasCreatedAt = cols.includes('created_at')
  const hasUpdatedAt = cols.includes('updated_at')
  const hasPlan = cols.includes('plan')

  const regTimeKey: 'created_at' | 'updated_at' | null = hasCreatedAt
    ? 'created_at'
    : hasUpdatedAt
      ? 'updated_at'
      : null

  if (!regTimeKey) {
    warnings.push('user_credits has no created_at/updated_at; registration trend metrics are unavailable')
  }
  if (!hasPlan) {
    warnings.push('user_credits.plan is missing; plan breakdown is unavailable')
  }

  const creditsSelect = [
    'email',
    hasCreatedAt ? 'created_at' : null,
    hasUpdatedAt ? 'updated_at' : null,
    hasPlan ? 'plan' : null,
  ]
    .filter(Boolean)
    .join(',')

  const creditsResp = await db.from('user_credits').select(creditsSelect || 'email')
  if (creditsResp.error) {
    return NextResponse.json(
      { error: `Failed to query user_credits: ${creditsResp.error.message}` },
      { status: 500 }
    )
  }

  const songsResp = await db.from('songs').select('id,email,created_at')
  const songs: SongRow[] = songsResp.error ? [] : ((songsResp.data as SongRow[] | null) || [])
  if (songsResp.error) {
    warnings.push(`songs query failed: ${songsResp.error.message}`)
  }

  const credits = ((creditsResp.data as UserCreditRow[] | null) || []).filter((r) => !!r.email)

  const regs7Rows = regTimeKey ? credits.filter((r) => inRange(r[regTimeKey], d7, now)) : []
  const regs30Rows = regTimeKey ? credits.filter((r) => inRange(r[regTimeKey], d30, now)) : []
  const regsPrev30Rows = regTimeKey ? credits.filter((r) => inRange(r[regTimeKey], d60, d30)) : []

  const songs7Rows = songs.filter((r) => inRange(r.created_at, d7, now))
  const songs30Rows = songs.filter((r) => inRange(r.created_at, d30, now))
  const songsPrev30Rows = songs.filter((r) => inRange(r.created_at, d60, d30))

  const active7 = new Set(songs7Rows.map((r) => r.email)).size
  const active30 = new Set(songs30Rows.map((r) => r.email)).size
  const activePrev30 = new Set(songsPrev30Rows.map((r) => r.email)).size

  const registeredUsers = new Set(credits.map((r) => r.email)).size
  const creators = new Set(songs.map((r) => r.email)).size

  const planBreakdown = hasPlan
    ? credits.reduce<Record<string, number>>((acc, row) => {
        const plan = String(row.plan || 'unknown').toLowerCase()
        acc[plan] = (acc[plan] || 0) + 1
        return acc
      }, {})
    : null

  const registrationsByDay: Record<string, number> = {}
  if (regTimeKey) {
    for (const row of regs30Rows) {
      if (!row[regTimeKey]) continue
      const day = isoDay(row[regTimeKey] as string)
      registrationsByDay[day] = (registrationsByDay[day] || 0) + 1
    }
  }

  const activeByDaySets: Record<string, Set<string>> = {}
  const songsByDay: Record<string, number> = {}
  for (const row of songs30Rows) {
    if (!row.created_at) continue
    const day = isoDay(row.created_at)
    if (!activeByDaySets[day]) activeByDaySets[day] = new Set<string>()
    activeByDaySets[day].add(row.email)
    songsByDay[day] = (songsByDay[day] || 0) + 1
  }
  const activeCreatorsByDay = Object.fromEntries(
    Object.entries(activeByDaySets).map(([day, users]) => [day, users.size])
  )

  const creatorCounts = songs.reduce<Record<string, number>>((acc, row) => {
    acc[row.email] = (acc[row.email] || 0) + 1
    return acc
  }, {})

  const topCreators = Object.entries(creatorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([email, count]) => ({ email, songs: count }))

  return NextResponse.json({
    generatedAt: now.toISOString(),
    schemaDetected: {
      userCreditsColumns: cols,
      registrationTimeField: regTimeKey,
      hasPlan,
    },
    warnings,
    totals: {
      registeredUsers,
      creators,
      songs: songs.length,
    },
    recent: {
      registrations7d: regs7Rows.length,
      registrations30d: regs30Rows.length,
      activeCreators7d: active7,
      activeCreators30d: active30,
      songsCreated7d: songs7Rows.length,
      songsCreated30d: songs30Rows.length,
    },
    previousWindow: {
      registrationsPrev30d: regsPrev30Rows.length,
      activeCreatorsPrev30d: activePrev30,
      songsCreatedPrev30d: songsPrev30Rows.length,
    },
    deltas: {
      registrations30dVsPrev30dPct: pct(regs30Rows.length, regsPrev30Rows.length),
      activeCreators30dVsPrev30dPct: pct(active30, activePrev30),
      songs30dVsPrev30dPct: pct(songs30Rows.length, songsPrev30Rows.length),
    },
    conversion: {
      creatorsAmongRegisteredPct: registeredUsers ? (creators / registeredUsers) * 100 : 0,
      songsPerActiveCreator30d: active30 ? songs30Rows.length / active30 : 0,
      songsPerActiveCreator7d: active7 ? songs7Rows.length / active7 : 0,
    },
    planBreakdown,
    daily: {
      registrations30d: registrationsByDay,
      activeCreators30d: activeCreatorsByDay,
      songsCreated30d: songsByDay,
    },
    topCreators,
  })
}
