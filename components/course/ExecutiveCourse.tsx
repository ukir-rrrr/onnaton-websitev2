"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  executiveCourse,
  courseSlideImageCrop,
  type CourseMenuData,
} from "@/lib/content/executiveCourse";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

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

export function CourseDetail({
  course,
  headingAs = "h2",
  id,
  nextCourseHref,
}: {
  course: CourseMenuData;
  headingAs?: "h1" | "h2";
  id?: string;
  nextCourseHref?: string;
}) {
  const c = course;
  const { t, tr, trName, isJa } = useT();
  const Heading = headingAs;
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
    <article id={id} className="scroll-mt-24 w-full overflow-x-clip bg-ink py-12 sm:py-16 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-8 px-5 sm:gap-10 sm:px-6 xl:flex-row xl:items-stretch xl:gap-4 xl:px-6 min-[1440px]:gap-6 min-[1440px]:px-8">
        {/* ===== LEFT: photo slider ===== */}
        <div className="relative w-full shrink-0 xl:w-[32%] min-[1440px]:w-[36%]">
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            {c.slides.map((slide, i) => {
              const crop = courseSlideImageCrop[slide.src];
              return (
                <div
                  key={slide.src}
                  aria-hidden={i !== index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                    i === index ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {crop ? (
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className="relative h-full w-full origin-top"
                        style={{ transform: `scale(${crop.scale})` }}
                      >
                        <Image
                          src={slide.src}
                          alt={slide.alt}
                          fill
                          priority={i === 0}
                          sizes="(min-width: 1280px) 38vw, 100vw"
                          quality={90}
                          className="object-cover"
                          style={{
                            objectPosition: crop.objectPosition ?? "center",
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1280px) 38vw, 100vw"
                      quality={90}
                      className="object-cover"
                    />
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={prev}
              aria-label={t(copy.coursePage.prevPhoto)}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-on-dark/90 transition-colors hover:bg-black/70 sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t(copy.coursePage.nextPhoto)}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-on-dark/90 transition-colors hover:bg-black/70 sm:right-4"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
            </button>

            <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1 sm:bottom-4">
              {c.slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`${t(copy.coursePage.photoN)} ${i + 1}`}
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
          <div className={isJa ? "xl:hidden" : ""}>
            <div className="mb-6 border-b border-cream/10 pb-5 text-center sm:mb-8 sm:pb-6">
              <Heading className="font-serif-jp mb-3 text-[26px] font-normal tracking-[0.2em] text-cream sm:text-[30px]">
                {trName(c.name)}
              </Heading>
              {c.subtitle ? (
                <p className="mx-auto mb-4 inline-block bg-wipe px-5 py-2.5 text-[15px] leading-[1.8] tracking-[0.06em] text-black sm:text-[16px]">
                  {tr(c.subtitle)}
                </p>
              ) : null}
              {c.priceLabel ? (
                <p className="mb-1 text-[13px] tracking-[0.12em] text-cream/75">
                  {tr(c.priceLabel)}
                </p>
              ) : null}
              <p className="font-serif-jp text-[22px] tracking-[0.08em] text-cream sm:text-[26px]">
                {isJa ? (
                  <>
                    <span className="md:hidden">{c.priceMainMobile}</span>
                    <span className="hidden md:inline">{c.priceMain}</span>
                  </>
                ) : (
                  c.priceMainMobile
                )}
              </p>
              <p className="mt-1 text-[13px] tracking-[0.08em] text-cream/80 sm:text-[14px]">
                {isJa ? (
                  <>
                    <span className="md:hidden">{c.priceTaxNoteMobile}</span>
                    <span className="hidden md:inline">{c.priceTaxNote}</span>
                  </>
                ) : (
                  c.priceTaxNoteMobile
                )}
              </p>
              {c.altPrice ? (
                <div className="mt-4">
                  <p className="mb-1 text-[13px] tracking-[0.12em] text-cream/75">
                    {tr(c.altPrice.label)}
                  </p>
                  <p className="font-serif-jp text-[20px] tracking-[0.08em] text-cream sm:text-[24px]">
                    {isJa ? (
                      <>
                        <span className="md:hidden">{c.altPrice.mainMobile}</span>
                        <span className="hidden md:inline">{c.altPrice.main}</span>
                      </>
                    ) : (
                      c.altPrice.mainMobile
                    )}
                  </p>
                  <p className="mt-1 text-[13px] tracking-[0.08em] text-cream/80 sm:text-[14px]">
                    {isJa ? (
                      <>
                        <span className="md:hidden">{c.altPrice.taxNoteMobile}</span>
                        <span className="hidden md:inline">{c.altPrice.taxNote}</span>
                      </>
                    ) : (
                      c.altPrice.taxNoteMobile
                    )}
                  </p>
                </div>
              ) : null}
            </div>

            <ul className="font-serif-jp divide-y divide-cream/10">
              {c.dishes.map((dish) => (
                <li key={`${dish.name}-${dish.note ?? ""}`} className="py-3.5 sm:py-4">
                  {dish.nameMobileLines ? (
                    <>
                      <p className="text-[15px] leading-[1.7] tracking-[0.06em] text-cream md:hidden sm:text-[16px]">
                        <span className="block">{tr(dish.nameMobileLines[0])}</span>
                        <span className="block">{tr(dish.nameMobileLines[1])}</span>
                      </p>
                      <p className="hidden text-[15px] leading-[1.7] tracking-[0.06em] text-cream md:block sm:text-[16px]">
                        {trName(dish.name)}
                      </p>
                      {dish.note ? (
                        <p
                          className={`mt-1 leading-[1.6] tracking-[0.04em] ${
                            dish.emphasizeNote
                              ? "text-[16px] text-cream sm:text-[18px]"
                              : "text-[12px] text-cream/70 sm:text-[13px]"
                          }`}
                        >
                          {tr(dish.note)}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <p className="text-[15px] leading-[1.7] tracking-[0.06em] text-cream sm:text-[16px]">
                        {trName(dish.name)}
                      </p>
                      {dish.note ? (
                        <p
                          className={`mt-1 leading-[1.6] tracking-[0.04em] ${
                            dish.emphasizeNote
                              ? "text-[16px] text-cream sm:text-[18px]"
                              : "text-[12px] text-cream/70 sm:text-[13px]"
                          }`}
                        >
                          {tr(dish.note)}
                        </p>
                      ) : null}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop: tategaki columns */}
          <div className={`hidden min-w-0 flex-1 xl:overflow-x-auto xl:overflow-y-visible ${isJa ? "xl:block" : ""}`}>
            <div className="flex w-max min-w-full justify-end">
              <div className="font-serif-jp flex flex-row-reverse items-start gap-2 text-cream min-[1440px]:gap-5">
                <Heading
                  className="shrink-0 text-[28px] font-normal tracking-[0.32em] text-cream min-[1440px]:text-[34px] min-[1440px]:tracking-[0.4em]"
                  style={verticalTextStyle}
                >
                  {c.nameTategakiLead ? trName(c.nameTategakiLead) : trName(c.name)}
                  {c.nameTategakiRest ? (
                    <span className="text-[18px] tracking-[0.14em] min-[1440px]:text-[22px] min-[1440px]:tracking-[0.18em]">
                      {tr(c.nameTategakiRest)}
                    </span>
                  ) : null}
                </Heading>

                {c.subtitle ? (
                  <div className="flex w-10 shrink-0 justify-center bg-wipe min-[1440px]:w-12">
                    <p
                      className="py-5 text-[14px] leading-[1.85] tracking-[0.12em] text-black min-[1440px]:py-6 min-[1440px]:text-[16px] min-[1440px]:leading-[1.9] min-[1440px]:tracking-[0.14em]"
                      style={verticalTextStyle}
                    >
                      {tr(c.subtitle)}
                    </p>
                  </div>
                ) : null}

                <p
                  className="ml-6 shrink-0 leading-[1.45] min-[1440px]:ml-10 min-[1440px]:leading-[1.5] min-[1536px]:ml-12"
                  style={verticalTextStyle}
                >
                  {c.priceLabel ? (
                    <>
                      <span className="text-[12px] tracking-[0.1em] text-cream/75 min-[1440px]:text-[14px] min-[1440px]:tracking-[0.12em]">
                        {tr(c.priceLabel)}
                      </span>
                      <br />
                    </>
                  ) : null}
                  <span className="text-[24px] tracking-[0.08em] text-cream min-[1440px]:text-[28px] min-[1440px]:tracking-[0.1em]">
                    {c.priceMain}
                  </span>
                  <br />
                  <span className="text-[12px] tracking-[0.1em] text-cream/85 min-[1440px]:text-[14px] min-[1440px]:tracking-[0.12em]">
                    {c.priceTaxNote}
                  </span>
                  {c.altPrice ? (
                    <>
                      <br />
                      <span className="text-[12px] tracking-[0.1em] text-cream/75 min-[1440px]:text-[14px] min-[1440px]:tracking-[0.12em]">
                        {tr(c.altPrice.label)}
                      </span>
                      <br />
                      <span className="text-[20px] tracking-[0.08em] text-cream min-[1440px]:text-[24px] min-[1440px]:tracking-[0.1em]">
                        {c.altPrice.main}
                      </span>
                      <br />
                      <span className="text-[12px] tracking-[0.1em] text-cream/85 min-[1440px]:text-[14px] min-[1440px]:tracking-[0.12em]">
                        {c.altPrice.taxNote}
                      </span>
                    </>
                  ) : null}
                </p>

                {c.dishes.map((dish) => (
                  <p
                    key={`${dish.name}-${dish.note ?? ""}`}
                    className="shrink-0 leading-[1.85] tracking-[0.14em] min-[1440px]:leading-[2] min-[1440px]:tracking-[0.18em]"
                    style={verticalTextStyle}
                  >
                    <span className="text-[16px] text-cream min-[1440px]:text-[18px] min-[1536px]:text-[20px]">
                      {trName(dish.name)}
                    </span>
                    {dish.note ? (
                      <span
                        className={
                          dish.emphasizeNote
                            ? "text-[16px] tracking-[0.06em] text-cream min-[1440px]:text-[18px] min-[1440px]:tracking-[0.08em] min-[1536px]:text-[20px]"
                            : "text-[12px] tracking-[0.06em] text-cream/80 min-[1440px]:text-[14px] min-[1440px]:tracking-[0.08em]"
                        }
                      >
                        {"　"}
                        {tr(dish.note)}
                      </span>
                    ) : null}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center xl:mt-6 xl:justify-end">
            <ReserveButton
              courseId={course.id}
              className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] tracking-[0.14em] hover:bg-wipe hover:text-cream sm:w-auto sm:min-w-[280px]"
            />
          </div>
        </div>
      </div>

      {nextCourseHref ? (
        <a
          href={nextCourseHref}
          className="mt-10 flex min-h-11 items-center justify-center text-[22px] leading-none text-cream/80 transition-colors hover:text-cream sm:mt-12 sm:text-[26px]"
          aria-label={t(copy.coursePage.next)}
        >
          ▽
        </a>
      ) : null}
    </article>
  );
}

/** @deprecated Use CourseDetail with executiveCourse */
export function ExecutiveCourse() {
  return <CourseDetail course={executiveCourse} headingAs="h1" />;
}
