export const locales = ["ja", "en", "yue", "zhTw", "ko"] as const;

export type Locale = (typeof locales)[number];

/** Maps UI locales to copy keys in Localized strings (ja / en / ko / zh). */
export type ContentLocale = "ja" | "en" | "ko" | "zh";

export const defaultLocale: Locale = "ja";

export const localeCookie = "onnaton-locale";

export const htmlLang: Record<Locale, string> = {
  ja: "ja",
  en: "en",
  yue: "yue",
  zhTw: "zh-Hant",
  ko: "ko",
};

export const mapEmbedLang: Record<Locale, string> = {
  ja: "ja",
  en: "en",
  yue: "zh-HK",
  zhTw: "zh-TW",
  ko: "ko",
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Accepts legacy `zh` cookie from before Cantonese / Traditional Chinese split. */
export function normalizeLocale(value: string | undefined): Locale {
  if (value === "zh") return "zhTw";
  return isLocale(value) ? value : defaultLocale;
}

export function resolveContentLocale(locale: Locale): ContentLocale {
  if (locale === "yue" || locale === "zhTw") return "zh";
  return locale;
}
