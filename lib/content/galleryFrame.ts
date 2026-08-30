import {
  GALLERY_LOW_RES_LONG_EDGE,
  type GalleryItem,
} from "./gallery";

const HIGH_RES_FRAME =
  "relative h-[46vh] w-[85vw] min-h-[240px] max-w-[400px] shrink-0 overflow-hidden border-r border-ink sm:h-[62vh] sm:w-[48vw] sm:min-w-[300px] sm:max-w-none lg:h-[66vh] lg:w-[34vw] lg:min-w-[380px]";

const LOW_RES_FRAME =
  "relative h-[40vh] w-[70vw] min-h-[220px] shrink-0 overflow-hidden border-r border-ink sm:h-[52vh] sm:w-[30vw] sm:min-w-[240px] lg:h-[54vh] lg:w-[22vw] lg:min-w-[260px]";

export function galleryFrameProps(item: GalleryItem) {
  const longEdge =
    item.width != null && item.height != null
      ? Math.max(item.width, item.height)
      : GALLERY_LOW_RES_LONG_EDGE;

  if (longEdge >= GALLERY_LOW_RES_LONG_EDGE) {
    return {
      className: HIGH_RES_FRAME,
      sizes: "(min-width: 1024px) 34vw, (min-width: 640px) 48vw, 85vw",
      unoptimized: false as const,
      style: undefined,
    };
  }

  /** Retina 2x でも元解像度を超えて拡大しないよう CSS 幅を上限。 */
  const maxWidth =
    item.width != null
      ? Math.max(220, Math.min(340, Math.floor(item.width * 0.5)))
      : 300;

  return {
    className: LOW_RES_FRAME,
    sizes: `${maxWidth}px`,
    unoptimized: true as const,
    style: { maxWidth: `${maxWidth}px` },
  };
}
