"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { sceneList } from "@/lib/content/scenes";
import { MultilineText } from "@/components/i18n/MultilineText";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Scenes() {
  const { t, tr, isJa } = useT();
  const reduceMotion = useReducedMotion() === true;
  const isMobile = useIsMobile();

  return (
    <section className="w-full px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14 lg:pt-[120px] lg:pb-[200px]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease }}
      >
        <SectionEyebrow eyebrow="SCENE" heading={t(copy.scenes.heading)} className="mb-16 sm:mb-20" />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4"
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
        {sceneList.map((scene) => (
          <motion.div
            key={scene.title}
            className="relative h-[320px] overflow-hidden rounded-sm sm:h-[380px] xl:h-[420px]"
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: isMobile
                      ? { opacity: 0 }
                      : { opacity: 0, y: 32 },
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
              transition={{ duration: isMobile ? 0.6 : 1.25, ease }}
            >
              <Image
                src={scene.photo}
                alt={tr(scene.title)}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                quality={90}
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-40% to-black/85" />
            <motion.div
              className="absolute inset-x-6 bottom-6"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.75, delay: isMobile ? 0.05 : 0.2, ease }}
            >
              <h3 className="font-serif-jp mb-2 min-w-0 break-words text-lg font-semibold text-on-dark sm:text-[19px]">
                {tr(scene.title)}
              </h3>
              <p className="min-h-[2lh] text-[13px] leading-[1.7] text-on-dark/80 sm:text-[13px]">
                <span className="sm:hidden">
                  <MultilineText
                    text={tr(isJa && scene.descMobile ? scene.descMobile : scene.desc)}
                    keepAll={false}
                  />
                </span>
                <span className="hidden sm:inline">{tr(scene.desc)}</span>
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
