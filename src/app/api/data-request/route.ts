import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkRateLimit, getClientIp, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit'
import { generateToken, sendDataRequestConfirmationEmail } from '@/lib/email'

interface DataRequestBody {
  requestType: 'access' | 'export' | 'delete'
  email: string
  reason?: string
}

/**
 * Step 1 of the two-step data-request flow.
 *
 * We never return personal data from this endpoint — doing so would leak
 * data to anyone who knows a user's email (GDPR Art. 12(6) / CCPA §1798.130
 * require identity verification before disclosure or deletion).
 *
 * Instead we issue a one-time token, email it to the address on file, and
 * defer the actual access/export/delete to /api/data-request/confirm.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = checkRateLimit(`data-request:${ip}`, RATE_LIMITS.dataRequest)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult)
    }

    const body: DataRequestBody = await request.json()

    if (!body.requestType || !body.email) {
      return NextResponse.json(
        { error: 'Request type and email are required' },
        { status: 400 }
      )
    }

    if (!['access', 'export', 'delete'].includes(body.requestType)) {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = body.email.toLowerCase()
    const reason = body.reason?.slice(0, 1000)

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true }
    })

    // Only create + email a token if the account actually exists. We still
    // return the same success response in both cases so this endpoint doesn't
    // double as an email-enumeration oracle.
    if (user) {
      const token = generateToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await prisma.dataRequest.create({
        data: {
          email: normalizedEmail,
          requestType: body.requestType,
          token,
          reason,
          expiresAt,
        }
      })

      await sendDataRequestConfirmationEmail(normalizedEmail, token, body.requestType)
    } else {
      console.log('Data request for non-existent user:', {
        requestType: body.requestType,
        email: normalizedEmail,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a confirmation link has been sent. Check your inbox to complete your request.',
    })
  } catch (error) {
    console.error('Data request error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    )
  }
}
