-- Add subscription plan field for analytics segmentation.
-- Safe to run multiple times.

ALTER TABLE IF EXISTS user_credits
  ADD COLUMN IF NOT EXISTS plan text;

-- Backfill existing rows.
UPDATE user_credits
SET plan = 'free'
WHERE plan IS NULL OR btrim(plan) = '';

-- Enforce default and not-null after backfill.
ALTER TABLE user_credits
  ALTER COLUMN plan SET DEFAULT 'free',
  ALTER COLUMN plan SET NOT NULL;

CREATE INDEX IF NOT EXISTS user_credits_plan_idx ON user_credits(plan);
