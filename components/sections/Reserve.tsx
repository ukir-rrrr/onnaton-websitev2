"use client";

import Image from "next/image";
import { photos } from "@/lib/content/photos";
import { MultilineText } from "@/components/i18n/MultilineText";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

function PolicyCard({
  id,
  heading,
  lead,
  paragraphs,
  note,
  closing,
}: {
  id: string;
  heading: string;
  lead: string;
  paragraphs: readonly string[];
  note?: string;
  closing?: string;
}) {
  return (
    <article
      id={id}
      className="scroll-mt-24 min-w-0 rounded-sm border border-cream/10 bg-ink-raised px-6 py-10 sm:px-12 sm:py-14"
    >
      <h3 className="font-serif-jp mb-6 text-center text-[24px] font-normal tracking-[0.12em] text-cream sm:mb-8 sm:text-[28px] xl:text-[30px]">
        {heading}
      </h3>
      <p className="font-serif-jp mb-8 text-[16px] leading-[2.05] tracking-[0.04em] text-cream sm:mb-10 sm:text-[18px] sm:leading-[2.15]">
        <MultilineText text={lead} keepAll={false} />
      </p>
      <div className="font-serif-jp space-y-6 text-[16px] leading-[2.1] tracking-[0.04em] text-cream/80 sm:space-y-7 sm:text-[18px] sm:leading-[2.2]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>
            <MultilineText text={paragraph} keepAll={false} />
          </p>
        ))}
      </div>
      {note ? (
        <p className="mt-8 text-[15px] leading-[2.05] tracking-[0.04em] text-cream/60 sm:mt-10 sm:text-[16px] sm:leading-[2.15]">
          ※<MultilineText text={note} keepAll={false} />
        </p>
      ) : null}
      {closing ? (
        <p className="mt-6 text-[16px] leading-[2.05] tracking-[0.04em] text-cream/85 sm:text-[17px] sm:leading-[2.15]">
          <MultilineText text={closing} keepAll={false} />
        </p>
      ) : null}
    </article>
  );
}

export function Reserve() {
  const { t } = useT();
  return (
    <section id="reserve" className="scroll-mt-24">
      <div className="relative min-h-[560px] w-full overflow-hidden text-center sm:aspect-[19/10] sm:min-h-0 sm:max-h-[90vh]">
        <Image
          src={photos.reservation01}
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-16 sm:px-10 lg:px-14">
          <SectionEyebrow
            eyebrow="RESERVATION"
            heading={t(copy.reserveSection.heading)}
            className="mb-8"
            tone="onDark"
          />

          <p className="mx-auto mb-6 max-w-[720px] text-[14px] leading-[2] text-on-dark/80 sm:mb-8 sm:text-base">
            <MultilineText text={t(copy.reserveSection.body)} />
          </p>
          <div className="mx-auto mb-8 max-w-[720px] sm:mb-10">
            <p className="text-[13px] leading-[1.9] tracking-[0.04em] text-gold sm:text-[14px]">
              <MultilineText text={t(copy.children.lead)} />
            </p>
            <a
              href="#children"
              className="mt-1 inline-flex min-h-11 items-center text-[12px] tracking-[0.06em] text-on-dark/55 underline-offset-4 transition-colors hover:text-gold hover:underline sm:text-[13px]"
            >
              {t(copy.children.more)} →
            </a>
          </div>
          <ReserveButton
            variant="outline"
            className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] sm:min-w-[320px] sm:w-auto sm:px-16"
          />
          <p className="mt-6 text-[12px] tracking-[0.04em] text-on-dark/55 sm:text-[13px]">
            {t(copy.hero.note)}
          </p>
        </div>
      </div>

      <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <div className="mx-auto flex w-full min-w-0 max-w-[42rem] flex-col gap-8 sm:gap-10 xl:max-w-[46rem]">
          <PolicyCard
            id="children"
            heading={t(copy.children.heading)}
            lead={t(copy.children.lead)}
            paragraphs={[
              t(copy.children.p1),
              t(copy.children.p2),
            ]}
            note={t(copy.children.note)}
            closing={t(copy.children.closing)}
          />
          <PolicyCard
            id="tattoo"
            heading={t(copy.tattoo.heading)}
            lead={t(copy.tattoo.lead)}
            paragraphs={[t(copy.tattoo.p1)]}
          />
          <PolicyCard
            id="fragrance"
            heading={t(copy.fragrance.heading)}
            lead={t(copy.fragrance.lead)}
            paragraphs={[t(copy.fragrance.p1)]}
          />
        </div>
      </div>
    </section>
  );
}
