import { photos } from "./photos";

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
  highlights: [
    { label: "特選ラベル" },
    { label: "A5ランクのみ使用" },
    { label: "石垣牛認定店" },
  ] as const,
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

/** こだわり03 — 唯一無二のお出汁 */
export const dashiFeature: KodawariFeature = {
  num: "03",
  heading: ["唯一無二のお出汁"] as const,
  photo: photos.kodawariShabuDashi,
  photoAlt: "唯一無二のお出汁",
  paragraphs: [
    "最初に感じるのは、ほどよいピリ辛さ。\nそこへ良質なお肉の旨みと脂の甘みが溶け込むことで、\n食べ進めるほどに出汁の味わいが変化し、\n最後には皆さまが驚くほど甘くまろやかな味わいへと仕上がっていきます。",
    "一つの鍋の中で変化していく、\n恩納豚ならではのお出汁をぜひお楽しみください。",
    "※出汁の変更はできません。\n辛いものが極度に苦手な方はご遠慮ください。",
  ],
  imageAspectClass: "aspect-[5/3]",
  imageClassName:
    "object-cover object-[center_28%] sm:object-[center_top]",
};

/** こだわり04 — おきなわ食材の認定店 */
export const okinawaFoodFeature: KodawariFeature = {
  num: "04",
  heading: ["おきなわ食材の認定店"] as const,
  photo: photos.kodawariYasai,
  photoAlt: "おきなわ食材の認定店",
  paragraphs: [
    "ご提供する食材のほとんどは沖縄県産。\n島野菜をはじめ、沖縄で育まれた食材を積極的に取り入れています。",
    "そのほかの食材についても、使用するものはすべて国内産。\n一皿一皿を通して、沖縄と日本の豊かな恵みをお楽しみください。",
  ],
  imageAspectClass: "aspect-[5/3]",
  imageClassName: "object-cover object-center",
};
