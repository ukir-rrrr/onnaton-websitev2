-- Run once in Supabase SQL Editor on existing projects (after initial schema.sql).
-- ④ International reservation form: add "how did you hear about us" survey.

alter table public.reservation_requests
  add column if not exists referral_source text;
