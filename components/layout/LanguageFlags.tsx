"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions/locale";
import { type Locale } from "@/lib/i18n/config";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

function JpFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <circle cx="30" cy="20" r="8" fill="#bc002d" />
    </svg>
  );
}

function UsFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#b22234" />
      <path
        fill="#fff"
        d="M0 4.6h60v3.1H0zm0 6.2h60v3.1H0zm0 6.1h60v3.1H0zm0 6.2h60v3.1H0zm0 6.1h60v3.1H0zm0 6.2h60v3.1H0z"
      />
      <rect width="24" height="21.5" fill="#3c3b6e" />
    </svg>
  );
}

function KrFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <path fill="#cd2e3a" d="M22 20a8 8 0 0 1 16 0 4 4 0 1-8 0 4 4 0 0 0-8 0 8 8 0 0 1 0-16z" />
      <path fill="#0047a0" d="M38 20a8 8 0 0 1-16 0 4 4 0 1 8 0 4 4 0 0 0 8 0 8 8 0 0 1 0 16z" />
    </svg>
  );
}

function CnFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#de2910" />
      <polygon
        fill="#ffde00"
        points="12,8 13.2,11.6 17,11.6 13.9,13.8 15.1,17.4 12,15.2 8.9,17.4 10.1,13.8 7,11.6 10.8,11.6"
      />
    </svg>
  );
}

const NATIVE_LABELS: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
  zh: "中文",
};

const OPTIONS: {
  code: Locale;
  Flag: typeof JpFlag;
}[] = [
  { code: "ja", Flag: JpFlag },
  { code: "en", Flag: UsFlag },
  { code: "ko", Flag: KrFlag },
  { code: "zh", Flag: CnFlag },
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
        <span aria-hidden>🌐</span>
        <span className="hidden sm:inline">Language</span>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t(copy.lang.menuButton)}
          className="absolute right-0 top-full z-[60] mt-2 min-w-[210px] overflow-hidden rounded-sm border border-black/8 bg-white py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
        >
          {OPTIONS.map(({ code, Flag }) => {
            const active = locale === code;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                disabled={pending}
                onClick={() => switchTo(code)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] tracking-[0.02em] text-black transition-colors hover:bg-black/[0.04] ${
                  active ? "bg-black/[0.04] font-medium" : ""
                }`}
              >
                <Flag className="h-4 w-6 shrink-0 overflow-hidden rounded-[1px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)]" />
                <span>{NATIVE_LABELS[code]}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
