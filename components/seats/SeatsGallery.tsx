"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { tennaiGallery } from "@/lib/content/seats";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function SeatsGallery() {
  const { t } = useT();
  const reduceMotion = useReducedMotion() === true;

  return (
    <section
      id="interior-gallery"
      className="scroll-mt-24 px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-28"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease }}
      >
        <SectionEyebrow
          eyebrow="INTERIOR"
          heading={t(copy.seatsPage.galleryHeading)}
          className="mb-12 sm:mb-16 lg:mb-20"
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
          },
        }}
      >
        {tennaiGallery.map((shot) => (
          <motion.figure
            key={shot.src}
            className={`group relative col-span-1 overflow-hidden ${shot.className}`}
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, ease },
                    },
                  }
            }
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes={
                shot.className.includes("col-span-12")
                  ? "100vw"
                  : shot.className.includes("col-span-7") ||
                      shot.className.includes("col-span-6")
                    ? "(min-width: 640px) 58vw, 100vw"
                    : shot.className.includes("col-span-4")
                      ? "(min-width: 640px) 33vw, 100vw"
                      : "(min-width: 640px) 42vw, 100vw"
              }
              quality={90}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
