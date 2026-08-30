import type { Locale } from "./config";
import { L, t } from "./types";

const copy = {
  placeholder: L(
    "年 / 月 / 日",
    "Y / M / D",
    "연 / 월 / 일",
    "年 / 月 / 日",
    "年 / 月 / 日",
  ),
  clear: L("削除", "Clear", "삭제", "清除", "清除"),
  today: L("今日", "Today", "오늘", "今日", "今天"),
  prevMonth: L("前の月", "Previous month", "이전 달", "上一個月", "上個月"),
  nextMonth: L("次の月", "Next month", "다음 달", "下一個月", "下個月"),
  calendarLabel: L(
    "日付を選択",
    "Choose a date",
    "날짜 선택",
    "選擇日期",
    "選擇日期",
  ),
  year: L("年", "Year", "년", "年", "年"),
  month: L("月", "Month", "월", "月", "月"),
  day: L("日", "Day", "일", "日", "日"),
};

const weekdayShort: Record<Locale, readonly string[]> = {
  ja: ["日", "月", "火", "水", "木", "金", "土"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  yue: ["日", "一", "二", "三", "四", "五", "六"],
  zhTw: ["日", "一", "二", "三", "四", "五", "六"],
  ko: ["일", "월", "화", "수", "목", "금", "토"],
};

const monthNames: Record<Locale, readonly string[]> = {
  ja: [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  yue: [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ],
  zhTw: [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ],
  ko: [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ],
};

export function datePickerLabels(locale: Locale) {
  return {
    placeholder: t(locale, copy.placeholder),
    clear: t(locale, copy.clear),
    today: t(locale, copy.today),
    prevMonth: t(locale, copy.prevMonth),
    nextMonth: t(locale, copy.nextMonth),
    calendarLabel: t(locale, copy.calendarLabel),
    year: t(locale, copy.year),
    month: t(locale, copy.month),
    day: t(locale, copy.day),
    weekdays: weekdayShort[locale],
    monthNames: monthNames[locale],
  };
}

export function formatPickerDisplayDate(locale: Locale, ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  if (!year || !month || !day) return ymd;

  switch (locale) {
    case "ja":
    case "yue":
    case "zhTw":
      return `${year}年${month}月${day}日`;
    case "ko":
      return `${year}년 ${month}월 ${day}일`;
    case "en":
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(Date.UTC(year, month - 1, day)));
    default:
      return ymd;
  }
}

export function formatPickerMonthTitle(locale: Locale, year: number, month: number): string {
  switch (locale) {
    case "en":
      return `${monthNames.en[month - 1]} ${year}`;
    case "ko":
      return `${year}년 ${monthNames.ko[month - 1]}`;
    default:
      return `${year}年${monthNames[locale][month - 1]}`;
  }
}
