/**
 * Languages shown as flag buttons in the header.
 * Japanese is the site default. Switching is persisted in a cookie.
 */
export const languageFlags = [
  { code: "en", label: "English", flag: "us" },
  { code: "ko", label: "한국어", flag: "kr" },
  { code: "zh", label: "中文", flag: "cn" },
] as const;

export type LanguageFlagCode = (typeof languageFlags)[number]["code"];
