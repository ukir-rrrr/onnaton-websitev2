import { photos } from "@/lib/content/photos";

/** Four hero slideshow frames — swap paths here when new photography lands. */
export const heroSlides = [
  { src: photos.aguPorkHero, alt: "あぐー豚のしゃぶしゃぶ" },
  { src: photos.ishigakiBeef, alt: "特選石垣牛" },
  { src: photos.shabuDashi, alt: "しゃぶしゃぶの出汁" },
  { src: photos.yamashiroBeef, alt: "山城牛" },
] as const;
