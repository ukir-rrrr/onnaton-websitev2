-- Run once in Supabase SQL Editor on existing projects (after initial schema.sql).
-- ② International reservation form: add phone number (country + national).

alter table public.reservation_requests
  add column if not exists phone_country text,
  add column if not exists phone_country_code text,
  add column if not exists phone_national text;
