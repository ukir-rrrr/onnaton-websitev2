/**
 * Languages shown in the header language menu.
 * Japanese is the site default. Switching is persisted in a cookie.
 */
export const languageOptions = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "yue", label: "廣東話" },
  { code: "zhTw", label: "繁體中文" },
  { code: "ko", label: "한국어" },
] as const;

export type LanguageOptionCode = (typeof languageOptions)[number]["code"];
