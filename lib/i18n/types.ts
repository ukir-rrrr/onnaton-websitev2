import type { Locale } from "./config";

export type Localized = Record<Locale, string>;

export function L(
  ja: string,
  en: string,
  ko: string,
  zh: string,
): Localized {
  return { ja, en, ko, zh };
}

export function t(locale: Locale, text: Localized): string {
  return text[locale] || text.ja;
}
