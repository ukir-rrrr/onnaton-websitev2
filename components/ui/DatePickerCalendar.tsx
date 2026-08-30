"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  buildMonthGrid,
  clampViewMonth,
  compareYmd,
  parseYmd,
} from "@/lib/date/calendar";
import { tokyoTodayYmd } from "@/lib/content/reservation";
import { datePickerLabels, formatPickerMonthTitle } from "@/lib/i18n/datePicker";
import type { Locale } from "@/lib/i18n/config";

type DatePickerCalendarProps = {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  viewYear: number;
  viewMonth: number;
  onViewChange: (year: number, month: number) => void;
  value: string;
  onSelect: (ymd: string) => void;
  onClear: () => void;
  min: string;
  max: string;
  isDisabled: (ymd: string) => boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
};

export function DatePickerCalendar({
  locale,
  open,
  onClose,
  viewYear,
  viewMonth,
  onViewChange,
  value,
  onSelect,
  onClear,
  min,
  max,
  isDisabled,
  anchorRef,
}: DatePickerCalendarProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );
  const labels = datePickerLabels(locale);
  const today = tokyoTodayYmd();
  const grid = buildMonthGrid(viewYear, viewMonth);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const width = Math.min(Math.max(rect.width, 280), 340);
      const left = Math.min(
        Math.max(12, rect.left),
        window.innerWidth - width - 12,
      );
      setPosition({
        top: rect.bottom + 8,
        left,
        width,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, anchorRef, viewYear, viewMonth]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, anchorRef]);

  const goMonth = (delta: number) => {
    const next = addMonths(viewYear, viewMonth, delta);
    const clamped = clampViewMonth(next.year, next.month, min, max);
    onViewChange(clamped.year, clamped.month);
  };

  const canGoPrev = (() => {
    const prev = addMonths(viewYear, viewMonth, -1);
    const minParsed = parseYmd(min);
    if (!minParsed) return true;
    return prev.year * 100 + prev.month >= minParsed.year * 100 + minParsed.month;
  })();

  const canGoNext = (() => {
    const next = addMonths(viewYear, viewMonth, 1);
    const maxParsed = parseYmd(max);
    if (!maxParsed) return true;
    return next.year * 100 + next.month <= maxParsed.year * 100 + maxParsed.month;
  })();

  const jumpToToday = () => {
    const parsed = parseYmd(today);
    if (!parsed) return;
    const clamped = clampViewMonth(parsed.year, parsed.month, min, max);
    onViewChange(clamped.year, clamped.month);
    if (
      compareYmd(today, min) >= 0 &&
      compareYmd(today, max) <= 0 &&
      !isDisabled(today)
    ) {
      onSelect(today);
      onClose();
    }
  };

  if (!open || !position) return null;

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      className="date-picker-panel fixed z-[200] rounded-sm border border-cream/20 bg-ink-raised p-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label={labels.prevMonth}
          disabled={!canGoPrev}
          onClick={() => goMonth(-1)}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm text-cream/80 transition-colors hover:bg-cream/8 hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} />
        </button>
        <p
          id={titleId}
          className="text-center text-[14px] font-medium tracking-[0.06em] text-cream sm:text-[15px]"
        >
          {formatPickerMonthTitle(locale, viewYear, viewMonth)}
        </p>
        <button
          type="button"
          aria-label={labels.nextMonth}
          disabled={!canGoNext}
          onClick={() => goMonth(1)}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm text-cream/80 transition-colors hover:bg-cream/8 hover:text-cream disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {labels.weekdays.map((label, index) => (
          <div
            key={index}
            className="py-1 text-center text-[11px] tracking-[0.08em] text-cream/55 sm:text-[12px]"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell, index) => {
          if (cell.kind === "empty") {
            return <div key={`empty-${index}`} aria-hidden className="aspect-square" />;
          }

          const disabled =
            compareYmd(cell.ymd, min) < 0 ||
            compareYmd(cell.ymd, max) > 0 ||
            isDisabled(cell.ymd);
          const selected = value === cell.ymd;
          const isToday = cell.ymd === today;

          return (
            <button
              key={cell.ymd}
              type="button"
              disabled={disabled}
              aria-label={`${cell.day}${labels.day}`}
              aria-pressed={selected}
              onClick={() => {
                onSelect(cell.ymd);
                onClose();
              }}
              className={`aspect-square rounded-sm text-[13px] tracking-[0.04em] transition-colors sm:text-[14px] ${
                selected
                  ? "bg-gold font-medium text-ink"
                  : disabled
                    ? "cursor-not-allowed text-cream/25"
                    : isToday
                      ? "border border-gold/45 text-gold hover:bg-gold/15"
                      : "text-cream/92 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-cream/12 pt-3">
        <button
          type="button"
          onClick={() => {
            onClear();
            onClose();
          }}
          className="min-h-9 px-2 text-[12px] tracking-[0.08em] text-cream/70 transition-colors hover:text-cream sm:text-[13px]"
        >
          {labels.clear}
        </button>
        <button
          type="button"
          onClick={jumpToToday}
          className="min-h-9 px-2 text-[12px] tracking-[0.08em] text-gold transition-colors hover:text-cream sm:text-[13px]"
        >
          {labels.today}
        </button>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
