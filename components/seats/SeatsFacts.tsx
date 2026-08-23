"use client";

import { interiorFacts } from "@/lib/content/store";
import { useT } from "@/components/i18n/LocaleProvider";

export function SeatsFacts() {
  const { tr } = useT();
  return (
    <div className="mt-10 px-6 pb-6 sm:mt-14 sm:px-10 lg:mt-16 lg:px-14">
      <div className="grid w-full grid-cols-2 gap-8 rounded-sm bg-ink-raised p-8 sm:grid-cols-3 sm:gap-10 sm:p-10 lg:grid-cols-5 lg:p-12">
        {interiorFacts.map((fact) => (
          <div key={fact.label} className="text-center">
            <p className="mb-3 text-[15px] text-cream/60 sm:text-[16px]">{tr(fact.label)}</p>
            <p className="font-serif-jp text-[16px] leading-[1.75] text-cream sm:text-[18px]">
              {tr(fact.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
