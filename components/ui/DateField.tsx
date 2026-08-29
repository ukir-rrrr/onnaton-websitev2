"use client";

import { CalendarDays } from "lucide-react";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

export const dateInputClass =
  "date-input relative box-border w-full min-w-0 max-w-full rounded-sm border border-cream/18 bg-ink-raised py-3.5 pl-4 pr-11 text-[16px] text-cream outline-none transition-colors [color-scheme:light] focus:border-gold sm:text-[15px]";

type DateFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  id: string;
};

export function DateField({ id, className, ...props }: DateFieldProps) {
  const { t } = useT();

  const openPicker = () => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) return;
    el.focus();
    if (typeof el.showPicker === "function") {
      try {
        el.showPicker();
      } catch {
        /* iOS Safari may reject showPicker outside a direct gesture */
      }
    }
  };

  return (
    <div className="date-input-shell">
      <input
        id={id}
        type="date"
        className={className ?? dateInputClass}
        {...props}
      />
      <button
        type="button"
        aria-label={t(copy.intlForm.openCalendar)}
        className="date-input-trigger"
        onClick={openPicker}
      >
        <CalendarDays className="size-[18px] text-cream/55" strokeWidth={1.5} />
      </button>
    </div>
  );
}
