"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryList } from "@/lib/content/gallery";
import { siteConfig } from "@/lib/content/store";
import { MultilineText } from "@/components/i18n/MultilineText";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

/** Auto drift speed (px / ms). */
const AUTO_SPEED = 0.018;
/** Ignore tiny moves so vertical page scroll still works on phones. */
const DRAG_THRESHOLD_PX = 8;

export function Gallery() {
  const { t } = useT();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const dragLockedRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lastXRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  /** Two copies for seamless infinite scroll. */
  const loopPhotos = [...galleryList, ...galleryList];

  const wrapOffset = (value: number) => {
    const loop = loopWidthRef.current;
    if (loop <= 0) return value;
    let next = value % loop;
    if (next > 0) next -= loop;
    return next;
  };

  const applyTransform = () => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const measureLoopWidth = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const next = el.scrollWidth / 2;
    if (next > 0) {
      loopWidthRef.current = next;
      offsetRef.current = wrapOffset(offsetRef.current);
      applyTransform();
    }
  }, []);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    measureLoopWidth();
    const onResize = () => measureLoopWidth();
    window.addEventListener("resize", onResize);

    const track = trackRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && track
        ? new ResizeObserver(() => measureLoopWidth())
        : null;
    if (track && ro) ro.observe(track);

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;

      if (!draggingRef.current && !reduceMotionRef.current) {
        offsetRef.current = wrapOffset(offsetRef.current - AUTO_SPEED * dt);
        applyTransform();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [measureLoopWidth]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      draggingRef.current = true;
      dragLockedRef.current = false;
      setIsDragging(true);
      startXRef.current = event.clientX;
      startYRef.current = event.clientY;
      lastXRef.current = event.clientX;
      viewport.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;

      const dxTotal = event.clientX - startXRef.current;
      const dyTotal = event.clientY - startYRef.current;

      if (!dragLockedRef.current) {
        if (Math.abs(dxTotal) < DRAG_THRESHOLD_PX && Math.abs(dyTotal) < DRAG_THRESHOLD_PX) {
          return;
        }
        // Prefer vertical page scroll unless the gesture is clearly horizontal
        if (Math.abs(dyTotal) > Math.abs(dxTotal)) {
          draggingRef.current = false;
          setIsDragging(false);
          try {
            viewport.releasePointerCapture(event.pointerId);
          } catch {
            /* already released */
          }
          return;
        }
        dragLockedRef.current = true;
      }

      event.preventDefault();
      const dx = event.clientX - lastXRef.current;
      lastXRef.current = event.clientX;
      offsetRef.current = wrapOffset(offsetRef.current + dx);
      applyTransform();
    };

    const endDrag = (event: PointerEvent) => {
      if (!draggingRef.current && !dragLockedRef.current) return;
      draggingRef.current = false;
      dragLockedRef.current = false;
      setIsDragging(false);
      try {
        viewport.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    };

    const onDragStart = (event: DragEvent) => {
      event.preventDefault();
    };

    viewport.addEventListener("pointerdown", onPointerDown, { passive: true });
    viewport.addEventListener("pointermove", onPointerMove, { passive: false });
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("dragstart", onDragStart);

    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  if (galleryList.length === 0) return null;

  return (
    <section className="w-full overflow-hidden py-20 sm:py-32 lg:py-[160px]">
      <Reveal className="mb-12 px-5 sm:mb-20 sm:px-10 lg:px-14" amount={0.4}>
        <SectionEyebrow eyebrow="GALLERY" heading={t(copy.gallery.heading)} />
      </Reveal>

      <div
        ref={viewportRef}
        className={`relative w-full overflow-hidden select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        role="region"
        aria-label={t(copy.gallery.aria)}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {loopPhotos.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              className="relative h-[48vh] w-[82vw] min-h-[240px] max-w-[380px] shrink-0 overflow-hidden border-r border-ink sm:h-[66vh] sm:w-[42vw] sm:min-w-[280px] sm:max-w-none lg:h-[68vh] lg:w-[30vw] lg:min-w-[360px]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 42vw, 82vw"
                quality={90}
                className="pointer-events-none select-none object-cover [-webkit-user-drag:none]"
                draggable={false}
                onLoadingComplete={measureLoopWidth}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 px-5 text-center text-[12px] tracking-[0.08em] text-cream/65 sm:hidden">
        {t(copy.gallery.swipe)}
      </p>

      <div className="mx-auto mt-14 flex w-full min-w-0 max-w-4xl flex-col items-center px-5 text-center sm:mt-20 sm:px-10 lg:mt-24">
        <Reveal variant="fadeUp" delay={0.05}>
          <p className="font-serif-jp mb-3 w-full min-w-0 max-w-full break-words text-[16px] leading-[2.1] tracking-[0.04em] text-cream/95 sm:text-[18px] sm:leading-[2.2]">
            <MultilineText text={t(copy.gallery.p1)} keepAll={false} />
          </p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.14}>
          <p className="font-serif-jp mb-8 w-full min-w-0 max-w-full break-words text-[16px] leading-[2.1] tracking-[0.04em] text-cream/92 sm:mb-10 sm:text-[18px] sm:leading-[2.2]">
            <MultilineText text={t(copy.gallery.p2)} keepAll={false} />
          </p>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.24}>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-sm min-h-11 items-center justify-center gap-3 border border-gold-ink px-5 py-3.5 text-[14px] font-bold tracking-[0.06em] text-gold-ink transition-colors hover:bg-gold-ink hover:text-on-dark sm:w-auto sm:min-w-[280px] sm:px-12 sm:text-[16px] sm:tracking-[0.08em]"
          >
            <InstagramIcon className="h-[18px] w-[18px]" />
            {siteConfig.instagramHandle}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
