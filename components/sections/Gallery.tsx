"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryList } from "@/lib/content/gallery";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

/** Auto drift speed (px / ms). */
const AUTO_SPEED = 0.025;
/** Ignore tiny moves so vertical page scroll still works on phones. */
const DRAG_THRESHOLD_PX = 8;

export function Gallery() {
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
      <div className="mb-12 px-5 sm:mb-20 sm:px-10 lg:px-14">
        <SectionEyebrow eyebrow="GALLERY" heading="ギャラリー" />
      </div>

      <div
        ref={viewportRef}
        className={`relative w-full overflow-hidden select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        role="region"
        aria-label="ギャラリー（左右にスワイプ／ドラッグで操作できます）"
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {loopPhotos.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              className="relative h-[48vh] w-[78vw] min-h-[240px] max-w-[340px] shrink-0 overflow-hidden border-r border-ink sm:h-[68vh] sm:w-[36vw] sm:min-w-[260px] sm:max-w-none lg:h-[72vh] lg:w-[24vw]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 36vw, 78vw"
                quality={90}
                className="pointer-events-none select-none object-cover [-webkit-user-drag:none]"
                draggable={false}
                onLoadingComplete={measureLoopWidth}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 px-5 text-center text-[12px] tracking-[0.08em] text-cream/40 sm:hidden">
        ← スワイプで写真を送れます →
      </p>
    </section>
  );
}
