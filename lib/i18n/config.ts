export const locales = ["ja", "en", "ko", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja";

export const localeCookie = "onnaton-locale";

export const htmlLang: Record<Locale, string> = {
  ja: "ja",
  en: "en",
  ko: "ko",
  zh: "zh-CN",
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
