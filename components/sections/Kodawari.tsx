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
  const wrapperClass = feature.imageWrapperClassName ?? "max-w-[720px]";
  const imageSizes =
    feature.imageSizes ?? "(min-width: 1280px) 720px, 100vw";

  return (
    <div className="mb-16 grid min-w-0 grid-cols-1 items-start gap-10 sm:mb-20 sm:gap-12 lg:mb-24 xl:grid-cols-[minmax(0,720px)_1fr] xl:gap-16">
      <div className={`mx-auto w-full ${wrapperClass} xl:mx-0`}>
        <motion.div
          className={`relative ${aspectClass} w-full overflow-hidden rounded-sm`}
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
              sizes={imageSizes}
              unoptimized
              className={imageClass}
            />
          </motion.div>
        </motion.div>

        {feature.photoMark ? (
          <motion.div
            className="mt-4 flex justify-center sm:mt-5"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, delay: 0.12, ease }}
          >
            <Image
              src={feature.photoMark}
              alt={tr(feature.photoMarkAlt ?? "")}
              width={320}
              height={140}
              unoptimized
              className="h-auto w-auto max-w-[240px] object-contain object-center sm:max-w-[280px] lg:max-w-[320px]"
            />
          </motion.div>
        ) : null}
      </div>

      <div className="min-w-0 max-w-full">
        <motion.p
          className="font-serif-jp mb-3 text-[13px] tracking-[0.28em] text-gold-ink"
          {...fadeUp(0)}
        >
          {feature.num}
        </motion.p>
        <motion.h3
          className={`font-serif-jp max-w-full break-words text-[19px] font-normal leading-[1.75] tracking-[0.04em] text-cream sm:text-[22px] sm:leading-[1.7] sm:tracking-[0.06em] xl:text-[30px] ${
            feature.highlights?.length ? "mb-3 sm:mb-4" : "mb-8 sm:mb-10"
          }`}
          {...fadeUp(0.08)}
        >
          {feature.heading.map((line) => (
            <span key={line} className="block max-w-full break-words">
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
                className="inline-flex max-w-full border border-gold/45 bg-ink-raised/80 px-3.5 py-2 text-center sm:px-4 sm:py-2.5"
              >
                <span className="font-serif-jp break-words text-[12px] tracking-[0.08em] text-gold-ink sm:text-[13px] sm:tracking-[0.1em]">
                  {tr(label)}
                </span>
              </span>
            ))}
          </motion.div>
        ) : null}

        <motion.div
          className="font-serif-jp max-w-full space-y-6 break-words text-[16px] leading-[2.2] tracking-[0.04em] text-cream/90 sm:space-y-7 sm:text-[18px] sm:leading-[2.35]"
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
      className="scroll-mt-24 w-full min-w-0 overflow-x-clip px-6 pb-24 sm:px-10 sm:pb-32 lg:px-14 lg:pb-[200px]"
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
