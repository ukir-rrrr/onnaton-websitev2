import type { Metadata, Viewport } from "next";
import {
  Sawarabi_Mincho,
  Noto_Sans_JP,
  Noto_Serif_JP,
  Zen_Maru_Gothic,
} from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/getLocale";
import { htmlLang } from "@/lib/i18n/config";
import { copy } from "@/lib/i18n/copy";
import { t } from "@/lib/i18n/types";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";

const sawarabiMincho = Sawarabi_Mincho({
  variable: "--font-sawarabi-mincho",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

/**
 * Noto Serif JP — used specifically for vertical-rl (tategaki) text.
 * It ships proper `vert` OpenType alternates so full-width parentheses,
 * commas, and the ideographic zero「〇」align correctly in vertical columns.
 * (Sawarabi Mincho, our primary JP serif, does not include those alternates,
 * which is why 〇 was shifted right and parentheses looked rotated wrong.)
 */
const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/** Soft rounded JP display face — section headings only (e.g. 当店のこだわり). */
const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, copy.meta.homeTitle),
    description: t(locale, copy.meta.homeDesc),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={htmlLang[locale]}
      className={`${sawarabiMincho.variable} ${notoSansJp.variable} ${notoSerifJp.variable} ${zenMaruGothic.variable}`}
    >
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}

