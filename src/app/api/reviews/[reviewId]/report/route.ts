import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkRateLimit, getClientIp, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit'

const VALID_REASONS = ['spam', 'false', 'harassment', 'privacy', 'other'] as const
type ReportReason = typeof VALID_REASONS[number]

const AUTO_HIDE_THRESHOLD = 3

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = checkRateLimit(`report:${ip}`, RATE_LIMITS.contact)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult)
    }

    const session = await getServerSession(authOptions)
    const { reviewId } = await params
    const body = await request.json().catch(() => ({}))

    const reason: ReportReason | undefined = body.reason
    const details: string | undefined = typeof body.details === 'string'
      ? body.details.slice(0, 2000)
      : undefined

    if (!reason || !VALID_REASONS.includes(reason)) {
      return NextResponse.json(
        { error: `Reason must be one of: ${VALID_REASONS.join(', ')}` },
        { status: 400 }
      )
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true, moderationStatus: true }
    })
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Block self-reports — not useful, and could be used to hide your own review
    // once the auto-hide threshold is in play.
    if (session?.user?.id && session.user.id === review.userId) {
      return NextResponse.json(
        { error: 'You cannot report your own review' },
        { status: 400 }
      )
    }

    // Prevent duplicate reports from the same logged-in user on the same review.
    if (session?.user?.id) {
      const existing = await prisma.reviewReport.findFirst({
        where: { reviewId, reporterId: session.user.id }
      })
      if (existing) {
        return NextResponse.json({
          success: true,
          message: 'You have already reported this review. Our team will review it.',
        })
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.reviewReport.create({
        data: {
          reviewId,
          reporterId: session?.user?.id ?? null,
          reporterIp: ip,
          reason,
          details,
        }
      })

      const updated = await tx.review.update({
        where: { id: reviewId },
        data: { reportCount: { increment: 1 } },
        select: { reportCount: true, moderationStatus: true }
      })

      // Auto-flag (not auto-remove) once the threshold is hit — a human still
      // has to decide whether to remove.
      if (
        updated.moderationStatus === 'active' &&
        updated.reportCount >= AUTO_HIDE_THRESHOLD
      ) {
        await tx.review.update({
          where: { id: reviewId },
          data: { moderationStatus: 'flagged' }
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Report received. Our team will review it.',
    })
  } catch (error) {
    console.error('Report review error:', error)
    return NextResponse.json(
      { error: 'Failed to submit report. Please try again.' },
      { status: 500 }
    )
  }
}
