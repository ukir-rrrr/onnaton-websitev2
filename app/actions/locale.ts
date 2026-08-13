"use server";

import { cookies } from "next/headers";
import { isLocale, localeCookie, type Locale } from "@/lib/i18n/config";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  const jar = await cookies();
  jar.set(localeCookie, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
