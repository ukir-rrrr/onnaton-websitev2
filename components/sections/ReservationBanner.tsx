"use client";

import { motion } from "motion/react";
import {
  UtensilsCrossed,
  CalendarCheck,
  Clock,
  Ban,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { ReserveButton } from "@/components/ui/ReserveButton";

const points: { label: string; icon: LucideIcon }[] = [
  { label: "コース料理専門店", icon: UtensilsCrossed },
  { label: "完全予約制", icon: CalendarCheck },
  { label: "事前予約が必要です", icon: Clock },
  { label: "予約なしでのご来店には対応できません", icon: Ban },
  { label: "ご予約時に希望コースをお選びいただきます", icon: ListChecks },
];

export function ReservationBanner() {
  return (
    <section className="relative w-full overflow-hidden border-y border-cream/[0.08] bg-[#161412]">
      <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <div className="mb-10 flex flex-col items-center gap-4 sm:mb-12 lg:mb-14">
          <p className="text-xs tracking-[0.35em] text-wipe sm:text-[16px]">
            RESERVATION
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden h-8 w-px bg-wipe sm:block" aria-hidden />
            <h2 className="font-serif-jp text-center text-xl font-normal tracking-[0.08em] text-cream sm:text-2xl lg:text-[26px]">
              コース料理専門店・完全予約制
            </h2>
            <span className="hidden h-8 w-px bg-wipe sm:block" aria-hidden />
          </div>
        </div>

        <motion.ul
          className="mx-auto grid max-w-5xl grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-5 lg:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {points.map(({ label, icon: Icon }, i) => (
            <motion.li
              key={label}
              className={`flex flex-col items-center gap-3 text-center ${
                i === points.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-gold">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="font-serif-jp max-w-[16rem] text-[13px] leading-[1.7] tracking-[0.04em] text-cream/85 sm:max-w-[11rem] sm:text-[13px]">
                {label}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        {/* Outside the 5-col cells so width is not capped by a narrow column */}
        <motion.div
          className="mx-auto mt-10 flex max-w-5xl justify-center lg:mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <ReserveButton
            variant="outline"
            className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] sm:min-w-[320px] sm:w-auto sm:px-16"
          />
        </motion.div>
      </div>
    </section>
  );
}
