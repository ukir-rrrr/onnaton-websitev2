"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { adminInputClass } from "@/app/admin/adminStyles";

type PasswordInputProps = {
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
};

export function PasswordInput({
  id = "password",
  name = "password",
  required = true,
  autoComplete = "current-password",
  className = "",
  disabled = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        name={name}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${adminInputClass} py-2 pl-3 pr-11 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#5c5348] transition hover:text-[#2a2520]"
        aria-label={visible ? "パスワードを隠す" : "パスワードを表示"}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
