import { copy } from "@/lib/i18n/copy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/types";
import type { IntlReservationInput } from "@/lib/supabase/reservations";
import { getResendReplyTo, sendResendEmail } from "./resend";

function fill(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}

function localeFromInput(locale: string | null): Locale {
  if (locale && isLocale(locale)) return locale;
  return "en";
}

export async function sendCustomerAutoReply(
  input: IntlReservationInput,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const locale = localeFromInput(input.locale);
  const vars = {
    name: input.name,
    reference: input.reference,
  };

  const subject = fill(t(locale, copy.intlAutoReply.subject), vars);
  const text = fill(t(locale, copy.intlAutoReply.body), vars);

  return sendResendEmail({
    to: [input.email],
    subject,
    text,
    replyTo: getResendReplyTo(),
    logLabel: "reservation/intl/customer",
  });
}
