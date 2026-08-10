import { photos } from "./photos";

export interface Course {
  name: string;
  /** Leave as the placeholder string until pricing is finalized. */
  price: string;
  meat: string;
  /** Leave as the placeholder string until the dish count is finalized. */
  dishes: string;
  desc: string;
  note: string;
  photo: string;
}

/**
 * コース・メニュー — this is the data the spreadsheet will eventually feed.
 * Until real pricing/dish counts are supplied, keep the 【...】 placeholders
 * so it's obvious in the UI that these fields still need real data.
 */
export const courseList: Course[] = [
  {
    name: "恩納豚コース",
    price: "￥ ---,---（税込）",
    meat: "あぐー豚",
    dishes: "【品数ご入力】",
    desc: "あぐー豚の旨みをしゃぶしゃぶで気軽に楽しめるベーシックなコースです。",
    note: "※内容・料金は変更となる場合がございます。",
    photo: photos.aguPork,
  },
  {
    name: "石垣牛コース",
    price: "￥ ---,---（税込）",
    meat: "特選石垣牛",
    dishes: "【品数ご入力】",
    desc: "沖縄を代表する和牛、石垣牛を中心にお楽しみいただくコースです。",
    note: "※内容・料金は変更となる場合がございます。",
    photo: photos.ishigakiBeef,
  },
  {
    name: "恩納豚・石垣牛 食べ比べコース",
    price: "￥ ---,---（税込）",
    meat: "あぐー豚・特選石垣牛",
    dishes: "【品数ご入力】",
    desc: "二つの銘柄をしゃぶしゃぶで食べ比べていただく、当店人気のコースです。",
    note: "※内容・料金は変更となる場合がございます。",
    photo: photos.shabuDashi,
  },
  {
    name: "山城牛コース",
    price: "￥ ---,---（税込）",
    meat: "山城牛",
    dishes: "【品数ご入力】",
    desc: "希少な山城牛を使用した、特別な日にふさわしいコースです。",
    note: "※内容・料金は変更となる場合がございます。",
    photo: photos.yamashiroBeef,
  },
  {
    name: "恩納豚 特別懐石コース",
    price: "￥ ---,---（税込）",
    meat: "あぐー豚・特選石垣牛・山城牛",
    dishes: "【品数ご入力】",
    desc: "当店自慢の食材を贅沢に取り入れた、最上級のコースです。",
    note: "※前日までのご予約制、内容・料金は変更となる場合がございます。",
    photo: photos.interiorKaiseki,
  },
];
