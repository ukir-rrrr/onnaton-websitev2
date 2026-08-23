"use client";

import { drinkGroups } from "@/lib/content/drinks";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

export function DrinkMenu() {
  const { t, tr } = useT();
  return (
    <section
      id="drinks"
      className="scroll-mt-24 w-full bg-ink px-5 py-16 sm:px-10 sm:py-20 lg:px-14 lg:pb-28 lg:pt-24"
    >
      <SectionEyebrow
        eyebrow="DRINKS"
        heading={t(copy.drinks.heading)}
        className="mb-6 sm:mb-8"
      />
      <p className="mx-auto mb-12 w-fit bg-gold px-4 py-1.5 text-[12px] tracking-[0.08em] text-ink sm:mb-16 sm:text-[13px]">
        ※{t(copy.drinks.tax)}
      </p>

      <div className="mx-auto max-w-3xl">
        {drinkGroups.map((group) => (
          <div key={group.heading} className="mb-10 sm:mb-12">
            <h3 className="font-serif-jp mb-4 border-b border-cream/25 pb-2 text-[16px] tracking-[0.08em] text-cream sm:text-[18px]">
              {tr(group.heading)}
            </h3>
            <ul className="font-serif-jp">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-4 py-2.5"
                >
                  <span className="text-[14px] leading-[1.7] tracking-[0.04em] text-cream sm:text-[15px]">
                    {tr(item.name)}
                  </span>
                  {item.price ? (
                    <span className="shrink-0 text-[14px] tracking-[0.04em] text-cream sm:text-[15px]">
                      {item.price}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <ReserveButton className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] tracking-[0.14em] hover:bg-wipe hover:text-cream sm:w-auto sm:min-w-[280px]" />
      </div>
    </section>
  );
}
