"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions/locale";
import { type Locale } from "@/lib/i18n/config";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const OPTIONS: { code: Locale; label: string }[] = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "yue", label: "廣東話" },
  { code: "zhTw", label: "繁體中文" },
  { code: "ko", label: "한국어" },
];

interface LanguageFlagsProps {
  className?: string;
  onHero?: boolean;
}

export function LanguageFlags({ className = "", onHero = false }: LanguageFlagsProps) {
  const { locale, t } = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const switchTo = (code: Locale) => {
    if (code === locale || pending) return;
    setOpen(false);
    startTransition(async () => {
      await setLocale(code);
      router.refresh();
    });
  };

  const buttonIdle = onHero
    ? "text-on-dark hover:bg-on-dark/10 hover:text-gold"
    : "text-cream hover:bg-cream/6 hover:text-gold";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t(copy.lang.menuButton)}
        disabled={pending}
        className={`font-serif-jp flex min-h-11 items-center gap-1 rounded px-2 py-1.5 text-[14px] tracking-[0.06em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:gap-1.5 sm:px-3.5 sm:text-[16px] ${buttonIdle} ${
          open ? "text-gold" : ""
        } ${pending ? "pointer-events-none opacity-60" : ""}`}
      >
        <span className="hidden sm:inline">Language</span>
        <span className="sm:hidden">Lang</span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t(copy.lang.menuButton)}
          className="absolute right-0 top-full z-[60] mt-2 min-w-[210px] overflow-hidden rounded-sm border border-black/8 bg-white py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
        >
          {OPTIONS.map(({ code, label }) => {
            const active = locale === code;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                disabled={pending}
                onClick={() => switchTo(code)}
                className={`flex w-full px-4 py-2.5 text-left text-[15px] tracking-[0.02em] text-black transition-colors hover:bg-black/[0.04] ${
                  active ? "bg-black/[0.04] font-medium" : ""
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
