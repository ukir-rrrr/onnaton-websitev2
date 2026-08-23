"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  CLIP_COVER,
  CLIP_OFF_LEFT,
  CLIP_OFF_RIGHT,
  WIPE_DURATION,
  WIPE_EASE,
} from "@/lib/motion/diagonalWipe";

export type IntroPhase = "logo" | "wipeIn" | "wipeOut" | "ready";

interface PageIntroProps {
  phase: IntroPhase;
  onWipeInComplete: () => void;
  onWipeOutComplete: () => void;
}

/** Stages ①–③: logo hold → diagonal brand wipe in → wipe out. */
export function PageIntro({
  phase,
  onWipeInComplete,
  onWipeOutComplete,
}: PageIntroProps) {
  // Keep the white logo layer under the wipe until cover is complete,
  // so the hero image never flashes between logo → wipe.
  const showLogoPlate = phase === "logo" || phase === "wipeIn";

  return (
    <AnimatePresence>
      {showLogoPlate && (
        <motion.div
          key="intro-logo"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-white"
        >
          <Image
            src="/images/onnaton-logo.jpg"
            alt="恩納豚 ONNATON"
            width={200}
            height={200}
            priority
            className="h-auto w-[120px] object-contain sm:w-[160px] lg:w-[180px]"
          />
        </motion.div>
      )}

      {(phase === "wipeIn" || phase === "wipeOut") && (
        <motion.div
          key="intro-wipe"
          className="fixed inset-0 z-[130] bg-wipe"
          initial={{ clipPath: CLIP_OFF_RIGHT }}
          animate={{
            clipPath: phase === "wipeIn" ? CLIP_COVER : CLIP_OFF_LEFT,
          }}
          transition={{ duration: WIPE_DURATION, ease: WIPE_EASE }}
          onAnimationComplete={() => {
            if (phase === "wipeIn") onWipeInComplete();
            else onWipeOutComplete();
          }}
        />
      )}
    </AnimatePresence>
  );
}
