import { headers } from "next/headers";

/** Client IP for rate limiting (Cloudflare → proxy → fallback). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const cf = h.get("cf-connecting-ip")?.trim();
  if (cf) return cf;

  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;

  const realIp = h.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}
