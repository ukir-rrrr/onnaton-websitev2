-- Run once in Supabase SQL Editor on existing projects (after initial schema.sql).
-- ③ International reservation form: replace children count with four age groups.
-- The legacy `children` column is kept (not dropped); the server writes
-- children = age_0_5 + age_6_12 + age_13_19 to satisfy its NOT NULL constraint.

alter table public.reservation_requests
  add column if not exists age_0_5 smallint not null default 0 check (age_0_5 >= 0),
  add column if not exists age_6_12 smallint not null default 0 check (age_6_12 >= 0),
  add column if not exists age_13_19 smallint not null default 0 check (age_13_19 >= 0);
