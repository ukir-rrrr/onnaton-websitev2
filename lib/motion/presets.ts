import type { Transition, Variants } from "motion/react";

export const SECTION_EASE = [0.22, 1, 0.36, 1] as const;

export function sectionTransition(duration = 0.9, delay = 0): Transition {
  return { duration, delay, ease: SECTION_EASE };
}

export function revealFadeUp(reduceMotion: boolean, delay = 0, y = 28) {
  if (reduceMotion) return {};
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: sectionTransition(0.9, delay),
  };
}

export function revealFade(reduceMotion: boolean, delay = 0) {
  if (reduceMotion) return {};
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.35 },
    transition: sectionTransition(1, delay),
  };
}

export function revealScale(reduceMotion: boolean, delay = 0, scale = 1.08) {
  if (reduceMotion) return {};
  return {
    initial: { opacity: 0, scale },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: sectionTransition(1.15, delay),
  };
}

export function staggerContainer(stagger = 0.1): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };
}

export function staggerItem(reduceMotion: boolean, y = 24): Variants | undefined {
  if (reduceMotion) return undefined;
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: sectionTransition(0.85),
    },
  };
}

export function modalBackdrop(reduceMotion: boolean) {
  if (reduceMotion) return {};
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25, ease: SECTION_EASE },
  };
}

export function modalPanel(reduceMotion: boolean) {
  if (reduceMotion) return {};
  return {
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.98 },
    transition: { duration: 0.32, ease: SECTION_EASE },
  };
}
