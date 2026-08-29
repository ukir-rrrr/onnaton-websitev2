export type ResendSendResult = { ok: boolean; skipped?: boolean };

export function getResendConfig(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) return null;
  return { apiKey, from };
}

export function getResendReplyTo(): string | undefined {
  return (
    process.env.RESEND_REPLY_TO?.trim() ||
    process.env.RESEND_OWNER_TO?.trim() ||
    undefined
  );
}

export async function sendResendEmail(params: {
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
  logLabel: string;
}): Promise<ResendSendResult> {
  const config = getResendConfig();
  if (!config) {
    console.info(`[${params.logLabel}] email skipped (Resend not configured)`);
    return { ok: true, skipped: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: params.to,
        subject: params.subject,
        text: params.text,
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[${params.logLabel}] Resend failed`,
        response.status,
        detail || "(no body)",
      );
      return { ok: false };
    }

    console.info(`[${params.logLabel}] email sent`, {
      ...(process.env.NODE_ENV === "development" ? { to: params.to } : {}),
    });
    return { ok: true };
  } catch (error) {
    console.error(`[${params.logLabel}] Resend error`, error);
    return { ok: false };
  }
}
