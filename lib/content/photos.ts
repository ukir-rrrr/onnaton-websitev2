/**
 * Central photo registry.
 *
 * All page content refers to photos by these keys instead of raw file paths,
 * so swapping in new photography later is a one-line change here rather than
 * a hunt through every section/component that uses a given image.
 *
 * Drop replacement files into /public/images and update the path below.
 */
export const photos = {
  aguPork: "/images/kodawari_agu_01.jpg",
  /** Hero image — meat and soup pot both framed. */
  aguPorkHero: "/images/kodawari_agu_01_upscaledcopy.jpg",
  /** Top-page course teaser (full-bleed). */
  courseMenu: "/images/course_menu.jpg",
  /** Executive course photography */
  course011: "/images/course011.jpg",
  course012: "/images/course012.jpg",
  course013: "/images/course013.jpg",
  course014: "/images/course014.jpg",
  course015: "/images/course015.jpg",
  course016: "/images/course016.jpg",
  course017: "/images/course017.jpg",
  course018: "/images/course018.jpg",
  course019: "/images/course019.jpg",
  course020: "/images/course020.jpg",
  course021: "/images/course021.jpg",
  course022: "/images/course022.jpg",
  course023: "/images/course023.jpg",
  course024: "/images/course024.jpg",

  /** 追加のお料理 */
  tuika01: "/images/tuika_01.jpg",
  tuika02: "/images/tuika_02.jpg",
  tuika03: "/images/tuika_03.jpg",
  tuika04: "/images/tuika_04.jpg",

  ishigakiBeef: "/images/ishigaki-beef.jpg",
  shabuDashi: "/images/shabu-dashi.jpg",
  yamashiroBeef: "/images/yamashiro-beef.jpg",
  interiorKaiseki: "/images/interior-kaiseki.jpg",
  interiorTatami: "/images/interior-tatami.jpg",
  interiorTable: "/images/interior-table.jpg",
  galleryExtra: "/images/gallery-extra.jpg",
  /**
   * Dedicated gallery shots — drop files in /public/images/gallery/
   * then register them in lib/content/gallery.ts (preferred) or here.
   */
  // gallery01: "/images/gallery/01.jpg",
  /** ご利用シーン */
  scene01: "/images/scene_01.jpg",
  scene02: "/images/scene_02.jpg",
  scene03: "/images/scene_03.jpg",
  scene04: "/images/scene_04.jpg",


  /** ご予約について */
  reservation01: "/images/reservation_01.jpg",
  /** About / 恩納豚について — vertical portrait. */
  onnatonAbout: "/images/onnnaton_tuite.jpg",
  // 当店のこだわり
  kodawariAguPork: "/images/kodawariagubuta.jpg",
  kodawariAguButa: "/images/kodawari_agu_buta.jpg",
  kodawariShabuDashi:"/images/kodawari_03.jpg",
  kodawariYasai:"/images/kodawari_04.jpg",
  /** お席ページ — 店内写真 */
  tennai01: "/images/tennai_01.jpg",
  tennai02: "/images/tennai_02.jpg",
  tennai03: "/images/tennai_03.jpg",
  tennai04: "/images/tennai_04.jpg",
  tennai05: "/images/tennai_05.jpg",
  tennai06: "/images/tennai_06.jpg",
  tennai07: "/images/tennai_07.jpg",
  tennai08: "/images/tennai_08.jpg",
  tennai09: "/images/tennai_09.jpg",
  tennai10: "/images/tennai_10.jpg",
  tennai11: "/images/tennai_11.jpg",
  tennai12: "/images/tennai_12.jpg",
} as const;

export type PhotoKey = keyof typeof photos;
