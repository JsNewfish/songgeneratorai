import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const runtime = 'nodejs'

const CREEM_API_BASE =
  process.env.CREEM_TEST_MODE === 'true'
    ? 'https://test-api.creem.io'
    : 'https://api.creem.io'

// planKey is the simplified name stored in user_credits.plan
const PLANS: Record<string, { productId: string; credits: number; planKey: string }> = {
  basic:            { productId: process.env.CREEM_PRODUCT_BASIC_MONTHLY_ID    ?? '', credits: 1000,  planKey: 'basic' },
  standard:         { productId: process.env.CREEM_PRODUCT_STANDARD_MONTHLY_ID ?? '', credits: 2500,  planKey: 'standard' },
  pro:              { productId: process.env.CREEM_PRODUCT_PRO_MONTHLY_ID      ?? '', credits: 6000,  planKey: 'pro' },
  basic_yearly:     { productId: process.env.CREEM_PRODUCT_BASIC_YEARLY_ID     ?? '', credits: 12000, planKey: 'basic' },
  standard_yearly:  { productId: process.env.CREEM_PRODUCT_STANDARD_YEARLY_ID  ?? '', credits: 30000, planKey: 'standard' },
  pro_yearly:       { productId: process.env.CREEM_PRODUCT_PRO_YEARLY_ID       ?? '', credits: 72000, planKey: 'pro' },
  topup:            { productId: process.env.CREEM_PRODUCT_TOPUP_ID            ?? '', credits: 200,   planKey: 'topup' },
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null) as { plan?: string; quantity?: number } | null
  const plan = body?.plan
  const quantity = Math.max(1, Math.min(99, Number(body?.quantity ?? 1) || 1))
  if (!plan || !PLANS[plan]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const { productId, planKey } = PLANS[plan]
  if (!productId) {
    return NextResponse.json(
      { error: `Product not configured. Set CREEM_PRODUCT_${plan.toUpperCase()}_ID in .env.local.` },
      { status: 500 },
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const response = await fetch(`${CREEM_API_BASE}/v1/checkouts`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CREEM_API_KEY ?? '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      success_url: `${siteUrl}/pricing?subscribed=true`,
      customer: { email: session.user.email },
      metadata: {
        referenceId: session.user.email,
        plan,     // full key e.g. 'basic_yearly'
        planKey,  // simplified key e.g. 'basic'
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    console.error('[checkout] Creem API error:', error)
    return NextResponse.json(
      { error: 'Checkout creation failed', details: error },
      { status: 502 },
    )
  }

  const data = await response.json() as { checkout_url?: string }
  return NextResponse.json({ url: data.checkout_url })
}
