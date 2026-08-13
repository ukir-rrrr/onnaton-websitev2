"use client";

import { useTransition } from "react";
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

const OPTIONS: {
  code: Locale;
  Flag: typeof JpFlag;
  labelKey: "ja" | "en" | "ko" | "zh";
}[] = [
  { code: "ja", Flag: JpFlag, labelKey: "ja" },
  { code: "en", Flag: UsFlag, labelKey: "en" },
  { code: "ko", Flag: KrFlag, labelKey: "ko" },
  { code: "zh", Flag: CnFlag, labelKey: "zh" },
];

interface LanguageFlagsProps {
  className?: string;
}

export function LanguageFlags({ className = "" }: LanguageFlagsProps) {
  const { locale, t } = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (code: Locale) => {
    if (code === locale || pending) return;
    startTransition(async () => {
      await setLocale(code);
      router.refresh();
    });
  };

  return (
    <div className={`flex items-center gap-1.5 sm:gap-3 ${className}`}>
      {OPTIONS.map(({ code, Flag, labelKey }) => {
        const active = locale === code;
        const label = t(copy.lang[labelKey]);
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            aria-label={label}
            aria-pressed={active}
            onClick={() => switchTo(code)}
            className={`flex min-h-11 min-w-11 items-center justify-center transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
              active ? "opacity-100" : "opacity-55 hover:opacity-100"
            } ${pending ? "pointer-events-none" : ""}`}
          >
            <Flag
              className={`h-5 w-[30px] overflow-hidden rounded-[1px] sm:h-[22px] sm:w-[33px] ${
                active
                  ? "shadow-[0_0_0_2px_rgba(201,169,98,0.9)]"
                  : "shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
