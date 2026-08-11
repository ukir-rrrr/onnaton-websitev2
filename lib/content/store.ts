/**
 * Store-wide facts (name, phone, address, hours, ...).
 * `reservationPhoneHref` drives every "電話で予約する" button on the page.
 *
 * Source: Google Business Profile + https://www.onnaton.com/access/
 */
export const siteConfig = {
  name: "沖縄しゃぶしゃぶ恩納豚 　那覇",
  // nameReading: "おんなとん",
  nameRomaji: "ONNATON",
  reservationPhoneDisplay: "090-3650-0710",
  reservationPhoneHref: "tel:09036500710",
  instagramUrl: "https://www.instagram.com/onnaton_okinawa/",
  instagramHandle: "@onnaton_okinawa",
  mapEmbedSrc:
    "https://www.google.com/maps?q=%E6%B2%96%E7%B8%84%E7%9C%8C%E9%82%A3%E8%A6%87%E5%B8%82%E8%BE%BB1-2-5+%E6%81%A9%E7%B4%8D%E8%B1%9A&hl=ja&z=16&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=%E6%B2%96%E7%B8%84%E7%9C%8C%E9%82%A3%E8%A6%87%E5%B8%82%E8%BE%BB1-2-5+%E6%81%A9%E7%B4%8D%E8%B1%9A",
};

export interface StoreInfoRow {
  label: string;
  value: string;
  href?: string;
  icon?: "instagram";
}

/** 店舗情報・アクセス — aligned with Google / official site listing. */
export const storeInfoRows: StoreInfoRow[] = [
  { label: "店名", value: `${siteConfig.name} ` },  /*（${siteConfig.nameReading}）*/
  { label: "住所", value: "〒900-0037 沖縄県那覇市辻1-2-5" },
  {
    label: "電話番号",
    value: siteConfig.reservationPhoneDisplay,
    href: siteConfig.reservationPhoneHref,
  },
  {
    label: "営業時間",
    value: "18:00 open（閉店時間はお問い合わせください）",
  },
  { label: "定休日", value: "火曜日・水曜日" },
  { label: "形態", value: "コース料理専門店・完全予約制（前日まで要予約）" },
  { label: "ご予約", value: "お電話のみ／受付 13:30〜21:00（1ヶ月前〜）" },
  { label: "駐車場", value: "なし（近隣のコインパーキングをご利用ください）" },
  {
    label: "アクセス",
    value: "旭橋エリア／MAP CODE：33155442",
  },
  {
    label: "SNS",
    value: `Instagram ${siteConfig.instagramHandle}`,
    href: siteConfig.instagramUrl,
    icon: "instagram",
  },
];

export interface InteriorFact {
  label: string;
  value: string;
}

/** 店内・お席の基本情報 */
export const interiorFacts: InteriorFact[] = [
  { label: "席の種類", value: "お座敷 ／ テーブル席" },
  { label: "席数", value: "【ご案内準備中】" },
  { label: "貸切", value: "応相談（ご予約時にご相談ください）" },
  { label: "個室", value: "あり（お座敷個室）" },
];
