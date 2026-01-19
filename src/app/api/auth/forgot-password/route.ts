import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent' })
    }

    // Delete any existing password reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: `password-reset:${user.email}`
      }
    })

    // Create a new password reset token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: `password-reset:${user.email}`,
        token,
        expires
      }
    })

    // In production, send email here
    // For development, log the reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
    console.log('========================================')
    console.log('PASSWORD RESET LINK (Development Only)')
    console.log(`User: ${user.email}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log('========================================')

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
