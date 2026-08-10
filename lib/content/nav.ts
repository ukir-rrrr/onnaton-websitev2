export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/", label: "トップ" },
  { href: "/#about-text", label: "恩納豚について" },
  { href: "/#kodawari", label: "こだわり" },
  { href: "/course", label: "コース" },
  { href: "/seats", label: "店内" },
  { href: "/#access", label: "アクセス" },
];

/**
 * Visual-only legacy labels — prefer `languageFlags` in the header.
 * Keep until real locale routing is wired.
 */
export const languageOptions = [
  { code: "en", label: "EN" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
] as const;
