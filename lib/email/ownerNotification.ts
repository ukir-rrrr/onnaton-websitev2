import type { IntlReservationInput } from "@/lib/supabase/reservations";
import { getResendReplyTo, sendResendEmail } from "./resend";

function formatDates(input: IntlReservationInput): string {
  const lines = [`1. ${input.datePreference1}`];
  if (input.datePreference2) lines.push(`2. ${input.datePreference2}`);
  if (input.datePreference3) lines.push(`3. ${input.datePreference3}`);
  return lines.join("\n");
}

export async function notifyOwnerIntlReservation(
  input: IntlReservationInput,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const to = process.env.RESEND_OWNER_TO?.trim();
  if (!to) {
    console.info("[reservation/intl/owner] email skipped (RESEND_OWNER_TO not set)", {
      reference: input.reference,
    });
    return { ok: true, skipped: true };
  }

  const subject = `[恩納豚] 海外予約リクエスト ${input.reference}`;
  const text = [
    "海外向け予約リクエストが届きました。",
    "空席確認後、お客様へ確認メールをお送りください。",
    "",
    `受付番号: ${input.reference}`,
    `お名前: ${input.name}`,
    `メール: ${input.email}`,
    `国・地域: ${input.country}`,
    `locale: ${input.locale ?? "—"}`,
    "",
    "希望日（第1〜3希望）:",
    formatDates(input),
    "",
    `大人: ${input.adults} 名`,
    `お子様: ${input.children} 名`,
    "",
    input.notes ? `備考:\n${input.notes}` : "備考: —",
    "",
    `同意日時: ${input.agreedAt}`,
    "",
    "※ お客様には受付確認の自動返信メールを送信済みです。",
  ].join("\n");

  return sendResendEmail({
    to: [to],
    subject,
    text,
    replyTo: input.email,
    logLabel: "reservation/intl/owner",
  });
}
