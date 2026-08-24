"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { storeInfoRows, siteConfig } from "@/lib/content/store";
import { MultilineText } from "@/components/i18n/MultilineText";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Access() {
  const { t, tr, locale, isJa } = useT();
  const reduceMotion = useReducedMotion() === true;

  return (
    <section
      id="access"
      className="scroll-mt-24 w-full px-6 pb-24 sm:px-10 sm:pb-32 lg:px-14 lg:pb-[200px]"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease }}
      >
        <SectionEyebrow
          eyebrow="ACCESS"
          heading={t(copy.access.heading)}
          align="left"
          className="mb-10 sm:mb-12"
        />
      </motion.div>

      <div className="grid grid-cols-1 items-start gap-14 xl:grid-cols-[0.9fr_1.1fr] xl:gap-20">
        <motion.div
          className="flex min-w-0 flex-col gap-6"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, delay: 0.12, ease }}
        >
          {storeInfoRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-3 py-1 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-x-0 ${
                i === 0 ? "border-t border-cream/12 pt-4" : ""
              }`}
            >
              <span className="pt-0.5 text-[13px] text-cream/50 sm:text-[13px]">
                {tr(row.label)}
              </span>
              {row.label === "ご予約" && !isJa ? (
                <Link
                  href="/reserve"
                  className="inline-flex min-h-11 items-center py-1 text-[15px] leading-[1.7] text-cream underline-offset-4 transition-colors hover:text-gold hover:underline sm:min-h-0 sm:py-0"
                >
                  {t(copy.access.reserveOnline)}
                </Link>
              ) : row.href ? (
                <a
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    row.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="inline-flex min-h-11 min-w-0 items-center gap-2.5 py-1 text-[15px] leading-[1.7] text-cream underline-offset-4 transition-colors hover:text-gold hover:underline sm:min-h-0 sm:py-0"
                >
                  <span className="min-w-0">{tr(row.value)}</span>
                  {row.icon === "instagram" ? (
                    <InstagramIcon className="h-[18px] w-[18px] shrink-0" />
                  ) : null}
                </a>
              ) : (
                <span className="min-w-0 py-1 text-[15px] leading-[1.7] text-cream sm:py-0">
                  <MultilineText text={tr(row.value)} keepAll={false} />
                </span>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="w-full overflow-hidden rounded-sm border border-cream/10"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, delay: 0.15, ease }}
        >
          <iframe
            title={t(copy.access.mapTitle)}
            src={siteConfig.mapEmbedSrc.replace(
              "hl=ja",
              `hl=${locale === "zh" ? "zh-CN" : locale}`,
            )}
            className="h-[320px] w-full border-0 sm:h-[420px] xl:h-[600px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            href={siteConfig.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center border-t border-cream/10 bg-ink-raised px-4 py-3.5 text-[13px] tracking-[0.12em] text-cream/70 transition-colors hover:text-gold"
          >
            {t(copy.access.openMap)}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
