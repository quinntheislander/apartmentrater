import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdmin, adminNotFound } from '@/lib/admin'
import { generateToken, sendInviteEmail, sendPasswordResetEmail, INVITE_TTL_MS } from '@/lib/email'

const RESET_TTL_MS = 60 * 60 * 1000 // matches forgot-password

// Emails the user a link to set a new password. Users who never verified
// (e.g. an unanswered invite) get the invite email again instead.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdmin())) return adminNotFound()

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, emailVerified: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const invite = !user.emailVerified
    const identifier = `password-reset:${user.email}`
    const token = generateToken()

    await prisma.verificationToken.deleteMany({ where: { identifier } })
    await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires: new Date(Date.now() + (invite ? INVITE_TTL_MS : RESET_TTL_MS)),
      },
    })

    if (invite) await sendInviteEmail(user.email, token)
    else await sendPasswordResetEmail(user.email, token)

    return NextResponse.json({ sent: invite ? 'invite' : 'reset' })
  } catch (error) {
    console.error('Admin password reset error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
