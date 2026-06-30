-- Daily metrics SQL (UTC-based windows)
-- Use in Supabase SQL editor or scheduled reports.

-- 1) Funnel snapshot: registrations, active creators, songs (7d / 30d)
WITH
registrations AS (
  SELECT
    COUNT(*) FILTER (WHERE created_at >= now() - interval '7 day') AS registrations_7d,
    COUNT(*) FILTER (WHERE created_at >= now() - interval '30 day') AS registrations_30d,
    COUNT(*) FILTER (
      WHERE created_at >= now() - interval '60 day'
        AND created_at < now() - interval '30 day'
    ) AS registrations_prev_30d,
    COUNT(*) AS registrations_total
  FROM user_credits
),
activity AS (
  SELECT
    COUNT(*) FILTER (WHERE created_at >= now() - interval '7 day') AS songs_7d,
    COUNT(*) FILTER (WHERE created_at >= now() - interval '30 day') AS songs_30d,
    COUNT(*) FILTER (
      WHERE created_at >= now() - interval '60 day'
        AND created_at < now() - interval '30 day'
    ) AS songs_prev_30d,
    COUNT(*) AS songs_total,
    COUNT(DISTINCT email) FILTER (WHERE created_at >= now() - interval '7 day') AS active_creators_7d,
    COUNT(DISTINCT email) FILTER (WHERE created_at >= now() - interval '30 day') AS active_creators_30d,
    COUNT(DISTINCT email) FILTER (
      WHERE created_at >= now() - interval '60 day'
        AND created_at < now() - interval '30 day'
    ) AS active_creators_prev_30d,
    COUNT(DISTINCT email) AS active_creators_total
  FROM songs
)
SELECT *
FROM registrations
CROSS JOIN activity;

-- 2) Plan breakdown (requires user_credits.plan)
SELECT plan, COUNT(*) AS users
FROM user_credits
GROUP BY plan
ORDER BY users DESC;

-- 3) Daily registrations (last 30d)
SELECT date_trunc('day', created_at)::date AS day, COUNT(*) AS registrations
FROM user_credits
WHERE created_at >= now() - interval '30 day'
GROUP BY 1
ORDER BY 1;

-- 4) Daily active creators (last 30d)
SELECT date_trunc('day', created_at)::date AS day, COUNT(DISTINCT email) AS active_creators
FROM songs
WHERE created_at >= now() - interval '30 day'
GROUP BY 1
ORDER BY 1;

-- 5) Daily songs created (last 30d)
SELECT date_trunc('day', created_at)::date AS day, COUNT(*) AS songs_created
FROM songs
WHERE created_at >= now() - interval '30 day'
GROUP BY 1
ORDER BY 1;

-- 6) Top creators by output
SELECT email, COUNT(*) AS songs_created
FROM songs
GROUP BY email
ORDER BY songs_created DESC
LIMIT 10;
