import type { Locale } from "./config";
import { resolveContentLocale } from "./config";

export type Localized = Record<"ja" | "en" | "ko" | "zh", string>;

export function L(
  ja: string,
  en: string,
  ko: string,
  zh: string,
): Localized {
  return { ja, en, ko, zh };
}

export function t(locale: Locale, text: Localized): string {
  const key = resolveContentLocale(locale);
  return text[key] || text.ja;
}
