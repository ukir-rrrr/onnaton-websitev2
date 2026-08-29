import { getSiteSlug, getSupabaseAdmin } from "./server";

export type IntlReservationInput = {
  reference: string;
  name: string;
  email: string;
  country: string;
  datePreference1: string;
  datePreference2: string | null;
  datePreference3: string | null;
  adults: number;
  children: number;
  notes: string | null;
  locale: string | null;
  agreedAt: string;
};

async function getSiteId(siteSlug: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: site } = await supabase
    .from("sites")
    .select("id")
    .eq("slug", siteSlug)
    .maybeSingle();

  return site?.id ?? null;
}

export async function insertIntlReservation(
  input: IntlReservationInput,
  siteSlug = getSiteSlug(),
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const siteId = await getSiteId(siteSlug);
  if (!siteId) return { ok: false, error: "Site not found" };

  const { error } = await supabase.from("reservation_requests").insert({
    site_id: siteId,
    reference: input.reference,
    status: "pending",
    name: input.name,
    email: input.email,
    country: input.country,
    date_preference_1: input.datePreference1,
    date_preference_2: input.datePreference2,
    date_preference_3: input.datePreference3,
    adults: input.adults,
    children: input.children,
    notes: input.notes,
    locale: input.locale,
    agreed_at: input.agreedAt,
  });

  if (error) {
    console.error("[reservation/intl]", error);
    return { ok: false, error: "保存に失敗しました" };
  }

  return { ok: true };
}
