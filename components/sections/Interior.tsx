"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { photos } from "@/lib/content/photos";
import { interiorFacts } from "@/lib/content/store";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Interior() {
  const { t, tr } = useT();
  const reduceMotion = useReducedMotion() === true;
  const isMobile = useIsMobile();

  return (
    <section id="interior" className="scroll-mt-24 w-full px-6 pb-24 sm:px-10 sm:pb-32 lg:px-14 lg:pb-[200px]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease }}
      >
        <SectionEyebrow eyebrow="INTERIOR & SEATS" heading={t(copy.interior.heading)} className="mb-16 sm:mb-20" />
      </motion.div>

      <motion.div
        className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: isMobile ? 0.1 : 0.14 },
          },
        }}
      >
        {[
          { src: photos.interiorTatami, alt: t(copy.interior.tatami) },
          { src: photos.interiorTable, alt: t(copy.interior.table) },
        ].map((photo) => (
          <motion.div
            key={photo.alt}
            className="relative h-[320px] overflow-hidden rounded-sm sm:h-[420px] lg:h-[520px]"
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: isMobile
                      ? { opacity: 0 }
                      : { opacity: 0, y: 28 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: isMobile ? 0.55 : 0.9,
                        ease,
                      },
                    },
                  }
            }
          >
            <motion.div
              className="absolute inset-0"
              initial={
                reduceMotion
                  ? false
                  : isMobile
                    ? { opacity: 0 }
                    : { scale: 1.1 }
              }
              whileInView={
                reduceMotion
                  ? undefined
                  : isMobile
                    ? { opacity: 1 }
                    : { scale: 1 }
              }
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: isMobile ? 0.6 : 1.3, ease }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                quality={90}
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-col gap-8 rounded-sm bg-ink-raised p-8 sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-12"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, delay: 0.1, ease }}
      >
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {interiorFacts.map((fact) => (
            <div key={fact.label}>
              <p className="mb-2.5 text-[13px] text-cream/50">{tr(fact.label)}</p>
              <p className="text-[15px] text-cream sm:text-base">{tr(fact.value)}</p>
            </div>
          ))}
        </div>

        <Link
          href="/seats"
          className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-3 self-stretch border border-cream/55 px-5 py-3 text-[13px] font-medium tracking-[0.28em] text-cream transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold sm:gap-4 sm:self-end sm:px-7 sm:py-3.5 sm:text-[12px] lg:self-center"
        >
          VIEW MORE
          <span
            aria-hidden
            className="text-[13px] transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
