import { getSupabaseAdmin } from "@/lib/supabase/server";

export type LockoutPolicy = {
  maxAttempts: number;
  windowMs: number;
  lockMs: number;
};

export type RateLimitStatus = {
  allowed: boolean;
  lockedUntil?: Date;
  retryAfterSeconds?: number;
};

type RateLimitRow = {
  bucket_key: string;
  attempt_count: number;
  window_start: string;
  locked_until: string | null;
};

function nowMs(): number {
  return Date.now();
}

function retrySeconds(until: Date): number {
  return Math.max(1, Math.ceil((until.getTime() - nowMs()) / 1000));
}

async function getRow(bucketKey: string): Promise<RateLimitRow | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("rate_limits")
    .select("bucket_key, attempt_count, window_start, locked_until")
    .eq("bucket_key", bucketKey)
    .maybeSingle();

  if (error) {
    console.error("[rate-limit] read failed", bucketKey, error.message);
    return null;
  }

  return data;
}

async function upsertRow(row: {
  bucket_key: string;
  attempt_count: number;
  window_start: string;
  locked_until: string | null;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase.from("rate_limits").upsert(
    {
      ...row,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "bucket_key" },
  );

  if (error) {
    console.error("[rate-limit] upsert failed", row.bucket_key, error.message);
  }
}

async function deleteRow(bucketKey: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase
    .from("rate_limits")
    .delete()
    .eq("bucket_key", bucketKey);

  if (error) {
    console.error("[rate-limit] delete failed", bucketKey, error.message);
  }
}

/** Admin login: check active lockout before attempting password verify. */
export async function checkLockout(
  bucketKey: string,
  _policy: LockoutPolicy,
): Promise<RateLimitStatus> {
  const row = await getRow(bucketKey);
  if (!row) return { allowed: true };

  const lockedUntil = row.locked_until ? new Date(row.locked_until) : null;
  if (lockedUntil && lockedUntil.getTime() > nowMs()) {
    return {
      allowed: false,
      lockedUntil,
      retryAfterSeconds: retrySeconds(lockedUntil),
    };
  }

  return { allowed: true };
}

/** Admin login: increment failures; lock when max attempts reached in window. */
export async function recordLockoutFailure(
  bucketKey: string,
  policy: LockoutPolicy,
): Promise<RateLimitStatus> {
  const now = new Date();
  const row = await getRow(bucketKey);

  let attemptCount = 1;
  let windowStart = now.toISOString();
  let lockedUntil: string | null = null;

  if (row) {
    const windowStartMs = new Date(row.window_start).getTime();
    const inWindow = nowMs() - windowStartMs <= policy.windowMs;

    if (inWindow) {
      attemptCount = row.attempt_count + 1;
      windowStart = row.window_start;
    }

    if (attemptCount >= policy.maxAttempts) {
      lockedUntil = new Date(nowMs() + policy.lockMs).toISOString();
    }
  }

  await upsertRow({
    bucket_key: bucketKey,
    attempt_count: attemptCount,
    window_start: windowStart,
    locked_until: lockedUntil,
  });

  if (lockedUntil) {
    const until = new Date(lockedUntil);
    return {
      allowed: false,
      lockedUntil: until,
      retryAfterSeconds: retrySeconds(until),
    };
  }

  return { allowed: true };
}

export async function clearRateLimit(bucketKey: string): Promise<void> {
  await deleteRow(bucketKey);
}

/** Submission quota: true if another action is allowed within the window. */
export async function checkQuota(
  bucketKey: string,
  maxAttempts: number,
  windowMs: number,
): Promise<boolean> {
  const row = await getRow(bucketKey);
  if (!row) return true;

  const windowStartMs = new Date(row.window_start).getTime();
  if (nowMs() - windowStartMs > windowMs) return true;

  return row.attempt_count < maxAttempts;
}

/** Record a successful submission against IP / email quotas. */
export async function recordQuota(
  bucketKey: string,
  windowMs: number,
): Promise<void> {
  const now = new Date();
  const row = await getRow(bucketKey);

  let attemptCount = 1;
  let windowStart = now.toISOString();

  if (row) {
    const windowStartMs = new Date(row.window_start).getTime();
    if (nowMs() - windowStartMs <= windowMs) {
      attemptCount = row.attempt_count + 1;
      windowStart = row.window_start;
    }
  }

  await upsertRow({
    bucket_key: bucketKey,
    attempt_count: attemptCount,
    window_start: windowStart,
    locked_until: null,
  });
}

/** Auto-reply cooldown (e.g. one customer email per 24h). */
export async function isWithinCooldown(bucketKey: string): Promise<boolean> {
  const row = await getRow(bucketKey);
  if (!row?.locked_until) return false;

  return new Date(row.locked_until).getTime() > nowMs();
}

export async function setCooldown(
  bucketKey: string,
  durationMs: number,
): Promise<void> {
  const until = new Date(nowMs() + durationMs).toISOString();
  await upsertRow({
    bucket_key: bucketKey,
    attempt_count: 1,
    window_start: new Date().toISOString(),
    locked_until: until,
  });
}

export const ADMIN_LOGIN_POLICY: LockoutPolicy = {
  maxAttempts: 10,
  windowMs: 30 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
};

export const INTL_SUBMIT_IP_MAX = 5;
export const INTL_SUBMIT_IP_WINDOW_MS = 60 * 60 * 1000;

export const INTL_SUBMIT_EMAIL_MAX = 3;
export const INTL_SUBMIT_EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;

export const INTL_AUTOREPLY_COOLDOWN_MS = 24 * 60 * 60 * 1000;
