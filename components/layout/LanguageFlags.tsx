import { languageFlags } from "@/lib/content/languages";

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

const FLAG = {
  us: UsFlag,
  kr: KrFlag,
  cn: CnFlag,
} as const;

interface LanguageFlagsProps {
  className?: string;
}

/** Flag buttons for EN / KO / ZH. Japanese is default (no JP flag). */
export function LanguageFlags({ className = "" }: LanguageFlagsProps) {
  return (
    <div className={`flex items-center gap-1.5 sm:gap-3 ${className}`}>
      {languageFlags.map((lang) => {
        const Flag = FLAG[lang.flag];
        return (
          <button
            key={lang.code}
            type="button"
            aria-label={`${lang.label}に切り替え`}
            className="flex min-h-11 min-w-11 items-center justify-center opacity-90 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Flag className="h-5 w-[30px] overflow-hidden rounded-[1px] shadow-[0_0_0_1px_rgba(255,255,255,0.18)] sm:h-[22px] sm:w-[33px]" />
          </button>
        );
      })}
    </div>
  );
}
