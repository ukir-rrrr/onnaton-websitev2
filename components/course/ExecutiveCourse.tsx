"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { executiveCourse } from "@/lib/content/executiveCourse";
import { ReserveButton } from "@/components/ui/ReserveButton";

/**
 * Compact photo + tategaki menu, both centered on the page with matching
 * vertical extent (photo ≈ menu column height), following the paper-menu
 * reference where the image sits alongside the vertical text rather than
 * dominating the viewport.
 *
 * NOTE on writing-mode: apply `writing-mode: vertical-rl` to each text leaf
 * only. Never on the flex row itself — per the Flexbox spec, `row`'s main
 * axis follows the container's inline axis, so vertical-rl on the container
 * flips row into a vertical stack and everything but the first child gets
 * clipped.
 *
 * Mobile / tablet: horizontal (yokogaki) dish list for readability.
 * xl+: paper-menu tategaki columns.
 */
const verticalTextStyle = {
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  fontFeatureSettings: '"vert", "vpal"',
  fontFamily: "var(--font-noto-serif-jp), var(--font-sawarabi-mincho), serif",
} as const;

export function ExecutiveCourse() {
  const c = executiveCourse;
  const [index, setIndex] = useState(0);
  const total = c.slides.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5500);
    return () => window.clearInterval(id);
  }, [total]);

  return (
    <article className="w-full bg-ink py-12 sm:py-16 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-8 px-5 sm:gap-10 sm:px-6 xl:flex-row xl:items-stretch xl:gap-8 xl:px-8 2xl:px-12">
        {/* ===== LEFT: photo slider ===== */}
        <div className="relative w-full shrink-0 xl:w-[48%] 2xl:w-[50%]">
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            {c.slides.map((slide, i) => (
              <div
                key={slide.src}
                aria-hidden={i !== index}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  i === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1280px) 50vw, 100vw"
                  quality={90}
                  className="object-cover"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={prev}
              aria-label="前の写真"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-cream/90 transition-colors hover:bg-black/70 sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="次の写真"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-cream/90 transition-colors hover:bg-black/70 sm:right-4"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
            </button>

            <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1 sm:bottom-4">
              {c.slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`写真 ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className="flex h-11 w-11 items-center justify-center"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === index ? "bg-gold" : "bg-cream/35"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: menu + CTA ===== */}
        <div className="flex min-w-0 w-full flex-1 flex-col">
          {/* Mobile / tablet: yokogaki list */}
          <div className="xl:hidden">
            <div className="mb-6 border-b border-cream/10 pb-5 text-center sm:mb-8 sm:pb-6">
              <h1 className="font-serif-jp mb-3 text-[26px] font-normal tracking-[0.2em] text-gold sm:text-[30px]">
                {c.name}
              </h1>
              <p className="font-serif-jp text-[22px] tracking-[0.08em] text-gold sm:text-[26px]">
                {c.priceMain}
              </p>
              <p className="mt-1 text-[13px] tracking-[0.08em] text-wipe/85 sm:text-[14px]">
                {c.priceTaxNote}
              </p>
            </div>

            <ul className="font-serif-jp divide-y divide-cream/10">
              {c.dishes.map((dish) => (
                <li key={dish.name} className="py-3.5 sm:py-4">
                  <p className="text-[15px] leading-[1.7] tracking-[0.06em] text-wipe sm:text-[16px]">
                    {dish.name}
                  </p>
                  {dish.note ? (
                    <p className="mt-1 text-[12px] leading-[1.6] tracking-[0.04em] text-wipe/70 sm:text-[13px]">
                      {dish.note}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop: tategaki columns */}
          <div className="hidden flex-1 xl:block xl:h-full xl:overflow-visible">
            <div className="flex h-full justify-end">
              <div className="font-serif-jp flex flex-row-reverse items-start gap-3 text-wipe 2xl:gap-5">
                <h1
                  className="shrink-0 text-[34px] font-normal tracking-[0.4em] text-gold"
                  style={verticalTextStyle}
                >
                  {c.name}
                </h1>

                <p
                  className="ml-10 shrink-0 leading-[1.5] 2xl:ml-12"
                  style={verticalTextStyle}
                >
                  <span className="text-[28px] tracking-[0.1em] text-gold">
                    {c.priceMain}
                  </span>
                  <br />
                  <span className="text-[14px] tracking-[0.12em] text-wipe/90">
                    {c.priceTaxNote}
                  </span>
                </p>

                {c.dishes.map((dish) => (
                  <p
                    key={dish.name}
                    className="shrink-0 leading-[2] tracking-[0.18em]"
                    style={verticalTextStyle}
                  >
                    <span className="text-[18px] text-wipe 2xl:text-[20px]">
                      {dish.name}
                    </span>
                    {dish.note ? (
                      <span className="text-[14px] tracking-[0.08em] text-wipe/85">
                        {"　"}
                        {dish.note}
                      </span>
                    ) : null}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center xl:mt-6 xl:justify-end">
            <ReserveButton className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] tracking-[0.14em] hover:bg-wipe hover:text-cream sm:w-auto sm:min-w-[280px]" />
          </div>
        </div>
      </div>
    </article>
  );
}
