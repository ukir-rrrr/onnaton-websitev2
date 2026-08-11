import { photos } from "./photos";

export interface ExecutiveDish {
  name: string;
  /** Same column as name; smaller / lighter annotation */
  note?: string;
  /** Phone-only line breaks (md+ / tategaki keep `name` + `note`) */
  nameMobileLines?: readonly [string, string];
}

/**
 * エグゼクティブコース — split layout matching design mock
 * (photo slider left / tategaki menu right).
 */
export const executiveCourse = {
  name: "エグゼクティブコース",
  priceMain: "一〇、五〇〇円",
  priceTaxNote: "（税込 一一、五五〇円）",
  /** Phone-only Arabic numerals (md+ keeps kanji above). */
  priceMainMobile: "10,500円",
  priceTaxNoteMobile: "（税込 11,550円）",
  slides: [
    { src: photos.course013, alt: "久米島産海ぶどう" },
    { src: photos.course011, alt: "前菜" },
    { src: photos.course012, alt: "お料理" },
    { src: photos.course014, alt: "もとぶ牛・特選肉" },
    { src: photos.course015, alt: "お肉" },
    { src: photos.course016, alt: "お食事" },
    { src: photos.course017, alt: "デザート" },
  ],
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: "（海ぶどう未入荷時は代わりの物をお出しします）" },
    { name: "紅しゃぶスープ" },
    {
      name: "沖縄県産ブランド黒毛和牛　もとぶ牛（Ａ５ランク）",
      note: "１００ｇ",
      nameMobileLines: [
        "沖縄県産ブランド黒毛和牛",
        "もとぶ牛（Ａ５ランク）",
      ],
    },
    { name: "あぐー豚", note: "１００ｇ" },
    { name: "お野菜" },
    { name: "手ごねのあぐーつくね" },
    { name: "目の前で焼き上げる焼きチーズリゾット" },
    { name: "バニラアイスクリーム" },
  ] satisfies ExecutiveDish[],
} as const;
