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
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authed = await isAdminAuthenticated();
  const configuredPassword = readAdminPassword();
  const passwordConfigured = Boolean(configuredPassword);
  const passwordLength =
    process.env.NODE_ENV === "development" ? configuredPassword?.length : undefined;

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
            passwordConfigured={passwordConfigured}
            passwordLength={passwordLength}
          />
        </div>
      </div>
    );
  }

  const notices = await getNoticesForAdmin();

  return (
    <div className="min-h-screen bg-ink px-6 py-16 text-[#2a2520]">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-center font-display-jp text-2xl font-medium tracking-[0.08em] text-[#2a2520]">
          お知らせ管理
        </h1>
        <p className={`mb-10 text-center ${adminMutedClass}`}>
          恩納豚 — トップページ お知らせ セクション
        </p>
        {notices.length === 0 ? (
          <p className={`text-center ${adminMutedClass}`}>
            お知らせデータを読み込めませんでした。Supabase の設定を確認してください。
          </p>
        ) : (
          <AdminNoticesClient
            notices={notices}
            formKey={notices.map((n) => n.updatedAt).join("-")}
          />
        )}
      </div>
    </div>
  );
}
