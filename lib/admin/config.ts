/** Env key for /admin/notices login. Prefixed to avoid Windows `ADMIN_PASSWORD` collisions. */
export const ADMIN_PASSWORD_ENV = "ONNATON_ADMIN_PASSWORD";

export function readAdminPassword(): string | null {
  const password = process.env[ADMIN_PASSWORD_ENV]?.trim();
  return password || null;
}
