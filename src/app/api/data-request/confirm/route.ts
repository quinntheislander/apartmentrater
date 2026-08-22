import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkRateLimit, getClientIp, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit'

/**
 * Step 2 of the two-step data-request flow.
 *
 * The user clicks the link from step 1, which hits this endpoint with the
 * one-time token. We verify the token, mark the request confirmed, and then
 * actually fulfill it (access/export returns data, delete wipes the account).
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rateLimitResult = checkRateLimit(`data-request-confirm:${ip}`, RATE_LIMITS.auth)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult)
    }

    const { token } = await request.json()
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const dataRequest = await prisma.dataRequest.findUnique({ where: { token } })
    if (!dataRequest) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 400 })
    }

    if (dataRequest.fulfilledAt) {
      return NextResponse.json({ error: 'This request has already been completed' }, { status: 400 })
    }

    if (dataRequest.expiresAt < new Date()) {
      return NextResponse.json({ error: 'This link has expired. Please submit a new request.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: dataRequest.email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        reviews: {
          select: {
            id: true,
            title: true,
            experienceSummary: true,
            noiseLevel: true,
            naturalLight: true,
            generalVibe: true,
            overallRating: true,
            wouldRecommend: true,
            anonymous: true,
            unitNumber: true,
            leaseStartDate: true,
            leaseEndDate: true,
            createdAt: true,
            apartment: {
              select: { name: true, address: true, city: true, state: true, zipCode: true }
            }
          }
        },
        favorites: {
          select: {
            apartment: { select: { name: true, address: true, city: true, state: true, zipCode: true } },
            createdAt: true,
          }
        }
      }
    })

    if (!user) {
      // Account was deleted between request and confirmation — nothing to do.
      await prisma.dataRequest.update({
        where: { token },
        data: { confirmedAt: new Date(), fulfilledAt: new Date() }
      })
      return NextResponse.json({
        success: true,
        message: 'No account data found for this email.',
      })
    }

    switch (dataRequest.requestType) {
      case 'access':
      case 'export': {
        const exportData = {
          profile: {
            email: user.email,
            name: user.name,
            image: user.image,
            accountCreated: user.createdAt,
          },
          reviews: user.reviews.map(review => ({
            id: review.id,
            title: review.title,
            experienceSummary: review.experienceSummary,
            ratings: {
              noiseLevel: review.noiseLevel,
              naturalLight: review.naturalLight,
              generalVibe: review.generalVibe,
              overall: review.overallRating,
            },
            wouldRecommend: review.wouldRecommend,
            anonymous: review.anonymous,
            unitNumber: review.unitNumber,
            leaseStartDate: review.leaseStartDate,
            leaseEndDate: review.leaseEndDate,
            createdAt: review.createdAt,
            apartment: review.apartment,
          })),
          favorites: user.favorites.map(fav => ({
            apartment: fav.apartment,
            savedAt: fav.createdAt,
          })),
          requestedAt: dataRequest.createdAt,
          fulfilledAt: new Date().toISOString(),
        }

        await prisma.dataRequest.update({
          where: { token },
          data: { confirmedAt: new Date(), fulfilledAt: new Date() }
        })

        return NextResponse.json({
          success: true,
          requestType: dataRequest.requestType,
          data: exportData,
        })
      }

      case 'delete': {
        const userId = user.id
        const userEmail = user.email

        await prisma.$transaction(async (tx) => {
          await tx.helpfulVote.deleteMany({ where: { userId } })
          await tx.favorite.deleteMany({ where: { userId } })
          await tx.reviewReport.deleteMany({ where: { reporterId: userId } })
          await tx.review.deleteMany({ where: { userId } })
          await tx.session.deleteMany({ where: { userId } })
          await tx.account.deleteMany({ where: { userId } })
          await tx.verificationToken.deleteMany({
            where: {
              OR: [
                { identifier: userEmail },
                { identifier: `password-reset:${userEmail}` }
              ]
            }
          })
          await tx.user.delete({ where: { id: userId } })
          await tx.dataRequest.update({
            where: { token },
            data: { confirmedAt: new Date(), fulfilledAt: new Date() }
          })
        })

        return NextResponse.json({
          success: true,
          requestType: 'delete',
          message: 'Your account and all associated data have been permanently deleted.',
        })
      }

      default:
        return NextResponse.json({ error: 'Unknown request type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Data request confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to process confirmation. Please try again later.' },
      { status: 500 }
    )
  }
}
