"use client";

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
          <p className="font-serif-jp flex items-baseline gap-3 text-[28px] font-medium tracking-[0.12em] text-ink sm:gap-4 sm:text-[40px] sm:tracking-[0.16em]">
            <span>恩納豚</span>
            <span className="text-[14px] tracking-[0.35em] sm:text-[18px] sm:tracking-[0.4em]">
              ONNATON
            </span>
          </p>
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
