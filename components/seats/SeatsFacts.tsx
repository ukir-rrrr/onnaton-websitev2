"use client";

import { interiorFacts } from "@/lib/content/store";
import { useT } from "@/components/i18n/LocaleProvider";

export function SeatsFacts() {
  const { tr } = useT();
  return (
    <div className="px-6 pb-6 sm:px-10 lg:px-14">
      <div className="grid w-full grid-cols-2 gap-8 rounded-sm bg-ink-raised p-8 sm:grid-cols-3 sm:gap-10 lg:grid-cols-5 lg:p-12">
        {interiorFacts.map((fact) => (
          <div key={fact.label} className="text-center">
            <p className="mb-2.5 text-[13px] text-cream/50">{tr(fact.label)}</p>
            <p className="text-[15px] text-cream sm:text-base">{tr(fact.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
