import { photos } from "./photos";

export interface Scene {
  title: string;
  desc: string;
  /** JA mobile-only line breaks; falls back to `desc` on sm+ and other locales. */
  descMobile?: string;
  photo: string;
}

/** ご利用シーン */
export const sceneList: Scene[] = [
  {
    title: "沖縄旅行の特別な夕食",
    desc: "旅の思い出に残る、上質な一夜を。",
    photo: photos.scene01,
  },
  {
    title: "記念日・誕生日",
    desc: "大切な日を、特別なコースでお祝いします。",
    photo: photos.scene02,
  },
  {
    title: "接待・会食",
    desc: "落ち着いた空間で、大切な方にも。",
    photo: photos.scene03,
  },
  {
    title: "海外からのお客様",
    desc: "世界各国からのお客様にご愛顧いただいています。",
    descMobile: "世界各国のお客様に\nご愛顧いただいています。",
    photo: photos.scene04,
  },
];
