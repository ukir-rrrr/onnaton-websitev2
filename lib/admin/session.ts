import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { readAdminPassword } from "./config";

export const ADMIN_COOKIE = "onnaton-admin-session";

function adminPassword(): string | null {
  return readAdminPassword();
}

function sessionToken(): string | null {
  const password = adminPassword();
  if (!password) return null;
  return createHmac("sha256", "onnaton-admin").update(password).digest("hex");
}

export function verifyAdminPassword(input: string): boolean {
  const expected = adminPassword();
  const normalized = input.trim().normalize("NFKC");
  if (!expected || !normalized) {
    const dummy = Buffer.alloc(32, 0);
    timingSafeEqual(dummy, dummy);
    return false;
  }

  const inputBuf = Buffer.from(normalized, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");

  if (inputBuf.length !== expectedBuf.length) {
    timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }

  return timingSafeEqual(inputBuf, expectedBuf);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = sessionToken();
  if (!token) return false;

  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value;
  if (!value || value.length !== token.length) return false;

  return timingSafeEqual(Buffer.from(value, "utf8"), Buffer.from(token, "utf8"));
}

export async function setAdminSession(): Promise<void> {
  const token = sessionToken();
  if (!token) return;

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
