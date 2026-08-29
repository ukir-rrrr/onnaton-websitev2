"use client";

import Image from "next/image";
import type { SeatType } from "@/lib/content/seats";
import { useT } from "@/components/i18n/LocaleProvider";

/** Overlapping photo + dark copy panel (reference: Sayaka seats). */
export function SeatDetail({ seat }: { seat: SeatType }) {
  const { tr } = useT();
  const imageLeft = seat.imageLeft;

  return (
    <section id={seat.id} className="scroll-mt-24 px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
      {seat.note ? (
        <p className="mb-8 text-center text-[15px] tracking-[0.04em] text-cream/88 sm:mb-10 sm:text-[16px]">
          {tr(seat.note)}
        </p>
      ) : null}

      <div
        className={`relative mx-auto flex max-w-6xl flex-col ${
          imageLeft ? "xl:flex-row" : "xl:flex-row-reverse"
        } xl:items-center`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden xl:w-[68%]">
          <Image
            src={seat.photo}
            alt={tr(seat.name)}
            fill
            sizes="(min-width: 1280px) 68vw, 100vw"
            className="object-cover"
          />
        </div>

        <div
          className={`relative z-10 w-full bg-black/80 px-7 py-9 sm:px-10 sm:py-12 xl:absolute xl:w-[42%] xl:max-w-md ${
            imageLeft
              ? "xl:right-0 xl:top-1/2 xl:-translate-y-1/2"
              : "xl:left-0 xl:top-1/2 xl:-translate-y-1/2"
          }`}
        >
          <h2 className="font-serif-jp mb-5 text-[24px] tracking-[0.12em] text-on-dark sm:mb-6 sm:text-[26px]">
            {tr(seat.name)}
          </h2>
          <p className="font-serif-jp text-[16px] leading-[2.15] tracking-[0.04em] text-on-dark/90 sm:text-[18px] sm:leading-[2.25]">
            {tr(seat.desc)}
          </p>
        </div>
      </div>
    </section>
  );
}
