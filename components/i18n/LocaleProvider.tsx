"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { t, type Localized } from "@/lib/i18n/types";
import { tr, trName } from "@/lib/i18n/phrases";

const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT() {
  const locale = useLocale();
  return {
    locale,
    t: (text: Localized) => t(locale, text),
    tr: (ja: string) => tr(locale, ja),
    trName: (ja: string) => trName(locale, ja),
    isJa: locale === "ja",
  };
}
