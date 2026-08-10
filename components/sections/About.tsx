"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { photos } from "@/lib/content/photos";

const ease = [0.22, 1, 0.36, 1] as const;

export function About() {
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
            コンセプト
          </motion.p>
        </div>
        <div className="max-w-[420px] lg:pt-6">
          <motion.p
            className="font-serif-jp text-base leading-[2.9] text-cream"
            {...fadeLeft(0.18)}
          >
            良いものには、それだけの理由がある。
          </motion.p>
          <motion.p
            className="font-serif-jp text-base leading-[2.9] text-cream"
            {...fadeLeft(0.3)}
          >
            沖縄の恵みを、恩納豚だけの出汁で。
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
            alt="店内"
            fill
            sizes="100vw"
            quality={90}
            className="object-cover brightness-[0.65]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/55" />

        <motion.span
          className="font-sans-jp absolute left-5 top-10 hidden text-[14px] font-bold tracking-[0.45em] text-cream sm:left-11 sm:top-20 sm:block sm:text-[15px]"
          style={{ writingMode: "vertical-rl" }}
          {...fade(0.35)}
        >
          Concept
        </motion.span>

        <div className="absolute inset-x-6 bottom-8 sm:inset-x-16 sm:bottom-16 lg:left-[120px] lg:right-auto lg:bottom-[120px] lg:max-w-[1100px]">
          <motion.p
            className="font-serif-jp mb-3 text-2xl font-bold text-cream sm:mb-4 sm:text-3xl lg:text-[42px]"
            {...fadeUp(0.2)}
          >
            沖縄の恵みを、極上のしゃぶしゃぶで。
          </motion.p>
          <motion.p
            className="text-[13px] tracking-[0.02em] text-cream/75 sm:text-sm"
            {...fadeUp(0.35)}
          >
            Okinawa&apos;s finest ingredients, served as exquisite shabu-shabu.
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
        <div className="order-2 lg:order-1">
          <motion.p
            className="mb-6 text-[13px] tracking-[0.28em] text-gold sm:mb-8 sm:text-[18px]"
            {...fadeUp(0)}
          >
            恩納豚について
          </motion.p>

          <motion.h3
            className="font-serif-jp mb-10 text-[20px] font-medium leading-[2] tracking-[0.04em] text-cream sm:mb-12 sm:text-[28px] sm:leading-[2.05] lg:text-[32px]"
            {...fadeUp(0.1)}
          >
            あぐー豚と特選石垣牛。沖縄が誇る二大名産を
            <br className="hidden sm:block" />
            数日間熟成させた恩納豚オリジナルの出汁でいただく
            <br className="hidden sm:block" />
            唯一無二のしゃぶしゃぶ専門店です。
          </motion.h3>

          <motion.div {...fadeUp(0.2)}>
            <div className="font-serif-jp space-y-8 text-[14px] font-normal leading-[2.35] tracking-[0.04em] text-cream/80 sm:text-[16px] sm:leading-[2.5]">
              <p>
                あぐー豚や特選石垣牛は、通常のお肉に比べて甘みと旨みが際立ちます。
                その味わいに負けないよう、当店では数日間熟成させたコクのある
                オリジナルの出汁をご用意しました。
                <br className="hidden sm:block" />
                ポン酢やごまだれではなく、この出汁と共に味わうことで肉本来の旨さをより引き出します。
              </p>
              <p>
                使用する食材の約95%は沖縄県産。沖縄県農林水産部が推奨する
                <br className="hidden sm:block" />
                「おきなわ食材の店」にも認定されています。
              </p>
              <p>
                良いものをお出しするには、それだけの手間と時間がかかります。
                <br className="hidden sm:block" />
                その一皿の背景にある想いごと、味わっていただければ幸いです。
              </p>
            </div>
            <p className="font-serif-jp mt-12 text-left text-[14px] tracking-[0.18em] text-cream sm:mt-14 sm:text-[15px]">
              恩納豚　店主
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
              alt="恩納豚について"
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
