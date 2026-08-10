import type { Metadata, Viewport } from "next";
import { Sawarabi_Mincho, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "恩納豚（おんなとん）| 沖縄しゃぶしゃぶ 完全予約制コース料理専門店",
  description:
    "あぐー豚×特選石垣牛。沖縄・那覇の完全予約制しゃぶしゃぶコース専門店「恩納豚（おんなとん）」。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${sawarabiMincho.variable} ${notoSansJp.variable} ${notoSerifJp.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
