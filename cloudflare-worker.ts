// @ts-ignore `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { pingSupabase } from "./lib/supabase/keepAlive";

export default {
  fetch: handler.fetch,

  /** Supabase free-tier keep-alive (see wrangler.jsonc triggers.crons). */
  async scheduled() {
    const result = await pingSupabase();
    if (!result.ok) {
      console.error("[cron/keep-alive] Supabase ping failed:", result.error);
      return;
    }
    if (result.skipped) {
      console.info("[cron/keep-alive] Supabase not configured, skipped");
      return;
    }
    console.info("[cron/keep-alive] Supabase ping ok");
  },
};
