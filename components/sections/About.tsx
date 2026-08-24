"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { photos } from "@/lib/content/photos";
import { MultilineText } from "@/components/i18n/MultilineText";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function About() {
  const { t } = useT();
  const reduceMotion = useReducedMotion() === true;

  const fadeUp = (delay = 0) =>
    reduceMotion
      ? {}
      : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.9, delay, ease },
      };

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 1, delay, ease },
      };

  const fadeLeft = (delay = 0) =>
    reduceMotion
      ? {}
      : {
        initial: { opacity: 0, x: 24 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.85, delay, ease },
      };

  return (
    <section id="about" className="scroll-mt-24 w-full pt-24 sm:pt-32 lg:pt-[140px]">
      <div className="mb-16 flex flex-col justify-between gap-8 px-6 sm:mb-20 sm:px-10 lg:mb-24 lg:flex-row lg:items-start lg:px-14">
        <div>
          <motion.h2
            className="font-serif text-5xl font-bold italic tracking-[0.01em] text-cream sm:text-7xl lg:text-[76px]"
            {...fadeUp(0)}
          >
            Concept
          </motion.h2>
          <motion.p
            className="mt-3.5 text-[13px] tracking-[0.2em] text-cream/55"
            {...fadeUp(0.12)}
          >
            {t(copy.about.conceptJa)}
          </motion.p>
        </div>
        <div className="max-w-[420px] lg:pt-6">
          <motion.p
            className="font-serif-jp text-lg leading-[2.9] text-cream"
            {...fadeLeft(0.18)}
          >
            {t(copy.about.line1)}
          </motion.p>
          <motion.p
            className="font-serif-jp text-lg leading-[2.9] text-cream"
            {...fadeLeft(0.3)}
          >
            {t(copy.about.line2)}
          </motion.p>
        </div>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden sm:h-[520px] lg:h-[680px]">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.08 }}
          whileInView={reduceMotion ? undefined : { scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.4, ease }}
        >
          <Image
            src={photos.interiorKaiseki}
            alt={t(copy.about.interiorAlt)}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover brightness-[0.65]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/55" />

        <motion.span
          className="font-sans-jp absolute left-5 top-10 hidden text-[14px] font-bold tracking-[0.45em] text-on-dark sm:left-11 sm:top-20 sm:block sm:text-[15px]"
          style={{ writingMode: "vertical-rl" }}
          {...fade(0.35)}
        >
          Concept
        </motion.span>

        <div className="absolute inset-x-6 bottom-8 sm:inset-x-16 sm:bottom-16 lg:left-[120px] lg:right-auto lg:bottom-[120px] lg:max-w-[1100px]">
          <motion.p
            className="font-serif-jp mb-3 text-2xl font-bold text-on-dark sm:mb-4 sm:text-3xl lg:text-[42px]"
            {...fadeUp(0.2)}
          >
            {t(copy.about.overlay)}
          </motion.p>
          <motion.p
            className="text-[13px] tracking-[0.02em] text-on-dark/75 sm:text-sm"
            {...fadeUp(0.35)}
          >
            {t(copy.about.overlayEn)}
          </motion.p>
        </div>

        {/* <motion.a
          href="#about-text"
          className="group absolute bottom-6 right-6 inline-flex items-center gap-3 border border-cream/55 px-5 py-3 text-[11px] font-medium tracking-[0.28em] text-cream transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold sm:bottom-14 sm:right-14 sm:gap-4 sm:px-7 sm:py-3.5 sm:text-[12px]"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
        >
          VIEW MORE
          <span
            aria-hidden
            className="text-[13px] transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </motion.a> */}
      </div>

      <div
        id="about-text"
        className="scroll-mt-24 mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 sm:gap-12 sm:px-10 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-[120px]"
      >
        <div className="order-2 min-w-0 lg:order-1">
          <motion.p
            className="mb-6 text-[13px] tracking-[0.28em] text-gold sm:mb-8 sm:text-[18px]"
            {...fadeUp(0)}
          >
            {t(copy.about.heading)}
          </motion.p>

          <motion.h3
            className="font-serif-jp mb-10 text-[20px] font-medium leading-[2] tracking-[0.04em] text-cream sm:mb-12 sm:text-[28px] sm:leading-[2.05] lg:text-[32px]"
            {...fadeUp(0.1)}
          >
            <MultilineText text={t(copy.about.lead)} keepAll={false} nowrapLastLine />
          </motion.h3>

          <motion.div {...fadeUp(0.2)}>
            <div className="font-serif-jp space-y-8 text-[14px] font-normal leading-[2.35] tracking-[0.04em] text-cream/80 sm:text-[18px] sm:leading-[2.5]">
              <p>{t(copy.about.p1)}</p>
              <p>{t(copy.about.p2)}</p>
              <p>
                <MultilineText text={t(copy.about.p3)} keepAll={false} />
              </p>
              <p>{t(copy.about.p4)}</p>
            </div>
            <p className="font-serif-jp mt-12 text-left text-[14px] tracking-[0.18em] text-cream sm:mt-14 sm:text-[15px]">
              {t(copy.about.chef)}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="relative order-1 mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden lg:order-2 lg:mx-0 lg:max-w-none"
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.15, ease }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { scale: 1.08 }}
            whileInView={reduceMotion ? undefined : { scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.35, ease }}
          >
            <Image
              src={photos.onnatonAbout}
              alt={t(copy.about.photoAlt)}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
