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
  kodawariAguPork:"/images/kodawari_agu_buta.jpg",
  kodawariShabuDashi:"/images/kodawari_03.jpg",
  kodawariYasai:"/images/kodawari_04.jpg",
} as const;

export type PhotoKey = keyof typeof photos;
