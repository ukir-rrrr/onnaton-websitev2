"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { heroSlides } from "@/lib/content/heroSlides";
import {
  CLIP_COVER,
  CLIP_FULL,
  CLIP_OFF_RIGHT,
  WIPE_DURATION,
  WIPE_EASE,
} from "@/lib/motion/diagonalWipe";
import { PageIntro, type IntroPhase } from "@/components/hero/PageIntro";
import { ReserveButton } from "@/components/ui/ReserveButton";

const LOGO_HOLD_MS = 2500;
const SLIDE_INTERVAL_MS = 6000;

export function Hero() {
  const reduceMotion = useReducedMotion() === true;
  const [phase, setPhase] = useState<IntroPhase>("logo");
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const currentRef = useRef(0);
  const effectivePhase: IntroPhase = reduceMotion ? "ready" : phase;

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // ① logo hold → ② wipe in
  useEffect(() => {
    if (reduceMotion || phase !== "logo") return;
    const id = window.setTimeout(() => setPhase("wipeIn"), LOGO_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [phase, reduceMotion]);

  // Block scroll during intro without hiding the scrollbar (avoids layout jump)
  useEffect(() => {
    if (effectivePhase === "ready") return;
    const prevent = (event: Event) => {
      event.preventDefault();
    };
    document.addEventListener("wheel", prevent, { passive: false });
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      document.removeEventListener("wheel", prevent);
      document.removeEventListener("touchmove", prevent);
    };
  }, [effectivePhase]);

  // ④ auto slideshow — start after the copy rises from below
  useEffect(() => {
    if (effectivePhase !== "ready") return;
    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setIncoming((pending) => {
          if (pending !== null) return pending;
          return (currentRef.current + 1) % heroSlides.length;
        });
      }, SLIDE_INTERVAL_MS);
    }, 1200);
    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [effectivePhase]);

  const showHeroMotion =
    effectivePhase === "wipeOut" || effectivePhase === "ready";
  const activeDot = incoming ?? current;
  const showCopy = effectivePhase === "ready";

  return (
    <>
      {effectivePhase !== "ready" && (
        <PageIntro
          phase={effectivePhase}
          onWipeInComplete={() => setPhase("wipeOut")}
          onWipeOutComplete={() => setPhase("ready")}
        />
      )}

      <section
        id="top"
        className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[19/10] sm:max-h-[100vh]"
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ scale: showHeroMotion ? 1 : 1.08 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0">
            <Image
              src={heroSlides[current].src}
              alt={heroSlides[current].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_center]"
            />
          </div>

          <AnimatePresence>
            {incoming !== null && (
              <motion.div
                key={`incoming-${incoming}`}
                className="absolute inset-0"
                initial={{ clipPath: CLIP_OFF_RIGHT }}
                animate={{
                  clipPath: [CLIP_OFF_RIGHT, CLIP_COVER, CLIP_FULL],
                }}
                transition={{
                  duration: WIPE_DURATION,
                  ease: WIPE_EASE,
                  times: [0, 0.85, 1],
                }}
                onAnimationComplete={() => {
                  setCurrent(incoming);
                  setIncoming(null);
                }}
              >
                <Image
                  src={heroSlides[incoming].src}
                  alt={heroSlides[incoming].alt}
                  fill
                  sizes="100vw"
                  className="object-cover object-[60%_center]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/35" />

        <motion.div
          className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: showCopy ? 1 : 0 }}
          transition={{ duration: 0.5, delay: showCopy ? 0.55 : 0 }}
          aria-label={`スライド ${activeDot + 1} / ${heroSlides.length}`}
        >
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={
                i === activeDot
                  ? "h-1.5 w-1.5 rounded-full bg-cream"
                  : "h-1.5 w-1.5 rounded-full bg-cream/35"
              }
            />
          ))}
        </motion.div>

        <motion.div
          className="absolute inset-0 z-10 flex items-center px-6 pt-16 sm:px-12 sm:pt-14 lg:px-16"
          initial={false}
          animate={{
            opacity: showCopy ? 1 : 0,
            y: showCopy ? 0 : 56,
          }}
          transition={{
            duration: 0.85,
            delay: showCopy ? 0.25 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="w-full max-w-[36rem]">
            <p className="font-serif-jp mb-2 text-[18px] font-normal tracking-[0.12em] text-[#c4a574] sm:mb-2.5 sm:text-[20px]">
              沖縄しゃぶしゃぶ 恩納豚 那覇
            </p>

            <p className="font-serif-jp mb-5 text-[13px] font-normal tracking-[0.12em] text-[#c4a574] sm:mb-6 sm:text-[16px]">
              コース料理専門店
              <span className="mx-2 text-[#c4a574]/70" aria-hidden>
                ｜
              </span>
              完全予約制
            </p>

            <h1 className="font-serif-jp mb-5 text-[24px] font-medium leading-[1.65] tracking-[0.06em] text-cream sm:mb-6 sm:text-[40px] sm:leading-[1.7] lg:text-[48px]">
              <span className="block">あぐー豚×特選石垣牛</span>
              <span className="block">沖縄の恵みを、</span>
              <span className="block">極上のしゃぶしゃぶで。</span>
            </h1>

            <p className="font-serif-jp mb-7 max-w-[28rem] text-[13px] leading-[2] tracking-[0.06em] text-cream/85 sm:mb-8 sm:text-[14px] sm:leading-[2.1]">
              島の水と大地が育てた銘柄豚と和牛を当店だけの出汁でいただく
              <br className="hidden sm:block" />
              唯一無二のしゃぶしゃぶ体験。旅の一夜を、忘れられない特別な
              <br className="hidden sm:block" />
              時間に。
            </p>

            <ReserveButton
              className="font-serif-jp mb-3 min-h-11 w-full max-w-sm rounded-none px-9 py-3.5 text-[14px] font-medium tracking-[0.18em] text-white hover:bg-cream hover:text-ink sm:w-auto sm:px-24 sm:py-3 sm:text-[14px]"
            />

            <p className="text-[12px] tracking-[0.04em] text-cream/55 sm:text-[13px]">
              （完全予約制のため、事前のご予約をお願いいたします。）
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
}
