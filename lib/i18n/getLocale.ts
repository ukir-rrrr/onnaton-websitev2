import { cookies } from "next/headers";
import { localeCookie, normalizeLocale, type Locale } from "./config";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get(localeCookie)?.value;
  return normalizeLocale(value);
}
