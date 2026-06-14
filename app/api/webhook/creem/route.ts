import * as crypto from 'crypto'
import { NextResponse } from 'next/server'
import { addCredits, setPlan } from '@/lib/credits'

export const runtime = 'nodejs'

const PLAN_CREDITS: Record<string, number> = {
  basic:            1000,
  standard:         2500,
  pro:              6000,
  basic_yearly:     12000,
  standard_yearly:  30000,
  pro_yearly:       72000,
}

// Map full plan keys to the simplified value stored in user_credits.plan
const PLAN_KEY: Record<string, string> = {
  basic:            'basic',
  standard:         'standard',
  pro:              'pro',
  basic_yearly:     'basic',
  standard_yearly:  'standard',
  pro_yearly:       'pro',
}

function verifySignature(payload: string, secret: string, signature: string): boolean {
  const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature))
  } catch {
    return false
  }
}

interface CreemEvent {
  id: string
  eventType: string
  object: {
    customer?: { email?: string }
    metadata?: { referenceId?: string; plan?: string; planKey?: string; quantity?: string }
    [key: string]: unknown
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('creem-signature') ?? ''
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET ?? ''

  // Verify Creem signature when secret is configured
  if (webhookSecret && !verifySignature(rawBody, webhookSecret, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: CreemEvent
  try {
    event = JSON.parse(rawBody) as CreemEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { eventType, object: obj } = event
  const email = obj.metadata?.referenceId ?? obj.customer?.email
  const plan = obj.metadata?.plan
  const planKey = obj.metadata?.planKey ?? (plan ? PLAN_KEY[plan] : undefined)
  const qty = Math.max(1, parseInt(obj.metadata?.quantity as string ?? '1', 10) || 1)

  // Handle one-time topup purchase (checkout.completed fires for one-time products)
  if (eventType === 'checkout.completed') {
    if (email && plan === 'topup') {
      const creditsToAdd = 200 * qty
      await addCredits(email, creditsToAdd)
      console.log(`[webhook] topup: ${email} +${creditsToAdd} credits (qty=${qty})`)
    }
  }

  // Grant credits on subscription activation / renewal
  if (
    eventType === 'subscription.active' ||
    eventType === 'subscription.trialing' ||
    eventType === 'subscription.paid'
  ) {
    if (email && plan && PLAN_CREDITS[plan] && planKey) {
      await addCredits(email, PLAN_CREDITS[plan])
      await setPlan(email, planKey)
      console.log(`[webhook] ${eventType}: ${email} → plan=${planKey}, +${PLAN_CREDITS[plan]} credits`)
    }
  }

  // Revert to free plan on expiry / cancellation
  if (eventType === 'subscription.expired' || eventType === 'subscription.canceled') {
    if (email) {
      await setPlan(email, 'free')
      console.log(`[webhook] ${eventType}: ${email} → plan=free`)
    }
  }

  return NextResponse.json({ received: true })
}
