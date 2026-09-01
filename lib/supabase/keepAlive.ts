import { getSiteSlug, getSupabaseAdmin } from "./server";

export type KeepAliveResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string };

/** Lightweight read against Supabase to prevent free-tier project pause. */
export async function pingSupabase(): Promise<KeepAliveResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: true, skipped: true };
  }

  const { error } = await supabase
    .from("sites")
    .select("id")
    .eq("slug", getSiteSlug())
    .limit(1)
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
