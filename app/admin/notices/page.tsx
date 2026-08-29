import type { Metadata } from "next";
import { AdminNoticesClient } from "./AdminNoticesClient";
import { AdminLoginForm } from "./AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { readAdminPassword } from "@/lib/admin/config";
import { getNoticesForAdmin } from "@/lib/supabase/notices";
import { adminMutedClass } from "@/app/admin/adminStyles";

export const metadata: Metadata = {
  title: "お知らせ管理 | 恩納豚",
  robots: { index: false, follow: false },
};

export default async function AdminNoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; retry?: string }>;
}) {
  const { error, retry } = await searchParams;
  const retryAfterSeconds = retry ? Number.parseInt(retry, 10) : undefined;
  const authed = await isAdminAuthenticated();
  const configuredPassword = readAdminPassword();
  const passwordConfigured = Boolean(configuredPassword);

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink px-6 py-16 text-[#2a2520]">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-2 text-center font-display-jp text-2xl font-medium tracking-[0.08em] text-[#2a2520]">
            お知らせ管理
          </h1>
          <p className={`mb-8 text-center ${adminMutedClass}`}>
            トップページのお知らせを管理・編集します
          </p>
          <AdminLoginForm
            error={error}
            retryAfterSeconds={
              Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : undefined
            }
            passwordConfigured={passwordConfigured}
          />
        </div>
      </div>
    );
  }

  const loadResult = await getNoticesForAdmin();

  const loadErrorMessage =
    loadResult.status === "supabase_not_configured"
      ? "Supabase の環境変数が Cloudflare に設定されていません。NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を Variables and secrets に追加し、再デプロイしてください。"
      : loadResult.status === "site_not_found"
        ? `Supabase に site slug「${loadResult.siteSlug}」が見つかりません。SITE_SLUG の値と supabase/schema.sql の seed を確認してください。`
        : loadResult.status === "query_failed"
          ? "Supabase からお知らせを取得できませんでした。ダッシュボードのログと RLS / テーブル設定を確認してください。"
          : null;

  return (
    <div className="min-h-screen bg-ink px-6 py-16 text-[#2a2520]">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-center font-display-jp text-2xl font-medium tracking-[0.08em] text-[#2a2520]">
          お知らせ管理
        </h1>
        <p className={`mb-10 text-center ${adminMutedClass}`}>
          恩納豚 — トップページ お知らせ セクション
        </p>
        {loadResult.status !== "ok" ? (
          <p className={`text-center leading-relaxed ${adminMutedClass}`}>
            {loadErrorMessage}
          </p>
        ) : (
          <AdminNoticesClient
            notices={loadResult.notices}
            formKey={loadResult.notices.map((n) => n.updatedAt).join("-")}
          />
        )}
      </div>
    </div>
  );
}
