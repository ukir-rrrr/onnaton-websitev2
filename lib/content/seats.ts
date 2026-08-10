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

/** お席について — placeholder copy until final seat copy is supplied. */
export const seatList: SeatType[] = [
  {
    id: "zashiki",
    name: "お座敷",
    navLabel: "お座敷",
    desc: "ゆったりとくつろげるお座敷席。ご家族やご友人との団らん、記念日のお食事など、落ち着いた時間をお過ごしいただけます。",
    photo: photos.interiorTatami,
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
  {
    id: "private",
    name: "個室",
    navLabel: "個室",
    note: "※個室のご利用はご予約時にご相談ください。",
    desc: "周囲を気にせず寛げるお座敷個室。大切な方との特別な夜や、落ち着いた接待の場としてご利用いただけます。",
    photo: photos.interiorKaiseki,
    imageLeft: true,
  },
];

export const seatsIntro =
  "お座敷でのくつろぎの時間。テーブル席での団らん。個室での特別なひととき。恩納豚では、記念日・ご家族でのお食事・接待など、シーンに合わせてお席をお選びいただけます。";
