import type { Locale } from "./config";

/** Extract numeric amount from strings like "10,500円" or "（税込 11,550円）". */
export function parseYenAmount(raw: string): string | null {
  const match = raw.match(/[\d,]+/);
  return match ? match[0] : null;
}

export function formatYenAmount(locale: Locale, amount: string): string {
  switch (locale) {
    case "ja":
      return `${amount}円`;
    case "en":
      return `${amount} yen`;
    case "ko":
      return `${amount}엔`;
    case "yue":
    case "zhTw":
      return `${amount}日圓`;
    default:
      return `${amount} yen`;
  }
}

export function formatTaxIncluded(locale: Locale, amount: string): string {
  switch (locale) {
    case "ja":
      return `（税込 ${amount}円）`;
    case "en":
      return `${amount} yen (tax included)`;
    case "ko":
      return `세금 포함 ${amount}엔`;
    case "yue":
    case "zhTw":
      return `含稅 ${amount}日圓`;
    default:
      return `${amount} yen (tax included)`;
  }
}

export function formatPerPersonMain(locale: Locale, amount: string): string {
  switch (locale) {
    case "ja":
      return `お一人様 ${amount}円`;
    case "en":
      return `Per person ${amount} yen`;
    case "ko":
      return `1인 ${amount}엔`;
    case "yue":
    case "zhTw":
      return `每位 ${amount}日圓`;
    default:
      return `Per person ${amount} yen`;
  }
}

/** Localize a menu price string (may include 各, ranges, or tax notes). */
export function formatMenuPrice(locale: Locale, raw: string): string {
  if (locale === "ja" || !raw.trim()) return raw;

  const eachPrefix = /^各\s+/;
  if (eachPrefix.test(raw)) {
    const rest = raw.replace(eachPrefix, "");
    const amount = parseYenAmount(rest);
    if (amount) {
      const eachWord =
        locale === "en" ? "each" : locale === "ko" ? "각" : "各";
      return `${eachWord} ${formatYenAmount(locale, amount)}`;
    }
  }

  if (raw.includes("税込")) {
    const amount = parseYenAmount(raw);
    if (amount) return formatTaxIncluded(locale, amount);
  }

  if (raw.includes("円")) {
    return raw
      .split(/\s*\/\s*/)
      .map((part) => {
        const amount = parseYenAmount(part);
        return amount ? formatYenAmount(locale, amount) : part;
      })
      .join(" / ");
  }

  return raw;
}

export function formatCoursePriceMain(
  locale: Locale,
  mobileAmount: string,
): string {
  const amount = parseYenAmount(mobileAmount);
  if (!amount) return mobileAmount;
  if (locale === "ja") return mobileAmount;
  return formatYenAmount(locale, amount);
}

export function formatCoursePriceTax(
  locale: Locale,
  mobileTaxNote: string,
): string {
  const amount = parseYenAmount(mobileTaxNote);
  if (!amount) return mobileTaxNote;
  return formatTaxIncluded(locale, amount);
}
