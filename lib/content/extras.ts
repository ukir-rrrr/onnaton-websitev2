import { photos } from "./photos";

export interface ExtraItem {
  name: string;
  amount?: string;
  price: string;
  emphasizeAmount?: boolean;
}

export interface ExtraGroup {
  heading: string;
  note?: string;
  items: ExtraItem[];
  photos: { src: string; alt: string }[];
}

/** 追加料理 */
export const extraGroups: ExtraGroup[] = [
  {
    heading: "追加のお料理",
    items: [
      { name: "ミミガーの和え物", price: "780円" },
      { name: "海ぶどう", price: "880円" },
      { name: "もずく酢", price: "680円" },
      { name: "野菜盛り合わせ", price: "780円" },
      { name: "ゴーヤのピクルス", price: "680円" },
    ],
    photos: [
      { src: photos.tuika01, alt: "ミミガーの和え物" },
      { src: photos.tuika02, alt: "海ぶどう" },
      { src: photos.tuika03, alt: "もずく酢" },
    ],
  },
  {
    heading: "追加あぐー豚",
    items: [
      { name: "あぐー豚", amount: "200g", price: "3,200円" },
      { name: "あぐー豚", amount: "100g", price: "1,800円" },
      { name: "あぐー豚つくね", amount: "150g", price: "1,200円" },
    ],
    photos: [{ src: photos.kodawariAguPork, alt: "あぐー豚" }],
  },
  {
    heading: "追加牛肉",
    note: "ご注文されたコースに入ってないお肉は追加できません",
    items: [],
    photos: [{ src: photos.tuika04, alt: "追加牛肉" }],
  },
];
