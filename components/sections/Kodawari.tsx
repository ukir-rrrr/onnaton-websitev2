"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  aguFeature,
  dashiFeature,
  ishigakiFeature,
  okinawaFoodFeature,
  type KodawariFeature,
} from "@/lib/content/kodawari";
import { MultilineText } from "@/components/i18n/MultilineText";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

const kodawariFeatures: KodawariFeature[] = [
  aguFeature,
  ishigakiFeature,
  dashiFeature,
  okinawaFoodFeature,
];

function KodawariFeatureBlock({
  feature,
  fadeUp,
  reduceMotion,
}: {
  feature: KodawariFeature;
  fadeUp: (delay?: number) => object;
  reduceMotion: boolean;
}) {
  const { tr } = useT();
  const aspectClass = feature.imageAspectClass ?? "aspect-[5/3]";
  const imageClass = feature.imageClassName ?? "object-cover object-center";

  return (
    <div className="mb-16 grid grid-cols-1 items-center gap-10 sm:mb-20 sm:gap-12 lg:mb-24 xl:grid-cols-[minmax(0,720px)_1fr] xl:gap-16">
      <motion.div
        className={`relative mx-auto ${aspectClass} w-full max-w-[720px] overflow-hidden rounded-sm xl:mx-0`}
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.08 }}
          whileInView={reduceMotion ? undefined : { scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease }}
        >
          <Image
            src={feature.photo}
            alt={tr(feature.photoAlt)}
            fill
            sizes="(min-width: 1280px) 720px, 100vw"
            unoptimized
            className={imageClass}
          />
        </motion.div>
      </motion.div>

      <div>
        <motion.p
          className="font-serif-jp mb-3 text-[13px] tracking-[0.28em] text-gold"
          {...fadeUp(0)}
        >
          {feature.num}
        </motion.p>
        <motion.h3
          className={`font-serif-jp text-[22px] font-normal leading-[1.7] tracking-[0.06em] text-cream sm:text-[28px] xl:text-[30px] ${
            feature.highlights?.length ? "mb-3 sm:mb-4" : "mb-8 sm:mb-10"
          }`}
          {...fadeUp(0.08)}
        >
          {feature.heading.map((line) => (
            <span key={line} className="block">
              {tr(line)}
            </span>
          ))}
        </motion.h3>

        {feature.highlights && feature.highlights.length > 0 ? (
          <motion.div
            className="mb-8 flex flex-wrap gap-2.5 sm:mb-10 sm:gap-3"
            {...fadeUp(0.12)}
          >
            {feature.highlights.map(({ label }) => (
              <span
                key={label}
                className="inline-flex border border-gold/45 bg-ink-raised/80 px-3.5 py-2 text-center sm:px-4 sm:py-2.5"
              >
                <span className="font-serif-jp text-[12px] tracking-[0.1em] text-gold-deep sm:text-[13px]">
                  {tr(label)}
                </span>
              </span>
            ))}
          </motion.div>
        ) : null}

        <motion.div
          className="font-serif-jp space-y-6 text-[16px] leading-[2.2] tracking-[0.04em] text-cream/90 sm:space-y-7 sm:text-[18px] sm:leading-[2.35]"
          {...fadeUp(feature.highlights?.length ? 0.16 : 0.16)}
        >
          {feature.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              <MultilineText text={tr(paragraph)} />
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function Kodawari() {
  const { t, tr } = useT();
  const reduceMotion = useReducedMotion() === true;

  const fadeUp = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.9, delay, ease },
        };

  return (
    <section
      id="kodawari"
      className="scroll-mt-24 w-full px-6 pb-24 sm:px-10 sm:pb-32 lg:px-14 lg:pb-[200px]"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease }}
      >
        <SectionEyebrow
          eyebrow="OUR COMMITMENT"
          heading={t(copy.kodawari.heading)}
          className="mb-16 sm:mb-20 lg:mb-24"
        />
      </motion.div>

      {kodawariFeatures.map((feature) => (
        <KodawariFeatureBlock
          key={feature.num}
          feature={feature}
          fadeUp={fadeUp}
          reduceMotion={reduceMotion}
        />
      ))}

    </section>
  );
}
