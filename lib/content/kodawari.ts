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
    "恩納豚で使用しているのは、JAおきなわの品質基準をクリアした、認定ブランドの「あぐー豚」です。",
    "沖縄でよく目にする「アグー豚」という呼び方とは異なり、ひらがなの「あぐー」は、JAおきなわが商標を管理するブランド名称。\n定められた品質基準を満たし、認定された豚肉だけが「あぐー」として流通します。",
    "恩納豚では、この認定された「あぐー豚」を使用しています。脂に上品な甘みがあり、しゃぶしゃぶにすることで柔らかさと旨みが際立ちます。沖縄が誇る上質な味わいを、存分にお楽しみください。",
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
    "ひと口に石垣牛といっても、品質によって「特選ラベル」と「銘産ラベル」に分けられ、その基準は異なります。",
    "当店で使用するのは、その中でも上位に位置する「特選ラベル」の石垣牛。さらに、肉質等級5・歩留等級AのA5ランクのみを厳選しています。",
    "仕入れた肉はそのまま使用せず、余分な脂や筋を丁寧に取り除く「グルムキ」を施し、石垣牛本来のきめ細かな肉質、上品な脂の甘み、とろけるような柔らかさを存分に味わっていただける状態に整えてご提供します。",
    "石垣牛ならではの本物の味わいを、ぜひしゃぶしゃぶでご堪能ください。",
  ],
  imageAspectClass: "aspect-[5/3]",
  imageClassName: "object-cover object-center",
};

/** 当店のこだわり — 特集の下に並ぶ項目 */
export const kodawariList: KodawariItem[] = [
  {
    num: "03",
    title: "しゃぶしゃぶの出汁",
    desc: "肉と島野菜の旨みを引き出す出汁にこだわり、〆の一品まで美味しく召し上がっていただけるようご用意しています。",
    photo: photos.kodawariShabuDashi,
    imageClassName:
      "h-full w-full origin-top scale-[1.0] object-cover object-top",
  },
  {
    num: "04",
    title: "沖縄県産食材",
    desc: "島野菜をはじめ、沖縄県産の食材を積極的に取り入れ、土地の恵みを一皿ごとに感じていただけるよう努めています。",
    photo: photos.kodawariYasai,
  },
];
