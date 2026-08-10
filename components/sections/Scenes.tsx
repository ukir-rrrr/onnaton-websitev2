"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { sceneList } from "@/lib/content/scenes";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

const ease = [0.22, 1, 0.36, 1] as const;

export function Scenes() {
  const reduceMotion = useReducedMotion() === true;

  return (
    <section className="w-full px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14 lg:pt-[120px] lg:pb-[200px]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease }}
      >
        <SectionEyebrow eyebrow="SCENE" heading="ご利用シーン" className="mb-16 sm:mb-20" />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {sceneList.map((scene) => (
          <motion.div
            key={scene.title}
            className="relative h-[320px] overflow-hidden rounded-sm sm:h-[380px] lg:h-[420px]"
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: { opacity: 0, y: 32 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.85, ease },
                    },
                  }
            }
          >
            <motion.div
              className="absolute inset-0"
              initial={reduceMotion ? false : { scale: 1.1 }}
              whileInView={reduceMotion ? undefined : { scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.25, ease }}
            >
              <Image
                src={scene.photo}
                alt={scene.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                quality={90}
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 from-40% to-black/85" />
            <div className="absolute inset-x-6 bottom-6">
              <h3 className="font-serif-jp mb-2 text-lg font-semibold text-cream sm:text-[19px]">
                {scene.title}
              </h3>
              <p className="text-[13px] leading-[1.7] text-cream/80 sm:text-[13px]">
                {scene.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
