import type { Locale } from "./config";
import { resolveContentLocale } from "./config";

export type ContentLocale = "ja" | "en" | "ko" | "yue" | "zhTw";

export type Localized = Record<ContentLocale, string>;

export function L(
  ja: string,
  en: string,
  ko: string,
  yue: string,
  zhTw: string,
): Localized {
  return { ja, en, ko, yue, zhTw };
}

export function t(locale: Locale, text: Localized): string {
  const key = resolveContentLocale(locale);
  return text[key] || text.ja;
}
