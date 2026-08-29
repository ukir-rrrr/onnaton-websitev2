"use client";

import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import {
  revealFade,
  revealFadeUp,
  revealScale,
  sectionTransition,
  SECTION_EASE,
} from "@/lib/motion/presets";

type RevealVariant = "fadeUp" | "fade" | "scale" | "fadeLeft" | "fadeRight";

interface RevealProps extends HTMLMotionProps<"div"> {
  variant?: RevealVariant;
  delay?: number;
  amount?: number;
  children?: ReactNode;
}

export function Reveal({
  variant = "fadeUp",
  delay = 0,
  amount = 0.35,
  children,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion() === true;

  if (reduceMotion) {
    return <div {...(props as ComponentProps<"div">)}>{children}</div>;
  }

  const base = {
    viewport: { once: true, amount },
    transition: sectionTransition(variant === "scale" ? 1.15 : 0.9, delay),
  };

  const motionProps =
    variant === "fade"
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, ...base }
      : variant === "scale"
        ? {
            initial: { opacity: 0, scale: 1.08 },
            whileInView: { opacity: 1, scale: 1 },
            ...base,
          }
        : variant === "fadeLeft"
          ? {
              initial: { opacity: 0, x: 24 },
              whileInView: { opacity: 1, x: 0 },
              transition: { duration: 0.85, delay, ease: SECTION_EASE },
              viewport: { once: true, amount },
            }
          : variant === "fadeRight"
            ? {
                initial: { opacity: 0, x: -24 },
                whileInView: { opacity: 1, x: 0 },
                transition: { duration: 0.85, delay, ease: SECTION_EASE },
                viewport: { once: true, amount },
              }
            : {
                initial: { opacity: 0, y: 28 },
                whileInView: { opacity: 1, y: 0 },
                ...base,
              };

  return (
    <motion.div {...motionProps} {...props}>
      {children}
    </motion.div>
  );
}

export { revealFade, revealFadeUp, revealScale };
