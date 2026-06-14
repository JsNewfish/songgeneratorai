/**
 * Credits management — backed by Supabase.
 *
 * Table: user_credits
 *   email            text  PRIMARY KEY
 *   credits          int   NOT NULL  DEFAULT 20
 *   plan             text  NOT NULL  DEFAULT 'free'
 *   daily_reset_at   date  (NULL = never reset)  ← 需在 Supabase 执行:
 *                    ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS daily_reset_at date;
 *   created_at       timestamptz
 *   updated_at       timestamptz
 *
 * 免费用户每天自动补充 20 credits（UTC 日期驱动，无需 cron）。
 * 付费用户 credits 由 webhook 充值，不参与每日补充。
 *
 * All functions run server-side only (uses service role key).
 */

import { getAdminClient } from './supabase'

const FREE_DAILY_CREDITS = Number(process.env.FREE_DAILY_CREDITS ?? 20)

// ---------- helpers ----------

function nowIso() {
  return new Date().toISOString()
}

/** Returns today's date string in UTC, e.g. "2026-05-27" */
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

// ---------- public API ----------

/**
 * Returns current credits, creating the row if needed.
 * For free users: automatically refills to FREE_DAILY_CREDITS if last reset was before today.
 */
export async function getOrCreateCredits(email: string): Promise<number> {
  const db = getAdminClient()

  // Upsert to create row if missing (ignore on conflict)
  await db.from('user_credits').upsert(
    { email, credits: FREE_DAILY_CREDITS, plan: 'free', created_at: nowIso(), updated_at: nowIso() },
    { onConflict: 'email', ignoreDuplicates: true }
  )

  const { data, error } = await db
    .from('user_credits')
    .select('credits, plan, daily_reset_at')
    .eq('email', email)
    .single()

  if (error) throw new Error(`[credits] getOrCreateCredits: ${error.message}`)

  const row = data as { credits: number; plan: string; daily_reset_at: string | null }
  const today = todayUtc()

  // Daily refill for free users only
  if (row.plan === 'free' && row.daily_reset_at !== today) {
    const refillBalance = FREE_DAILY_CREDITS
    await db
      .from('user_credits')
      .update({ credits: refillBalance, daily_reset_at: today, updated_at: nowIso() })
      .eq('email', email)
    return refillBalance
  }

  return row.credits
}

/** Deducts `amount` credits. Returns the new balance. Throws if insufficient. */
export async function deductCredits(email: string, amount = 1): Promise<number> {
  const db = getAdminClient()

  const current = await getOrCreateCredits(email)
  if (current < amount) {
    throw new Error('Insufficient credits')
  }

  const newBalance = current - amount
  const { error } = await db
    .from('user_credits')
    .update({ credits: newBalance, updated_at: nowIso() })
    .eq('email', email)

  if (error) throw new Error(`[credits] deductCredits: ${error.message}`)
  return newBalance
}

/** Returns the user's subscription plan (e.g. 'free', 'basic', 'standard', 'pro'). */
export async function getUserPlan(email: string): Promise<string> {
  const db = getAdminClient()
  const { data } = await db
    .from('user_credits')
    .select('plan')
    .eq('email', email)
    .maybeSingle()
  return (data as Record<string, unknown> | null)?.plan as string ?? 'free'
}

/** Adds `amount` credits (e.g. after payment). Returns the new balance. */
export async function addCredits(email: string, amount: number): Promise<number> {
  const db = getAdminClient()

  const current = await getOrCreateCredits(email)
  const newBalance = current + amount

  const { error } = await db
    .from('user_credits')
    .update({ credits: newBalance, updated_at: nowIso() })
    .eq('email', email)

  if (error) throw new Error(`[credits] addCredits: ${error.message}`)
  return newBalance
}

/** Sets the user's subscription plan (e.g. 'basic', 'standard', 'pro', 'free'). */
export async function setPlan(email: string, plan: string): Promise<void> {
  const db = getAdminClient()
  await getOrCreateCredits(email) // ensure row exists
  const { error } = await db
    .from('user_credits')
    .update({ plan, updated_at: nowIso() })
    .eq('email', email)
  if (error) throw new Error(`[credits] setPlan: ${error.message}`)
}
