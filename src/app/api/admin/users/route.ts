import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getAdmin, adminNotFound } from '@/lib/admin'
import { generateToken, sendInviteEmail, INVITE_TTL_MS } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Invites a user: creates the account with an unusable random password and
// emails a link to choose one. That link goes through the reset flow, which
// also records Terms assent and verifies the email.
export async function POST(request: Request) {
  try {
    if (!(await getAdmin())) return adminNotFound()

    const { email, name } = await request.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    if (!EMAIL_RE.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })
    if (existing) {
      return NextResponse.json({ error: 'A user with that email already exists' }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 100) : null,
        password: await bcrypt.hash(generateToken(), 12),
      },
      select: { id: true },
    })

    const token = generateToken()
    await prisma.verificationToken.create({
      data: {
        identifier: `password-reset:${normalizedEmail}`,
        token,
        expires: new Date(Date.now() + INVITE_TTL_MS),
      },
    })
    await sendInviteEmail(normalizedEmail, token)

    return NextResponse.json({ id: user.id })
  } catch (error) {
    console.error('Admin invite error:', error)
    return NextResponse.json({ error: 'Failed to invite user' }, { status: 500 })
  }
}
