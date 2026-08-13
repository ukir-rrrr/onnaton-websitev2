"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/content/store";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

interface ReserveButtonProps {
  variant?: "solid" | "outline";
  className?: string;
  children?: React.ReactNode;
  /** Pre-select this course on the online form (EN / KO / ZH). */
  courseId?: string;
}

function isDesktopPointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** JA: phone reservation. EN / KO / ZH: online reservation form. */
export function ReserveButton({
  variant = "solid",
  className = "",
  children,
  courseId,
}: ReserveButtonProps) {
  const { t, isJa } = useT();
  const label = children ?? (isJa ? t(copy.reserve.call) : t(copy.reserve.online));
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const base =
    "inline-flex items-center justify-center rounded-sm text-[14px] font-bold tracking-[0.05em] transition-colors";
  const styles =
    variant === "solid"
      ? "bg-gold text-ink hover:bg-cream"
      : "border border-gold text-gold hover:bg-gold hover:text-ink";

  if (!isJa) {
    const href = courseId
      ? `/reserve?course=${encodeURIComponent(courseId)}`
      : "/reserve";
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {label}
      </Link>
    );
  }

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.reservationPhoneDisplay);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <a
        href={siteConfig.reservationPhoneHref}
        className={`${base} ${styles} ${className}`}
        onClick={(event) => {
          if (!isDesktopPointer()) return;
          event.preventDefault();
          setCopied(false);
          setOpen(true);
        }}
      >
        {label}
      </a>

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/75 px-6 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto border border-cream/15 bg-ink-raised px-6 py-9 text-center shadow-2xl sm:px-12 sm:py-12"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id={titleId}
              className="mb-3 text-xs tracking-[0.28em] text-gold sm:text-[12px]"
            >
              {t(copy.reserve.phoneLabel)}
            </p>
            <p className="font-serif-jp mb-2 text-[30px] font-medium tracking-[0.08em] text-cream sm:text-[42px]">
              {siteConfig.reservationPhoneDisplay}
            </p>
            <p className="mb-8 text-[13px] leading-[1.8] tracking-[0.04em] text-cream/60">
              {t(copy.reserve.hours)}
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={copyNumber}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-gold px-6 py-3.5 text-[14px] font-bold tracking-[0.14em] text-ink transition-colors hover:bg-cream"
              >
                {copied ? t(copy.reserve.copied) : t(copy.reserve.copy)}
              </button>
              <a
                href={siteConfig.reservationPhoneHref}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-cream/25 px-6 py-3.5 text-[14px] font-bold tracking-[0.14em] text-cream transition-colors hover:border-gold hover:text-gold"
              >
                {t(copy.reserve.dial)}
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-1 flex min-h-11 w-full items-center justify-center text-[13px] tracking-[0.12em] text-cream/45 transition-colors hover:text-cream/70"
              >
                {t(copy.reserve.close)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
