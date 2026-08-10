"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { kodawariList } from "@/lib/content/kodawari";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

const ease = [0.22, 1, 0.36, 1] as const;

export function Kodawari() {
  const reduceMotion = useReducedMotion() === true;

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
          heading="当店のこだわり"
          className="mb-16 sm:mb-20 lg:mb-24"
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12 },
          },
        }}
      >
        {kodawariList.map((item) => (
          <motion.div
            key={item.num}
            className="flex flex-col"
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
            <div className="mb-7 h-[260px] overflow-hidden rounded-sm sm:h-[300px] lg:h-[340px]">
              {item.photo ? (
                <motion.div
                  className="h-full w-full"
                  initial={reduceMotion ? false : { scale: 1.1 }}
                  whileInView={reduceMotion ? undefined : { scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 1.25, ease }}
                >
                  <Image
                    src={item.photo}
                    alt={item.title}
                    width={480}
                    height={340}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    quality={90}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    background:
                      "repeating-linear-gradient(135deg,#211d19,#211d19 14px,#262119 14px,#262119 28px)",
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
            <h3 className="font-serif-jp mb-4 text-[19px] font-normal tracking-[0.1em] text-cream sm:text-[20px]">
              {item.title}
            </h3>
            <p className="font-serif-jp text-[14px] leading-[2.15] tracking-[0.04em] text-cream/72">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
