"use client";

import {
  executiveCourse,
  type CourseMenuData,
} from "@/lib/content/executiveCourse";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

/**
 * Mobile / tablet: horizontal (yokogaki) dish list.
 * xl+ (Japanese): paper-menu tategaki columns — centered now that photos are removed.
 *
 * Apply `writing-mode: vertical-rl` to each text leaf only, never on the flex row.
 */
const verticalTextStyle = {
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  fontFeatureSettings: '"vert", "vpal"',
  fontFamily: "var(--font-brush-jp)",
} as const;

const verticalDisplayStyle = {
  ...verticalTextStyle,
  fontFamily: "var(--font-brush-display-jp)",
} as const;

const dishNameClass =
  "text-[15px] leading-[1.7] tracking-[0.06em] text-cream sm:text-[16px]";

const dishNameTategakiClass =
  "text-[17px] text-cream min-[1440px]:text-[19px] min-[1536px]:text-[21px]";

const horizontalTextStyle = {
  writingMode: "horizontal-tb",
  textOrientation: "mixed",
} as const;

function CourseBadge({
  label,
  tail,
}: {
  label: string;
  tail?: string;
}) {
  const { tr } = useT();
  return (
    <span className="inline-block bg-gold px-4 py-1.5 text-[17px] font-medium tracking-[0.08em] text-ink sm:px-5 sm:py-2 sm:text-[18px]">
      {tr(label)}
      {tail ? (
        <>
          {" "}
          {tail}
        </>
      ) : null}
    </span>
  );
}

