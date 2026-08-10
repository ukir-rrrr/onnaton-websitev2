import { photos } from "./photos";

export interface KodawariItem {
  num: string;
  title: string;
  desc: string;
  photo: string | null;
  placeholderLabel?: string;
}

/** 当店のこだわり — replace desc/photo as sourcing details are finalized. */
export const kodawariList: KodawariItem[] = [
  {
    num: "01",
    title: "沖縄県産 あぐー豚",
    desc: "島の気候でじっくり育てられたあぐー豚は、脂に上品な甘みがあり、しゃぶしゃぶにすることでその柔らかさと旨みが際立ちます。",
    photo: photos.kodawariAguPork,
  },
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
