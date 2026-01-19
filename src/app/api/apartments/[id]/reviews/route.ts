import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function updateApartmentStats(apartmentId: string) {
  const reviews = await prisma.review.findMany({
    where: { apartmentId },
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
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      )
    }

    const { id: apartmentId } = await params
    const data = await request.json()

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
        leaseEndDate: leaseEnd
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