function CourseBadgeTategaki({
  label,
  tail,
}: {
  label: string;
  tail?: string;
}) {
  const { tr } = useT();
  const textClass =
    "text-[17px] font-medium leading-[1.85] tracking-[0.12em] text-ink min-[1440px]:text-[18px] min-[1440px]:leading-[1.9] min-[1440px]:tracking-[0.14em]";

  return (
    <div className="flex flex-col items-center gap-2 min-[1440px]:gap-2.5">
      <p className={textClass} style={verticalDisplayStyle}>
        {tr(label)}
      </p>
      {tail ? (
        <p
          className={`${textClass} whitespace-nowrap tracking-[0.04em]`}
          style={{
            ...horizontalTextStyle,
            fontFamily: "var(--font-brush-display-jp)",
          }}
        >
          {tail}
        </p>
      ) : null}
    </div>
  );
}

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

  return (
    <article
      id={id}
      className="scroll-mt-24 w-full overflow-x-clip border-b border-cream/8 bg-ink py-14 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12 xl:max-w-[1400px] xl:px-16">
        {/* Mobile / tablet: yokogaki */}
        <div className={isJa ? "xl:hidden" : ""}>
          <header className="mb-8 border-b border-cream/10 pb-6 text-center sm:mb-10 sm:pb-8">
            <Heading className="font-serif-jp mb-3 text-[26px] font-normal tracking-[0.2em] text-cream sm:text-[30px]">
              <span className="block">{trName(c.name)}</span>
              {c.nameTategakiRest ? (
                <span className="mt-2 block text-[20px] tracking-[0.12em] text-cream/90 sm:text-[22px]">
                  {tr(c.nameTategakiRest)}
                </span>
              ) : null}
            </Heading>
            {c.badge ? (
              <p className="mb-4">
                <CourseBadge label={c.badge} tail={c.badgeTail} />
              </p>
            ) : null}
            {c.subtitle ? (
              <p className="mx-auto mb-4 text-[15px] leading-[1.8] tracking-[0.06em] text-cream sm:text-[16px]">
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
          </header>

          <ul className="font-serif-jp mx-auto max-w-3xl divide-y divide-cream/10">
            {c.dishes.map((dish) => (
              <li
                key={`${dish.name}-${dish.note ?? ""}`}
                className="py-3.5 text-center sm:py-4"
              >
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
                      <p className={`${dishNameClass} mt-1`}>{tr(dish.note)}</p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className={dishNameClass}>{trName(dish.name)}</p>
                    {dish.note ? (
                      <p className={`${dishNameClass} mt-1`}>{tr(dish.note)}</p>
                    ) : null}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop: tategaki columns (Japanese only) */}
        <div className={`hidden min-w-0 xl:overflow-x-clip ${isJa ? "xl:block" : ""}`}>
          <div className="flex w-full justify-center px-2 sm:px-4">
            <div className="font-serif-jp flex flex-row-reverse items-start gap-3 text-cream min-[1440px]:gap-6 min-[1536px]:gap-8">
              {c.badge ? (
                <div className="flex w-12 shrink-0 items-center justify-center bg-gold py-8 min-[1440px]:w-14 min-[1440px]:py-10 min-[1536px]:py-12">
                  <CourseBadgeTategaki label={c.badge} tail={c.badgeTail} />
                </div>
              ) : null}

              {c.nameTategakiRest ? (
                <div className="flex shrink-0 flex-row-reverse items-start gap-0.5 min-[1440px]:gap-1">
                  <Heading
                    className="text-[30px] font-normal tracking-[0.32em] text-cream min-[1440px]:text-[36px] min-[1440px]:tracking-[0.4em]"
                    style={verticalDisplayStyle}
                  >
                    {trName(c.nameTategakiLead ?? c.name)}
                  </Heading>
                  <p
                    className="text-[19px] tracking-[0.14em] min-[1440px]:text-[24px] min-[1440px]:tracking-[0.18em]"
                    style={verticalDisplayStyle}
                  >
                    {tr(c.nameTategakiRest)}
                  </p>
                </div>
              ) : (
                <Heading
                  className="shrink-0 text-[30px] font-normal tracking-[0.32em] text-cream min-[1440px]:text-[36px] min-[1440px]:tracking-[0.4em]"
                  style={verticalDisplayStyle}
                >
                  {c.nameTategakiLead ? trName(c.nameTategakiLead) : trName(c.name)}
                </Heading>
              )}

              {c.subtitle ? (
                <p
                  className="shrink-0 leading-[1.85] tracking-[0.14em] text-cream min-[1440px]:leading-[2] min-[1440px]:tracking-[0.18em]"
                  style={verticalTextStyle}
                >
                  <span className={dishNameTategakiClass}>{tr(c.subtitle)}</span>
                </p>
              ) : null}

              <p
                className="shrink-0 leading-[1.45] min-[1440px]:leading-[1.5]"
                style={verticalTextStyle}
              >
                {c.priceLabel ? (
                  <>
                    <span className="text-[13px] tracking-[0.1em] text-cream/75 min-[1440px]:text-[15px] min-[1440px]:tracking-[0.12em]">
                      {tr(c.priceLabel)}
                    </span>
                    <br />
                  </>
                ) : null}
                <span className="text-[26px] tracking-[0.08em] text-cream min-[1440px]:text-[30px] min-[1440px]:tracking-[0.1em]">
                  {c.priceMain}
                </span>
                <br />
                <span className="text-[13px] tracking-[0.1em] text-cream/85 min-[1440px]:text-[15px] min-[1440px]:tracking-[0.12em]">
                  {c.priceTaxNote}
                </span>
                {c.altPrice ? (
                  <>
                    <br />
                    <span className="text-[13px] tracking-[0.1em] text-cream/75 min-[1440px]:text-[15px] min-[1440px]:tracking-[0.12em]">
                      {tr(c.altPrice.label)}
                    </span>
                    <br />
                    <span className="text-[22px] tracking-[0.08em] text-cream min-[1440px]:text-[26px] min-[1440px]:tracking-[0.1em]">
                      {c.altPrice.main}
                    </span>
                    <br />
                    <span className="text-[13px] tracking-[0.1em] text-cream/85 min-[1440px]:text-[15px] min-[1440px]:tracking-[0.12em]">
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
                  <span className={dishNameTategakiClass}>
                    {trName(dish.name)}
                  </span>
                  {dish.note ? (
                    <span className={dishNameTategakiClass}>
                      {"　"}
                      {tr(dish.note)}
                    </span>
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12 lg:mt-14">
          <ReserveButton
            courseId={course.id}
            className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] tracking-[0.14em] hover:bg-wipe hover:text-cream sm:w-auto sm:min-w-[280px]"
          />
        </div>
      </div>

      {nextCourseHref ? (
        <a
          href={nextCourseHref}
          className="mt-10 flex min-h-11 items-center justify-center text-[22px] leading-none text-cream/80 transition-colors hover:text-cream sm:mt-14 sm:text-[26px]"
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
