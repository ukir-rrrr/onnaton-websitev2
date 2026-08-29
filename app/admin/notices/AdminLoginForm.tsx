"use client";

import { loginAdminForm } from "@/app/actions/admin-notices";
import { adminLabelClass, adminMutedClass } from "@/app/admin/adminStyles";
import { PasswordInput } from "./PasswordInput";

const loginErrors: Record<string, string> = {
  config:
    "ONNATON_ADMIN_PASSWORD が読み込まれていません。.env.local を保存して dev サーバーを再起動してください",
  empty: "パスワードを入力してください",
  bad_password: "パスワードが正しくありません",
};

type AdminLoginFormProps = {
  error?: string;
  passwordConfigured: boolean;
  passwordLength?: number;
};

export function AdminLoginForm({
  error,
  passwordConfigured,
  passwordLength,
}: AdminLoginFormProps) {
  const message = error ? loginErrors[error] : null;

  return (
    <div className="mx-auto max-w-sm space-y-4">
      {!passwordConfigured ? (
        <p className="rounded border border-amber-800/35 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          {loginErrors.config}
        </p>
      ) : null}
      {/* {passwordConfigured && passwordLength ? (
        <p className={`text-center text-xs ${adminMutedClass}`}>
          開発用: ONNATON_ADMIN_PASSWORD は {passwordLength} 文字で読み込まれています
        </p>
      ) : null} */}
      <form action={loginAdminForm} className="space-y-4">
        <label className="block space-y-2" htmlFor="admin-password">
          <span className={adminLabelClass}>パスワード</span>
          <PasswordInput id="admin-password" />
        </label>
        {message ? (
          <p
            className="rounded border border-red-800/35 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
            role="alert"
          >
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded bg-gold px-6 py-3 text-sm font-medium tracking-[0.08em] text-ink transition hover:bg-gold/90"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
