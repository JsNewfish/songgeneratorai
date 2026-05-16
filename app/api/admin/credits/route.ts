import { NextRequest, NextResponse } from 'next/server'
import { addCredits, getOrCreateCredits } from '@/lib/credits'

/**
 * Admin endpoint to manage credits.
 * Protected by ADMIN_SECRET env variable.
 *
 * POST /api/admin/credits
 * Headers: x-admin-secret: <ADMIN_SECRET>
 * Body: { email: string, amount: number }
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email, amount } = await req.json()
    if (!email || typeof amount !== 'number') {
      return NextResponse.json({ error: 'email and amount are required' }, { status: 400 })
    }

    const newBalance = await addCredits(email, amount)
    return NextResponse.json({ email, credits: newBalance })
  } catch (err) {
    console.error('[api/admin/credits]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

/**
 * GET /api/admin/credits?email=xxx
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  try {
    const credits = await getOrCreateCredits(email)
    return NextResponse.json({ email, credits })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
