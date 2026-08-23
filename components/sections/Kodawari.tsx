"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  aguFeature,
  ishigakiFeature,
  kodawariList,
  type KodawariFeature,
} from "@/lib/content/kodawari";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

const kodawariGridPlacement = [
  "lg:col-span-2 lg:col-start-2",
  "lg:col-span-2 lg:col-start-4",
] as const;

const kodawariFeatures: KodawariFeature[] = [aguFeature, ishigakiFeature];

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
    <div className="mb-16 grid grid-cols-1 items-center gap-10 sm:mb-20 sm:gap-12 lg:mb-24 lg:grid-cols-[minmax(0,720px)_1fr] lg:gap-16">
      <motion.div
        className={`relative mx-auto ${aspectClass} w-full max-w-[720px] overflow-hidden rounded-sm lg:mx-0`}
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease }}
      >
        <Image
          src={feature.photo}
          alt={tr(feature.photoAlt)}
          fill
          sizes="(min-width: 1024px) 720px, 100vw"
          unoptimized
          className={imageClass}
        />
      </motion.div>

      <div>
        <motion.p
          className="font-serif-jp mb-3 text-[13px] tracking-[0.28em] text-gold"
          {...fadeUp(0)}
        >
          {feature.num}
        </motion.p>
        <motion.h3
          className={`font-serif-jp text-[22px] font-normal leading-[1.7] tracking-[0.06em] text-cream sm:text-[28px] lg:text-[30px] ${
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
          className="font-serif-jp space-y-6 text-[16px] leading-[2.2] tracking-[0.04em] text-cream/75 sm:space-y-7 sm:text-[18px] sm:leading-[2.35]"
          {...fadeUp(feature.highlights?.length ? 0.16 : 0.16)}
        >
          {feature.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              {tr(paragraph).split("\n").map((line, i) => (
                <span key={line}>
                  {i > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
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
  const isMobile = useIsMobile();

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

      <motion.div
        className="grid grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-6 lg:gap-x-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: isMobile ? 0.08 : 0.12 },
          },
        }}
      >
        {kodawariList.map((item, index) => (
          <motion.div
            key={item.num}
            className={`flex flex-col ${kodawariGridPlacement[index] ?? ""}`}
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: isMobile ? { opacity: 0 } : { opacity: 0, y: 32 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: isMobile ? 0.55 : 0.85,
                        ease,
                      },
                    },
                  }
            }
          >
            <div className="mb-7 h-[260px] overflow-hidden rounded-sm sm:h-[300px] lg:h-[340px]">
              {item.photo ? (
                <motion.div
                  className="h-full w-full"
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
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: isMobile ? 0.6 : 1.25,
                    ease,
                  }}
                >
                  <Image
                    src={item.photo}
                    alt={tr(item.title)}
                    width={480}
                    height={340}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    quality={90}
                    className={
                      item.imageClassName ?? "h-full w-full object-cover"
                    }
                  />
                </motion.div>
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    background:
                      "repeating-linear-gradient(135deg,#ddd0b8,#ddd0b8 14px,#e5d9c4 14px,#e5d9c4 28px)",
                  }}
                >
                  <span className="font-mono text-xs tracking-[0.05em] text-cream/45">
                    {item.placeholderLabel}
                  </span>
                </div>
              )}
            </div>

            <p className="font-serif-jp mb-3 text-[13px] tracking-[0.28em] text-gold">
              {item.num}
            </p>
            <h3 className="font-serif-jp mb-4 text-[19px] font-normal tracking-[0.1em] text-cream sm:text-[28px]">
              {tr(item.title)}
            </h3>
            <p className="font-serif-jp text-[16px] leading-[2.15] tracking-[0.04em] text-cream/72 sm:text-[18px] sm:leading-[2.3]">
              {tr(item.desc)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
