"use client";

import Image from "next/image";
import { photos } from "@/lib/content/photos";
import { seatList, seatsIntro } from "@/lib/content/seats";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

/** Hero: full-bleed interior + title plate + seat type jump links. */
export function SeatsHero() {
  const { t, tr } = useT();
  return (
    <div className="relative w-full">
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden sm:h-[62vh] sm:min-h-[440px]">
        <Image
          src={photos.interiorTatami}
            alt={t(copy.interior.heading)}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover brightness-[0.72]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-ink" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <div className="bg-black/55 px-10 py-4 sm:px-16 sm:py-5">
            <h1 className="font-serif-jp text-[24px] tracking-[0.2em] text-on-dark sm:text-[28px] lg:text-[32px]">
              {t(copy.seatsPage.heading)}
            </h1>
          </div>

          <nav
            aria-label={t(copy.seatsPage.navAria)}
            className="mt-6 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2.5 sm:mt-8 sm:gap-3"
          >
            {seatList.map((seat) => (
              <a
                key={seat.id}
                href={`#${seat.id}`}
                className="inline-flex min-h-11 items-center gap-2 bg-ink-raised/95 px-4 py-3 text-[15px] tracking-[0.08em] text-cream transition-colors hover:bg-gold hover:text-on-dark sm:px-5 sm:text-[16px]"
              >
                {tr(seat.navLabel)}
                <span aria-hidden className="text-[12px] opacity-70">
                  ∨
                </span>
              </a>
            ))}
            <a
              href="#interior-gallery"
              className="inline-flex min-h-11 items-center gap-2 bg-ink-raised/95 px-4 py-3 text-[15px] tracking-[0.08em] text-cream transition-colors hover:bg-gold hover:text-on-dark sm:px-5 sm:text-[16px]"
            >
              {t(copy.seatsPage.galleryCta)}
              <span aria-hidden className="text-[12px] opacity-70">
                ∨
              </span>
            </a>
          </nav>
        </div>
      </div>

      <div className="bg-ink px-6 pb-10 text-center sm:px-10 sm:pb-12 lg:px-14">
        <p className="font-serif-jp mx-auto max-w-3xl text-[16px] leading-[2.15] tracking-[0.04em] text-cream/88 sm:text-[18px] sm:leading-[2.3]">
          {tr(seatsIntro)}
        </p>
        <div className="mx-auto mt-12 h-px w-16 bg-gold/50 sm:mt-14" />
      </div>
    </div>
  );
}
