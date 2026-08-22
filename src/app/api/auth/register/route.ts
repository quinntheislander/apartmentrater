import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { generateToken, sendVerificationEmail } from '@/lib/email'
import { checkRateLimit, getClientIp, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit'
import { TOS_VERSION, PRIVACY_VERSION } from '@/lib/legal'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = checkRateLimit(`auth-register:${ip}`, RATE_LIMITS.auth)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult)
    }

    const { email, password, name, acceptTerms, confirmAge } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Terms acceptance is required for our arbitration, content license, and
    // indemnification clauses to be enforceable. Age confirmation avoids
    // knowingly collecting data from minors under COPPA.
    if (!acceptTerms) {
      return NextResponse.json(
        { error: 'You must agree to the Terms of Service and Privacy Policy' },
        { status: 400 }
      )
    }
    if (!confirmAge) {
      return NextResponse.json(
        { error: 'You must confirm that you meet the minimum age requirement' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    // Don't reveal whether an account already exists (user enumeration).
    // Act as if we sent a verification email either way.
    if (existingUser) {
      return NextResponse.json({
        user: {
          email: normalizedEmail,
          name: null,
        }
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const now = new Date()
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        tosAcceptedAt: now,
        tosVersion: TOS_VERSION,
        privacyAcceptedAt: now,
        privacyVersion: PRIVACY_VERSION,
        ageAttestedAt: now,
      }
    })

    const token = generateToken()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires
      }
    })

    await sendVerificationEmail(user.email, token)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
