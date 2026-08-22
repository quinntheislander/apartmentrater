import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkRateLimit, getClientIp, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit'
import { RECENT_TENANCY_WINDOW_YEARS, recentWindowStart } from '@/lib/residency'
import { findVerifiedResidency } from '@/lib/residency-store'

async function updateApartmentStats(apartmentId: string) {
  const reviews = await prisma.review.findMany({
    where: { apartmentId, moderationStatus: { in: ['active', 'flagged'] } },
    select: { overallRating: true }
  })

  const reviewCount = reviews.length
  const averageRating = reviewCount > 0
    ? reviews.reduce((sum: number, r: { overallRating: number }) => sum + r.overallRating, 0) / reviewCount
    : null

  await prisma.apartment.update({
    where: { id: apartmentId },
    data: { averageRating, reviewCount }
  })
}

// Calculate overall rating from the 3 opinion-based categories
function calculateOverallRating(data: {
  noiseLevel: number
  naturalLight: number
  generalVibe: number
}): number {
  return (data.noiseLevel + data.naturalLight + data.generalVibe) / 3
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit: 60 requests per minute
    const ip = getClientIp(request)
    const rateLimitResult = checkRateLimit(`reviews:${ip}`, RATE_LIMITS.general)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult)
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      )
    }

    const { id: apartmentId } = await params
    const data = await request.json()

    // Validate rating values are integers between 1 and 5
    for (const field of ['noiseLevel', 'naturalLight', 'generalVibe'] as const) {
      const value = data[field]
      if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) {
        return NextResponse.json(
          { error: `${field} must be an integer between 1 and 5` },
          { status: 400 }
        )
      }
    }

    const apartment = await prisma.apartment.findUnique({
      where: { id: apartmentId }
    })

    if (!apartment) {
      return NextResponse.json(
        { error: 'Apartment not found' },
        { status: 404 }
      )
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        apartmentId,
        userId: session.user.id
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this apartment' },
        { status: 400 }
      )
    }

    // Validate lease dates (required)
    if (!data.leaseStartDate || !data.leaseEndDate) {
      return NextResponse.json(
        { error: 'Lease start and end dates are required' },
        { status: 400 }
      )
    }

    // Validate lease end is after lease start
    const leaseStartCheck = new Date(data.leaseStartDate)
    const leaseEndCheck = new Date(data.leaseEndDate)
    if (leaseEndCheck < leaseStartCheck) {
      return NextResponse.json(
        { error: 'Lease end date must be after the start date' },
        { status: 400 }
      )
    }

    // Conditions change; only current tenancies or ones that ended recently are reviewable
    if (leaseEndCheck < recentWindowStart()) {
      return NextResponse.json(
        { error: `Reviews must come from a current tenancy or one that ended within the last ${RECENT_TENANCY_WINDOW_YEARS} years` },
        { status: 400 }
      )
    }

    // Validate certification (required for Legal Shield)
    if (!data.certifiedPersonalExperience) {
      return NextResponse.json(
        { error: 'You must certify that this review is based on your personal experience' },
        { status: 400 }
      )
    }

    // Calculate overall rating from opinion-based categories
    const overallRating = calculateOverallRating({
      noiseLevel: data.noiseLevel,
      naturalLight: data.naturalLight,
      generalVibe: data.generalVibe
    })

    // Auto-verify if valid lease dates are provided
    const leaseStart = data.leaseStartDate ? new Date(data.leaseStartDate) : null
    const leaseEnd = data.leaseEndDate ? new Date(data.leaseEndDate) : null
    let isVerified = false

    if (leaseStart && leaseEnd) {
      const daysDiff = (leaseEnd.getTime() - leaseStart.getTime()) / (1000 * 60 * 60 * 24)
      // Verify if lease is at least 30 days and start is before end
      isVerified = leaseStart < leaseEnd && daysDiff >= 30
    }

    // Link the reviewer's residency verification for this unit, if they have one
    const verification = await findVerifiedResidency(session.user.id, apartmentId, data.unitNumber)

    const review = await prisma.review.create({
      data: {
        apartmentId,
        userId: session.user.id,
        overallRating,
        // Opinion-based ratings
        noiseLevel: data.noiseLevel,
        naturalLight: data.naturalLight,
        generalVibe: data.generalVibe,
        // Experience summary (renamed from content)
        title: data.title,
        experienceSummary: data.experienceSummary,
        // Unit information with verification flag
        unitNumber: data.unitNumber,
        isUnitVerified: data.isUnitVerified || false,
        // Legal certification
        certifiedPersonalExperience: data.certifiedPersonalExperience,
        // Other fields
        wouldRecommend: data.wouldRecommend,
        anonymous: data.anonymous || false,
        isVerified,
        leaseStartDate: leaseStart,
        leaseEndDate: leaseEnd,
        verificationId: verification?.id ?? null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    await updateApartmentStats(apartmentId)

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
