import { MultilineText } from "@/components/i18n/MultilineText";
import { getActiveNotices } from "@/lib/supabase/notices";

export async function SiteNotices() {
  const notices = await getActiveNotices();
  if (notices.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden border-y-2 border-gold/35 bg-gradient-to-b from-ink-raised via-ink-raised to-ink"
      aria-label="お知らせ"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/20" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-6 py-12 sm:px-10 sm:py-16 lg:max-w-[42rem] lg:py-20">
        <div className="mb-8 flex flex-col items-center gap-3 sm:mb-10 sm:gap-4">
          <p className="text-base font-medium tracking-[0.35em] text-gold sm:text-[18px]">
            NOTICE
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden h-9 w-px bg-gold/50 sm:block" aria-hidden />
            <h2 className="font-display-jp text-center text-[24px] font-medium tracking-[0.12em] text-cream sm:text-[30px] lg:text-[34px]">
              お知らせ
            </h2>
            <span className="hidden h-9 w-px bg-gold/50 sm:block" aria-hidden />
          </div>
        </div>

        <ul className="space-y-5 sm:space-y-6">
          {notices.map((notice) => (
            <li
              key={notice.sortOrder}
              className="relative overflow-hidden rounded-md border border-gold/40 bg-white/30 px-5 py-5 shadow-[0_8px_28px_rgba(42,37,32,0.08)] backdrop-blur-[2px] sm:px-7 sm:py-6"
            >
              <span
                className="absolute inset-y-3 left-0 w-1 rounded-full bg-gold/80"
                aria-hidden
              />
              <div className="space-y-4 pl-3 text-center font-serif-jp text-[17px] leading-[2.05] tracking-[0.04em] text-cream sm:pl-4 sm:text-[19px] sm:leading-[2.12]">
                {notice.bodyJa.trim() ? (
                  <p className="font-medium">
                    <MultilineText text={notice.bodyJa} />
                  </p>
                ) : null}
                {notice.bodyEn.trim() ? (
                  <p className="text-[15px] leading-[1.95] text-cream/75 sm:text-[16px]">
                    <MultilineText text={notice.bodyEn} keepAll={false} />
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
