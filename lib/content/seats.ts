import { photos } from "./photos";

export interface SeatType {
  id: string;
  name: string;
  /** Short label for hero nav buttons */
  navLabel: string;
  /** Optional note above the detail block */
  note?: string;
  desc: string;
  photo: string;
  /** Image on the left (false = image on the right) */
  imageLeft: boolean;
}

export interface TennaiShot {
  src: string;
  alt: string;
  /** Tailwind col-span on sm+ (mobile is always full width) */
  className: string;
}

/** お席について */
export const seatList: SeatType[] = [
  {
    id: "zashiki",
    name: "お座敷",
    navLabel: "お座敷",
    desc: "ゆったりとくつろげるお座敷席。ご家族やご友人との団らん、記念日のお食事など、落ち着いた時間をお過ごしいただけます。",
    photo: photos.tennai04,
    imageLeft: true,
  },
  {
    id: "table",
    name: "テーブル席",
    navLabel: "テーブル席",
    desc: "会食や接待にも使いやすいテーブル席。しゃぶしゃぶを囲みながら、会話を楽しむひとときをお届けします。",
    photo: photos.interiorTable,
    imageLeft: false,
  },
];

export const seatsIntro =
  "お座敷でのくつろぎの時間。テーブル席での団らん。恩納豚では、記念日・会食・接待など、シーンに合わせてお席をお選びいただけます。";

/** 店内写真 — ワイドとペアを交互にして雑誌のようなリズムにする */
export const tennaiGallery: TennaiShot[] = [
  {
    src: photos.rouka001,
    alt: "色紙が並ぶ店内の通路",
    className: "sm:col-span-12 aspect-[16/9] lg:aspect-[2.15/1]",
  },
  {
    src: photos.tennai06,
    alt: "暖簾と店内の入口",
    className: "sm:col-span-7 aspect-[3/2]",
  },
  {
    src: photos.tennai03,
    alt: "店内の行灯",
    className: "sm:col-span-5 aspect-[3/2]",
  },
  {
    src: photos.tennai04,
    alt: "お座敷",
    className: "sm:col-span-12 aspect-[16/9] lg:aspect-[2.15/1]",
  },
  {
    src: photos.tennai05,
    alt: "お席のセッティング",
    className: "sm:col-span-6 aspect-[3/2]",
  },
  {
    src: photos.tennai07,
    alt: "店内のシーサー",
    className: "sm:col-span-6 aspect-[3/2]",
  },
  {
    src: photos.tennai02,
    alt: "色紙の壁",
    className: "sm:col-span-4 aspect-[3/2]",
  },
  {
    src: photos.tennai08,
    alt: "色紙と行灯",
    className: "sm:col-span-4 aspect-[3/2]",
  },
  {
    src: photos.tennai10,
    alt: "特選石垣牛の認定",
    className: "sm:col-span-4 aspect-[3/2]",
  },
  {
    src: photos.tennai11,
    alt: "恩納豚の暖簾と通路",
    className: "sm:col-span-7 aspect-[3/2]",
  },
  {
    src: photos.tennai09,
    alt: "お客様からのメッセージ",
    className: "sm:col-span-5 aspect-[3/2]",
  },
  {
    src: photos.tennai12,
    alt: "夜間の入口",
    className: "sm:col-span-12 aspect-[16/9] lg:aspect-[2.15/1]",
  },
];
