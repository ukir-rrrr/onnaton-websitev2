"use client";

import { motion } from "motion/react";
import { MultilineText } from "@/components/i18n/MultilineText";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

export function ReservationBanner() {
  const { t } = useT();
  const notices = [
    copy.reservationBanner.notice1,
    copy.reservationBanner.notice2,
    copy.reservationBanner.notice3,
    copy.reservationBanner.notice4,
    copy.reservationBanner.notice5,
  ];

  return (
    <section className="relative w-full overflow-hidden border-y border-cream/10 bg-ink-raised">
      <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <div className="mb-10 flex flex-col items-center gap-4 sm:mb-12 lg:mb-14">
          <p className="text-base tracking-[0.35em] text-wipe sm:text-[18px]">
            RESERVATION
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden h-9 w-px bg-wipe sm:block" aria-hidden />
            <h2 className="font-display-jp text-center text-[26px] font-medium tracking-[0.1em] text-cream sm:text-[32px] lg:text-[36px]">
              {t(copy.reservationBanner.heading)}
            </h2>
            <span className="hidden h-9 w-px bg-wipe sm:block" aria-hidden />
          </div>
        </div>

        <motion.div
          className="mx-auto max-w-2xl text-center lg:max-w-[42rem]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-serif-jp space-y-5 text-[16px] leading-[2.05] tracking-[0.04em] text-cream/82 sm:space-y-6 sm:text-[18px] sm:leading-[2.15]">
            {notices.map((notice) => (
              <p key={notice.ja}>
                <MultilineText text={t(notice)} />
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 max-w-2xl border-t border-cream/10 pt-10 text-center lg:mt-12 lg:pt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif-jp text-[15px] leading-[1.95] tracking-[0.04em] text-cream/78 sm:text-[16px] sm:leading-[2]">
            <MultilineText text={t(copy.children.lead)} />
          </p>
          <a
            href="/#children"
            className="mt-2 inline-flex min-h-11 items-center text-[14px] tracking-[0.06em] text-gold underline-offset-4 transition-colors hover:text-cream hover:underline sm:mt-3 sm:text-[15px]"
          >
            {t(copy.children.more)} →
          </a>
        </motion.div>

        <motion.div
          className="mx-auto mt-8 flex max-w-5xl justify-center lg:mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <ReserveButton
            variant="outline"
            className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[15px] sm:min-w-[320px] sm:w-auto sm:px-16 sm:text-[16px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
