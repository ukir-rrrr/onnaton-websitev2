import { photos } from "./photos";

/** Course slider only — zoom/crop specific photos; frame size unchanged. */
export const courseSlideImageCrop: Partial<
  Record<string, { scale: number; objectPosition?: string }>
> = {
  /** お出汁 — hide portable konro/flame at bottom */
  [photos.course013]: { scale: 1.03, objectPosition: "center top" },
  [photos.kodawariAguButa]: { scale: 1.03, objectPosition: "center top" },
};

export interface ExecutiveDish {
  name: string;
  /** Same column as name (e.g. １００ｇ, 補足文) */
  note?: string;
  /** Phone-only line breaks (md+ / tategaki keep `name` + `note`) */
  nameMobileLines?: readonly [string, string];
}

export interface CourseAltPrice {
  label: string;
  main: string;
  taxNote: string;
  mainMobile: string;
  taxNoteMobile: string;
}

export interface CourseMenuData {
  id: string;
  name: string;
  /**
   * Tategaki only: title before `nameTategakiRest`.
   * When set, `name` is still used for yokogaki / accessibility.
   */
  nameTategakiLead?: string;
  /** Tategaki only: smaller continuation (e.g. 極 withシャトーブリアン). */
  nameTategakiRest?: string;
  /** Short line under the title (e.g. 増量コース) */
  subtitle?: string;
  /** Prominent label near the course name (e.g. 人気) */
  badge?: string;
  /** Tategaki only: horizontal tail after vertical badge (e.g. No.1) */
  badgeTail?: string;
  priceLabel?: string;
  priceMain: string;
  priceTaxNote: string;
  /** Phone-only Arabic numerals (md+ keeps kanji above). */
  priceMainMobile: string;
  priceTaxNoteMobile: string;
  altPrice?: CourseAltPrice;
  slides: readonly { src: string; alt: string }[];
  dishes: readonly ExecutiveDish[];
}

const executiveSlides = [
  { src: photos.course013, alt: "お出汁" },
  { src: photos.course011, alt: "前菜" },
  { src: photos.course012, alt: "お料理" },
  { src: photos.course014, alt: "もとぶ牛・特選肉" },
  { src: photos.course015, alt: "お肉" },
  { src: photos.course016, alt: "お食事" },
  { src: photos.kodawariAguButa, alt: "あぐー豚" },
] as const;

const kiwamiSlides = [
  { src: photos.course013, alt: "お出汁" },
  { src: photos.course011, alt: "前菜" },
  { src: photos.course012, alt: "お料理" },
  { src: photos.course018, alt: "もとぶ牛・山城牛・特選石垣牛" },
  { src: photos.course019, alt: "チーズ" },
  { src: photos.course023, alt: "焼きチーズリゾット" },
  { src: photos.course015, alt: "お肉" },
  { src: photos.course016, alt: "お食事" },
  { src: photos.course017, alt: "デザート" },
  { src: photos.kodawariAguButa, alt: "あぐー豚" },
] as const;

const kouSlides = [
  { src: photos.course013, alt: "お出汁" },
  { src: photos.course011, alt: "前菜" },
  { src: photos.course012, alt: "お料理" },
  { src: photos.course022, alt: "もとぶ牛・山城牛・特選石垣牛" },
  { src: photos.course021, alt: "しゃぶしゃぶ" },
  { src: photos.course019, alt: "チーズ" },
  { src: photos.course023, alt: "焼きチーズリゾット" },
  { src: photos.course015, alt: "お肉" },
  { src: photos.course024, alt: "チーズリゾット" },
  { src: photos.course016, alt: "お食事" },
  { src: photos.course017, alt: "デザート" },
  { src: photos.kodawariAguButa, alt: "あぐー豚" },
] as const;

const chateaubriandSlides = [
  { src: photos.course013, alt: "お出汁" },
  { src: photos.course011, alt: "前菜" },
  { src: photos.course012, alt: "お料理" },
  { src: photos.course022, alt: "もとぶ牛・山城牛・特選石垣牛" },
  { src: photos.course021, alt: "しゃぶしゃぶ" },
  { src: photos.course019, alt: "チーズ" },
  { src: photos.course023, alt: "焼きチーズリゾット" },
  { src: photos.course015, alt: "お肉" },
  { src: photos.course024, alt: "チーズリゾット" },
  { src: photos.course016, alt: "お食事" },
  { src: photos.course017, alt: "デザート" },
  { src: photos.kodawariAguButa, alt: "あぐー豚" },
  { src: photos.course020, alt: "特選石垣牛" },
] as const;

const umiNote = "（海ぶどうが未入荷の際は代わりものをお出しします）";
const wagyuPrefix = "沖縄県産ブランド黒毛和牛";
const g50 = "５０ｇ";
const g100 = "１００ｇ";
const g200 = "２００ｇ";
const approxG50 = "≒　５０ｇ";
const approxG100 = "≒　１００ｇ";
const approxG200 = "≒　２００ｇ";

export const executiveCourse: CourseMenuData = {
  id: "executive",
  name: "エグゼクティブコース",
  priceLabel: "お一人様",
  priceMain: "一〇、五〇〇円",
  priceTaxNote: "（税込 一一、五五〇円）",
  priceMainMobile: "10,500円",
  priceTaxNoteMobile: "（税込 11,550円）",
  slides: executiveSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    { name: "紅しゃぶスープ" },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: approxG100,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
    },
    { name: "あぐー豚", note: approxG100 },
    { name: "お野菜" },
    { name: "手ごねのあぐーつくね" },
    { name: "目の前で焼き上げる焼きチーズリゾット" },
    { name: "バニラアイスクリーム" },
  ],
};

