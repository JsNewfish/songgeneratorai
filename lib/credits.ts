/**
 * Credits management — backed by Supabase.
 *
 * Table: user_credits
 *   email          text  PRIMARY KEY
 *   credits        int   NOT NULL  DEFAULT 3
 *   created_at     timestamptz
 *   updated_at     timestamptz
 *
 * All functions run server-side only (uses service role key).
 */

import { getAdminClient } from './supabase'

const FREE_CREDITS = Number(process.env.FREE_CREDITS ?? 3)

// ---------- helpers ----------

function nowIso() {
  return new Date().toISOString()
}

// ---------- public API ----------

/** Returns current credits, creating the row if needed. */
export async function getOrCreateCredits(email: string): Promise<number> {
  const db = getAdminClient()

  // Try insert-ignore pattern via upsert with ignoreDuplicates
  const { error: upsertErr } = await db.from('user_credits').upsert(
    { email, credits: FREE_CREDITS, created_at: nowIso(), updated_at: nowIso() },
    { onConflict: 'email', ignoreDuplicates: true }
  )
  if (upsertErr) console.error('[credits] upsert error', upsertErr)

  const { data, error } = await db
    .from('user_credits')
    .select('credits')
    .eq('email', email)
    .single()

  if (error) throw new Error(`[credits] getOrCreateCredits: ${error.message}`)
  return data.credits as number
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
