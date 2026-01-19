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
    ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount
    : null

  await prisma.apartment.update({
    where: { id: apartmentId },
    data: { averageRating, reviewCount }
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to edit a review' },
        { status: 401 }
      )
    }

    const { reviewId } = await params
    const data = await request.json()

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own reviews' },
        { status: 403 }
      )
    }

    // Opinion-First: 3 subjective categories
    const categoryRatings = [
      data.noiseLevel,
      data.naturalLight,
      data.generalVibe
    ]
    const overallRating = categoryRatings.reduce((a, b) => a + b, 0) / categoryRatings.length

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        overallRating,
        noiseLevel: data.noiseLevel,
        naturalLight: data.naturalLight,
        generalVibe: data.generalVibe,
        title: data.title,
        experienceSummary: data.experienceSummary,
        wouldRecommend: data.wouldRecommend,
        anonymous: data.anonymous || false,
        leaseStartDate: data.leaseStartDate ? new Date(data.leaseStartDate) : null,
        leaseEndDate: data.leaseEndDate ? new Date(data.leaseEndDate) : null,
        unitNumber: data.unitNumber,
        isUnitVerified: data.isUnitVerified || false,
        certifiedPersonalExperience: data.certifiedPersonalExperience || false
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

    await updateApartmentStats(review.apartmentId)

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a review' },
        { status: 401 }
      )
    }

    const { reviewId } = await params

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      )
    }

    const apartmentId = review.apartmentId

    await prisma.review.delete({
      where: { id: reviewId }
    })

    await updateApartmentStats(apartmentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        apartment: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true
          }
        }
      }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}
