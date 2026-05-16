import { auth } from '@/auth'
import { getOrCreateCredits, getUserPlan } from '@/lib/credits'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ credits: 0, plan: 'free' }, { status: 401 })
  }

  try {
    const [credits, plan] = await Promise.all([
      getOrCreateCredits(session.user.email),
      getUserPlan(session.user.email),
    ])
    return NextResponse.json({ credits, plan })
  } catch (err) {
    console.error('[api/credits]', err)
    return NextResponse.json({ credits: 0, plan: 'free' }, { status: 500 })
  }
}
