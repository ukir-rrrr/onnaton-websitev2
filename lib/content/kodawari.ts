import { photos } from "./photos";

export interface KodawariItem {
  num: string;
  title: string;
  desc: string;
  photo: string | null;
  placeholderLabel?: string;
  imageClassName?: string;
}

export interface KodawariFeature {
  num: string;
  heading: readonly string[];
  photo: string;
  photoAlt: string;
  paragraphs: readonly string[];
  highlights?: readonly { label: string }[];
  /** Tailwind aspect class */
  imageAspectClass?: string;
  imageClassName?: string;
}

/** こだわり01 — 認定ブランド「あぐー豚」 */
export const aguFeature: KodawariFeature = {
  num: "01",
  heading: ["「アグー豚」ではなく、", "認定ブランド「あぐー豚」"] as const,
  photo: photos.kodawariAguButa,
  photoAlt: "認定ブランド あぐー豚のしゃぶしゃぶ",
  paragraphs: [
    "恩納豚で使用しているのは、\nJAおきなわの品質基準をクリアした、\n認定ブランドの「あぐー豚」です。",
    "沖縄でよく目にする「アグー豚」という呼び方とは異なり、ひらがなの「あぐー」は、JAおきなわが商標を管理するブランド名称。\n定められた品質基準を満たし、認定された豚肉だけが「あぐー」として流通します。",
    "恩納豚では、この認定された「あぐー豚」を使用しています。\n脂に上品な甘みがあり、しゃぶしゃぶにすることで\n柔らかさと旨みが際立ちます。\n沖縄が誇る上質な味わいを、存分にお楽しみください。",
  ],
  imageAspectClass: "aspect-[5/3]",
  imageClassName: "object-cover object-[center_top]",
};

/** こだわり02 — 特選 石垣牛 */
export const ishigakiFeature: KodawariFeature = {
  num: "02",
  heading: ["特選 石垣牛"] as const,
  photo: photos.ishigakiBeef,
  photoAlt: "特選 石垣牛のしゃぶしゃぶ",
  highlights: [{ label: "特選ラベル" }, { label: "A5ランクのみ使用" }] as const,
  paragraphs: [
    "沖縄が誇るブランド和牛「石垣牛」",
    "ひと口に石垣牛といっても、品質によって\n「特選ラベル」と「銘産ラベル」に分けられ、\nその基準は異なります。",
    "当店で使用するのは、その中でも上位に位置する「特選ラベル」の石垣牛。\nさらに、肉質等級5・歩留等級AのA5ランクのみを\n厳選しています。",
    "仕入れた肉はそのまま使用せず、\n余分な脂や筋を丁寧に取り除く「グルムキ」を施し、\n石垣牛本来のきめ細かな肉質、上品な脂の甘み、\nとろけるような柔らかさを存分に味わっていただける状態に\n整えてご提供します。",
    "石垣牛ならではの本物の味わいを、\nぜひしゃぶしゃぶでご堪能ください。",
  ],
  imageAspectClass: "aspect-[5/3]",
  imageClassName: "object-cover object-center",
};

/** 当店のこだわり — 特集の下に並ぶ項目 */
export const kodawariList: KodawariItem[] = [
  {
    num: "03",
    title: "しゃぶしゃぶの出汁",
    desc: "肉と島野菜の旨みを引き出す出汁にこだわり、\n〆の一品まで美味しく\n召し上がっていただけるようご用意しています。",
    photo: photos.kodawariShabuDashi,
    imageClassName:
      "h-full w-full origin-top scale-[1.25] object-cover object-[center_28%] sm:scale-100 sm:object-[center_top] xl:scale-[1.25] xl:object-[center_28%] xl:origin-top",
  },
  {
    num: "04",
    title: "沖縄県産食材",
    desc: "島野菜をはじめ、沖縄県産の食材を\n積極的に取り入れ、\n土地の恵みを一皿ごとに感じていただけるよう努めています。",
    photo: photos.kodawariYasai,
  },
];
