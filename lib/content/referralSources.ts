export const referralSourceIds = ["repeater", "sns", "internet", "referral"] as const;
export type ReferralSourceId = (typeof referralSourceIds)[number];

export function isReferralSourceId(v: string): v is ReferralSourceId {
  return (referralSourceIds as readonly string[]).includes(v);
}

/** Japanese labels for the owner-facing notification email. */
export const referralSourceLabelJa: Record<ReferralSourceId, string> = {
  repeater: "リピーター",
  sns: "SNS",
  internet: "インターネット",
  referral: "知人の紹介",
};
