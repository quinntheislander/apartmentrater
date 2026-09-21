/**
 * Admins are listed by email in ADMIN_EMAILS (comma-separated), kept in config
 * rather than the public repo. Unset means nobody is an admin.
 *
 * Separate from lib/admin.ts so lib/auth.ts can use it without an import cycle.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase())
}
