import { photos } from "./photos";

export interface KodawariItem {
  num: string;
  title: string;
  desc: string;
  photo: string | null;
  placeholderLabel?: string;
}

/** こだわり先頭の特集 — 認定ブランド「あぐー豚」 */
export const aguFeature = {
  num: "01",
  heading: ["「アグー豚」ではなく、", "認定ブランド「あぐー豚」"] as const,
  photo: photos.kodawariAguPork,
  photoAlt: "認定ブランド あぐー豚のしゃぶしゃぶ",
  paragraphs: [
    "恩納豚で使用しているのは、JAおきなわの品質基準をクリアした、認定ブランドの「あぐー豚」です。",
    "沖縄でよく目にする「アグー豚」という呼び方とは異なり、ひらがなの「あぐー」は、JAおきなわが商標を管理するブランド名称。\n定められた品質基準を満たし、認定された豚肉だけが「あぐー」として流通します。",
    "恩納豚では、この認定された「あぐー豚」を使用しています。脂に上品な甘みがあり、しゃぶしゃぶにすることで柔らかさと旨みが際立ちます。沖縄が誇る上質な味わいを、存分にお楽しみください。",
  ],
} as const;

/** 当店のこだわり — あぐー豚特集の下に並ぶ項目 */
export const kodawariList: KodawariItem[] = [
  {
    num: "02",
    title: "特選 石垣牛",
    desc: "沖縄を代表する和牛、石垣牛。きめ細やかな霜降りと、噛むほどに広がる濃厚な味わいを、存分にお楽しみいただけます。",
    photo: photos.ishigakiBeef,
  },
  {
    num: "03",
    title: "しゃぶしゃぶの出汁",
    desc: "肉と島野菜の旨みを引き出す出汁にこだわり、〆の一品まで美味しく召し上がっていただけるようご用意しています。",
    photo: photos.kodawariShabuDashi,
  },
  {
    num: "04",
    title: "沖縄県産食材",
    desc: "島野菜をはじめ、沖縄県産の食材を積極的に取り入れ、土地の恵みを一皿ごとに感じていただけるよう努めています。",
    photo: photos.kodawariYasai,
  },
];
