import { NextResponse } from "next/server";
import { pingSupabase } from "@/lib/supabase/keepAlive";

export async function GET() {
  const result = await pingSupabase();

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    supabase: result.skipped ? "skipped" : "ok",
  });
}
