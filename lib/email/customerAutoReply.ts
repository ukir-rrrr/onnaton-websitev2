import type { IntlReservationInput } from "@/lib/supabase/reservations";
import { getResendReplyTo, sendResendEmail } from "./resend";

function fill(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}

/** Owner-specified fixed English wording, sent regardless of locale. */
const AUTO_REPLY_SUBJECT = "Reservation Request Received | ONNATON";

const AUTO_REPLY_BODY = `Dear {name},

Thank you for submitting a reservation request to ONNATON.

This is an automated reply.
Your reservation is not confirmed yet.

After reviewing your reservation request, the owner will send you a confirmation email manually.

Please read that email carefully and reply to it.

Once we receive your reply, we will send you a final reservation confirmation email.

Your reservation will be officially confirmed only after you receive the final confirmation email from us.

Please note that we do not accept phone reservations from international guests.

Reservations are accepted from one month before your preferred visit date.
We cannot accept reservations for dates more than one month in advance. Please submit your request again once the reservation period opens.

Our emails may occasionally be filtered into your Spam, Junk, or Trash folder. If you do not receive our email, please check those folders and your email settings.

※This is an automated email.
Please do not reply to this message.

ONNATON`;

export async function sendCustomerAutoReply(
  input: IntlReservationInput,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const subject = AUTO_REPLY_SUBJECT;
  const text = fill(AUTO_REPLY_BODY, { name: input.name });

  return sendResendEmail({
    to: [input.email],
    subject,
    text,
    replyTo: getResendReplyTo(),
    logLabel: "reservation/intl/customer",
  });
}
