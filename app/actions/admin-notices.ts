"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin/session";
import { readAdminPassword } from "@/lib/admin/config";
import {
  updateNotices,
  type NoticeUpdateInput,
} from "@/lib/supabase/notices";
import { getClientIp } from "@/lib/security/client-ip";
import {
  ADMIN_LOGIN_POLICY,
  checkLockout,
  clearRateLimit,
  recordLockoutFailure,
} from "@/lib/security/rate-limit";

export type AdminNoticesState = {
  ok: boolean;
  error?: string;
  saved?: boolean;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "")
    .trim()
    .normalize("NFKC");
}

function parseNoticeRows(formData: FormData): NoticeUpdateInput[] {
  return [0, 1, 2].map((sortOrder) => {
    const visibleUntil = str(formData, `visible_until_${sortOrder}`);
    return {
      sortOrder,
      enabled: formData.get(`enabled_${sortOrder}`) === "on",
      bodyJa: str(formData, `body_ja_${sortOrder}`),
      bodyEn: str(formData, `body_en_${sortOrder}`),
      visibleUntil: visibleUntil || null,
    };
  });
}

export async function loginAdminForm(formData: FormData): Promise<void> {
  if (!readAdminPassword()) {
    redirect("/admin/notices?error=config");
  }

  const password = str(formData, "password");
  if (!password) {
    redirect("/admin/notices?error=empty");
  }

  const ip = await getClientIp();
  const loginBucket = `admin_login:ip:${ip}`;
  const lockStatus = await checkLockout(loginBucket, ADMIN_LOGIN_POLICY);
  if (!lockStatus.allowed) {
    const retry = lockStatus.retryAfterSeconds ?? 900;
    redirect(`/admin/notices?error=locked&retry=${retry}`);
  }

  if (!verifyAdminPassword(password)) {
    const failure = await recordLockoutFailure(loginBucket, ADMIN_LOGIN_POLICY);
    if (!failure.allowed) {
      const retry = failure.retryAfterSeconds ?? 900;
      redirect(`/admin/notices?error=locked&retry=${retry}`);
    }
    redirect("/admin/notices?error=bad_password");
  }

  await clearRateLimit(loginBucket);
  await setAdminSession();
  redirect("/admin/notices");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/notices");
}

export async function saveNotices(
  _prev: AdminNoticesState,
  formData: FormData,
): Promise<AdminNoticesState> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "ログインが必要です" };
  }

  const rows = parseNoticeRows(formData);
  const hasContent = rows.some((row) => row.bodyJa || row.bodyEn);
  const enabledWithoutText = rows.some(
    (row) => row.enabled && !row.bodyJa.trim() && !row.bodyEn.trim(),
  );

  if (enabledWithoutText) {
    return {
      ok: false,
      error: "表示ONのお知らせには日本語または英語の本文が必要です",
    };
  }

  if (!hasContent && rows.some((row) => row.enabled)) {
    return { ok: false, error: "本文を入力してください" };
  }

  const result = await updateNotices(rows);
  if (!result.ok) {
    return { ok: false, error: result.error ?? "保存に失敗しました" };
  }

  revalidatePath("/");
  revalidatePath("/admin/notices");

  return { ok: true, saved: true };
}
