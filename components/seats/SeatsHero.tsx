import Image from "next/image";
import { photos } from "@/lib/content/photos";
import { seatList, seatsIntro } from "@/lib/content/seats";

/** Hero: full-bleed interior + title plate + seat type jump links. */
export function SeatsHero() {
  return (
    <div className="relative w-full">
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden sm:h-[62vh] sm:min-h-[440px]">
        <Image
          src={photos.interiorTatami}
          alt="店内・お席"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.72]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-ink" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <div className="bg-black/55 px-10 py-4 sm:px-16 sm:py-5">
            <h1 className="font-serif-jp text-[24px] tracking-[0.2em] text-cream sm:text-[28px] lg:text-[32px]">
              お席について
            </h1>
          </div>

          <nav
            aria-label="お席の種類"
            className="mt-6 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2.5 sm:mt-8 sm:gap-3"
          >
            {seatList.map((seat) => (
              <a
                key={seat.id}
                href={`#${seat.id}`}
                className="inline-flex min-h-11 items-center gap-2 bg-cream/92 px-4 py-3 text-[13px] tracking-[0.08em] text-ink transition-colors hover:bg-gold hover:text-ink sm:px-5 sm:text-[13px]"
              >
                {seat.navLabel}
                <span aria-hidden className="text-[12px] opacity-70">
                  ∨
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-ink px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-14">
        <p className="font-serif-jp mx-auto max-w-3xl text-[14px] leading-[2.2] tracking-[0.04em] text-cream/85 sm:text-[15px] sm:leading-[2.35]">
          {seatsIntro}
        </p>
        <div className="mx-auto mt-10 h-px w-16 bg-gold/50" />
      </div>
    </div>
  );
}