export const hanaCourse: CourseMenuData = {
  id: "hana",
  name: "エグゼクティブコース　華-hana-",
  subtitle: "エグゼクティブコースよりあぐー豚１００ｇ増量コース",
  priceLabel: "お一人様",
  priceMain: "一二、〇〇〇円",
  priceTaxNote: "（税込 一三、二〇〇円）",
  priceMainMobile: "12,000円",
  priceTaxNoteMobile: "（税込 13,200円）",
  slides: executiveSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    { name: "紅しゃぶスープ" },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: approxG100,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
    },
    { name: "あぐー豚", note: approxG200 },
    { name: "お野菜" },
    { name: "手ごねのあぐーつくね" },
    { name: "目の前で焼き上げる焼きチーズリゾット" },
    { name: "バニラアイス" },
  ],
};

export const kiwamiCourse: CourseMenuData = {
  id: "kiwami",
  name: "エグゼクティブ　極-kiwami-",
  badge: "初めての方におすすめコース",
  priceLabel: "コースお一人様",
  priceMain: "一四、八〇〇円",
  priceTaxNote: "（税込 一六、二八〇円）",
  priceMainMobile: "14,800円",
  priceTaxNoteMobile: "（税込 16,280円）",
  altPrice: {
    label: "セットお一人様",
    main: "一三、八〇〇円",
    taxNote: "（税込 一五、一八〇円）",
    mainMobile: "13,800円",
    taxNoteMobile: "（税込 15,180円）",
  },
  slides: kiwamiSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    { name: "紅しゃぶスープ" },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: g50,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
    },
    {
      name: `${wagyuPrefix}　山城牛（Ａ５ランク）`,
      note: g50,
      nameMobileLines: [wagyuPrefix, "山城牛（Ａ５ランク）"],
    },
    {
      name: `${wagyuPrefix}　特選石垣牛（Ａ５ランク）`,
      note: g50,
      nameMobileLines: [wagyuPrefix, "特選石垣牛（Ａ５ランク）"],
    },
    { name: "あぐー豚", note: g100 },
    { name: "お野菜" },
    { name: "手ごねのあぐーつくね" },
    { name: "目の前で焼き上げる焼きチーズリゾット" },
    { name: "沖縄県産黒蜜きな粉バニラアイスクリーム" },
  ],
};

export const kouCourse: CourseMenuData = {
  id: "kou",
  name: "エグゼクティブ　煌-kou-",
  badge: "ご常連様人気",
  badgeTail: "No.1",
  priceLabel: "コースお一人様",
  priceMain: "一八、五〇〇円",
  priceTaxNote: "（税込 二〇、三五〇円）",
  priceMainMobile: "18,500円",
  priceTaxNoteMobile: "（税込 20,350円）",
  altPrice: {
    label: "セットお一人様",
    main: "一七、八〇〇円",
    taxNote: "（税込 一九、五八〇円）",
    mainMobile: "17,800円",
    taxNoteMobile: "（税込 19,580円）",
  },
  slides: kouSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    {
      name: `${wagyuPrefix}　特選石垣牛（Ａ５ランク）`,
      note: approxG100,
      nameMobileLines: [wagyuPrefix, "特選石垣牛（Ａ５ランク）"],
    },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: approxG100,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
    },
    {
      name: `${wagyuPrefix}　山城牛（Ａ５ランク）`,
      note: approxG50,
      nameMobileLines: [wagyuPrefix, "山城牛（Ａ５ランク）"],
    },
    { name: "あぐー豚", note: approxG50 },
    { name: "紅しゃぶスープ" },
    { name: "お野菜" },
    { name: "手ごねのあぐーつくね" },
    { name: "目の前で焼き上げる焼きチーズリゾット" },
    { name: "沖縄県産黒蜜きな粉バニラアイスクリーム" },
  ],
};

export const chateaubriandCourse: CourseMenuData = {
  id: "chateaubriand",
  name: "エグゼクティブ極",
  nameTategakiRest: "（with シャトーブリアン）",
  priceLabel: "コースお一人様",
  priceMain: "二五、八〇〇円",
  priceTaxNote: "（税込 二八、三八〇円）",
  priceMainMobile: "25,800円",
  priceTaxNoteMobile: "（税込 28,380円）",
  slides: chateaubriandSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    {
      name: "特選石垣牛（Ａ５ランク）シャトーブリアンステーキ",
      note: approxG100,
      nameMobileLines: [
        "特選石垣牛（Ａ５ランク）",
        "シャトーブリアンステーキ",
      ],
    },
    { name: "高級ワイン「Rindo」などを元に作ったソースと共に" },
    {
      name: `${wagyuPrefix}　特選石垣牛（Ａ５ランク）`,
      note: approxG50,
      nameMobileLines: [wagyuPrefix, "特選石垣牛（Ａ５ランク）"],
    },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: approxG50,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
    },
    {
      name: `${wagyuPrefix}　山城牛（Ａ５ランク）`,
      note: approxG50,
      nameMobileLines: [wagyuPrefix, "山城牛（Ａ５ランク）"],
    },
    { name: "あぐー豚", note: approxG50 },
    { name: "紅しゃぶスープ" },
    { name: "お野菜" },
    { name: "手ごねのあぐーつくね" },
    { name: "目の前で焼き上げる焼きチーズリゾット" },
    { name: "沖縄県産黒蜜きな粉バニラアイスクリーム" },
  ],
};

export const courseMenus: CourseMenuData[] = [
  executiveCourse,
  hanaCourse,
  kiwamiCourse,
  kouCourse,
  chateaubriandCourse,
];
