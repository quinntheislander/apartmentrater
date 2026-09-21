import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdminEmail } from '@/lib/admin-emails'

export { isAdminEmail }

/**
 * The signed-in admin, or null. Re-reads the user from the database rather
 * than trusting the session, so a changed email or a deleted account can't
 * ride an old session cookie.
 */
export async function getAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, emailVerified: true },
  })
  if (!user?.emailVerified || !isAdminEmail(user.email)) return null
  return user
}

/**
 * For admin pages. Call in every page, not just the layout: client-side
 * navigation can render a page without re-running its layout.
 */
export async function requireAdminPage() {
  const admin = await getAdmin()
  if (!admin) notFound()
  return admin
}

/** Admin API routes answer non-admins with a 404 so they don't advertise themselves. */
export function adminNotFound() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
