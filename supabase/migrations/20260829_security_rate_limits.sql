-- Run once in Supabase SQL Editor on existing projects (after initial schema.sql).

create table if not exists public.rate_limits (
  bucket_key text primary key,
  attempt_count int not null default 0,
  window_start timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists rate_limits_locked_until_idx on public.rate_limits (locked_until)
  where locked_until is not null;

drop policy if exists "Public insert reservation requests" on public.reservation_requests;
